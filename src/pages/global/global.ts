import { UsernameProvider } from './../../providers/username/username';
import { MessagesProvider } from './../../providers/messages/messages';
import { SortingProvider } from './../../providers/sorting/sorting';
import { AuthProvider } from './../../providers/auth/auth';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Select } from 'ionic-angular';
import { SetProvider } from '../../providers/set/set';
import { Set} from '../../models/set';

@IonicPage()
@Component({
  selector: 'page-global',
  templateUrl: 'global.html',
})
export class GlobalPage implements OnInit{

  sets_const:Set[];
  sets:Set[];
  currentUser_id:string;
  currentUser_email:string;
  currentUser_username:string;

  currentOrder:string;
  searchInput: string;

  @ViewChild('selectOrder') selectOrder:Select;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authService: AuthProvider,
              public messagesService: MessagesProvider,
              private setService: SetProvider,
              private usernameService: UsernameProvider,
              private sortingService: SortingProvider) {
  }

  ngOnInit(){
    this.currentOrder = 'date-desc';   

    //init user
    this.authService.getCurrentUser().then(user => {
      if(user && user.uid){
        this.currentUser_id = user.uid;
        this.currentUser_email = user.email;
        this.usernameService.getCurrentUser().then(uname => {
          this.currentUser_username = uname;
        });
      }
    });

    //init sets
    this.setService.getPublicSets$().subscribe(sets => {
      this.sets_const = sets;
      this.sortingService.sortSetsByCurrent(this.sets_const,this.currentOrder).then(res => {
        this.sets = res;
      });
    })

    //
    this.searchInput = '';
  }
  

  copySet(slidingSet, toCopySetID:string){

    
    this.setService.getSet(toCopySetID).then(toCopySet => {  

      slidingSet.close(); //html element slides back after click
     
      if(this.currentUser_email == toCopySet.user_email){
        console.log('own Set');
        this.messagesService.showMessageTop('This Set Is Already Yours!');
        return; //no sense for downloading own set
      }

      let newSet:Set = toCopySet; //new set is a copy of toCopySet

      //USER INFO
      newSet.user_id = this.currentUser_id;
      newSet.user_email = this.currentUser_email;
      newSet.user_username = this.currentUser_username; //new set becomes the set owned by current user

      //SET INFO
      newSet.copied = true;
      newSet.private = true; //copied sets are never public or not copied

      this.setService.addSet(newSet).then(newSetId => { //addSet():Promise<string (id of added set) > 
        
        this.setService.getCards$(toCopySetID).subscribe(cards => { //after adding newSet it gets a copied collection of the toCopySets cards
      
          cards.forEach((card)=>{
            this.setService.addCard(newSetId, card); //no better method in firestore to copy a whole collection so far
          });
        })
        this.messagesService.showMessageTop('Set Copied!');

      });


    });
  }

  openViewSet(id:string){
    this.navCtrl.push('ViewSetPage',{set_id: id});
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
      //sort current shown sets (current = sets that aren´t filtered by search function)
      this.sets = res;
    }).catch(error => {
      console.log(error);
    });
    this.sortingService.sortSetsByCurrent(this.sets_const,this.currentOrder).then(res => {
      //sort all sets
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
    if(this.searchInput == '') this.sets = this.sets_const;
    if(this.searchInput) this.sets = this.sets_const.filter(set => set.title.toUpperCase().includes(this.searchInput.toUpperCase()) 
                                                          || set.user_username.toUpperCase().includes(this.searchInput.toUpperCase()) 
                                                          || set.user_email.toUpperCase().includes(this.searchInput.toUpperCase())
                                                      );//search for title username or email

  }
}

