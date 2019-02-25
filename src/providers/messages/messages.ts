import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';

@Injectable()
export class MessagesProvider {

  constructor(private toastCtrl: ToastController,
              private alertCtrl: AlertController) {
  }

  async welcomeUser(username: string){
    await this.toastCtrl.create({
      message: "Logged In ("+username+")",
      duration: 1500,
      position: 'top',
      cssClass: "toast-black"
    }).present();
  }

  async goodbyeUser(){
    await this.toastCtrl.create({
      message: "Logged Out",
      duration: 1500,
      position: 'bottom',
      cssClass: "toast-black"
    }).present();
  }

  async showMessageTop(text:string){
    await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top',
      cssClass: "toast-black"
    }).present();
  }

  async showMessageBottom(text:string){
    await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-black"
    }).present();
  }

  async showErr(error){
      await this.alertCtrl.create({
        title: error.code,
        message: error.message,
        buttons: ['Got it!'],
        cssClass: 'alert-error'
      }).present();
  }

  async showErrString(title:string, text:string){
    let al = this.alertCtrl.create({
      title: title,
      message: text,
      buttons: ['Got it!'],
      cssClass: 'alert-error'
    });
    await al.present();
}


}
