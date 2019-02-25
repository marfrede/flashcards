import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/*FIREBASE*/ 
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireAuthModule } from "angularfire2/auth";

/*PROVIDERS*/
  // own
import { MessagesProvider } from '../providers/messages/messages';
import { AuthProvider } from '../providers/auth/auth';
import { UsernameProvider } from '../providers/username/username';
import { SetProvider } from '../providers/set/set';
import { SortingProvider } from '../providers/sorting/sorting';
import { WictionaryProvider } from '../providers/wictionary/wictionary';
import { WordnikProvider } from '../providers/wordnik/wordnik';
  // foreign
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFirestore,
    MessagesProvider,
    AuthProvider,
    UsernameProvider,
    SetProvider,
    SortingProvider,
    WictionaryProvider,
    WordnikProvider
  ]
})
export class AppModule {}
