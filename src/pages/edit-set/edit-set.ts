import { MessagesProvider } from './../../providers/messages/messages';
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
              private setService: SetProvider,
              private messageService: MessagesProvider) {
  }

  ngOnInit(){
    this.set_id = this.navParams.get('set_id');
    this.setService.getSet(this.set_id).then(set => {
      this.editSet = set;
    })
  }

  submit(){
    
      if(this.set_id && this.editSet && this.editSet.title == '' || this.editSet.title.length > 28){
        if(this.editSet.title == '') this.messageService.showErrString('No Title','Your Set Needs A Title!');
        else this.messageService.showErrString('Title To Long','The Maximum Number of Characters Is 28.')
      }else{
        if(this.editSet.description == '' || this.editSet.description.length < 10 || this.editSet.description.length > 120){
          if(this.editSet.description.length > 120) this.messageService.showErrString('Description To Long', 'The Maximum Number of Characters Is 120.')
          this.messageService.showErrString('No Description','Your Set´s Description Needs At Least 10 Characters!')
        }else{
          this.setService.updateSet(this.set_id, this.editSet.title, this.editSet.description, this.editSet.private).then(res => {
            this.navParams.get("parentPage").ngOnInit();
            this.navCtrl.pop();
          })
        }

    }
  }

  cancel(){
    this.navCtrl.pop();
  }

}

