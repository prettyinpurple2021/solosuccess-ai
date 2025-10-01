import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

const handler = toNextJsHandler(auth)


// Edge Runtime disabled due to Node.js dependency incompatibility

export { handler as GET, handler as POST }
