import ILocation from "../models/location.ts";

export default class Game {
    private _authcookie: string;
    public get AuthCookie(): string {
        return this._authcookie;
    }

    private _id: string;
    public get Id(): string {
        return this._id
    }

    private _score: number;
    public get Score(): number {
        return this._score;
    }
    public set Score(val: number) {
        this._score = Math.round(val);
    }

    private _round: number;
    public get Round(): number {
        return this._round;
    }
    public set Round(val: number) {
        this._round = val;
    }

    public get Location(): ILocation {
        return this.Locations[this.Round - 1];
    }


    private _locations: Array<ILocation>;
    public get Locations(): Array<ILocation> {
        return this._locations;
    }


    constructor(id: string, authCookie: string, locations: Array<ILocation>) {
        this._id = id;
        this._score = 0;
        this._round = 1;
        this._authcookie = authCookie;
        this._locations = locations;
    }


    public getDistanceTo(latlng: { lat: number, lng: number }): number {
        var dx = latlng.lng - this.Location.latlng.lng,
            dy = latlng.lat - this.Location.latlng.lat;

        return Math.sqrt(dx * dx + dy * dy);
    }

    public toObject(): { authCookie: string, id: string, score: number, round: number, locationImage: string } {
        return {
            authCookie: this.AuthCookie,
            id: this.Id,
            score: this.Score,
            round: this.Round,
            locationImage: this.Location.imageLink
        }
    }

    public toAdminObject(): { authCookie: string, id: string, score: number, round: number, locations: Array<ILocation>, location: ILocation } {
        return {
            authCookie: this.AuthCookie,
            id: this.Id,
            score: this.Score,
            round: this.Round,
            locations: this.Locations,
            location: this.Location
        }
    }
}