process.env.NODE_ENV = "production";

async function startServer() {
  const [{ createServer }, { default: next }] = await Promise.all([
    import("node:http"),
    import("next"),
  ]);
  const app = next({ dev: false });
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = createServer((request, response) => {
    handle(request, response);
  });

  server.on("error", (error) => {
    console.error("Trainology server failed:", error);
    process.exit(1);
  });

  server.listen();
}

startServer().catch((error) => {
  console.error("Trainology could not start:", error);
  process.exit(1);
});
