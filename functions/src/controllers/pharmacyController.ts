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
  let limit = req.query.limit || 10;
  // case 2 .. to paginate
  let searchkey = req.query.searchkey;
  let lastkey = req.query.lastkey;

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
  getDistrict.then((dist_id) => {
      if(!dist_id){
        res.status(404).send("Not found district")
      }else{
        pharmacyDAO.getByMedicineAndDistrict(medicine_id, dist_id, 5).then((data) =>{
          pharmacyDAO.insertManyInOne('result', data)
          res.status(200).send(data)
        }).catch((err) =>{
          res.status(503).send(err)
        })
      }
  })
});

export default pharmacyRouter;
