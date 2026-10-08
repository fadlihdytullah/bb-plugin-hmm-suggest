import { defineRpcContract, type BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";

const INSTRUCTIONS = `At the end of every response that expects a reply from the user, add 2-4 short likely user replies as a final line in exactly this form:
::suggest{a="reply one" b="reply two" c="reply three" d="reply four"}
Rules: keys a-d only, omit unused keys, each reply under 60 characters, written as the user would type it, in the user's language, no double quotes inside values, never inside a code block. Skip the line when no reply is expected.`;

const rpcContract = defineRpcContract({
  send: {
    input: z.object({ threadId: z.string().min(1), text: z.string().min(1).max(500) }),
    output: z.object({ ok: z.boolean() }),
  },
});

export default async function plugin(bb: BbPluginApi) {
  bb.agents.contributeInstructions(() => INSTRUCTIONS);

  bb.rpc.register(rpcContract, {
    send: async ({ threadId, text }) => {
      await bb.sdk.threads.send({ threadId, mode: "queue-if-active", input: [{ type: "text", text, mentions: [] }] });
      return { ok: true };
    },
  });
}

export { rpcContract };
