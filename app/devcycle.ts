import { setupDevCycle } from "@devcycle/nextjs-sdk/server";
import { logWarn } from "@/lib/logger";

const getUserIdentity = async () => {
  return { user_id: "anonymous" };
};

const serverSDKKey = process.env.DEVCYCLE_SERVER_SDK_KEY?.trim() || "";
const clientSDKKey = process.env.NEXT_PUBLIC_DEVCYCLE_CLIENT_SDK_KEY?.trim() || "";

// Only initialize DevCycle if valid SDK keys are provided (not empty strings)
const isDevCycleEnabled = Boolean(serverSDKKey && clientSDKKey && serverSDKKey.length > 0 && clientSDKKey.length > 0);

let devCycleInstance: ReturnType<typeof setupDevCycle> | null = null;

if (isDevCycleEnabled) {
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
  };
};

export const getVariableValue = devCycleInstance?.getVariableValue ?? fallbackGetVariableValue;
export const getClientContext = devCycleInstance?.getClientContext ?? fallbackGetClientContext;

