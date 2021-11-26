import { Application, send, viewEngine, adapterFactory, engineFactory, oakCors } from "./deps.ts";
import indexRouter from "./routes/index.ts";
import locationsRouter from "./routes/locations.ts";
import scoresRouter from "./routes/scores.ts";
import gamesRouter from "./routes/game.ts";

const app = new Application({ keys: ["secret1"] });
const ejsEngine = await engineFactory.getEjsEngine();
const oakAdapter = await adapterFactory.getOakAdapter();

app.use(oakCors());
app.use(viewEngine(oakAdapter, ejsEngine));

app.use(indexRouter.routes());
app.use(locationsRouter.routes());
app.use(scoresRouter.routes());
app.use(gamesRouter.routes());

app.use(async (context) => {
    await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}/public`
    });
});

export default app;
