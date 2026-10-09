# bb-plugin-hmm-suggest

Tap-to-send quick replies for [bb](https://getbb.app). Hmm Suggest asks the
agent to end each response that expects an answer with 2-4 likely user
replies, then renders them as buttons under the message. One tap sends the
reply to the thread, which is handy on a phone.

## Tech Stack

- TypeScript and React
- `@get-bb/plugin-sdk` for agent instructions, message directives, and RPC
- Zod for RPC validation

## Prerequisites

- bb >= 0.42
- Node.js and npm

## Setup

```sh
git clone git@github.com:fadlihdytullah/bb-plugin-hmm-suggest.git
cd bb-plugin-hmm-suggest
npm install
```

## Environment

No environment variables are required.

## Run

```sh
npx tsc -p .
bb plugin build
```

## Deploy

```sh
bb plugin install git:https://github.com/fadlihdytullah/bb-plugin-hmm-suggest
```

From a local checkout:

```sh
bb plugin install path:.
```

## How it works

- `bb.agents.contributeInstructions` tells the agent to finish replies with
  `::suggest{a="..." b="..." c="..." d="..."}` when a user reply is expected.
- `app.slots.messageDirective` renders that directive as wrapping buttons in
  the assistant message.
- Tapping a button calls the `send` RPC, which posts the text through
  `bb.sdk.threads.send` with `queue-if-active`, so it queues if the agent is
  still running. Buttons lock after one send.
- Dragging a button drops its text into the prompt input, so you can edit or
  add words before sending.
- Instructions apply when a provider session starts, so existing threads pick
  them up only after their session restarts; new threads get them right away.
