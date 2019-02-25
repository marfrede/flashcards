import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSetPage } from './add-set';

@NgModule({
  declarations: [
    AddSetPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSetPage),
  ],
})
export class AddSetPageModule {}
