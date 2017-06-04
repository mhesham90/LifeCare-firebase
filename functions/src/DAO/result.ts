import { AbstractDAO } from './abstract';
// import Result from '../models/result';

export class ResultDAO extends AbstractDAO{

  constructor() {
      super()
      this.entity = 'result';
  }

  deserialize(data: any){

  }

  getSome(searchkey: any, lastkey: any, limit: number){
      let cursorQuery = this.db.query({path:this.entity + '/' +searchkey + '/data', where:'id', equal:lastkey})
      return new Promise((resolve, reject) =>{
        this.db.executeOne(cursorQuery)
        .then((data: any) =>{
            if(!data){
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

}

export const resultDAO = new ResultDAO();
