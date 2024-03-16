import { Component } from '@angular/core';
import {TokenStorageService} from "./auth/token-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular15-iwa2023-http-students';
  private roles?: string[];
  authority?: string;

  constructor(private tokenStorage: TokenStorageService) {  }

  ngOnInit() : void  {
    console.log("init");
    if (this.tokenStorage.getToken()) {
      console.log(this.tokenStorage.getToken());
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          console.log("ADMIN");
          return false;
        }
        if (role === 'ROLE_RECEIVER') {
          this.authority = 'receiver';
          console.log("RECEIVER");
          return false;
        }
        if (role === 'ROLE_TRANSMITTER') {
          this.authority = 'transmitter';
          console.log("TRANSMITTER");
          return false;
        }
        return true;
      });
    }
  }
}
