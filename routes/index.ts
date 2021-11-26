import { Router, IPLocationService } from "../deps.ts";
import Databases from "../db/mongo.ts"
import Igeo_dataSchema from "../models/geo_data.ts";
import Iplays_by_dateSchema from "../models/plays_by_date.ts"
import { GetIP } from "../ts/GetIP.ts"

const indexRouter = new Router();

indexRouter.get('/', getIndex);
indexRouter.get('/privacypolicy', getPrivacyPolicy);
let db = Databases["main"];

async function getIndex(ctx: any): Promise<void> {
    try {
        let ip = GetIP(ctx);
        await saveGeoData(ip)
        await savePlaysByDate();
        ctx.response.status = 200;
        ctx.render("./dist/index.ejs", {})
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "There was an error on server, please try again later..."
        console.log(error)
    }
}

async function getPrivacyPolicy(ctx: any) {
    try {
        ctx.response.status = 200;
        ctx.render("./dist/privacypolicy.ejs", {})
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "There was an error on server, please try again later..."
        console.log(error)
    }
}


async function saveGeoData(ip: string): Promise<void> {
    try {
        let geo_data_collection = db.collection<Igeo_dataSchema>("geo_data");
        const data = await geo_data_collection.findOne({ ip: ip });

        let tmp: Igeo_dataSchema = {
            ip: ip,
            details: await IPLocationService.getIPLocation(ip),
            visits: 1,
            last_visit: (new Date()).toUTCString()
        };


        if (data) await geo_data_collection.updateOne({ ip: ip }, { ip: ip, details: tmp.details, visits: (data.visits += 1), last_visit: tmp.last_visit });
        if (!data) await geo_data_collection.insertOne(tmp);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function savePlaysByDate(): Promise<void> {
    try {
        let nowDate: Date = new Date()
        let nowDateString = `${nowDate.getDate()}/${nowDate.getMonth() + 1}/${nowDate.getFullYear()}`;
        let plays_by_date_collection = db.collection<Iplays_by_dateSchema>("plays_by_date");
        const data = await plays_by_date_collection.findOne({ date: nowDateString });

        let tmp: Iplays_by_dateSchema = {
            date: nowDateString,
            plays: 1
        };

        if (data) await plays_by_date_collection.updateOne({ date: nowDateString }, { date: nowDateString, plays: (data.plays += 1) });
        if (!data) await plays_by_date_collection.insertOne(tmp);


    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default indexRouter;