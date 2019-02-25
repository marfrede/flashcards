import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizPage } from './quiz';
import { IonicSwipeAllModule } from 'ionic-swipe-all';


@NgModule({
  declarations: [
    QuizPage
  ],
  imports: [
    IonicPageModule.forChild(QuizPage),
    IonicSwipeAllModule
  ],
})
export class QuizPageModule {}
