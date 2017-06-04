import { ORMInterface } from './ORMInterface';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default class FirebaseORM implements ORMInterface{
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

    insertOne(data: any, ref: any){
      if(data.uid){
        let dataToInsert = {}
        let key = data.uid
        delete data['uid']
        dataToInsert[key] = data
        this.db.ref(ref + '/').update(dataToInsert);
        return key;
      }else{
        return this.db.ref(ref + '/').push(data).key;
      }
    }

    insertMany(data: any, ref: any){
      data.forEach((d: any) => {
          if(d.uid){
            let dataToInsert = {}
            let key = d.uid
            delete d['uid']
            dataToInsert[key] = d
            this.db.ref(ref + '/').update(dataToInsert)
          }else{
            this.db.ref(ref + '/').push(d);
          }
      })
    }

    insertManyInOne(data: any, ref: any){
      let newKey = this.db.ref(ref + '/').push().key;
      data.forEach((d: any) => {
          if(d.uid){
            let dataToInsert = {}
            let key = d.uid
            delete d['uid']
            dataToInsert[key] = d
            this.db.ref(ref + '/' + newKey).update(dataToInsert)
          }else{
            this.db.ref(ref + '/' + newKey).push(d);
          }
      })
    }
}
