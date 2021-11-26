import app from "./main.ts"

const PORT = Deno.args[0] || '3000';

app.addEventListener('listen', () => {
    console.log(`Server started on port ${PORT}`);
});

await app.listen({ port: parseInt(PORT) });

