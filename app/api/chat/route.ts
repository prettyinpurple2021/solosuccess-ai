import { streamText } from "ai"
import { getTeamMemberConfig } from "@/lib/ai-config"

export async function POST(req: Request) {
  try {
    const { message, memberId, chatHistory } = await req.json()

    if (!message || !memberId) {
      return new Response("Missing required fields", { status: 400 })
    }

    const config = getTeamMemberConfig(memberId)

    // Build conversation history for context
    const messages = [
      {
        role: "system" as const,
        content: config.systemPrompt,
      },
      // Add previous chat history for context
      ...chatHistory.slice(-6).map((msg: any) => ({
        role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ]

    const result = await streamText({
      model: config.model,
      messages,
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
