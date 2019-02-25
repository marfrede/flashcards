import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Account } from '../../models/account';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  account: Account = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthProvider,
              public navCtrl: NavController, 
              public navParams: NavParams) {

  }
  openRegister(){
    this.navCtrl.push('RegisterPage', {
      mail : this.account ? this.account.email : '',
      pw : this.account ? this.account.password : ''
    });
  }

  tryLogin(){
    this.authService.doLogin(this.account.email,this.account.password).then(res => {
      // this.navCtrl.push('TabsPage');
    }).catch(err => {
      console.log(err);
    });
  }


}
