import { Injectable } from '@angular/core';


@Injectable()
export class LangProvider {

  currentLang:string;

  constructor() {
    this.currentLang = 'en-GB';
  }

  getLang():string{
    return this.currentLang;
  }

  setLang(lang:string){
    this.currentLang = lang;
  }

  

}
