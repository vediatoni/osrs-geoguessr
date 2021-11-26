import { apiCreds } from "../config/api.ts"

export module CheckAuth {
    export async function API(ctx: any) {
        const headers: Headers = ctx.request.headers;
        const authorization = headers.get('Authorization')

        if (!authorization) {
            ctx.response.status = 401;
            return false;
        }

        let base64 = authorization.split(" ")[1]
        let utf8String = atob(base64).split(':');

        if (utf8String[0] !== apiCreds.username || utf8String[1] !== apiCreds.password) {
            ctx.response.status = 401;
            return false;
        }

        return true;
    }


}