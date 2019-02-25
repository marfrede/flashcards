import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityPage } from './community';
import { UsersComponent } from '../../components/users/users';
import { GroupsComponent } from '../../components/groups/groups';

@NgModule({
  declarations: [
    CommunityPage,
    GroupsComponent,
    UsersComponent
  ],
  imports: [
    IonicPageModule.forChild(CommunityPage),
  ],
})
export class CommunityPageModule {}
