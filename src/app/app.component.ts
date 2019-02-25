import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from "angularfire2/auth";
import { MessagesProvider } from '../providers/messages/messages';
import { UsernameProvider } from '../providers/username/username';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: NavController;
  rootPage:string;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              afAuth: AngularFireAuth,
              usernameService: UsernameProvider,
              mService: MessagesProvider) {
  
    afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.rootPage = 'TabsPage';
        this.nav.setRoot(this.rootPage);
        let username:string;
        usernameService.getCurrentUser().then(un => {
          if(un) username = un;
          else    username = '';
          if(res.email){
            if(username && username!=''){
              mService.welcomeUser(username);
            }else{
              mService.welcomeUser(res.email);
            }
          }
        });
      } else {
        this.rootPage = 'LoginPage';
        this.nav.setRoot(this.rootPage);
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}
