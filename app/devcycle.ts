import { setupDevCycle } from "@devcycle/nextjs-sdk/server";

const getUserIdentity = async () => {
  return { user_id: "anonymous" };
};

export const { getVariableValue, getClientContext } = setupDevCycle({
  serverSDKKey: process.env.DEVCYCLE_SERVER_SDK_KEY ?? "",
  clientSDKKey: process.env.NEXT_PUBLIC_DEVCYCLE_CLIENT_SDK_KEY ?? "",
  userGetter: getUserIdentity,
  options: {},
});

