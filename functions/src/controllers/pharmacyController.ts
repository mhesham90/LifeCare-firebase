import { pharmacyDAO } from '../DAO/pharmacy';
import { districtDAO } from '../DAO/district';
import { Router } from 'express';

const pharmacyRouter: Router = Router();

/*Query params
* gpslong, gpslat   (to get required district)
* district          (given district id => ignore gpslong and gpslat)
* limit             (pagination limit)
* searchkey         (to report that he is comming from an old search)
*    lastkey        (required with searchkey to report the last key he got (instead of offset))
*/
pharmacyRouter.get('/medicine/:id', function(req, res, next) {
  let medicine_id = req.params.id;
  // case 1 .. first hit to get pharmacies
  let district_id = req.query.district;
  let gpslong = req.query.gpslong;
  let gpslat = req.query.gpslat;
  let limit = Number(req.query.limit) || 10;
  // case 2 .. to paginate
  let searchkey = req.query.searchkey;
  let lastkey = req.query.lastkey;

  if(!searchkey){
    let getDistrict = new Promise((resolve, reject) => {
        if(district_id !== "" && district_id !== undefined){
            resolve(district_id)
        }else{
          districtDAO.getByCoords(gpslong, gpslat)
            .then((dis: any) => {
                resolve(dis.uid);
            })
        }
    })
    var nextPharKeys = new Promise((resolve, reject) => {
      getDistrict.then((dist_id) => {
          if(!dist_id){
            res.status(404).send("Not found district")
          }else{
            pharmacyDAO.getByMedicineAndDistrict(medicine_id, dist_id, 5).then((data: any) =>{
              let now = Date.now();
              searchkey = pharmacyDAO.insertOne('result',{timestamp:now});
              pharmacyDAO.insertManyInOne('result/'+searchkey, data, 'data')
              let pharkeys = data.slice(0,limit);
              resolve(pharkeys);
            }).catch((err) =>{
              reject(err);
            })
          }
      })
    })
  }else{
    var nextPharKeys = new Promise((resolve, reject) => {
      let cursorQuery = pharmacyDAO.db.query({path:'result/'+searchkey+'/data', where:'id', equal:lastkey})
      pharmacyDAO.db.executeOne(cursorQuery).then((data: any) =>{
        delete(data['uid'])
        let start = Object.keys(data)[0];
        let nextKeysQuery = pharmacyDAO.db.query({path:'result/'+searchkey+'/data', where:{by:'key'}, start:start, limit:limit})
        pharmacyDAO.db.executeAll(nextKeysQuery).then((keys: any) =>{
          keys.shift();
          resolve(keys);
        }).catch((error: any) => { reject('keys error') })
      }).catch((error: any) => { reject('cursor error') })

    })
  }

  nextPharKeys.then((pharkeys: any) =>{
    let resArray: any = [];
    pharkeys.forEach((phar:any) => {
      resArray.push(pharmacyDAO.getById(phar.id))
    })
    let pharmacies: any = [];
    Promise.all(resArray).then((phars: any) =>{
      for (let key in phars){
        pharmacies.push({'pharmacy':phars[key],'delivery':pharkeys[key]['delivery']});
      }
      res.status(200).send({pharmacies:pharmacies,searchkey:searchkey})
    }).catch((err) =>{
      res.status(503).send(err)
    })
  }).catch((error: any) => { res.status(503).send(error) })



});

export default pharmacyRouter;
