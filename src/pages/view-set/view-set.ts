import { SortingProvider } from './../../providers/sorting/sorting';
import { AuthProvider } from './../../providers/auth/auth';
import { MessagesProvider } from './../../providers/messages/messages';
import { Card, Diff } from './../../models/card';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Select } from 'ionic-angular';
import { Set } from '../../models/set';
import { SetProvider } from '../../providers/set/set';


@IonicPage()
@Component({
  selector: 'page-view-set',
  templateUrl: 'view-set.html',
})
export class ViewSetPage {

//OWNER
  isOwner:boolean;  //true if currently logged in user is the owner of the current set

//NEW_CARD
  newcard: Card = { // (ngModel)
    front: '',
    back: '',
    diff: Diff.hard
  };

//SET
  set_id: string; // current set.id
  set: Set;       //current set

//CARDS
  cards_const: Card[];     //Array holding ALL cards at ALL times (COMPLETE CARDS)
  cards:Card[];            //Array holding JUST the cards which are searched for (NOT NECESSARILY COMPLETE CARDS)

  cardsShowFront: boolean[];    //Array remembers if the individual card (index) currently shows the front or back
  cardsShowingFront:number;     //Number of cards curently showing the front
  mostCardsShowFront: boolean;  //true if (cardsShowingFront > cards.length/2 )

  //SEARCH
    searchInput:string; // (ngModel)

  //ORDER
    @ViewChild('selectOrder') selectOrder: Select;  //ViewChild for the ion-select in HTML
    currentOrder:string;  // remebers by what the cards currently
                          // are sorted (front-asc / front-desc / back-asc /...) 

//JUST SOME HTML TEXT
  cardFrontButText:string;  //toggle button text option1
  cardBackButText:string;   //toggle button text option2

//CONSTRUCTOR
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authService: AuthProvider,
              private messagesService: MessagesProvider,
              private setService: SetProvider,
              private alertCtrl: AlertController,
              private sortingService: SortingProvider) {
  }

//INITIALIZING
  ngOnInit(){
    this.currentOrder = 'date-desc';                //default sorting (new - old)
    this.set_id = this.navParams.get('set_id');     //initialize id of current set

    //INIT SET
    this.setService.getSet(this.set_id).then(set => {  
        
        this.set = set;    

        //initialize isOwner:boolean
        this.authService.getCurrentUser().then(user => { 
          if(this.set && user && user.uid && this.set.user_id == user.uid) this.isOwner = true;
          else this.isOwner = false;
        })
    });

    //INIT CARDS
    this.setService.getCards$(this.set_id).subscribe(cards => { 
      
      this.cards_const = cards; // initialize COMPLETE CARDS
      this.sortingService.sortByCurrent(this.cards_const,this.currentOrder).then(res => { //sort by current order
        this.cards = res; //initialize NOT NECESSARILY COMPLETE CARDS ( but onInit it is complete )

        this.cardsShowFront = [];  
        this.cardsShowingFront = 0; 
        this.cards.forEach(() => {
          this.cardsShowFront.push(true); //inititalized with true -> default: front (initially all cards show their front)
          this.cardsShowingFront++;       //increase number of cards which show their front
        });
      }).catch(error => {
        console.log(error);
      });

    })
    this.mostCardsShowFront = true;    //true for now
    this.searchInput = '';             //empty for now

    //HTML TEXT

      this.cardFrontButText = 'FRONT';
      this.cardBackButText = 'BACK';
      
  }

  openSelect() {
    if(this.cards_const && this.cards_const.length > 0) this.selectOrder.open(); //open ion-options for sorting
    else this.messagesService.showMessageTop('No Cards To Sort!');
  }

  submit($event:string){    //change the order
    switch ($event) {
      case 'diff-asc':
        this.currentOrder = 'diff-asc';
        break;
      case 'diff-desc':
      this.currentOrder = 'diff-desc';
        break;
      case 'front-asc':
        this.currentOrder = 'front-asc';
        break;
      case 'front-desc':
      this.currentOrder = 'front-desc';
        break;
      case 'back-asc':
      this.currentOrder = 'back-asc';
        break;
      case 'back-desc':
      this.currentOrder = 'back-desc';
        break;
      case 'date-asc':
      this.currentOrder = 'date-asc';
        break;
      default:
      this.currentOrder = 'date-desc';
        break;
    }

    this.sortingService.sortByCurrent(this.cards,this.currentOrder).then(res => {
      this.cards = res;
    }).catch(error => {
      console.log(error);
    });
    this.sortingService.sortByCurrent(this.cards_const,this.currentOrder).then(res => {
      this.cards_const = res;
    }).catch(error => {
      console.log(error);
    });
    //take the NOT NECESSARILY COMPLETE ARRAY and reorder it
  }

  onFocus($event){
    if(this.cards_const && !(this.cards_const.length > 0)){
      this.messagesService.showMessageBottom('No Sets to search in!');
      return;
    }
  }
  
  onInput($event){
    console.log('input: >',this.searchInput,'<')
    if(this.searchInput == '') this.cards = this.cards_const; 
    if(this.searchInput) this.cards = this.cards_const.filter(card => card.front.toUpperCase().includes(this.searchInput.toUpperCase()));
  }

  onCancel($event){
    console.log($event);
  }

  turnCard(card: Card){
    this.toggleShownText(this.cards_const.indexOf(card));
  }

  toggleShownText(index: number) {

    if(this.cardsShowFront[index]){
      this.cardsShowFront[index] = false;
      this.cardsShowingFront = this.cardsShowingFront - 1;
    }else{
      this.cardsShowFront[index] = true;
      this.cardsShowingFront = this.cardsShowingFront + 1;
    }
  }

  turnEveryCard(){
    if(this.cardsShowingFront >= (this.cards.length / 2)){
      this.mostCardsShowFront = false;
      this.cardsShowingFront = 0;
    }else{
      this.mostCardsShowFront = true;
      this.cardsShowingFront = this.cards.length;
    }
    for(let i = 0; i<this.cardsShowFront.length; i++){
      this.cardsShowFront[i] = this.mostCardsShowFront;
    }
  }

  newCard(){
    if(this.newcard.front == '' || this.newcard.back == '' || !this.isOwner){
      this.messagesService.showErrString('Not Enough Input','Your card needs a front text and a back text.');
    }else if(this.newcard.front.length > 50 || this.newcard.back.length > 50){
      this.messagesService.showErrString('Too Much Input','The front and back of your card must be within 50 characters.');
    }else{
      this.setService.addCard(this.set_id, this.newcard).then(()=>{
        this.newcard.front = this.newcard.back = '';
      });
    }
  }

  deleteCard(card_id:string){
    if(this.isOwner) this.setService.removeCard(this.set.id,card_id);
  }

  openQuizPage(){
    this.navCtrl.push('QuizPage',{set_id: this.set_id, set_name: this.set? this.set.title : ''});

  }

  deleteSet(){
    if(this.isOwner){
      let alert = this.alertCtrl.create({
        title: 'Confirm Deletion',
        message: 'Do you want to delete "'+this.set.title+'" and all its cards?',
        buttons: [
          {
            text: 'No! Abort!',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Yes, I Do!',
            handler: () => {
              console.log('Deleted: '+this.set.title+' from User '+this.set.user_email+' !');
              this.setService.removeSet(this.set_id);
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
    } 
  }
  
  editSet(){
    this.navCtrl.push('EditSetPage',{"set_id": this.set_id, "parentPage": this });
  }

}
