import { districtDAO } from '../index';
import { Router } from 'express';

const districtRouter: Router = Router();

districtRouter.get('/', function(req, res, next) {
    districtDAO.getAll()
    .then((data: any) => {
        res.status(200).send(data);
    }).catch((error: any) =>{
        res.status(503).send("Server Error: "+error);
    })
});

districtRouter.get('/:long/:lat', function(req, res, next){
    let long = Number(req.params.long);
    let lat = Number(req.params.lat);
    districtDAO.getByCoords(long, lat)
    .then((district: any) => {
        res.status(200).send(district)
    }).catch(() => {
        res.status(404).send("error");
    })
});

export default districtRouter;
