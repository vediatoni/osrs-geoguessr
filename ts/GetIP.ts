export function GetIP(ctx: any): string {
    if (Deno.env.get("USERNAME") == "tony") return ctx.request.ip;

    return ctx.request.headers.get("X-Real-IP") || "127.0.0.1";
}