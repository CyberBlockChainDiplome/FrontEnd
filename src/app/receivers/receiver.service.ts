import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {Receiver} from "./receiver.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReceiverService {

  private receiversUrl = 'http://localhost:8080/receivers';

  constructor(private http: HttpClient) { }

  /** GET receivers from the server */
  getReceivers(): Observable<Receiver[]> {
    return this.http.get<Receiver[]>(this.receiversUrl);
  }
  partialUpdateReceiver(receiver: Partial<Receiver>, id:number):Observable<Receiver> {
    return this.http.patch<Receiver>(`${this.receiversUrl}/${id}`,receiver,httpOptions).pipe(
      tap((receiverPartialUpdated: Receiver) => this.log(`partial update receiver id=${receiverPartialUpdated.id}`)),
      catchError(this.handleError<any>('partialUpdateReceiver'))
    )
  }
  /** GET receiver by id. Will 404 if id not found */
  getReceiver(id: number): Observable<Receiver> {
    const url = `${this.receiversUrl}/${id}`;
    return this.http.get<Receiver>(url).pipe(
      tap(_ => this.log(`fetched receiver id=${id}`)),
      catchError(this.handleError<Receiver>(`getReceiver id=${id}`))
    );
  }

  /** POST: add a new receiver to the server */
  addReceiver(receiver: Receiver): Observable<Receiver> {
    return this.http.post<Receiver>(this.receiversUrl, receiver, httpOptions).pipe(
      tap((receiverAdded: Receiver) => this.log(`added receiver id=${receiverAdded.id}`)),
      catchError(this.handleError<Receiver>('addReceiver'))
    );
  }

  /** DELETE: delete the receiver from the server */
  deleteReceiver(receiver: Receiver | number): Observable<Receiver> {
    const id = typeof receiver === 'number' ? receiver : receiver.id;
    const url = `${this.receiversUrl}/${id}`;
    return this.http.delete<Receiver>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted receiver id=${id}`)),
      catchError(this.handleError<Receiver>('deleteReceiver'))
    );
  }

  /** DELETE: delete all the receivers from the server */
  deleteReceivers(): Observable<Receiver> {
    return this.http.delete<Receiver>(this.receiversUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted receivers`)),
      catchError(this.handleError<Receiver>('deleteReceivers'))
    );
  }

  /** PUT: update the receiver on the server */
  updateReceiver(receiver: Receiver, id:number): Observable<Receiver> {
    return this.http.put<Receiver>(`${this.receiversUrl}/${id}`, receiver, httpOptions).pipe(
      // tap(_ => this.log(`updated receiver id=${receiver.id}`)), // same as the line below
      tap((receiverUpdated: Receiver) => this.log(`updated receiver id=${receiverUpdated.id}`)),
      catchError(this.handleError<any>('updateReceiver'))
    );
  }

  /** PUT: update all the receivers on the server */
  updateReceivers(receivers: Receiver[]): Observable<Receiver[]> {
    return this.http.put<Receiver[]>(this.receiversUrl, receivers, httpOptions).pipe(
      tap(_ => this.log(`updated receiver id=${receivers}`)),
      catchError(this.handleError<any>('updateReceiver'))
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

  /** Log a ReceiverService message with the MessageService */
  private log(message: string) {
    console.log('ReceiverService: ' + message);
  }

  /** GET number of receivers from the server */
  getReceiversCounter(): Observable<number> {
    const url = `${this.receiversUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of receivers in parent component
  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }

}
