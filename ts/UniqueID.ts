import { getGame } from "./DatabaseHelpers.ts"

export async function generateUniqueID(idLength: number, authCookieLength: number, gameType: string): Promise<{ id: string, authCookie: string }> {
    let result = null;

    while (result == null) {
        let id = await generateRandomString(idLength)
        let authCookie = await generateRandomString(authCookieLength)
        result = { id: id, authCookie: authCookie };

        if (await getGame(id, authCookie, gameType))
            result = null;
    }

    return result;
}

export async function generateRandomString(length: number): Promise<string> {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
