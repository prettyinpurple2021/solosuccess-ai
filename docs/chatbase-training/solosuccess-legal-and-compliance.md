# SoloSuccess AI — Legal & Compliance Notes

## Data Protection & Security
- Authentication is enforced for all protected routes; server-side validation guards inputs.
- User data, including uploaded files, lives in a managed PostgreSQL (Neon) stack.
- No MongoDB usage; data residency aligns with platform deployment.
- Encourage users to avoid sharing sensitive personal data in chats unless absolutely necessary.

## Guardian AI Responsibilities
- Automates GDPR/CCPA policy drafts and compliance checklists.
- Enables users to generate Privacy, Terms, and Cookie policies tailored to their business details.
- Provides scanning and monitoring to flag potential compliance gaps.

## Official Policies & Links
- Privacy Policy: `/privacy`
- Terms of Service: `/terms`
- Cookie Policy: `/cookies`
- GDPR Statement: `/gdpr`
- These pages are linked from the footer on every marketing and app page.

## Refund & Billing References
- Paid tiers include a 30-day money-back guarantee.
- Stripe manages subscriptions, invoices, and payment authentication.

## Support AI Guardrails
- Provide summaries of policies but refrain from offering legal advice.
- For compliance-sensitive inquiries, guide users to the Guardian AI tooling or the appropriate policy page.
- Escalate when users report potential breaches or request data deletion; collect contact details, timestamps, and scope before routing to the compliance team.

## Suggested Response Patterns
- “For official language, tap the in-app `Privacy`, `Terms`, or `Cookies` links in the footer. Guardian AI can also draft tailored policies if you enter your business details.”
- “Need GDPR guidance? The `/gdpr` page outlines our approach, and Guardian AI walks you through compliance steps.”
- “We handle all payments through Stripe, and every plan carries a 30-day money-back guarantee. Let me know if you need the refund request link.”

