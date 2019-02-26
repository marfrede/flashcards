import { MessagesProvider } from './../../providers/messages/messages';
import { SortingProvider } from './../../providers/sorting/sorting';
import { AuthProvider } from './../../providers/auth/auth';
import { SetProvider } from './../../providers/set/set';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Select } from 'ionic-angular';
import { Set } from '../../models/set';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  sets_const:Set[];
  sets:Set[];
  currentUser_id:string;

  currentOrder:string;
  searchInput: string;

  @ViewChild('selectOrder') selectOrder:Select;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authService: AuthProvider,
              public messagesService: MessagesProvider,
              private setService: SetProvider,
              private sortingService: SortingProvider) {
  }

  ngOnInit(){
    this.currentOrder = 'date-desc'; 
    this.authService.getCurrentUser().then(user => {
      if(user && user.uid) this.currentUser_id = user.uid;
      this.setService.getOwnSets$(user.uid).subscribe(sets => {
        this.sets_const = sets;
        this.sortingService.sortSetsByCurrent(this.sets_const,this.currentOrder).then(sortedArr => {
          this.sets = sortedArr;
        })
      })
    });
    this.searchInput = '';
  }

  ionViewDidLoad() {
  }

  openSelect() {
    if(this.sets_const && this.sets_const.length > 0) this.selectOrder.open(); //open ion-options for sorting
    else this.messagesService.showMessageTop('No Sets To Sort!');
  }

  submit($event:string){    //change the order
    switch ($event) {
      case 'title-asc':
        this.currentOrder = 'title-asc';
        break;
      case 'title-desc':
        this.currentOrder = 'title-desc';
        break;
      case 'uname-asc':
        this.currentOrder = 'uname-asc';
        break;
      case 'uname-desc':
       this.currentOrder = 'uname-desc';
        break;
      case 'umail-asc':
        this.currentOrder = 'date-asc';
        break;
      case 'umail-desc':
       this.currentOrder = 'back-desc';
        break;
      case 'date-asc':
       this.currentOrder = 'date-asc';
        break;
      default:
       this.currentOrder = 'date-desc';
        break;
    }
    this.sortingService.sortSetsByCurrent(this.sets,this.currentOrder).then(res => {
      this.sets = res;
    }).catch(error => {
      console.log(error);
    });
    this.sortingService.sortSetsByCurrent(this.sets_const,this.currentOrder).then(res => {
      this.sets_const = res;
    }).catch(error => {
      console.log(error);
    });
  }

  onFocus($event){
    if(this.sets_const && !(this.sets_const.length > 0)){
      this.messagesService.showMessageBottom('No Sets to search in!');
      return;
    }
  }
  
  onInput($event){
    console.log('searchInput:>',this.searchInput,'<');
    console.log('const: ',this.sets_const);
    console.log('_: ',this.sets);
    if(this.searchInput) this.sets = this.sets_const.filter(set => set.title.toUpperCase().includes(this.searchInput.toUpperCase()));
    if(this.searchInput && this.searchInput == ''){
      console.log('empty input');
      this.sets = this.sets_const;
    } 
    console.log('const: ',this.sets_const);
    console.log('_: ',this.sets);
  }

  openViewSet(id:string){
    console.log('opening ',id);
    this.navCtrl.push('ViewSetPage',{set_id: id});
  }

  openAddSet(){
    this.navCtrl.push('AddSetPage');
  }

}
