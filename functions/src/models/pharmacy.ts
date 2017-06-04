export default class Pharmacy{
    uid: string;
    name: string;
    imageUrl: string;
    telephone: string;
    location: any; // {long:'...', lat:'...'}
    district: string;
    delivery_areas: any; // fill array from snapshot
    medicine: any;  // fill array with medicine
    delivery_start_time: string;  //24 hr string
    delivery_end_time: string;  //24 hr string
    deliverabilty: boolean;

    constructor() {

    }

    set(data: any){
        this.uid = data.uid;
        this.name = data.name;
        this.imageUrl = data.imageUrl;
        this.telephone = data.telephone;
        this.location = data.location;
        this.district = data.district;
        this.delivery_areas = data.delivery_areas;
        this.medicine = data.medicine;
        this.delivery_start_time = data.delivery_start_time;
        this.delivery_end_time = data.delivery_end_time;
    }
}
