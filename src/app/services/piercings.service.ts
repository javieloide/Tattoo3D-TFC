import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {PiercingInterface} from '../models/piercing';
import {TattooInterface} from '../models/tattoo';

@Injectable({
  providedIn: 'root'
})
export class PiercingsService {

  constructor(private firestore: AngularFirestore) { }

  addPiercing(piercing: PiercingInterface): Promise<any> {
    return this.firestore.collection('piercings').add(piercing);
  }

  getPiercings(): Observable<any> {
    return this.firestore.collection('piercings', ref => ref.orderBy('name', 'asc')).snapshotChanges();
  }

  deletePiercing(id: string): Promise<any> {
    return this.firestore.collection('piercings').doc(id).delete();
  }

  getPiercing(id: string): Promise<PiercingInterface> {
    let piercing: any = null;
    const docRef =  this.firestore.collection('piercings').doc(id);
    piercing = docRef.get().toPromise().then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        return doc.data();
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    }).catch((error) => {
      console.log('Error getting document:', error);
    });
    return piercing;
  }

  updatePiercing(id: string, data: PiercingInterface): Promise<any> {
    return this.firestore.collection('piercings').doc(id).update(data);
  }
}
