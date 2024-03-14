import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {Subject} from "./subjects.model";
import {Student} from "../students/student.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private subjectsUrl = 'http://localhost:8080/subjects';

  constructor(private http: HttpClient) { }

  /** GET subjects from the server */
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.subjectsUrl);
  }

  partialUpdateSubject(subject: Partial<Subject>, id:number):Observable<Subject> {
    return this.http.patch<Subject>(`${this.subjectsUrl}/${id}`,subject,httpOptions).pipe(
      tap((subjectPartialUpdated: Subject) => this.log(`partial update subject id=${subjectPartialUpdated.id}`)),
      catchError(this.handleError<any>('partialUpdateSubject'))
    )
  }
  /** GET subject by id. Will 404 if id not found */
  getSubject(id: number): Observable<Subject> {
    const url = `${this.subjectsUrl}/${id}`;
    return this.http.get<Subject>(url).pipe(
      tap(_ => this.log(`fetched subject id=${id}`)),
      catchError(this.handleError<Subject>(`getSubject id=${id}`))
    );
  }

  /** POST: add a new subject to the server */
  addSubject(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>(this.subjectsUrl, subject, httpOptions).pipe(
      tap((subjectAdded: Subject) => this.log(`added subject id=${subjectAdded.id}`)),
      catchError(this.handleError<Subject>('addSubject'))
    );
  }

  /** DELETE: delete the subject from the server */
  deleteSubject(subject: Subject | number): Observable<Subject> {
    const id = typeof subject === 'number' ? subject : subject.id;
    const url = `${this.subjectsUrl}/${id}`;
    return this.http.delete<Subject>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted subject id=${id}`)),
      catchError(this.handleError<Subject>('deleteSubject'))
    );
  }

  /** DELETE: delete all the subjects from the server */
  deleteSubjects(): Observable<Subject> {
    return this.http.delete<Subject>(this.subjectsUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted subjects`)),
      catchError(this.handleError<Subject>('deleteSubjects'))
    );
  }

  /** PUT: update the subject on the server */
  updateSubject(subject: Subject, id:number): Observable<Subject> {
    return this.http.put<Subject>(`${this.subjectsUrl}/${id}`, subject, httpOptions).pipe(
       tap(_ => this.log(`updated subject id=${subject.id}`)), // same as the line below
      catchError(this.handleError<any>('updateSubject'))
    );
  }

  /** PUT: update all the subjects on the server */
  updateSubjects(subjects: Subject[]): Observable<Subject[]> {
    return this.http.put<Subject[]>(this.subjectsUrl, subjects, httpOptions).pipe(
      tap(_ => this.log(`updated subject id=${subjects}`)),
      catchError(this.handleError<any>('updateSubject'))
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

  /** Log a SubjectService message with the MessageService */
  private log(message: string) {
    console.log('SubjectService: ' + message);
  }

  /** GET number of subjects from the server */
  getSubjectsCounter(): Observable<number> {
    const url = `${this.subjectsUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of subjects in parent component
  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }

}
