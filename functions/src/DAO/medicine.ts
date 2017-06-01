import { AbstractDAO } from './abstract';
import Medicine from '../models/medicine';

class MedicineDAO extends AbstractDAO{

  constructor() {
      super()
      this.entity = 'medicine';
  }

  deserialize(data: any){
      let medicine = new Medicine()
      medicine.get(data)
      return medicine
  }

  searchByName(name: any){
      let query = this.db.query({path:'/' + this.entity, where:'LCaseName', start:name, end:name+"\uf8ff"});
      return new Promise((resolve, reject) =>{
          this.db.executeAll(query).then((data: any) =>{
              let arr = data.map(this.deserialize)
              resolve(arr)
          }).catch((error: any) => { reject(error) })
      })
  }

  // static getPharmaciesByDistrict(id: any, district: any){
  //   let pharmacies: any = [];
  //   return new Promise((resolve, reject)=>{
  //     admin.database().ref("medicine/"+id+"/pharmacies").orderByChild('district')
  //           .equalTo(district).once('value')
  //           .then((snapshots) => {    //...snapshot has all pharmacies having medicine within district
  //             console.log(snapshots.val());
  //             snapshots.forEach(function(snapshot: any){
  //               if(snapshot.val().quantity > 5){  //...only if medicine quantity is more than 5
  //                 // let pharmacy = new Pharmacy();
  //                 // pharmacy.fill(snapshot);
  //                 pharmacies.push(snapshot.key);
  //               }
  //             })
  //             resolve(pharmacies);
  //           }, error => reject());
  //   });
  // }
}

export const medicineDAO = new MedicineDAO();
