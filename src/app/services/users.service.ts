import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {UserInterface} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private firestore: AngularFirestore) { }

  addUser(user: UserInterface): Promise<any> {
    return this.firestore.collection('users').add(user);
  }

  getUsers(): Observable<any> {
    return this.firestore.collection('users', ref => ref.orderBy('email', 'asc')).snapshotChanges();
  }

  deleteUser(id: string): Promise<any> {
    return this.firestore.collection('users').doc(id).delete();
  }

  getUser(id: string): Promise<UserInterface> {
    let user: any = null;
    const docRef =  this.firestore.collection('users').doc(id);
    user = docRef.get().toPromise().then((doc) => {
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
    return user;
  }
  updateUser(id: string, data: UserInterface): Promise<any> {
    return this.firestore.collection('users').doc(id).update(data);
  }
}
