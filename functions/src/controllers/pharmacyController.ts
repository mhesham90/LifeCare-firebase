import { pharmacyDAO } from '../DAO/pharmacy';
import { districtDAO } from '../DAO/district';
import { Router } from 'express';

const pharmacyRouter: Router = Router();

pharmacyRouter.get('/medicine/:id', function(req, res, next) {
  let medicine_id = req.params.id;
  let getDistrict = new Promise((resolve, reject) => {
      if(req.query.district !== "" && req.query.district !== undefined){
          resolve(req.query.district)
      }else{
        districtDAO.getByCoords(req.query.gpslong, req.query.gpslat)
          .then((dis: any) => {
              resolve(dis.uid);
          })
      }
  })
  getDistrict.then((district) => {
      pharmacyDAO.getByMedicineAndDistrict(medicine_id, district).then((data) =>{
        res.status(200).send(data)
      }).catch((err) =>{
        res.status(503).send(err)
      })
  })
});


export default pharmacyRouter;
