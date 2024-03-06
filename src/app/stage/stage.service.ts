import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Grade} from "./grades.model";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private gradesUrl = 'http://localhost:8080/grades';

  constructor(private http: HttpClient) { }

  /** GET grades from the server */
  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.gradesUrl);
  }

  partialUpdateGrade(grade: Partial<Grade>, id:number):Observable<Grade> {
    return this.http.patch<Grade>(`${this.gradesUrl}/${id}`,grade,httpOptions).pipe(
      tap((gradePartialUpdated: Grade) => this.log(`partial update grade id=${gradePartialUpdated.id}`)),
      catchError(this.handleError<any>('partialUpdateGrade'))
    )
  }
  /** GET grade by id. Will 404 if id not found */
  getGrade(id: number): Observable<Grade> {
    const url = `${this.gradesUrl}/${id}`;
    return this.http.get<Grade>(url).pipe(
      tap(_ => this.log(`fetched grade id=${id}`)),
      catchError(this.handleError<Grade>(`getGrade id=${id}`))
    );
  }

  /** POST: add a new grade to the server */
  addGrade(grade: Grade): Observable<Grade> {
    return this.http.post<Grade>(this.gradesUrl, grade, httpOptions).pipe(
      tap((gradeAdded: Grade) => this.log(`added grade id=${gradeAdded.id}`)),
      catchError(this.handleError<Grade>('addGrade'))
    );
  }

  /** DELETE: delete the grade from the server */
  deleteGrade(grade: Grade | number): Observable<Grade> {
    const id = typeof grade === 'number' ? grade : grade.id;
    const url = `${this.gradesUrl}/${id}`;
    return this.http.delete<Grade>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted grade id=${id}`)),
      catchError(this.handleError<Grade>('deleteGrade'))
    );
  }

  /** DELETE: delete all the grades from the server */
  deleteGrades(): Observable<Grade> {
    return this.http.delete<Grade>(this.gradesUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted grades`)),
      catchError(this.handleError<Grade>('deleteGrades'))
    );
  }

  /** PUT: update the grade on the server */
  updateGrade(grade: Grade, id:number): Observable<Grade> {
    return this.http.put<Grade>(`${this.gradesUrl}/${id}`, grade, httpOptions).pipe(
      // tap(_ => this.log(`updated grade id=${grade.id}`)), // same as the line below
      tap((gradeUpdated: Grade) => this.log(`updated grade id=${gradeUpdated.id}`)),
      catchError(this.handleError<any>('updateGrade'))
    );
  }

  /** PUT: update all the grades on the server */
  updateGrades(grades: Grade[]): Observable<Grade[]> {
    return this.http.put<Grade[]>(this.gradesUrl, grades, httpOptions).pipe(
      tap(_ => this.log(`updated grade id=${grades}`)),
      catchError(this.handleError<any>('updateGrade'))
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

  /** Log a GradeService message with the MessageService */
  private log(message: string) {
    console.log('GradeService: ' + message);
  }

  /** GET number of grades from the server */
  getGradesCounter(): Observable<number> {
    const url = `${this.gradesUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of grades in parent component
  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }

}
