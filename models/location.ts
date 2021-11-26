export default interface IlocationsSchema {
    id: number,
    latlng: {
        lat: number,
        lng: number
    },
    imageLink: string
}