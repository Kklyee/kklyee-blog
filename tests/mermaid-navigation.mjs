const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:4321";
const cdpUrl = process.env.CDP_URL ?? "http://localhost:9222";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

const diagramState = () =>
  evaluate(`({
  path: location.pathname,
  sourceBlocks: document.querySelectorAll("pre > code.language-mermaid").length,
  diagrams: document.querySelectorAll(".mermaid").length,
  svgs: document.querySelectorAll(".mermaid svg").length,
})`);

const assertRendered = (state, route) => {
  if (state.diagrams === 0 || state.svgs !== state.diagrams || state.sourceBlocks !== 0) {
    throw new Error(`${route} did not render Mermaid: ${JSON.stringify(state)}`);
  }
};

await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: `${baseUrl}/` });
await sleep(1000);
await evaluate(`document.querySelector('a[href="/posts/tokenizer/"]').click()`);
await sleep(1500);
assertRendered(await diagramState(), "client navigation");

await send("Page.navigate", { url: `${baseUrl}/posts/tokenizer/` });
await sleep(1500);
assertRendered(await diagramState(), "hard navigation");

console.log("Mermaid navigation test passed");
socket.close();
