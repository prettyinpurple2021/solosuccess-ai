import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { getTierFromPriceId } from "@/lib/stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = await createClient()

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const subscriptionId = subscription.id
        const priceId = subscription.items.data[0]?.price.id
        const tier = getTierFromPriceId(priceId)
        const status = subscription.status
        const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString()
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()

        // Update user's subscription in database
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_tier: tier,
            subscription_status: status,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_current_period_start: currentPeriodStart,
            subscription_current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Error updating subscription:", error)
          return NextResponse.json({ error: "Database update failed" }, { status: 500 })
        }

        console.log(`Subscription ${event.type} for customer ${customerId}`)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Revert user to free tier
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_tier: "launchpad",
            subscription_status: "canceled",
            stripe_subscription_id: null,
            subscription_current_period_start: null,
            subscription_current_period_end: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Error canceling subscription:", error)
          return NextResponse.json({ error: "Database update failed" }, { status: 500 })
        }

        console.log(`Subscription canceled for customer ${customerId}`)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Activate subscription
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Error activating subscription:", error)
          return NextResponse.json({ error: "Database update failed" }, { status: 500 })
        }

        console.log(`Payment succeeded for customer ${customerId}`)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Mark subscription as past due
        const { error } = await supabase
          .from("profiles")
          .update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Error updating failed payment:", error)
          return NextResponse.json({ error: "Database update failed" }, { status: 500 })
        }

        console.log(`Payment failed for customer ${customerId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
