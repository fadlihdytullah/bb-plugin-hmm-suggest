import { useState } from "react";
import { definePluginApp, useRpc } from "@get-bb/plugin-sdk/app";
import type { PluginMessageDirectiveProps } from "@get-bb/plugin-sdk/app";
import type { rpcContract } from "./server";

const KEYS = ["a", "b", "c", "d"];

function Suggestions({ attributes, message }: PluginMessageDirectiveProps) {
  const rpc = useRpc<typeof rpcContract>();
  const [sent, setSent] = useState<string | null>(null);
  const replies = KEYS.map((key) => attributes[key]?.trim().slice(0, 500)).filter(
    (text): text is string => Boolean(text),
  );
  if (replies.length === 0) return null;

  const send = async (text: string) => {
    if (sent) return;
    setSent(text);
    try {
      await rpc.call("send", { threadId: message.threadId, text });
    } catch {
      setSent(null);
    }
  };

  return (
    <div className="my-2 flex flex-wrap gap-2">
      {replies.map((text) => (
        <button
          key={text}
          type="button"
          disabled={sent !== null}
          onClick={() => void send(text)}
          className={`min-h-9 rounded-full border border-border px-3 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-accent disabled:cursor-default ${
            sent === text ? "bg-accent" : "bg-card disabled:opacity-50"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default definePluginApp((app) => {
  app.slots.messageDirective({ id: "suggest", component: Suggestions });
});
