import ORM from '../ORM/firebase'

export abstract class AbstractDAO{
    public db: any;
    public entity: string;

    constructor() {
        this.db = new ORM();
    }

    abstract deserialize(data: any): any;

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
}
