import { AbstractDAO } from './abstract';
// import Result from '../models/result';

export class ResultDAO extends AbstractDAO{

  constructor() {
      super()
      this.entity = 'result';
  }

  deserialize(data: any){

  }

  getNextKeys(searchkey: any, lastkey: any, limit: number){
      let cursorQuery = this.db.query({path:this.entity + '/' +searchkey + '/data', where:'id', equal:lastkey})
      return new Promise((resolve, reject) =>{
        this.db.executeOne(cursorQuery)
        .then((data: any) =>{
            if(Object.keys(data).length === 0){
              reject('search key or last key not found')
            }
            delete(data['uid'])
            let start = Object.keys(data)[0];
            let nextKeysQuery = this.db.query({path:this.entity + '/' + searchkey + '/data', where:{by:'key'}, start:start, limit:limit+1})
            this.db.executeAll(nextKeysQuery)
            .then((keys: any) =>{
              keys.shift();
              resolve(keys);
            }).catch((error: any) => { reject('keys error') })
        }).catch((error: any) => { reject('cursor error') })
      })
  }

  removeExpired(min: number = 15){
      let now = Date.now();
      let cutoff = now - min*60*1000;
      let query = this.db.query({path:'result/', where:'timestamp', end: cutoff})
      this.db.executeAll(query).then((snapshots: any) =>{
        snapshots.forEach((result:any)=>{
          console.log(result);
          this.remove(result.uid)
        });
      })
  }

}

export const resultDAO = new ResultDAO();
