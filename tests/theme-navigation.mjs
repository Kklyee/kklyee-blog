const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:4321";
const cdpUrl = process.env.CDP_URL ?? "http://localhost:9222";

const targets = await (await fetch(`${cdpUrl}/json/list`)).json();
const target = targets.find((item) => item.type === "page");

if (!target) {
  throw new Error(`No Chrome page target found at ${cdpUrl}`);
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
let nextId = 0;
const pending = new Map();

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const request = pending.get(message.id);

  if (!request) return;

  pending.delete(message.id);
  if (message.error) {
    request.reject(new Error(JSON.stringify(message.error)));
  } else {
    request.resolve(message.result);
  }
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime evaluation failed");
  }

  return result.result?.value;
};

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-color-scheme", value: "dark" }],
});
await send("Page.navigate", { url: `${baseUrl}/` });
await evaluate(`new Promise((resolve) => {
  if (document.readyState === "complete") return resolve();
  addEventListener("load", resolve, { once: true });
})`);
const state = await evaluate(`new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error("Navigation timed out")), 3000);
  document.addEventListener("astro:page-load", () => {
    clearTimeout(timeout);
    const toggle = document.querySelector(".theme-toggle");
    resolve({
      path: location.pathname,
      savedTheme: localStorage.getItem("kklyee-theme"),
      theme: document.documentElement.dataset.theme,
      pressed: toggle?.getAttribute("aria-pressed"),
    });
  }, { once: true });
  localStorage.setItem("kklyee-theme", "light");
  document.documentElement.dataset.theme = "light";
  document.querySelector('a[href="/about/"]').click();
})`);

if (state.path !== "/about/" || state.theme !== "light" || state.pressed !== "false") {
  throw new Error(`Light theme was not preserved: ${JSON.stringify(state)}`);
}

const toggledState = await evaluate(`(() => {
  document.querySelector(".theme-toggle").click();
  return {
    savedTheme: localStorage.getItem("kklyee-theme"),
    theme: document.documentElement.dataset.theme,
  };
})()`);

if (toggledState.savedTheme !== "dark" || toggledState.theme !== "dark") {
  throw new Error(`Theme toggle stopped working after navigation: ${JSON.stringify(toggledState)}`);
}

console.log("Theme navigation test passed");
socket.close();
