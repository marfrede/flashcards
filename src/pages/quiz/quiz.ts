import { Counter } from './../../models/counter';
import { LangProvider } from './../../providers/lang/lang';
import { WictionaryProvider } from './../../providers/wictionary/wictionary';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Card, Diff } from './../../models/card';
import { WordnikProvider } from './../../providers/wordnik/wordnik';
import { SetProvider } from './../../providers/set/set';

import { TextToSpeech } from "@ionic-native/text-to-speech";


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
  counter:Counter = {
    easy : 0,
    medium : 0,
    hard : 0
  };
  cardShowsFront:boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private setService: SetProvider,
              private wordnikService: WordnikProvider,
              private wictionaryService: WictionaryProvider,
              private tts: TextToSpeech,
              private langService:LangProvider) {
  }

  ngOnInit(){
    this.set_id = this.navParams.get('set_id'); 
    this.set_title = this.navParams.get('set_name'); 
    this.setService.getCards$(this.set_id).subscribe(cards => {
      this.cards = cards;
      this.cardShowsFront = true;

      //pick random card with probability distribution with regard to card.difficulty
      this.getCard().then(res => {
        this.rand_card = res;
      }).catch(err => {
        this.getCard().then(res => {
          this.rand_card = res;
        }).catch(err => {
          this.getCard().then(res => {
            this.rand_card = res;
          }).catch(res => {
            this.rand_card = res;
          })
        })
      });
    
      if(this.rand_card) this.getInformationOn(this.rand_card.back);
    });
    
    this.wictionaryService.get$().subscribe(res=>{
      console.log('WICTIONARY PROVIDER: ',res);
    })
    this.details = '';
    this.phrases = [];
  }

  pick_():Promise<Card>{
    return new Promise(resolve => {
      let card:Card = this.cards[this.randCardsIndex()];
      resolve(card);
    })
  }

  getCard():Promise<Card>{
    let randcard:Card;
    return new Promise<Card>((resolve, reject) => { 
      this.pick_().then(randi => {

        randcard = randi; //get 'completely random' card
      
        switch (randcard.diff) {


          case Diff.easy: //you have to pick an easy card three times before it´s actually taken - very rare
            this.counter.easy++;
            if(this.counter.easy == 3){
              this.counter.easy = 0;
              resolve(randcard);
            }else{
              reject(randcard);
            }
            break;


          case Diff.medium: //you have to pick an medium card two times before it´s actually taken - rare
            this.counter.medium++;
            if(this.counter.medium == 2){
              this.counter.medium = 0;
              resolve(randcard);
            }else{
              reject(randcard);
            }
            break;


          case Diff.hard: //hard cards are taken right away - most likely
            resolve(randcard);
            break;
          default:
            console.log('error');
            break;
        }
      });
    });
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

  speak(toSpeak:string){
    
    this.tts.speak({
        text: toSpeak,
        locale: this.langService.getLang(),
        rate: 1.3
    });
  }

  swipeAll(event: any): any {
    console.log('Swipe All', event);
  }

  nextCard(){
    if(!this.cardShowsFront) this.turnCard();

    //pick random card with probability distribution with regard to card.difficulty
    this.getCard().then(res => {
      this.rand_card = res;
    }).catch(err => {
      this.getCard().then(res => {
        this.rand_card = res;
      }).catch(err => {
        this.getCard().then(res => {
          this.rand_card = res;
        }).catch(res => {
          this.rand_card = res;
        })
      })
    });
  
    if(this.rand_card) this.getInformationOn(this.rand_card.back);

  }

  swipeLeft(event: any, toUpdate:Card): void {
    console.log('easy');
    this.updEasy(toUpdate);
    this.nextCard();
  }

  swipeRight(event: any, toUpdate:Card): void {
      console.log('hard');
      this.updHard(toUpdate);
      this.nextCard();
  }

  swipeUp(event: any, toUpdate:Card): void {
      console.log('nuffin');
      this.nextCard();
  }

  swipeDown(event: any, toUpdate:Card): void {
      console.log('medium');
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