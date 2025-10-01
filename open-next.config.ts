// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
	incrementalCache: r2IncrementalCache,
	// Explicitly mark packages as external to prevent bundling issues
	esbuild: {
		external: [
			'stripe',
			'resend',
			'@neondatabase/serverless',
			'pg',
			'bcryptjs',
			'better-auth',
			'drizzle-orm',
			'openai',
			'@ai-sdk/openai',
			'@ai-sdk/anthropic',
			'@ai-sdk/google',
		]
	}
});
