/*IONIC*/
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

/*FIREBASE*/ 
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from "angularfire2/auth";

/*PROVIDERS*/
  // own
import { MessagesProvider } from '../providers/messages/messages';
import { AuthProvider } from '../providers/auth/auth';
import { UsernameProvider } from '../providers/username/username';
import { SetProvider } from '../providers/set/set';
import { SortingProvider } from '../providers/sorting/sorting';
import { WordnikProvider } from '../providers/wordnik/wordnik';
import { LangProvider } from '../providers/lang/lang';
  // foreign
import { HttpClientModule } from '@angular/common/http';

/*NATIVE*/
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TextToSpeech } from "@ionic-native/text-to-speech";

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
    WordnikProvider,
    TextToSpeech,
    LangProvider
  ]
})
export class AppModule {}
