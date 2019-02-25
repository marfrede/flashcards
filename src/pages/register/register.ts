import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Account } from '../../models/account';
import { TabsPage } from '../tabs/tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { Username } from '../../models/username';
import { UsernameProvider } from '../../providers/username/username';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit{

  account: Account = {
      email: '',
      password: ''
    };

  username: Username = {
    email: '',
    username: '',
    id: ''
  };

  constructor(private authService: AuthProvider,
              private usernameService: UsernameProvider,
              public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ngOnInit(){
    this.account.email = this.navParams.get('mail');
    this.account.password = this.navParams.get('pw');
  }

  ionViewDidLoad() {
  }

  tryRegister(){
    this.authService.doRegister(this.account.email,this.account.password).then(res => {
      this.navCtrl.setRoot(TabsPage);
      this.username.email = this.account.email;
      if(this.username.username == ''){
        this.usernameService.addUsername(this.username);
        this.username.email = '';
        this.username.username = '';
      }else{
        console.log('saving username: '+this.username.username+'...');
        this.usernameService.addUsername(this.username);
        this.username.email = '';
        this.username.username = '';
      }
    }).catch(err => {
      console.log(err);
    });
  }

}
