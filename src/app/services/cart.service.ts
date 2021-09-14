import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {OrderInterface} from '../models/order';
import {PiercingInterface} from '../models/piercing';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private firestore: AngularFirestore) { }
  addOrder(order: OrderInterface): Promise<any> {
    return this.firestore.collection('orders').add(order);
  }

  getOrders(): Observable<any> {
    return this.firestore.collection('orders', ref => ref.orderBy('date', 'asc')).snapshotChanges();
  }

  deleteOrder(id: string): Promise<any> {
    return this.firestore.collection('orders').doc(id).delete();
  }

  getOrder(id: string): Promise<OrderInterface> {
    let order: any = null;
    const docRef =  this.firestore.collection('orders').doc(id);
    order = docRef.get().toPromise().then((doc) => {
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
    return order;
  }
}
