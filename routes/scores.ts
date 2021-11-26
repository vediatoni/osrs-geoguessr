import { Router, helpers } from "../deps.ts";
import Databases from "../db/mongo.ts";
import IscoreSchema from "../models/score.ts";

const scoresRouter = new Router();

scoresRouter.get('/scores/:gameType', getTopScores)
scoresRouter.get('/scores/:gameType/amount/:number', getScoresByNumber)
scoresRouter.get('/scores/:gameType/name/:name', getScoreByName)


async function getTopScores(ctx: any) {
    try {
        let params = helpers.getQuery(ctx, { mergeParams: true });
        var score_data = await getScores(250, params.gameType);
        ctx.render("./dist/leaderboard.ejs", { scores: score_data, gameMode: String(params.gameType).toUpperCase() })
    }
    catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "There was an error on server, please try again later...";
        console.log(error)
    }
}

async function getScoresByNumber(ctx: any) {
    try {
        let params = helpers.getQuery(ctx, { mergeParams: true });
        var score_data = await getScores(parseInt(params.number), params.gameType);
        ctx.render("./dist/leaderboard.ejs", { scores: score_data })
    }
    catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "There was an error on server, please try again later...";
        console.log(error)
    }
}

async function getScoreByName(ctx: any) {
    try {
        let params = helpers.getQuery(ctx, { mergeParams: true });
        let db = Databases[params.gameType]
        let score_collection = db.collection<IscoreSchema>("scores");
        let score_data = await score_collection.find({ name: { $regex: ".*" + params.name + ".*" } })
        ctx.render("./dist/leaderboard.ejs", { scores: score_data })
    }
    catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "There was an error on server, please try again later...";
        console.log(error)
    }
}


async function getScores(amount: number, gameType: string) {
    let db = Databases[gameType]
    let score_collection = db.collection<IscoreSchema>("scores");
    let score_data = await score_collection.aggregate([
        { $sort: { score: -1, date: 1 } },
        { $limit: amount }
    ])

    return score_data;
}

export default scoresRouter;