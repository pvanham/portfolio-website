import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    { path: "/", method: "POST" },
    { path: "/contact", method: "POST" },
    { path: "/api/chat", method: "POST" },
  ],
});
