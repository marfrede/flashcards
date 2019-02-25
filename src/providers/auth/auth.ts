import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { MessagesProvider } from '../../providers/messages/messages'
import { Observable } from 'rxjs';

@Injectable()
export class AuthProvider {

  user$ : Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth,
              private mService: MessagesProvider) {
    this.user$ = firebaseAuth.authState;
  }

  doRegister(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        resolve(res);
      }).catch(err => {
        this.mService.showErr(err);
        reject(err);
      });
    })
  }

  doLogin(email: string, password: string) {
      return new Promise<any>((resolve, reject) => {
        this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
        .then(res => {
          resolve(res);
        }).catch(err => {
          this.mService.showErr(err);
          reject(err);
        });
      })
  }

  doLogout() {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.auth.signOut()
      .then(res => {
        this.mService.goodbyeUser();
        resolve(res);
      }).catch(err => {
        this.mService.showErr(err);
        reject(err);
      })
    })
  }

  getCurrentUser():Promise<firebase.User>{
    return new Promise<firebase.User>((resolve)=>{
      this.user$.subscribe(res => {
        resolve(res);
      })
    })
  }

}
