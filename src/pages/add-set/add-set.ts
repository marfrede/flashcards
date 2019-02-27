import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Set } from '../../models/set';
import { SetProvider } from '../../providers/set/set';
import { MessagesProvider } from '../../providers/messages/messages';
import { UsernameProvider } from '../../providers/username/username';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-add-set',
  templateUrl: 'add-set.html',
})
export class AddSetPage implements OnInit {

  set: Set = { //to add Set
    title: '',
    description: '',
    user_id: '',
    user_username: '',
    user_email: '',
    creator_email: '',
    creator_username: '',
    private: false,
    copied: false
  };

  userInfo = {
    name: '',
    id: '',
    email: ''
  };

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private messageService: MessagesProvider,
              private usernameService: UsernameProvider,
              private authService: AuthProvider,
              private setService: SetProvider) {
  }

  ngOnInit(){
    this.usernameService.getCurrentUser().then(username => { //get username
      if(username) this.userInfo.name = username;
      else         this.userInfo.name = '';
    });

    this.authService.getCurrentUser().then(user => { //get user email and id
      this.userInfo.email = user.email? user.email : '';
      this.userInfo.id = user.uid? user.uid : '';
    });
  }

  submit(){
    if(this.userInfo.id == '' || this.userInfo.email == ''){
      this.messageService.showErrString('Got No User ID or Email!','');
    }else{
      this.set.user_email = this.userInfo.email;
      this.set.user_id = this.userInfo.id;
      this.set.user_username = this.userInfo.name;

      this.set.creator_email = this.userInfo.email;
      this.set.creator_username = this.userInfo.name; //if adding a new set creator always == user

      if(this.set.title == '' || this.set.title.length > 21){
        if(this.set.title == '') this.messageService.showErrString('No Title','Your Set Needs A Title!');
        else this.messageService.showErrString('Title To Long','The Maximum Number of Characters Is 21.')
      }else{
        if(this.set.description == '' || this.set.description.length < 10 || this.set.description.length > 120){
          if(this.set.description.length > 120) this.messageService.showErrString('Description To Long', 'The Maximum Number of Characters Is 120.')
          this.messageService.showErrString('No Description','Your Set´s Description Needs At Least 10 Characters!')
        }else{
          this.setService.addSet(this.set).then(res => {
            this.set.title = '';
            this.set.description = ''; //clean form
            this.navCtrl.pop().then(()=>{
              this.navCtrl.push('ViewSetPage',{set_id: res}); //get to your new set
            });
          });
        }
      }
    }
  }

}
