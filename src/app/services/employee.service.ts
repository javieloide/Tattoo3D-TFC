import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {EmployeeInterface} from '../models/employee';
import {PiercingInterface} from '../models/piercing';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private firestore: AngularFirestore) { }

  addEmployee(employee: EmployeeInterface): Promise<any> {
    return this.firestore.collection('employees').add(employee);
  }

  getEmployees(): Observable<any> {
    return this.firestore.collection('employees', ref => ref.orderBy('name', 'asc')).snapshotChanges();
  }

  deleteEmployee(id: string): Promise<any> {
    return this.firestore.collection('employees').doc(id).delete();
  }

  getEmployee(id: string): Promise<EmployeeInterface> {
    let employee: any = null;
    const docRef =  this.firestore.collection('employees').doc(id);
    employee = docRef.get().toPromise().then((doc) => {
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
    return employee;
  }

  updateEmployee(id: string, data: any): Promise<any> {
    return this.firestore.collection('employees').doc(id).update(data);
  }
}
