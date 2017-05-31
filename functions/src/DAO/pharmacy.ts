import { AbstractDAO } from './abstract';
import Pharmacy from '../models/pharmacy';

export default class PharmacyDAO extends AbstractDAO{

  constructor() {
      super()
      this.entity = 'district';
  }

  deserialize(data: any){
      let pharmacy = new Pharmacy()
      pharmacy.get(data)
      return pharmacy
  }
}
