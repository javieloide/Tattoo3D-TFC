import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {LocationInterface} from '../models/location';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private firestore: AngularFirestore) { }
  getLocations(): Observable<any> {
    return this.firestore.collection('location').snapshotChanges();
  }
  getLocation(id: string): Promise<LocationInterface> {
    let location: any = null;
    const docRef =  this.firestore.collection('location').doc(id);
    location = docRef.get().toPromise().then((doc) => {
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
    return location;
  }
  updateLocation(id: string, data: LocationInterface): Promise<any> {
    return this.firestore.collection('location').doc(id).update(data);
  }
}
