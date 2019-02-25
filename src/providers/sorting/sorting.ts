import { Set } from './../../models/set';
import { Card } from './../../models/card';
import { Injectable } from '@angular/core';

/*
  Generated class for the SortingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SortingProvider {

  constructor() {
  }

  

  sortByCurrent(arr:Card[],curr:string):Promise<Card[]>{
    return new Promise<Card[]>((resolve) => {
        switch (curr) {
          case 'diff-asc':
             resolve(this.sortByDiffAsc(arr));
             break;
          case 'diff-desc':
              resolve(this.sortByDiffDesc(arr));
              break;
          case 'front-asc':
             resolve(this.sortByFrontAsc(arr));
             break;
          case 'front-desc':
              resolve(this.sortByFrontDesc(arr));
              break;
          case 'back-asc':
             resolve(this.sortByBackAsc(arr));
             break;
          case 'back-desc':
              resolve(this.sortByBackDesc(arr));
              break;
          case 'date-asc':
             resolve(this.sortByDateAsc(arr));
             break;
          default:
             resolve(this.sortByDateDesc(arr));
             break;
        }
    })
  }

  sortSetsByCurrent(arr:Set[],curr:string):Promise<Set[]>{
    return new Promise<Set[]>((resolve) => {
        switch (curr) {
          case 'title-asc':
             resolve(this.sortSetByTitleAsc(arr));
             break;
          case 'title-desc':
              resolve(this.sortSetByTitleDesc(arr));
              break;
          case 'uname-asc':
             resolve(this.sortSetByUnameAsc(arr));
             break;
          case 'uname-desc':
              resolve(this.sortSetByUnameDesc(arr));
              break;
          case 'umail-asc':
              resolve(this.sortSetByEmailAsc(arr));
              break;
          case 'umail-desc':
              resolve(this.sortSetByEmailAsc(arr));
              break;
          case 'date-asc':
             resolve(this.sortSetByDateAsc(arr));
             break;
          default:
             resolve(this.sortSetByDateDesc(arr));
             break;
        }
    })
  }

  sortByDiffDesc(arr:Card[]):Card[]{
    arr.sort(function(a:Card,b:Card){
        var diffA = a.diff; 
        var diffB = b.diff;
        if (diffA < diffB) return 1;
        if (diffA > diffB) return -1;
        return 0;
    });
    return arr;
  }

  sortByDiffAsc(arr:Card[]):Card[]{
    arr.sort(function(a:Card,b:Card){
        var diffA = a.diff; 
        var diffB = b.diff;
        if (diffA < diffB) return -1;
        if (diffA > diffB) return 1;
        return 0;
    });
    return arr;
  }

  sortByFrontAsc(arr:Card[]):Card[]{
    arr.sort(function(a:Card,b:Card){
        var frontA = a.front.toUpperCase(); 
        var frontB = b.front.toUpperCase(); // non case sensitiv
        if (frontA < frontB) return -1;
        if (frontA > frontB) return 1;
        return 0;
    });
    return arr;
  }

  sortByFrontDesc(arr:Card[]):Card[]{
    arr.sort(function(a:Card,b:Card){
        var frontA = a.front.toUpperCase(); 
        var frontB = b.front.toUpperCase(); // non case sensitiv
        if (frontA < frontB) return 1;
        if (frontA > frontB) return -1;
        return 0;
    });
    return arr;
  }

  sortByBackAsc(arr:Card[]):Card[]{
    arr.sort(function(a:Card,b:Card){
        var backA = a.back.toUpperCase(); 
        var backB = b.back.toUpperCase(); // non case sensitiv
        if (backA < backB) return -1;
        if (backA > backB) return 1;
        return 0;
    });
    return arr;
  }

  sortByBackDesc(arr:Card[]):Card[]{
    arr.sort(function(a:Card,b:Card){
        var backA = a.back.toUpperCase(); 
        var backB = b.back.toUpperCase(); // non case sensitiv
        if (backA < backB) return 1;
        if (backA > backB) return -1;
        return 0;
    });
    return arr;
  }

  sortByDateAsc(arr:Card[]):Card[]{
    arr.sort(function(a:Card,b:Card){
        var dateA = a.timestamp.toMillis();
        var dateB = b.timestamp.toMillis(); 
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
    });
    return arr;
  }

  sortByDateDesc(arr:Card[]):Card[]{
    arr.sort(function(a:Card,b:Card){
        var dateA = a.timestamp.toMillis();
        var dateB = b.timestamp.toMillis(); 
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
    });
    return arr;
  }

  //SETS

  sortSetByTitleAsc(arr:Set[]):Set[]{
    arr.sort(function(a:Set,b:Set){
        var tA = a.title.toUpperCase(); 
        var tB = b.title.toUpperCase(); // non case sensitiv
        if (tA < tB) return -1;
        if (tA > tB) return 1;
        return 0;
    });
    return arr;
  }

  sortSetByTitleDesc(arr:Set[]):Set[]{
    arr.sort(function(a:Set,b:Set){
        var tA = a.title.toUpperCase(); 
        var tB = b.title.toUpperCase(); // non case sensitiv
        if (tA < tB) return 1;
        if (tA > tB) return -1;
        return 0;
    });
    return arr;
  }

  sortSetByUnameAsc(arr:Set[]):Set[]{
    arr.sort(function(a:Set,b:Set){
        var unameA = a.user_username.toUpperCase(); 
        var unameB = b.user_username.toUpperCase(); // non case sensitiv
        if (unameA == '') return 1;
        if (unameB == '') return -1;  //users without username at bottom
        if (unameA < unameB) return -1;
        if (unameA > unameB) return 1;
        return 0;
    });
    return arr;
  }

  sortSetByUnameDesc(arr:Set[]):Set[]{
    arr.sort(function(a:Set,b:Set){
        var unameA = a.user_username.toUpperCase(); 
        var unameB = b.user_username.toUpperCase(); // non case sensitiv
        if (unameA == '') return 1;
        if (unameB == '') return -1;  //users without username at bottom
        if (unameA < unameB) return 1;
        if (unameA > unameB) return -1;
        return 0;
    });
    return arr;
  }

  sortSetByEmailAsc(arr:Set[]):Set[]{
    arr.sort(function(a:Set,b:Set){
        var umailA = a.user_email.toUpperCase(); 
        var umailB = b.user_email.toUpperCase(); // non case sensitiv
        if (umailA < umailB) return -1;
        if (umailA > umailB) return 1;
        return 0;
    });
    return arr;
  }

  sortSetByDateAsc(arr:Set[]):Set[]{
    arr.sort(function(a:Set,b:Set){
        var dateA = a.timestamp.toMillis();
        var dateB = b.timestamp.toMillis(); 
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
    });
    return arr;
  }

  sortSetByDateDesc(arr:Set[]):Set[]{
    arr.sort(function(a:Set,b:Set){
        var dateA = a.timestamp.toMillis();
        var dateB = b.timestamp.toMillis(); 
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
    });
    return arr;
  }

}
