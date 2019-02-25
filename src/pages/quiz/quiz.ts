import { WictionaryProvider } from './../../providers/wictionary/wictionary';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Card, Diff } from './../../models/card';
import { WordnikProvider } from './../../providers/wordnik/wordnik';
import { SetProvider } from './../../providers/set/set';

@IonicPage()
@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html',
})
export class QuizPage implements OnInit {


//Wordnik
  details:string;
  phrases:string[];


//CARDS
  set_id: string; // current set.id
  set_title: string; // current set.title
  cards:Card[];

//Questioned Card

  before_card:Card;
  rand_card:Card;
  cardShowsFront:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private setService: SetProvider,
              private wordnikService: WordnikProvider,
              private wictionaryService: WictionaryProvider) {
  }

  ngOnInit(){
    this.set_id = this.navParams.get('set_id'); 
    this.set_title = this.navParams.get('set_name'); 
    this.setService.getCards$(this.set_id).subscribe(cards => {
      this.cards = cards;
      this.cardShowsFront = true;
      this.pick();
    });
    this.wictionaryService.get$().subscribe(res=>{
      console.log('WICTIONARY PROVIDER: ',res);
    })
    this.details = '';
    this.phrases = [];
  }

  pick(){
    this.before_card = this.rand_card; //unimportant for initial pick()
    this.rand_card = this.cards[this.randCardsIndex()];
    if(this.rand_card == this.before_card && this.cards.length > 1) this.pick(); //pick again if it gets the same card
    if(this.rand_card) this.getInformationOn(this.rand_card.back);
  }

  getInformationOn(searchText:string){

    //DETAILS
    this.details = '';
    this.wordnikService.getDetails$(searchText).subscribe(res => {
      if(res && res[0] && res[0].text){
        this.details = res[0].text;
      }
    });

    //PHRASES
    this.phrases[0] = '';
    for(let i = 1; i<3; i++){
        this.phrases[i] = '';
      }
    this.wordnikService.getPhrases$(searchText).subscribe(res => {
      for(let i = 0; i<3; i++){
        if(res && res[i] && res[i].gram1 && res[i].gram2){
          this.phrases[i] = res[i].gram1+ " " + res[i].gram2;
        }
      }
    });

  }

  randCardsIndex():number{ return Math.floor(Math.random()*(this.cards.length)); }

  turnCard(){ this.cardShowsFront = this.cardShowsFront? false : true; }

  //testing
  swipeAll(event: any): any {
    console.log('Swipe All', event);
  }

  nextCard(){
    if(!this.cardShowsFront) this.turnCard();
    this.pick();
  }

  swipeLeft(event: any, toUpdate:Card): void {
    console.log('Swipe Left', event);
    this.updEasy(toUpdate);
    this.nextCard();
  }

  swipeRight(event: any, toUpdate:Card): void {
      console.log('Swipe Right', event);
      this.updHard(toUpdate);
      this.nextCard();
  }

  swipeUp(event: any, toUpdate:Card): void {
      console.log('Swipe Up', event);
      this.nextCard();
  }

  swipeDown(event: any, toUpdate:Card): void {
      console.log('Swipe Down', event);
      this.updMedium(toUpdate);
      this.nextCard();
  }

  updEasy(toUpdate:Card){
    this.setService.updateCard(this.set_id, toUpdate.id, Diff.easy);
  }

  updMedium(toUpdate:Card){
    this.setService.updateCard(this.set_id, toUpdate.id, Diff.medium);
  }

  updHard(toUpdate:Card){
    this.setService.updateCard(this.set_id, toUpdate.id, Diff.hard);
  }


}