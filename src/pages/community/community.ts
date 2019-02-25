import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})

export class CommunityPage implements OnInit{

  page:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  ngOnInit(){
    this.page = "groups";
  }

}
