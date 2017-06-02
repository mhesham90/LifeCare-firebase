export interface ORMInterface{

    query(params: {path:string, where?: any, equal?:any, start?:any , end?:any, limit?:number, to?:string}): any;

    executeAll(query: any): any;

    executeOne(query: any): any;

    insertOne(ref: any, data: any): any;

    insertMany(ref: any, data: any): any;

    insertManyInOne(ref: any, data: any): any;
}
