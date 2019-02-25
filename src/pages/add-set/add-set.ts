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

  set: Set = {
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
    this.usernameService.getCurrentUser().then(username => {
      if(username) this.userInfo.name = username;
      else         this.userInfo.name = '';
    });

    this.authService.getCurrentUser().then(user => {
      this.userInfo.email = user.email? user.email : '';
      this.userInfo.id = user.uid? user.uid : '';
    });
  }

  ionViewDidLoad() {
  }

  submit(){
    if(this.userInfo.id == '' || this.userInfo.email == ''){
      this.messageService.showErrString('Got No User ID or Email!','');
    }else{
      this.set.user_email = this.userInfo.email;
      this.set.user_id = this.userInfo.id;
      this.set.user_username = this.userInfo.name;

      this.set.creator_email = this.userInfo.email;
      this.set.creator_username = this.userInfo.name;

      if(this.set.title == ''){
        this.messageService.showErrString('No Title','Your Set Needs A Title!');
      }else{
        if(this.set.description == '' || this.set.description.length < 20){
          this.messageService.showErrString('No Description','Your Set´s Description Needs At Least 20 Characters!')
        }else{
          this.setService.addSet(this.set).then(res => {
            this.set.title = '';
            this.set.description = '';
            this.navCtrl.pop();
            this.navCtrl.push('ViewSetPage',{set_id: res});
          });
        }
      }
    }
  }

}
