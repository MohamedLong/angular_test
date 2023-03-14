import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { MainMenu } from '../model/mainmenu';

@Injectable({providedIn: 'root'})
export class MainMenuService {

    constructor(private http: HttpClient) { }

    getMenues(id: number) {
        return this.http.get<MainMenu[]>(config.dashboardUrl + '/userMainMenu/role/' + id)
        // return this.http.get<MainMenu[]>('assets/demo/data/response.json')
            .toPromise()
            .then(res => res as MainMenu[])
            .then(data => data);
    }

    getAllMenues() {
      return this.http.get<MainMenu[]>(config.dashboardUrl + '/userMainMenu/all')
      // return this.http.get<MainMenu[]>('assets/demo/data/response.json')
          .toPromise()
          .then(res => res as MainMenu[])
          .then(data => data);
  }
}
