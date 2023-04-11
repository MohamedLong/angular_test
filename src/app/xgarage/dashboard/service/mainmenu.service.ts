import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { MainMenu } from '../model/mainmenu';

@Injectable({providedIn: 'root'})
export class MainMenuService {

    constructor(private http: HttpClient) { }

    getAllMenues() {
      return this.http.get<MainMenu[]>(config.dashboardUrl + '/mainMenu/all')
          .toPromise()
          .then(res => res as MainMenu[])
          .then(data => data);
  }
}
