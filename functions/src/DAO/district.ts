import { AbstractDAO } from './abstract';
import District from '../models/district';
var inside = require('point-in-polygon');

class DistrictDAO extends AbstractDAO{

    constructor() {
        super()
        this.entity = 'district';
    }

    deserialize(data: any){
        let district = new District()
        district.get(data)
        return district
    }

    getByCoords(long: number, lat: number): any{
      return this.getAll()
        .then((districts: any) => {
          return new Promise((resolve, reject) =>{
              districts.forEach((dist: any) => {
                  let pointsList = this.getPointsList(dist)
                  console.log(pointsList)
                  console.log(inside([ long, lat ], pointsList))
                  if(inside([ long, lat ], pointsList)){
                      resolve(dist);
                  }
              })
              resolve(new District());
          })
        })
    }

    private getPointsList(dist: any){
        let pointsString = dist.points || "";
        let myPoints = pointsString.split(",");
        let pointsList: any = [];
        for (var i=0; i<myPoints.length; i+=2)
            pointsList.push(myPoints.slice(i,i+2));
        pointsList = pointsList.map((arr: any) => arr.map(Number))
        return pointsList;
    }

}

export const districtDAO = new DistrictDAO();
