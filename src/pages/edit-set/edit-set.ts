import { Set } from './../../models/set';
import { SetProvider } from './../../providers/set/set';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-edit-set',
  templateUrl: 'edit-set.html',
})
export class EditSetPage implements OnInit{

  set_id:string;
  editSet:Set;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private setService: SetProvider) {
  }

  ngOnInit(){
    this.set_id = this.navParams.get('set_id');
    this.setService.getSet(this.set_id).then(set => {
      this.editSet = set;
    })
  }

  submit(){
    if(this.set_id && this.editSet)
    this.setService.updateSet(this.set_id, this.editSet.title, this.editSet.description, this.editSet.private).then(res => {
      this.navParams.get("parentPage").ngOnInit();
      this.navCtrl.pop();
    })
  }

}
