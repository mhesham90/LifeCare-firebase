export default class Pharmacy{
    uid: string;
    name: string;
    imageURL: string;
    telephone: string;
    loaction: any; // {long:'...', lat:'...'}
    district: string;
    delivery_areas: any; // fill array from snapshot
    medicine: any;  // fill array with medicine
    delivery_start_time: string;  //24 hr string
    delivery_end_time: string;  //24 hr string

    constructor() {

    }

    get(data: any){
        this.uid = data.uid;
        this.name = data.name;
        this.imageURL = data.imageURL;
        this.telephone = data.telephone;
        this.loaction = data.loaction;
        this.district = data.district;
        this.medicine = data.medicine;
        this.delivery_start_time = data.delivery_start_time;
        this.delivery_end_time = data.delivery_end_time;
    }
}
