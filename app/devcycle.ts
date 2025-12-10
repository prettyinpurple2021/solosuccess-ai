import { setupDevCycle } from "@devcycle/nextjs-sdk/server";
import { logWarn } from "@/lib/logger";

const getUserIdentity = async () => {
  return { user_id: "anonymous" };
};

const serverSDKKey = process.env.DEVCYCLE_SERVER_SDK_KEY?.trim() || "";
const clientSDKKey = process.env.NEXT_PUBLIC_DEVCYCLE_CLIENT_SDK_KEY?.trim() || "";

// Only initialize DevCycle if valid SDK keys are provided (not empty strings)
export const isStaticBuild = process.env.NEXT_PHASE === "phase-production-build";
export const isDevCycleEnabled = Boolean(
  serverSDKKey &&
  clientSDKKey &&
  serverSDKKey.length > 0 &&
  clientSDKKey.length > 0
);
const isDevCycleRuntimeEnabled = isDevCycleEnabled && !isStaticBuild;

let devCycleInstance: ReturnType<typeof setupDevCycle> | null = null;

// Never initialize during static build; only at runtime when keys are present
if (isDevCycleRuntimeEnabled) {
  try {
    devCycleInstance = setupDevCycle({
      serverSDKKey,
      clientSDKKey,
      userGetter: getUserIdentity,
      options: {},
    });
  } catch (error) {
    // Silently fail in build environment - DevCycle will work at runtime when keys are provided
    if (process.env.NODE_ENV === 'development') {
      logWarn('DevCycle initialization failed', { error: error instanceof Error ? error.message : String(error) });
    }
    devCycleInstance = null;
  }
}

// Fallback functions when DevCycle is not available
const fallbackGetVariableValue = async <T>(key: string, defaultValue: T): Promise<T> => {
  return defaultValue;
};

const fallbackGetClientContext = () => {
  return {
    user_id: "anonymous",
    clientSDKKey: "",
    enableStreaming: false,
    realtimeDelay: 0,
    options: {},
    serverDataPromise: Promise.resolve({
      user: { user_id: "anonymous" } as any,
      config: {} as any,
      userAgent: "",
    }),
  };
};

export const getVariableValue = devCycleInstance?.getVariableValue ?? fallbackGetVariableValue;
export const getClientContext = () => {
  if (!isDevCycleEnabled || isStaticBuild) {
    return fallbackGetClientContext();
  }

  try {
    return devCycleInstance?.getClientContext?.() ?? fallbackGetClientContext();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      logWarn("DevCycle getClientContext failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return fallbackGetClientContext();
  }
};

