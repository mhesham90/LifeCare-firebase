import { pharmacyDAO } from '../index';
import { Router } from 'express';

const pharmacyRouter: Router = Router();

pharmacyRouter.get('/', function(req, res, next) {
    res.status(200).send('pharmacyURL');
});

export default pharmacyRouter;
