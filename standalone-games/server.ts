import { Application, send } from "../deps.ts";

const PORT = 3001;
const app = new Application({ keys: ["secret1"] });

app.addEventListener('listen', () => {
    console.log(`Server started on port ${PORT}`);
});

app.use(async (context) => {
    await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}`,
        index: "index.html"
    });
});

await app.listen({ port: PORT });

