import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class WordnikProvider {

  url_dot_jason:string = 'https://api.wordnik.com/v4/word.json';
  definitions:string = "definitions";
  phrases:string = "phrases";
  examples:string = "examples";
  url2:string = "?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false";
  url3:string = "?limit=3&useCanonical=false";
  apiKey:string = "9f141fedc9f24f915b02603f54d0a0e147e306a0e59ab08eb";

  constructor(public http: HttpClient) {
  }

  getDetails$(searchTerm:string):Observable<Object>{
    return this.http.get(`${this.url_dot_jason}/${searchTerm}/${this.definitions}${this.url2}&api_key=${this.apiKey}`);
  }


  getPhrases$(searchTerm:string):Observable<Object>{
    return this.http.get(`${this.url_dot_jason}/${searchTerm}/${this.phrases}${this.url3}&api_key=${this.apiKey}`);
  }

  getDetails(searchTerm:string):Promise<any>{
    return new Promise<any>(resolve => {
      this.getDetails$(searchTerm).subscribe(res => {
        resolve(res);
      })
    })
  }

  getPhrases(searchTerm:string):Promise<any>{
    return new Promise<any>(resolve => {
      this.getPhrases$(searchTerm).subscribe(res => {
        resolve(res);
      })
    })
  }


}
