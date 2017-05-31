import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Pharmacy from '../models/pharmacy';
import { Router } from 'express';

const pharmacyRouter: Router = Router();

pharmacyRouter.get('/', function(req, res, next) {
    res.status(200).send('pharmacyURL');
});

export default pharmacyRouter;

