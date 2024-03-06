import { Component, OnInit } from '@angular/core';
import { GradeService } from '../grades/grades.service';
import { StudentService } from '../students/student.service';
import { SubjectService } from '../subjects/subjects.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { Student } from '../students/student.model';
import { Grade } from '../grades/grades.model';
import { Subject } from '../subjects/subjects.model';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css']
})
export class StudentViewComponent implements OnInit {
  student?: Student;
  listGrades: Grade[] = [];
  listGradesOfStudent: Grade[] = [];
  listStudent: Student[] = [];
  listSubject: Subject[] = [];
  username?: string;
  selectedGrades: Grade[] = [];
  selectedGradeIndex: number = -1;

  constructor(
    private gradeService: GradeService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private tokenStorage: TokenStorageService
  ) {}


  showGradesBySubject(subject: Subject): void {
    this.selectedGrades = this.listGradesOfStudent.filter(grade => grade.subject.id === subject.id);
  }




  ngOnInit(): void {
    this.username = this.tokenStorage.getUsername();
    console.log('Voici le username : ' + this.username);
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getStudents().subscribe(studentList => {
      this.listStudent = studentList;
      console.log(this.listStudent.length);
      // @ts-ignore
      this.getStudent(this.username);
      console.log('ID Student : ' + this.student?.id);
      this.getGrades();
    });
  }

  getStudent(username: string) {
    for (const student of this.listStudent) {
      if (student.identifier === username) {
        this.student = student;
        break;
      }
    }
  }

  getGrades() {
    this.gradeService.getGrades().subscribe(gradeList => {
      this.listGrades = gradeList;
      console.log(this.listGrades.length);
      this.getGradesOfStudent(this.student?.id);
    });
  }

  getGradesOfStudent(studentId: number | undefined) {
    const uniqueSubjects: Subject[] = [];

    for (const grade of this.listGrades) {
      if (grade.student.id === studentId) {
        const subject = grade.subject;

        if (!uniqueSubjects.some(s => s.id === subject.id)) {
          uniqueSubjects.push(subject);
        }
      }
    }

    this.listGradesOfStudent = this.listGrades.filter(grade => grade.student.id === studentId);
    this.listSubject = uniqueSubjects;
  }





}
