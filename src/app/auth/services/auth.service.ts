import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInterface } from '../../models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  // tslint:disable-next-line:typedef
  async login(email: string, password: string){
    try{
      const result =  await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;
    }
    catch (error){
      return error.message;
    }
  }

  // tslint:disable-next-line:typedef
  async register(email: string, password: string, extraData = null){
    try{
      const result =  await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.updateUserData(result.user, extraData);
      return result;
    }
    catch (error){
      return error.message;
    }
  }

  // tslint:disable-next-line:typedef
  async logout(){
    try{
      await this.afAuth.signOut();
    }
    catch (error) {
      console.log(error);
    }
  }

  // tslint:disable-next-line:typedef
  getCurrentUser(){
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  // tslint:disable-next-line:typedef
   updateUserData(user, extraData = null){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: UserInterface = {
      id: user.uid,
      email: user.email,
      roles: {
        client: true
      },
      country: extraData.country,
      city: extraData.city,
      street: extraData.street,
      zip_code: extraData.zip_code,
      photo: extraData.photo
    };
    return userRef.set(data, {merge: true});
  }
  // tslint:disable-next-line:typedef
  isAuth(){
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  // tslint:disable-next-line:typedef
  isUserAdmin(userUid){
    return this.afs.doc<UserInterface>(`users/${userUid}`).valueChanges();
  }

}


