import { Component, OnInit } from '@angular/core';

/**
 * Generated class for the GroupsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'groups',
  templateUrl: 'groups.html'
})
export class GroupsComponent implements OnInit {

  text: string;

  constructor() {}

  ngOnInit(): void {
    this.text = 'Groups Page';
  }

}
