import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Stage} from "./stage.model";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StageService {

  private stagesUrl = 'http://localhost:8080/stages';

  constructor(private http: HttpClient) { }

  /** GET stages from the server */
  getStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(this.stagesUrl);
  }

  partialUpdateStage(stage: Partial<Stage>, id:number):Observable<Stage> {
    return this.http.patch<Stage>(`${this.stagesUrl}/${id}`,stage,httpOptions).pipe(
      tap((stagePartialUpdated: Stage) => this.log(`partial update stage id=${stagePartialUpdated.id}`)),
      catchError(this.handleError<any>('partialUpdateStage'))
    )
  }
  /** GET stage by id. Will 404 if id not found */
  getStage(id: number): Observable<Stage> {
    const url = `${this.stagesUrl}/${id}`;
    return this.http.get<Stage>(url).pipe(
      tap(_ => this.log(`fetched stage id=${id}`)),
      catchError(this.handleError<Stage>(`getStage id=${id}`))
    );
  }

  /** POST: add a new stage to the server */
  addStage(stage: Stage): Observable<Stage> {
    return this.http.post<Stage>(this.stagesUrl, stage, httpOptions).pipe(
      tap((stageAdded: Stage) => this.log(`added stage id=${stageAdded.id}`)),
      catchError(this.handleError<Stage>('addStage'))
    );
  }

  /** DELETE: delete the stage from the server */
  deleteStage(stage: Stage | number): Observable<Stage> {
    const id = typeof stage === 'number' ? stage : stage.id;
    const url = `${this.stagesUrl}/${id}`;
    return this.http.delete<Stage>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted stage id=${id}`)),
      catchError(this.handleError<Stage>('deleteStage'))
    );
  }

  /** DELETE: delete all the stages from the server */
  deleteStages(): Observable<Stage> {
    return this.http.delete<Stage>(this.stagesUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted stages`)),
      catchError(this.handleError<Stage>('deleteStages'))
    );
  }

  /** PUT: update the stage on the server */
  updateStage(stage: Stage, id:number): Observable<Stage> {
    return this.http.put<Stage>(`${this.stagesUrl}/${id}`, stage, httpOptions).pipe(
      // tap(_ => this.log(`updated stage id=${stage.id}`)), // same as the line below
      tap((stageUpdated: Stage) => this.log(`updated stage id=${stageUpdated.id}`)),
      catchError(this.handleError<any>('updateStage'))
    );
  }

  /** PUT: update all the stages on the server */
  updateStages(stages: Stage[]): Observable<Stage[]> {
    return this.http.put<Stage[]>(this.stagesUrl, stages, httpOptions).pipe(
      tap(_ => this.log(`updated stage id=${stages}`)),
      catchError(this.handleError<any>('updateStage'))
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

  /** Log a StageService message with the MessageService */
  private log(message: string) {
    console.log('StageService: ' + message);
  }

  /** GET number of stages from the server */
  getStagesCounter(): Observable<number> {
    const url = `${this.stagesUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of stages in parent component
  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }

}
