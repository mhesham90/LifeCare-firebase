import { medicineDAO } from '../DAO/medicine';
import { Router } from 'express';

const medicineRouter: Router = Router();

medicineRouter.get('/search', function(req, res, next) {
  let text = (req.query.text || '').toLowerCase();
  medicineDAO.searchByName(text)
    .then((medicines: any) => {
      res.status(200).send(medicines);
    }).catch((err) => {
      res.status(404).send(err);
    })
});

medicineRouter.get('/:id', function(req, res, next) {
  medicineDAO.getById(req.params.id)
    .then((data) => {
      res.status(200).send(data);
    }).catch((err) => {
      res.status(404).send("not found "+err);
    })
});

export default medicineRouter;
