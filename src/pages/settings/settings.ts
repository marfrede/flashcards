import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UsernameProvider } from '../../providers/username/username';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit{

  email: string;
  uid: string;
  username: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authService: AuthProvider,
              private usernameService: UsernameProvider) {
  }

  ngOnInit() {
    this.usernameService.getCurrentUser().then(username => {
      if(username) this.username = username;
      else         this.username = '';
    });
    this.authService.getCurrentUser().then(user => {
      this.email = user.email? user.email : '';
      this.uid = user.uid? user.uid : '';
    });
  }

  ionViewWillLoad() {
  }

  tryLogout(){
    this.authService.doLogout().then(res => {
      // location.reload();
    }).catch(err => {
      console.log(err);
    });
  }
  
}
