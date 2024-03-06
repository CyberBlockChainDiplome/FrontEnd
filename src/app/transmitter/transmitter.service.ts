import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {Teacher} from "./teacher.model";
import {Subject} from "../subjects/subjects.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private teachersUrl = 'http://localhost:8080/teachers';

  constructor(private http: HttpClient) { }

  /** GET teachers from the server */
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.teachersUrl);
  }
  partialUpdateTeacher(teacher: Partial<Teacher>, id:number):Observable<Teacher> {
    return this.http.patch<Teacher>(`${this.teachersUrl}/${id}`,teacher,httpOptions).pipe(
      tap((teacherPartialUpdated: Teacher) => this.log(`partial update teacher id=${teacherPartialUpdated.id}`)),
      catchError(this.handleError<any>('partialUpdateTeacher'))
    )
  }
  /** GET teacher by id. Will 404 if id not found */
  getTeacher(id: number): Observable<Teacher> {
    const url = `${this.teachersUrl}/${id}`;
    return this.http.get<Teacher>(url).pipe(
      tap(_ => this.log(`fetched teacher id=${id}`)),
      catchError(this.handleError<Teacher>(`getTeacher id=${id}`))
    );
  }

  /** POST: add a new teacher to the server */
  addTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(this.teachersUrl, teacher, httpOptions).pipe(
      tap((teacherAdded: Teacher) => this.log(`added teacher id=${teacherAdded.id}`)),
      catchError(this.handleError<Teacher>('addTeacher'))
    );
  }

  /** DELETE: delete the teacher from the server */
  deleteTeacher(teacher: Teacher | number): Observable<Teacher> {
    const id = typeof teacher === 'number' ? teacher : teacher.id;
    const url = `${this.teachersUrl}/${id}`;
    return this.http.delete<Teacher>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted teacher id=${id}`)),
      catchError(this.handleError<Teacher>('deleteTeacher'))
    );
  }

  /** DELETE: delete all the teachers from the server */
  deleteTeachers(): Observable<Teacher> {
    return this.http.delete<Teacher>(this.teachersUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted teachers`)),
      catchError(this.handleError<Teacher>('deleteTeachers'))
    );
  }

  /** PUT: update the teacher on the server */
  updateTeacher(teacher: Teacher, id:number): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.teachersUrl}/${id}`, teacher, httpOptions).pipe(
      // tap(_ => this.log(`updated teacher id=${teacher.id}`)), // same as the line below
      tap((teacherUpdated: Teacher) => this.log(`updated teacher id=${teacherUpdated.id}`)),
      catchError(this.handleError<any>('updateTeacher'))
    );
  }

  /** PUT: update all the teachers on the server */
  updateTeachers(teachers: Teacher[]): Observable<Teacher[]> {
    return this.http.put<Teacher[]>(this.teachersUrl, teachers, httpOptions).pipe(
      tap(_ => this.log(`updated teacher id=${teachers}`)),
      catchError(this.handleError<any>('updateTeacher'))
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

  /** Log a TeacherService message with the MessageService */
  private log(message: string) {
    console.log('TeacherService: ' + message);
  }

  /** GET number of teachers from the server */
  getTeachersCounter(): Observable<number> {
    const url = `${this.teachersUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of teachers in parent component
  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }

}
