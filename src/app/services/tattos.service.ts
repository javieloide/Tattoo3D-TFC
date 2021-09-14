import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {TattooInterface} from '../models/tattoo';

@Injectable({
  providedIn: 'root'
})
export class TattosService {

  constructor(private firestore: AngularFirestore) { }

  addTattoo(tatto: TattooInterface): Promise<any> {
    return this.firestore.collection('tattoos').add(tatto);
  }

  getTattoos(): Observable<any> {
    return this.firestore.collection('tattoos', ref => ref.orderBy('name', 'asc')).snapshotChanges();
  }

  deleteTattoo(id: string): Promise<any> {
    return this.firestore.collection('tattoos').doc(id).delete();
  }

  getTattoo(id: string): Promise<TattooInterface> {
    let tattoo: any = null;
    const docRef =  this.firestore.collection('tattoos').doc(id);
    tattoo = docRef.get().toPromise().then((doc) => {
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
    return tattoo;
  }

  updateTattoo(id: string, data: TattooInterface): Promise<any> {
    return this.firestore.collection('tattoos').doc(id).update(data);
  }
}
