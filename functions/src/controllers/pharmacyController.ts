import { pharmacyDAO } from '../DAO/pharmacy';
import { resultDAO } from '../DAO/result';
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
  ////////////////////////////////////
  let current_district: any;
  var nextPharKeys = new Promise(() =>{});
  if(searchkey && lastkey){
    nextPharKeys = resultDAO.getNextKeys(searchkey, lastkey, limit);
  }else if(district_id || (gpslong && gpslat)){
    nextPharKeys = new Promise((resolve, reject) => {
      districtDAO.findDistrict(district_id, gpslong, gpslat)
      .then((dist_id) => {
          if(!dist_id){
            res.status(404).send("Not found district")
          }else{
            current_district = dist_id;
            pharmacyDAO.getByMedicineAndDistrict(medicine_id, dist_id, 5).then((data: any) =>{
              let now = Date.now();
              searchkey = resultDAO.insertOne({timestamp:now});
              resultDAO.insertMany(data, '/' + searchkey + '/data')
              let pharkeys = data.slice(0,limit);
              resolve(pharkeys);
            }).catch((err) =>{
              reject(err);
            })
          }
      }).catch(err =>{
        res.status(503).send("get district error: "+err)
      })
    })
  }else{
    res.status(404).send("query params error")
  }

  nextPharKeys.then((pharkeys: any) =>{
    let resArray = pharkeys.map((phar: any) =>{ return pharmacyDAO.getById(phar.id) })
    let pharmacies: any = [];
    Promise.all(resArray).then((phars: any) =>{
      for (let key in phars){
        let p = phars[key]
        p.deliverabilty = pharkeys[key]['delivery']
        pharmacies.push(p);
      }
      res.status(200).send({pharmacies:pharmacies,district:current_district,searchkey:searchkey})
    }).catch((err) =>{
      res.status(503).send(err)
    })
  }).catch((error: any) => { res.status(503).send(error) })
});


export default pharmacyRouter;
