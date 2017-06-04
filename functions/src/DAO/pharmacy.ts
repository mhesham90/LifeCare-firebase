import { AbstractDAO } from './abstract';
import Pharmacy from '../models/pharmacy';

export class PharmacyDAO extends AbstractDAO{

  constructor() {
      super()
      this.entity = 'pharmacy';
  }

  deserialize(data: any){
      let pharmacy = new Pharmacy()
      pharmacy.set(data)
      return pharmacy
  }

  //return JS objects NOT model objects
  getByMedicineAndDistrict(id: any, district: any, quantity: number = 5){
      let query = this.db.query({path:'/medicine/'+id+'/pharmacies'})
      let pharmacies: any = [];
      return new Promise((resolve, reject)=>{
        this.db.executeAll(query).then((data: any) => {
            let pharmsFilteredByQuantity = this.filterAvailableQuantity(data, quantity)
            let pharmsOrderedByDiliveribility = this.orderByDeliverablePharms(pharmsFilteredByQuantity, district)
            resolve(pharmsOrderedByDiliveribility);
        }).catch((err: any) =>{
            reject(err)
        })
    });
  }
  private filterAvailableQuantity(arr: any, quantity: number){
      return arr.filter((e: any) => {return e.quantity > quantity})
  }
  private orderByDeliverablePharms(data: any, district: any){
      let result: any = [];
      data.forEach((e: any) => {
          if(e.delivery_areas[district]){
              result.unshift({'id': e.uid, 'delivery': 1})
          }else{
              result.push({'id': e.uid, 'delivery': 0})
          }
      })
      return result;
  }
  // getByMedicineAndDistrict(id: any, district: any){
  //     let query = this.db.query({path:'/medicine/'+id+'/pharmacies', where:'district', equal:district})
  //     let pharmacies: any = [];
  //     return new Promise((resolve, reject)=>{
  //       this.db.executeAll(query).then((data: any) => {
  //           let availablePharms = data.filter((e: any) => {return e.quantity > 5})
  //           let pharmsPromises = availablePharms.map((e: any) => {return pharmacyDAO.getById(e.uid)})
  //           Promise.all(pharmsPromises).then((pharms: any) =>{
  //             resolve(pharms)
  //           }).catch((err) =>{
  //             reject(err)
  //           })
  //       })
  //   });
  // }

}

export const pharmacyDAO = new PharmacyDAO();
