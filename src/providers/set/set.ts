import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Set } from '../../models/set';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Card, Diff } from '../../models/card';
import * as firebase from "firebase";

@Injectable()
export class SetProvider {

  setsCollection: AngularFirestoreCollection<Set>;

  constructor(public afs: AngularFirestore) {
    this.setsCollection = this.afs.collection('sets', ref => ref.where('private','==',false).orderBy('timestamp','desc'));
  }

  //copyToSet
  copyToSet(){
    console.log('in copyToSet');
  }

  getSets$():Observable<Set[]>{
    return this.setsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Set;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }

  getOwnSets$(uid:string):Observable<Set[]>{
    return this.afs.collection('sets', ref => ref.where('user_id','==',uid).orderBy('timestamp','desc')).snapshotChanges().pipe(map(changes => {
      return changes.map(a=> {
        const data = a.payload.doc.data() as Set;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  getCards$(set_id:string):Observable<Card[]>{
    return this.setsCollection.doc(set_id).collection('cards').snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Card;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  addSet(set:Set):Promise<string>{
    return new Promise<string>((resolve)=>{
      this.setsCollection.add({...set, timestamp: firebase.firestore.Timestamp.fromDate(new Date())}).then(doc => {
        resolve(doc.id);
      });
    })
  }

  addCard(set_id:string, card: Card):Promise<string>{
    return new Promise<string>((resolve)=>{
      this.setsCollection.doc(set_id).collection('cards').add({...card, timestamp: firebase.firestore.Timestamp.fromDate(new Date())}).then(doc => {
        resolve(doc.id);
      });
    })
  }

  removeSet(set_id:string):Promise<string>{
    return new Promise<string>(resolve => {
      this.setsCollection.doc(set_id).delete();
      resolve('deleted set');
    })
  }

  removeCard(set_id:string, card_id: string):Promise<string>{
    return new Promise<string>((resolve)=>{
      this.setsCollection.doc(set_id).collection('cards').doc(card_id).delete();
      resolve('deleted card');
    })
  }

  //UPDATE CARD
  updateCard(set_id:string, card_id: string, update: Diff):Promise<string>{
    return new Promise<string>((resolve)=>{
      this.setsCollection.doc(set_id).collection('cards').doc(card_id).update({diff: update});
      resolve('updated card');
      console.log('IN SETSERVICE UPDATECARD');
    })
  }

  getSet(pId:string):Promise<Set>{
    return new Promise<Set>((resolve, reject)=>{
      let set:Set;
      this.getSets$().subscribe(setsArr => {
        set = setsArr.find(set => set.id == pId);
        if(set) resolve (set);
        else    reject(set);
      })
    })
  }


}

