import { Component, OnInit } from '@angular/core';
import { Username } from '../../models/username';
import { UsernameProvider } from '../../providers/username/username';

@Component({
  selector: 'users',
  templateUrl: 'users.html'
})
export class UsersComponent implements OnInit {

  usernames:Username[];

  constructor(private usernameService: UsernameProvider) {
  }

  ngOnInit(){
    this.usernameService.getUsernames$().subscribe(res => {
      this.usernames = res;
    })
  }

}
