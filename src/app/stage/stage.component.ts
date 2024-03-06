import { Component, OnInit } from '@angular/core';
import {Grade} from "./grades.model";
import {GradeService} from "./grades.service";
import {switchMap} from "rxjs";
import {Subject} from "../subjects/subjects.model";
import {Student} from "../students/student.model";
import {StudentService} from "../students/student.service";
import {SubjectService} from "../subjects/subjects.service";
import {Teacher} from "../teachers/teacher.model";

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  gradeList?: Grade[];
  studentList: Student[] = [];
  subjectList: Subject[] = [];
  values: string[] = [];
  listGrade: string[][] = [];
  numberGradeInList: number = 0;
  originalStudentList: Student[] = [];
  filterValue: string = '';
  constructor(private gradeService: GradeService, private studentService: StudentService, private subjectService: SubjectService) { }

  ngOnInit() {
    this.getGrades();
    this.getStudents();
    this.getSubjects();
  }

  getGrades(): void {
    this.gradeService.getGrades()
      .subscribe(gradeList => this.gradeList = gradeList);
  }
  getStudents(): void {
    this.studentService.getStudents()
      .subscribe(studentList => {
        this.studentList = studentList,
          this.originalStudentList = studentList
      });
  }
  getSubjects(): void {
    this.subjectService.getSubjects()
      .subscribe(subjectList => this.subjectList = subjectList);
  }

  add(value: string, studentId: number, subjectId: number): void {
    console.log('Grade value:', value);
    console.log('Grade Student Id:', studentId);
    console.log('Grade Subject Id:', subjectId);
    if( value == null || studentId == null || subjectId == null){
      return;
    }
    const grade: Grade = {
      value: parseFloat(value),
      student: { id: studentId } as Student,
      subject: { id: subjectId } as Subject,
    };

    this.gradeService.addGrade(grade)
      .pipe(
        switchMap(() => this.gradeService.getGrades()) // Récupérer la liste des sujets mise à jour
      )
      .subscribe({
        next: (gradeList: Grade[]) => {
          this.gradeList = gradeList;
          this.gradeService.totalItems.next(gradeList.length);
          console.log(gradeList.length);
        },
        error: () => {},
        complete: () => {}
      });
  }
  delete(grade: Grade): void {
    this.gradeList = this.gradeList?.filter(c => c !== grade);
    this.gradeService.deleteGrade(grade).subscribe(() => {
        // for automatic update of number of grades in parent component
        if(this.gradeList != undefined) {
          this.gradeService.totalItems.next(this.gradeList.length);
          console.log(this.gradeList.length);
        }
      }
    );
  }

  deleteAll(): void {
    this.gradeService.deleteGrades().subscribe(() => {
        if(this.gradeList != undefined) {
          this.gradeList.length = 0;
        }
      }
    );
  }


  addStandBy(gradeName: string): void {
    gradeName = gradeName.trim();


    this.values = [gradeName];
    this.listGrade.push(this.values);
  }

  putAll(listGrade: string[][]): void {
    this.gradeService.deleteGrades().subscribe(() => {
        if (this.gradeList != undefined) {
          this.gradeList.length = 0;
        }
      }
    );
    for (const gradeList of listGrade) {
      let value: number= parseFloat(gradeList[this.numberGradeInList])
      this.numberGradeInList++;
      this.gradeService.addGrade({value} as Grade)
        .subscribe({
          next: (grade: Grade) => {
            this.gradeList?.push(grade);
            this.gradeService.getGrades().subscribe(grades => {
              this.gradeList = grades;
              this.gradeService.totalItems.next(this.gradeList.length);
            });
          },
          error: () => {},
          complete: () => {}
        });
    }
    this.listGrade = [];
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
      this.studentList = this.originalStudentList;

      // Restaurer la liste complète des notes
      this.getGrades();
    } else {
      // Filtrer les étudiants en fonction du nom de famille
      this.studentList = this.originalStudentList.filter((student) =>
        student.lastname.toLowerCase().includes(filter)
      );

      // Filtrer les notes en fonction du nom de famille
      this.gradeList = this.gradeList?.filter((grade) =>
        grade.student.lastname.toLowerCase().includes(filter)
      );
    }
  }


  partialUpdate(chosenToUpdateGrade: Grade, newValue?: number): void {
    const id = chosenToUpdateGrade.id;
    if (id !== undefined) {
      const updates: Partial<Grade> = { id:id};
      if (newValue) {
        updates.value = newValue
        console.log(updates.value);
      }
      this.gradeService.partialUpdateGrade(updates, id).pipe(
        switchMap(() => this.gradeService.getGrades()) // update the subjects list after partial update
      ).subscribe({
        next: (grades: Grade[]) => {
          this.gradeList = grades;
        },
        error: () => {
        },
        complete: () => {
          this.gradeService.totalItems.next(this.gradeList?.length || 0);
        }
      });
    }
  }
  deleteList() {
    this.listGrade = [];
  }


}

