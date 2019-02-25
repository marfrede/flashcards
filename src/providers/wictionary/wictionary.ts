import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class WictionaryProvider {

  url_search_for:string = 'https://www.mediawiki.org/w/api.php?action=query&list=search&origin=*&srsearch=';
  url_search_text_for:string = 'https://www.mediawiki.org/w/api.php?action=query&list=search&srwhat=text&origin=*&srsearch=meaning'; 

  constructor(public http: HttpClient) {
    console.log('Hello WictionaryProvider Provider');
  }

  get$():Observable<Object>{
    console.log('http request');
    return this.http.get(`https://www.mediawiki.org/w/api.php?action=query&format=json&list=search&origin=*&srsearch=Craig%20Noone`);
  }

}
