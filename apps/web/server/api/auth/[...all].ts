import { auth } from "@unuxt/auth/server";

export default defineEventHandler(async (event) => {
  return auth.handler(toWebRequest(event));
});
