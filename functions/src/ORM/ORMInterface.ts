export interface ORMInterface{

    query(params: {path:string, where?: any, equal?:any, start?:any , end?:any, limit?:number, to?:string}): any;

    executeAll(query: any): any;

    executeOne(query: any): any;

    insertOne(data: any, ref: any): any;

    insertMany(data: any, ref: any): any;

    insertManyInOne(data: any, ref: any): any;
}
