import { Router, Context, helpers } from "../deps.ts";
import { GetIP } from "../ts/GetIP.ts"
import { GameTypeID } from "../ts/GameTypeID.ts"
import { generateUniqueID } from "../ts/UniqueID.ts"
import { pluck, getDistanceBetween, getGoodScore } from "../ts/CalculationHelpers.ts"
import { getRandomLocations, getGame, addToLeaderboards, updateGame, newGame } from "../ts/DatabaseHelpers.ts"
import { GameConstants } from "../ts/GameConstants.ts"
const gamesRouter = new Router();

gamesRouter.get('/game/:gameType', initGame);
gamesRouter.get('/game/:gameType/get', getNewGame);
gamesRouter.post('/game/confirm', confirmLocation);
gamesRouter.post('/game/end', endGame);

async function initGame(ctx: any) {
    let params = helpers.getQuery(ctx, { mergeParams: true });
    ctx.render("./dist/standalonegame.ejs", { gameType: GameTypeID[params.gameType] })
}

async function getNewGame(ctx: any) {
    try {
        let params = helpers.getQuery(ctx, { mergeParams: true });
        let auth = await generateUniqueID(8, 12, params.gameType);
        let locations = await getRandomLocations(params.gameType);
        let ip = GetIP(ctx);

        await newGame({ id: auth.id, authCookie: auth.authCookie, locations: locations, ip: ip, round: 1, score: 0, addedToLeaderboards: false, date: new Date() }, params.gameType)

        ctx.response.body = { locations: pluck(locations, "imageLink"), maxRounds: GameConstants.MAX_ROUNDS, scoreProgressBarAMX: GameConstants.HIGHEST_SCORE, maxRadiusDistance: GameConstants.MAX_RADIUS, authCookie: auth.authCookie, id: auth.id }
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "There was an error on server, please try again later..."
        console.log(error)
    }
}

async function confirmLocation(ctx: Context) {
    try {
        let urlSearch: URLSearchParams = await ctx.request.body().value;
        let latlng = urlSearch.get("latlng");
        let id = urlSearch.get("id");
        let authCookie = urlSearch.get("authCookie")
        let gameType = urlSearch.get("gameType")

        if (!latlng || !id || !authCookie || !gameType) {
            ctx.response.status = 406
            ctx.response.body = "The request didn't provide all the data. Referesh page or contact admin if this persist.";
            return;
        }

        let args: { lat: number, lng: number } = JSON.parse(latlng)
        let game = await getGame(id, authCookie, gameType);
        let ip = GetIP(ctx);

        if (!game) throw new Error(`Game ${id} ${authCookie} was not found in the array.`);
        if (game.round == GameConstants.MAX_ROUNDS + 1) throw new Error(`Game ${game.id} is finished but the user ${ip} is trying to continue. It is on round ${game.round}`);

        let gameFinished = game.round == GameConstants.MAX_ROUNDS
        let prevLocationLatLng = game.locations[game.round - 1].latlng;
        let distance = getDistanceBetween(args, prevLocationLatLng);

        game.score += Math.round(getGoodScore(distance));
        game.round++;

        await updateGame(gameType, id, authCookie, game)

        ctx.response.body = {
            prevLocation: prevLocationLatLng,
            score: game.score,
            round: game.round,
            gameFinished: gameFinished,
            scoreProgess: (game.score / GameConstants.HIGHEST_SCORE) * 100,
            roundProgress: (game.round / GameConstants.MAX_ROUNDS) * 100
        };
    }
    catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "The request didn't provide all the data. Contact admin.";
        console.log(error)
    }

}

async function endGame(ctx: Context) {
    try {
        let urlSearch: URLSearchParams = await ctx.request.body().value;
        let id = urlSearch.get("id");
        let authCookie = urlSearch.get("authCookie")
        let saveOnLeaderBoard = urlSearch.get("saveOnLeaderBoard");
        let name = urlSearch.get("name")
        let gameType = urlSearch.get("gameType")

        if (!id || !authCookie || !saveOnLeaderBoard || !name || !gameType) {
            ctx.response.status = 406
            ctx.response.body = "The request didn't provide all the data. Referesh page or contact admin if this persist.";
            return;
        }

        let game = await getGame(id, authCookie, gameType);
        let ip = GetIP(ctx);

        if (!game) throw new Error(`Game ${id} was not found in the array. When ending the game`);
        if (game.round != GameConstants.MAX_ROUNDS + 1) throw new Error(`Game ${game.id} isn't finished but the user ${ip} is trying to finish it. It is on round ${game.round}`);

        // ADD SCORE FROM THE GAME TO LEADERBOARD
        if (saveOnLeaderBoard) {
            if (game.addedToLeaderboards) {
                ctx.response.status = 405;
                ctx.response.body = "You've already added the score!"
                return;
            }

            await addToLeaderboards(game, name, ip, gameType);
        }

        ctx.response.status = 200;
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = "There was an error processing your request."
        console.log(error)
    }
}

export default gamesRouter