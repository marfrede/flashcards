import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Username } from '../../models/username';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { AuthProvider } from '../auth/auth';

@Injectable()
export class UsernameProvider {
  
  usernamesCollection: AngularFirestoreCollection<Username>;
  usernames$: Observable<Username[]>;

  constructor(public afs: AngularFirestore, private authService: AuthProvider) {
    this.usernamesCollection = this.afs.collection('usernames', ref => ref.orderBy('username','asc'));
  }

  getUsernames$():Observable<Username[]>{
    return this.usernamesCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Username;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  addUsername(username:Username):void{
    this.usernamesCollection.add(username);
  }

  getCurrentUser():Promise<string>{
    return new Promise<string>((resolve)=>{
      this.authService.getCurrentUser().then(cUser => {
        this.getUsernames$().subscribe(unames => {
          let username:Username
          if(cUser && cUser.email) username = unames.find(name => name.email == cUser.email);
          const stringUname = username? username.username : '';
          resolve(stringUname);
        })
      })
    })
  }

}
