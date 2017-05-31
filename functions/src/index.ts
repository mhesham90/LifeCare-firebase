import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as express from 'express';
const pharmacyApp: express.Express = express();
const medicineApp: express.Express = express();
const districtApp: express.Express = express();
const searchApp: express.Express = express();

admin.initializeApp(functions.config().firebase);

// export DAO classes
import MedicineDAO from './DAO/medicine';
import PharmacyDAO from './DAO/pharmacy';
import DistrictDAO from './DAO/district';
export const medicineDAO = new MedicineDAO();
export const pharmacyDAO = new PharmacyDAO();
export const districtDAO = new DistrictDAO();

//...import controllers
import PharmacyRouter from './controllers/pharmacyController';
import DistrictRouter from './controllers/districtController';
import MidicineRouter from './controllers/medicineController';
// import SearchRouter from './controllers/searchController';
declare module 'express' {
  interface Request {
    user: any
  }
}

// authentication middleware
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403);
    res.send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    res.status(403).send('Unauthorized');
  });
};
//...use authenticate middleware
// pharmacyApp.use(authenticate);
// medicineApp.use(authenticate);
// districtApp.use(authenticate);
// searchApp.use(authenticate);


//...define routes
pharmacyApp.use("/",PharmacyRouter);
medicineApp.use("/",MidicineRouter);
districtApp.use("/",DistrictRouter);
// searchApp.use("/",SearchRouter);


export const pharmacy = functions.https.onRequest(pharmacyApp);
export const medicine = functions.https.onRequest(medicineApp);
export const district = functions.https.onRequest(districtApp);
// export const search = functions.https.onRequest(searchApp);
