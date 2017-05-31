import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export default class Pharmacy{
  uid: string;
  name: string;
  imageURL: string;
  telephone: string;
  loaction: any; // {long:'...', lat:'...'}
  district: string;
  delivery_areas: any; // fill array from snapshot
  medicine: any;  // fill array with medicine
  delivery_start_time: string;  //24 hr string
  delivery_end_time: string;  //24 hr string


}
