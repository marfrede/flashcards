import { NgModule } from '@angular/core';
import { UsersComponent } from './users/users';
import { GroupsComponent } from './groups/groups';
@NgModule({
	declarations: [UsersComponent,
    GroupsComponent],
	imports: [],
	exports: [UsersComponent,
    GroupsComponent]
})
export class ComponentsModule {}
