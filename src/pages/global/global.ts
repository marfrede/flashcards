import { MessagesProvider } from './../../providers/messages/messages';
import { SortingProvider } from './../../providers/sorting/sorting';
import { AuthProvider } from './../../providers/auth/auth';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Toolbar, Select } from 'ionic-angular';
import { SetProvider } from '../../providers/set/set';
import { Set} from '../../models/set';
import { Card} from '../../models/card';

@IonicPage()
@Component({
  selector: 'page-global',
  templateUrl: 'global.html',
})
export class GlobalPage implements OnInit{

  //copy set
  toCopySet:Set;
  oldToCopySetID:string;
  toCopyCards:Card[]
  currentUser_email:string;
  currentUser_username:string;


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
      console.log('USER EMAIL:', user.email);
      if(user && user.uid){
        this.currentUser_id = user.uid;
        this.currentUser_email = user.email;
        if(user.displayName === null){
          this.currentUser_username = '';
        }else{
          this.currentUser_username = user.displayName;
        }

      }
    });
    this.setService.getSets$().subscribe(sets => {
      this.sets_const = sets;
      this.sortingService.sortSetsByCurrent(this.sets_const,this.currentOrder).then(res => {
        this.sets = res;
      });
    })
    this.searchInput = '';
  }

  ionViewDidLoad() {
  }

  //nur für testzwecke!
  logSetID(setID:string){
    console.log(setID);
  }

  importSet(setID:string){
    //die userInfos müssen verändert werden, der inhalt kann ansonsten einfach kopiert werden!
    //beachte: collection muss foreach docweise kopiert werden...

    //INIT SET
    this.setService.getSet(setID).then(set => {  
        
      this.toCopySet = set;
      this.oldToCopySetID = this.toCopySet.id;

      //USER INFO
      this.toCopySet.user_id = this.currentUser_id;
      this.toCopySet.user_email = this.currentUser_email;
      this.toCopySet.user_username = this.currentUser_username;

      //SET INFO
      this.toCopySet.title = this.toCopySet.title + ' [copied]';

      this.setService.addSet(this.toCopySet).then(res => {
      //  console.log('res (id des neuen sets): ', res);//re ist die ID des NEUEN sets, das geaddet wurde
        
        //get all cards from the collection you want to copy
        this.setService.getCards$(this.oldToCopySetID).subscribe(cards => { 
          //console.log(cards); //cards hält alle cards der cards-collection also mit front back als obj innerhalb eines array (cards[])
      
          cards.forEach((card)=>{
            //console.log(card.front);
            //jetzt nur nicht loggen sondern adden ins neue set mit der res=id!
            this.setService.addCard(res, card).then(()=>{
                //console.log('ADDED CARDS!');
                ;
             });
          });
        })
      });
    });
  
  }

  openViewSet(id:string){
    this.navCtrl.push('ViewSetPage',{set_id: id});
  }

  onScroll($event){
    if($event && $event.scrollTop == 0){
      console.log('TOPSCROLL');
    }
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
    if(this.searchInput)
    this.sets = this.sets_const.filter(set => set.title.toUpperCase().includes(this.searchInput.toUpperCase()) || set.user_username.toUpperCase().includes(this.searchInput.toUpperCase()) || set.user_email.toUpperCase().includes(this.searchInput.toUpperCase()));
  }

  onCancel($event){
    console.log($event);
  }

}
