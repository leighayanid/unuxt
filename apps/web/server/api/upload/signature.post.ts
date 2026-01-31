import { createHash } from "crypto";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const timestamp = Math.round(Date.now() / 1000);
  const folder = body.folder || "";

  // Create signature
  const paramsToSign = folder
    ? `folder=${folder}&timestamp=${timestamp}`
    : `timestamp=${timestamp}`;

  const signature = createHash("sha256")
    .update(paramsToSign + config.cloudinaryApiSecret)
    .digest("hex");

  return {
    signature,
    timestamp,
    apiKey: config.public.cloudinaryApiKey,
    cloudName: config.public.cloudinaryCloudName,
  };
});
