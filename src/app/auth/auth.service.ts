import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginInfo} from './login-info';
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {JwtResponse} from './jwt-response';
import {SignupInfo} from './signup-info';
import {User} from "../user/user.model";


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:8080/auth/signin';
  private signupUrl = 'http://localhost:8080/auth/signup';

  private usersUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  attemptAuth(credentials: LoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, credentials, httpOptions);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }
  deleteUser(user: User | string): Observable<User> {
    const username = typeof user === 'string' ? user : user.username;
    const url = `${this.usersUrl}/${username}`;
    return this.http.delete<User>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted teacher username=${username}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  signUp(info: SignupInfo): Observable<string> {
    return this.http.post<string>(this.signupUrl, info, httpOptions);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a TeacherService message with the MessageService */
  private log(message: string) {
    console.log('AuthService (User) : ' + message);
  }
}
