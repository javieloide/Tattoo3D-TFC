import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {RequestTattooInterface} from '../models/requestTattoo';
import {UserInterface} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RequestsTattoosService {
  constructor(private firestore: AngularFirestore) { }

  addRequestTattoo(requestTatto: RequestTattooInterface): Promise<any> {
    return this.firestore.collection('requests_tattoo').add(requestTatto);
  }

  getRequestsTattoos(): Observable<any> {
    return this.firestore.collection('requests_tattoo', ref => ref.orderBy('date', 'asc')).snapshotChanges();
  }

  deleteRequestTattoo(id: string): Promise<any> {
    return this.firestore.collection('requests_tattoo').doc(id).delete();
  }

  getRequestTattoo(id: string): Promise<RequestTattooInterface> {
    let requestTattoo: any = null;
    const docRef =  this.firestore.collection('requests_tattoo').doc(id);
    requestTattoo = docRef.get().toPromise().then((doc) => {
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
    return requestTattoo;
  }

  updateRequestTattoo(id: string, data: any): Promise<any> {
    return this.firestore.collection('requests_tattoo').doc(id).update(data);
  }
}
