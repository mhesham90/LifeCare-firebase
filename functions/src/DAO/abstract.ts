import { ORMInterface } from '../ORM/ORMInterface'
import FirebaseORM from '../ORM/firebase'
// import MongoORM from '../ORM/mongo'
// import MysqlORM from '../ORM/mysql'

export abstract class AbstractDAO{
    public db: ORMInterface;
    public entity: string;

    constructor() {
        this.db = new FirebaseORM();
        // this.db = new MongoORM();
        // this.db = new MysqlORM();
    }

    abstract deserialize(data: any): any;

    serialize(data: any){
        return Object.assign({}, data)
    }

    getById(id: any){
        let query = this.db.query({path:'/' + this.entity + '/' + id});
        return new Promise((resolve, reject) =>{
            this.db.executeOne(query).then((data: any) =>{
                let obj = this.deserialize(data)
                resolve(obj)
            }).catch((error: any) => { reject(error) })
        })
    }

    getAll(){
        let query = this.db.query({path:'/' + this.entity});
        return new Promise((resolve, reject) =>{
            this.db.executeAll(query).then((data: any) =>{
                let arr = data.map(this.deserialize)
                resolve(arr)
            }).catch((error: any) => { reject(error) })
        })
    }

    // insert one object of model
    insertOne(data: any, ref: any = ''){
        //convert to JS object
        let d = this.serialize(data)
        return this.db.insertOne(d, this.entity + ref);
    }

    //insert array of objects of models
    insertMany(objects: any, ref: any = ''){
        //convert to JS objects
        let data = objects.map(this.serialize)
        this.db.insertMany(data, this.entity + ref);
    }

    //insert array of objects of models in One new key
    insertManyInOne(objects: any, ref: any = ''){
        //convert to JS objects
        let data = objects.map(this.serialize)
        this.db.insertManyInOne(data, this.entity + ref);
    }
}
