import { AbstractDAO } from './abstract';
import Pharmacy from '../models/pharmacy';

class PharmacyDAO extends AbstractDAO{

  constructor() {
      super()
      this.entity = 'pharmacy';
  }

  deserialize(data: any){
      let pharmacy = new Pharmacy()
      pharmacy.get(data)
      return pharmacy
  }

  getByMedicineAndDistrict(id: any, district: any){
      let query = this.db.query({path:'/medicine/'+id+'/pharmacies', where:'district', equal:district})
      let pharmacies: any = [];
      return new Promise((resolve, reject)=>{
        this.db.executeAll(query).then((data: any) => {
            let availablePharms = data.filter((e: any) => {return e.quantity > 5})
            let pharmsPromises = availablePharms.map((e: any) => {return pharmacyDAO.getById(e.uid)})
            Promise.all(pharmsPromises).then((pharms: any) =>{
              resolve(pharms)
            }).catch((err) =>{
              reject(err)
            })
        })
    });
  }
}

export const pharmacyDAO = new PharmacyDAO();
