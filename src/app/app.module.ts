import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
//import {StudentsComponent} from "./students/students.component";
//import {LoginComponent} from "./login/login.component";
//import {UserComponent} from "./user/user.component";
//import {AdminComponent} from "./admin/admin.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
//import {RegisterComponent} from "./register/register.component";
import {httpInterceptorProviders} from "./auth/auth-interceptor";
//import {RoleGuard} from "./guards/role.guard";
//import {authGuard} from "./guards/auth.guard";
//import { SubjectsComponent } from './subjects/subjects.component';
//import { TeachersComponent } from './teachers/teachers.component';
//import { GradesComponent } from './grades/grades.component';
//import { StudentViewComponent } from './student-view/student-view.component';
//import { HomeComponent } from './home/home.component';
//import { TeacherViewComponent } from './teacher-view/teacher-view.component';

const routes: Routes = [
  //{ path: 'home', component: HomeComponent },
  //{ path: 'teacherView', component: TeacherViewComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_TEACHER'] }, },
  //{ path: 'studentView', component: StudentViewComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_STUDENT'] }, },
  //{ path: 'subjects', component: SubjectsComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }, },
  //{ path: 'students', component: StudentsComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }, },
  //{ path: 'teachers', component: TeachersComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }, },
  //{ path: 'grades', component: GradesComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_ADMIN'] }, },
  //{ path: 'user', component: UserComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_STUDENT','ROLE_ADMIN', 'ROLE_TEACHER'] },},
  //{ path: 'auth/login', component: LoginComponent },
  //{ path: 'signup', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
@NgModule({
  declarations: [
    AppComponent,
    //StudentsComponent,
    //LoginComponent,
    //RegisterComponent,
    //UserComponent,
    //AdminComponent,
    //SubjectsComponent,
    //TeachersComponent,
    //GradesComponent,
    //StudentViewComponent,
    //HomeComponent,
    //TeacherViewComponent,
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
