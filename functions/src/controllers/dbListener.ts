import { pharmacyDAO } from '../DAO/pharmacy';
import { resultDAO } from '../DAO/result';

export const resultListener = (event: any) => {
  // Grab the current value of what was written to the Realtime Database.
  resultDAO.removeExpired(15);
};
