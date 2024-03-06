import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ReceiverComponent} from "./receiver/receiver.component";
import {LoginComponent} from "./login/login.component";
import {UserComponent} from "./user/user.component";
import {AdminComponent} from "./admin/admin.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "./register/register.component";
import {httpInterceptorProviders} from "./auth/auth-interceptor";
import {RoleGuard} from "./guards/role.guard";
import {authGuard} from "./guards/auth.guard";
import { DiplomaComponent } from './diploma/diploma.component';
import { TransmitterComponent } from './transmitter/transmitter.component';
import { StageComponent } from './stage/stage.component';
import { ReceiverViewComponent } from './receiver-view/receiver-view.component';
import { HomeComponent } from './home/home.component';
import { TransmitterViewComponent } from './transmitter-view/transmitter-view.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'transmitterView', component: TransmitterViewComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_TEACHER'] }, },
  { path: 'receiverView', component: ReceiverViewComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_STUDENT'] }, },
  { path: 'diploma', component: DiplomaComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }, },
  { path: 'receiver', component: ReceiverComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }, },
  { path: 'transmitter', component: TransmitterComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }, },
  { path: 'stage', component: StageComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }, },
  { path: 'user', component: UserComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_RECEIVER','ROLE_ADMIN', 'ROLE_TRANSMITTER'] },},
  { path: 'auth/login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
@NgModule({
  declarations: [
    AppComponent,
    ReceiverComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    AdminComponent,
    DiplomaComponent,
    TransmitterComponent,
    StageComponent,
    ReceiverViewComponent,
    HomeComponent,
    TransmitterViewComponent,
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
