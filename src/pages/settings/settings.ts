import { LangProvider } from './../../providers/lang/lang';
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

  //LANGUAGE
    curLang:string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authService: AuthProvider,
              private usernameService: UsernameProvider,
              private langService: LangProvider) {
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

  onChange(){
    this.langService.setLang(this.curLang);
    console.log(this.langService.getLang());
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
