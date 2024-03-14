import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {Transmitter} from "./transmitter.model";
import {Subject} from "../subjects/subjects.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransmitterService {

  private transmitterUrl = 'http://localhost:8080/transmitter';

  constructor(private http: HttpClient) { }

  /** GET transmitter from the server */
  getTransmitters(): Observable<Transmitter[]> {
    return this.http.get<Transmitter[]>(this.transmitterUrl);
  }
  partialUpdateTransmitter(transmitter: Partial<Transmitter>, id:number):Observable<Transmitter> {
    return this.http.patch<Transmitter>(`${this.transmitterUrl}/${id}`,transmitter,httpOptions).pipe(
      tap((transmitterPartialUpdated: Transmitter) => this.log(`partial update transmitter id=${transmitterPartialUpdated.id}`)),
      catchError(this.handleError<any>('partialUpdateTransmitter'))
    )
  }
  /** GET transmitter by id. Will 404 if id not found */
  getTransmitter(id: number): Observable<Transmitter> {
    const url = `${this.transmitterUrl}/${id}`;
    return this.http.get<Transmitter>(url).pipe(
      tap(_ => this.log(`fetched transmitter id=${id}`)),
      catchError(this.handleError<Transmitter>(`getTransmitter id=${id}`))
    );
  }

  /** POST: add a new transmitter to the server */
  addTransmitter(transmitter: Transmitter): Observable<Transmitter> {
    return this.http.post<Transmitter>(this.transmitterUrl, transmitter, httpOptions).pipe(
      tap((transmitterAdded: Transmitter) => this.log(`added transmitter id=${transmitterAdded.id}`)),
      catchError(this.handleError<Transmitter>('addTransmitter'))
    );
  }

  /** DELETE: delete the transmitter from the server */
  deleteTransmitter(transmitter: Transmitter | number): Observable<Transmitter> {
    const id = typeof transmitter === 'number' ? transmitter : transmitter.id;
    const url = `${this.transmitterUrl}/${id}`;
    return this.http.delete<Transmitter>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted transmitter id=${id}`)),
      catchError(this.handleError<Transmitter>('deleteTransmitter'))
    );
  }

  /** DELETE: delete all the transmitter from the server */
  deleteTransmitters(): Observable<Transmitter> {
    return this.http.delete<Transmitter>(this.transmitterUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted transmitter`)),
      catchError(this.handleError<Transmitter>('deleteTransmitter'))
    );
  }

  /** PUT: update the transmitter on the server */
  updateTransmitter(transmitter: Transmitter, id:number): Observable<Transmitter> {
    return this.http.put<Transmitter>(`${this.transmitterUrl}/${id}`, transmitter, httpOptions).pipe(
      // tap(_ => this.log(`updated transmitter id=${transmitter.id}`)), // same as the line below
      tap((transmitterUpdated: Transmitter) => this.log(`updated transmitter id=${transmitterUpdated.id}`)),
      catchError(this.handleError<any>('updateTransmitter'))
    );
  }

  /** PUT: update all the transmitter on the server */
  updateTransmitters(transmitter: Transmitter[]): Observable<Transmitter[]> {
    return this.http.put<Transmitter[]>(this.transmitterUrl, transmitter, httpOptions).pipe(
      tap(_ => this.log(`updated transmitter id=${transmitter}`)),
      catchError(this.handleError<any>('updateTransmitter'))
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

  /** Log a TransmitterService message with the MessageService */
  private log(message: string) {
    console.log('TransmitterService: ' + message);
  }

  /** GET number of transmitter from the server */
  getTransmitterCounter(): Observable<number> {
    const url = `${this.transmitterUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of transmitter in parent component
  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }

}
