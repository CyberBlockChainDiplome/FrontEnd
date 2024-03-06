import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorDiploma, catchError, Observable, of, tap} from "rxjs";
import {Diploma} from "./diploma.model";
import {Receiver} from "../receiver/receiver.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DiplomaService {

  private diplomaUrl = 'http://localhost:8080/diploma';

  constructor(private http: HttpClient) { }

  /** GET diploma from the server */
  getDiploma(): Observable<Diploma[]> {
    return this.http.get<Diploma[]>(this.diplomaUrl);
  }

  partialUpdateDiploma(diploma: Partial<Diploma>, id:number):Observable<Diploma> {
    return this.http.patch<Diploma>(`${this.diplomaUrl}/${id}`,diploma,httpOptions).pipe(
      tap((diplomaPartialUpdated: Diploma) => this.log(`partial update diploma id=${diplomaPartialUpdated.id}`)),
      catchError(this.handleError<any>('partialUpdateDiploma'))
    )
  }
  /** GET diploma by id. Will 404 if id not found */
  getDiploma(id: number): Observable<Diploma> {
    const url = `${this.diplomaUrl}/${id}`;
    return this.http.get<Diploma>(url).pipe(
      tap(_ => this.log(`fetched diploma id=${id}`)),
      catchError(this.handleError<Diploma>(`getDiploma id=${id}`))
    );
  }

  /** POST: add a new diploma to the server */
  addDiploma(diploma: Diploma): Observable<Diploma> {
    return this.http.post<Diploma>(this.diplomaUrl, diploma, httpOptions).pipe(
      tap((diplomaAdded: Diploma) => this.log(`added diploma id=${diplomaAdded.id}`)),
      catchError(this.handleError<Diploma>('addDiploma'))
    );
  }

  /** DELETE: delete the diploma from the server */
  deleteDiploma(diploma: Diploma | number): Observable<Diploma> {
    const id = typeof diploma === 'number' ? diploma : diploma.id;
    const url = `${this.diplomaUrl}/${id}`;
    return this.http.delete<Diploma>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted diploma id=${id}`)),
      catchError(this.handleError<Diploma>('deleteDiploma'))
    );
  }

  /** DELETE: delete all the diploma from the server */
  deleteDiploma(): Observable<Diploma> {
    return this.http.delete<Diploma>(this.diplomaUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted diploma`)),
      catchError(this.handleError<Diploma>('deleteDiploma'))
    );
  }

  /** PUT: update the diploma on the server */
  updateDiploma(diploma: Diploma, id:number): Observable<Diploma> {
    return this.http.put<Diploma>(`${this.diplomaUrl}/${id}`, diploma, httpOptions).pipe(
      tap(_ => this.log(`updated diploma id=${diploma.id}`)), // same as the line below
      catchError(this.handleError<any>('updateDiploma'))
    );
  }

  /** PUT: update all the diploma on the server */
  updateDiploma(diploma: Diploma[]): Observable<Diploma[]> {
    return this.http.put<Diploma[]>(this.diplomaUrl, diploma, httpOptions).pipe(
      tap(_ => this.log(`updated diploma id=${diploma}`)),
      catchError(this.handleError<any>('updateDiploma'))
    );
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

  /** Log a DiplomaService message with the MessageService */
  private log(message: string) {
    console.log('DiplomaService: ' + message);
  }

  /** GET number of diploma from the server */
  getDiplomaCounter(): Observable<number> {
    const url = `${this.diplomaUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of diploma in parent component
  public totalItems: BehaviorDiploma<number> = new BehaviorDiploma<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }

}
