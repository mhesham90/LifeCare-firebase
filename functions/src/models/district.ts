export default class District{
    uid :string
    name  :string;
    points :string;

    constructor() {

    }

    get(data: any){
        this.uid = data.uid;
        this.name = data.name;
        this.points = data.points;
    }
}
