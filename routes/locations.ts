import { Router, copySync, FormDataBody, helpers } from "../deps.ts";
import { CheckAuth } from "../ts/CheckAuth.ts"
import { Games } from "../config/games.ts"
import Databases from "../db/mongo.ts"
import IlocationsSchema from "../models/location.ts";

const locationsRouter = new Router();

locationsRouter.get('/locations/:type/selector', selector)
locationsRouter.post('/locations/:type/add', addLocation)


async function selector(ctx: any) {
    try {
        let params = helpers.getQuery(ctx, { mergeParams: true });
        ctx.response.headers.set("WWW-Authenticate", `Basic realm="User Visible Realm", charset="UTF-8"`)
        const authenticated = await CheckAuth.API(ctx);
        const gameObj = Games[params.type];
        if (authenticated) ctx.render("./dist/locationSelector.ejs", { gameObj: gameObj })

    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "There was an error on server, please try again later... \n" + error;
        console.log(error)
    }
}


async function addLocation(ctx: any) {
    try {
        let params = helpers.getQuery(ctx, { mergeParams: true });
        ctx.response.headers.set("WWW-Authenticate", `Basic realm="User Visible Realm", charset="UTF-8"`)
        const authenticated = await CheckAuth.API(ctx);

        if (authenticated) {
            const file = ctx.request.body({ type: "form-data" });
            let args = await file.value.read();
            let db = Databases[args.fields.game_type]

            let location_collection = db.collection<IlocationsSchema>("locations");
            let id = (await location_collection.find()).length;
            let image_type = await saveImageFile(args, id.toString());

            let newLoc: IlocationsSchema = {
                id: id,
                latlng: {
                    lat: parseInt(args.fields.lat),
                    lng: parseInt(args.fields.lng)
                },
                imageLink: `images/locations/${id}.${image_type}`
            }
            await location_collection.insertOne(newLoc);
            const gameObj = Games[params.type];
            ctx.render("./dist/locationAdded.ejs", { imgLink: `/images/locations/${args.fields.game_type}/${id}.${image_type}`, lat: parseInt(args.fields.lat), lng: parseInt(args.fields.lng), gameObj: gameObj })
        }
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "There was an error on server, please try again later... \n" + error;
        console.log(error)
    }
}

async function saveImageFile(args: FormDataBody, id: string): Promise<string> {
    if (!args.files) throw Error("You didn't upload the file")
    let type = args.files[0].contentType.split("/")[1]

    if (!args.files[0].filename) throw Error("Couldn't find the image")
    copySync(args.files[0].filename, `${Deno.cwd()}/public/images/locations/${args.fields.game_type}/${id}.${type}`)

    return type;
}

export default locationsRouter;
