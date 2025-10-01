import { getAuth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Lazy initialization - handler is created at runtime, not build time
let handler: ReturnType<typeof toNextJsHandler> | null = null

function getHandler() {
  if (!handler) {
    handler = toNextJsHandler(getAuth())
  }
  return handler
}

// Edge Runtime disabled due to Node.js dependency incompatibility

export const GET = async (req: Request) => {
  const h = getHandler()
  return h.GET(req)
}

export const POST = async (req: Request) => {
  const h = getHandler()
  return h.POST(req)
}
