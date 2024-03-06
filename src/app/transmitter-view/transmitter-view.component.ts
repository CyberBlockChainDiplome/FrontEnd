import { Component, OnInit } from '@angular/core';
import { GradeService } from '../grades/grades.service';
import { StudentService } from '../students/student.service';
import { SubjectService } from '../subjects/subjects.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { Student } from '../students/student.model';
import { Grade } from '../grades/grades.model';
import { Subject } from '../subjects/subjects.model';
import { TeacherService } from '../teachers/teacher.service';
import { Teacher } from '../teachers/teacher.model';
import {switchMap} from "rxjs";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-teacher-view',
  templateUrl: './teacher-view.component.html',
  styleUrls: ['./teacher-view.component.css']
})
export class TeacherViewComponent implements OnInit {
  teacher?: Teacher;
  listGrades: Grade[] = [];
  listGradesOfSubjectsOfTeacher: Grade[] = [];
  listSubjectsOfTeacher: Subject[] = [];
  listStudent: Student[] = [];
  listTeacher: Teacher[] = [];
  listSubject: Subject[] = [];
  username?: string;
  filterValue: string = '';

  originalStudentList: Student[] = [];

  constructor(
    private gradeService: GradeService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.username = this.tokenStorage.getUsername();
    console.log('Voici le username : ' + this.username);
    this.getTeachers();
  }
  getStudents(): void {
    this.studentService.getStudents().subscribe(studentList => {
      this.listStudent = studentList;
      this.originalStudentList = studentList;
      this.getGrades();
    });
  }
  getTeachers(): void {
    this.teacherService.getTeachers().subscribe(teacherList => {
      this.listTeacher = teacherList;
      // @ts-ignore
      this.getTeacher(this.username);
    });
  }

  getTeacher(username: string) {
    for (const teacher of this.listTeacher) {
      if (teacher.identifier === username) {
        this.teacher = teacher;
        this.getStudents();
        break;
      }
    }
  }

  getGrades() {
    this.listGradesOfSubjectsOfTeacher = [];
    this.listGrades = [];
    this.gradeService.getGrades().subscribe(gradeList => {
      this.listGrades = gradeList;
      this.getSubjects();
    });
  }

  private getSubjects() {
    this.listSubjectsOfTeacher = [];
    this.listSubject = [];
    this.subjectService.getSubjects().subscribe(subjectList => {
      this.listSubject = subjectList;
      this.getSubjectsOfTeacher(this.teacher?.id);
    });
  }

  private getSubjectsOfTeacher(teacherId: number | undefined) {
    for (const subject of this.listSubject) {
      if (subject.teacher.id === teacherId) {
        this.listSubjectsOfTeacher.push(subject);
      }
    }
    this.getGradesOfSubjectsOfTeacher(this.teacher?.id);
  }
  getGradesOfSubjectsOfTeacher(teacherId: number | undefined){
    for (const grade of this.listGrades) {
      if (grade.subject.teacher.id === teacherId) {
        this.listGradesOfSubjectsOfTeacher.push(grade);
      }
    }
  }
  delete(grade: Grade): void {
    this.listGrades = this.listGrades?.filter(c => c !== grade);
    this.gradeService.deleteGrade(grade).subscribe(() => {
        // for automatic update of number of grades in parent component
        if(this.listGrades != undefined) {
          this.gradeService.totalItems.next(this.listGrades.length);
          console.log(this.listGrades.length);
        }
      }
    );
    const index = this.listGradesOfSubjectsOfTeacher.findIndex(g => g.id === grade.id);
    if (index !== -1) {
      this.listGradesOfSubjectsOfTeacher.splice(index, 1);
    }
  }

  add(value: string, studentId: number, subjectId: number): void {
    console.log('Grade value:', value);
    console.log('Grade Student Id:', studentId);
    console.log('Grade Subject Id:', subjectId);
    const grade: Grade = {
      value: parseFloat(value),
      student: { id: studentId } as Student,
      subject: { id: subjectId } as Subject,
    };

    this.gradeService.addGrade(grade).subscribe(() => {
      this.refresh(); // Appeler la méthode refresh() pour mettre à jour les données
    });
  }

  refresh(): void {
    this.getGrades(); // Récupérer à nouveau les notes pour mettre à jour les données
  }

  resetDropdown(dropDown1: HTMLSelectElement, dropDown2: HTMLSelectElement) {
    dropDown1.selectedIndex = 0;
    dropDown2.selectedIndex = 0;
  }
  filterTable() {
    // Convertir la valeur de filtrage en minuscules pour une comparaison insensible à la casse
    const filter = this.filterValue.toLowerCase();

    if (filter === '') {
      // Restaurer la liste complète des étudiants
      this.listStudent = this.originalStudentList;

      // Restaurer la liste complète des notes
      this.getGrades();
    } else {
      // Filtrer les étudiants en fonction du nom de famille
      this.listStudent = this.originalStudentList.filter((student) =>
        student.lastname.toLowerCase().includes(filter)
      );

      // Filtrer les notes en fonction du nom de famille de l'étudiant et des sujets de l'enseignant
      this.listGradesOfSubjectsOfTeacher = this.listGrades.filter((grade) =>
        grade.student.lastname.toLowerCase().includes(filter) &&
        this.listSubjectsOfTeacher.some(subject => subject.id === grade.subject.id)
      );
    }
  }

}
