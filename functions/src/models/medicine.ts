export default class Medicine{
  uid: string;
  name: string;
  imageURL: string;
  category: string;   //medicines or accessories
  type: string;       //pills, ..
  unit_no: number;
  unit_price: number;
  pharmacies:{};

  constructor() {

  }

  get(data: any){
      this.uid = data.uid;
      this.name = data.name;
      this.imageURL = data.imageURL;
      this.category = data.category;
      this.type = data.type;
      this.unit_no = data.unit_no;
      this.unit_price = data.unit_price;
      this.pharmacies = data.pharmacies;
  }
}
