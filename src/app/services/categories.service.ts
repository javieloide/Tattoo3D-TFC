import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {CategoryInterface} from '../models/category';
import {PiercingInterface} from '../models/piercing';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private firestore: AngularFirestore) { }

  addCategory(category: CategoryInterface): Promise<any> {
    return this.firestore.collection('categories').add(category);
  }

  getCategories(): Observable<any> {
    return this.firestore.collection('categories', ref => ref.orderBy('name', 'asc')).snapshotChanges();
  }

  deleteCategory(id: string): Promise<any> {
    return this.firestore.collection('categories').doc(id).delete();
  }

  getCategory(id: string): Promise<CategoryInterface> {
    let category: any = null;
    const docRef =  this.firestore.collection('piercings').doc(id);
    category = docRef.get().toPromise().then((doc) => {
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
    return category;
  }

  updateCategory(id: string, data: CategoryInterface): Promise<any> {
    return this.firestore.collection('categories').doc(id).update(data);
  }
}
