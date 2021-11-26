import app from "./main.ts"
import { superoak } from "./deps.ts"

Deno.test("Test index server that should return 200", async () => {
    const request = await superoak(app);
    await request.get("/")
        .expect(200)
});