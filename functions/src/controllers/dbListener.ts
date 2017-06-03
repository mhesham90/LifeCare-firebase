import { pharmacyDAO } from '../DAO/pharmacy';

export const resultListener = (event: any) => {
  // Grab the current value of what was written to the Realtime Database.
  let now = Date.now();
  let cutoff = now - 15*60*1000;
  let oldRefs = pharmacyDAO.db.query({path:'result/', where:'timestamp', end: cutoff})
  pharmacyDAO.db.executeAll(oldRefs).then((snapshots: any) =>{
    snapshots.forEach((result:any)=>{
      console.log(result);
      pharmacyDAO.db.insertOne('result',{uid:result.uid,null:null})
    });
  })
};
