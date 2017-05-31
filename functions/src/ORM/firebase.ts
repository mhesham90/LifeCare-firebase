import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default class FirebaseORM{
    db: any

    constructor() {
        this.db = admin.database();
    }

    query(params: {path:string, where?: any, equal?:any, start?:any , end?:any, limit?:number, to?:string}){
        let rootRef = this.db.ref(params.path);
        let q = rootRef;
        //where
        if(params.where){
            if(typeof params.where == 'string'){
                q = q.orderByChild(params.where)
            }
            if(typeof params.where == 'object'){
                switch(params.where.by){
                    case 'child':
                        q = q.orderByChild(params.where.value)
                        break
                    case 'key':
                        q = q.orderByKey()
                        break
                    case 'value':
                        q = q.orderByValue()
                        break
                }
            }
        }
        //equal
        if(params.equal){
            q = q.equalTo(params.equal);
        }
        //start
        if(params.start){
            q = q.startAt(params.start);
        }
        //end
        if(params.end){
            q = q.endAt(params.end);
        }
        //limit
        if(params.limit && (!params.to || params.to === 'first')){
            q = q.limitToFirst(params.limit)
        }
        if(params.limit && params.to === 'last'){
            q = q.limitToLast(params.limit)
        }
        return q
    }
    executeAll(query: any){
        return new Promise((resolve, reject)=>{
            query.once('value').then((snapshots: any) =>{
                let result: any[] = [];
                snapshots.forEach((snap: any) =>{
                    let obj = snap.val();
                    obj.uid = snap.key;
                    result.push(obj);
                })
                resolve(result)
            }).catch((error: any) => reject(error))
        })
    }
    executeOne(query: any){
      return new Promise((resolve, reject)=>{
          query.once('value').then((snapshot: any) =>{
              let result: any = {};
              if(snapshot.exists()){
                  result = snapshot.val();
                  result.uid = snapshot.key;
              }
              resolve(result)
          }).catch((error: any) => reject(error))
      })
    }
}
