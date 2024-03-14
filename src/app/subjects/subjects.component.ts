import {Component, NgModule, OnInit} from '@angular/core';
import {Subject} from "./subjects.model";
import {SubjectService} from "./subjects.service";
import {mergeMap, switchMap} from "rxjs";
import {TeacherService} from "../teachers/teacher.service";
import {Teacher} from "../teachers/teacher.model";


@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})

export class SubjectsComponent implements OnInit {
  subjectList?: Subject[];
  teacherList: Teacher[] = [];
  values: string[] = [];
  listSubject: string[][] = [];
  numberSubjectInList: number = 0;
  selectedTeacherId!: number;
  tempTeacher?: Teacher;
  originalSubjectList: Subject[] = [];
  filterValue: string = '';

  constructor(private subjectService: SubjectService, private teacherService: TeacherService) {

  }

  ngOnInit() {
    this.getSubjects();
    this.getTeachers();
  }

  getSubjects(): void {
    this.subjectService.getSubjects()
      .subscribe(subjectList => {
        this.subjectList = subjectList;
        this.originalSubjectList = subjectList;
      });
  }
  getTeachers(): void {
    this.teacherService.getTeachers()
      .subscribe(teacherList => this.teacherList = teacherList);
  }


  add(subjectName: string, teacherId: number): void {
    if(subjectName == '' || teacherId == null ){
      return;
    }
    console.log('Subject Name:', subjectName);
    console.log('Subject Teacher Id:', teacherId);
    const subject: Subject = {
      subjectName: subjectName.trim(),
      teacher: { id: teacherId } as Teacher,
    };

    this.subjectService.addSubject(subject)
      .pipe(
        switchMap(() => this.subjectService.getSubjects()) // Récupérer la liste des sujets mise à jour
      )
      .subscribe({
        next: (subjectList: Subject[]) => {
          this.subjectList = subjectList;
          this.subjectService.totalItems.next(subjectList.length);
          console.log(subjectList.length);
        },
        error: () => {},
        complete: () => {}
      });
  }
  filterTable() {
    // Convertir la valeur de filtrage en minuscules pour une comparaison insensible à la casse
    const filter = this.filterValue.toLowerCase();

    if (filter === '') {
      // Restaurer la liste complète des étudiants
      this.subjectList = this.originalSubjectList;
    } else {
      // Appliquer le filtre au tableau
      this.subjectList = this.originalSubjectList.filter((subject) =>
        subject.subjectName.toLowerCase().includes(filter)
      );
    }
  }
  resetDropdown(dropDown: HTMLSelectElement) {
    dropDown.selectedIndex = 0;
  }
  delete(subject: Subject): void {
    this.subjectList = this.subjectList?.filter(c => c !== subject);
    this.subjectService.deleteSubject(subject).subscribe(() => {
        // for automatic update of number of subjects in parent component
        if(this.subjectList != undefined) {
          this.subjectService.totalItems.next(this.subjectList.length);
          console.log(this.subjectList.length);
        }
      }
    );
  }

  deleteAll(): void {
    this.subjectService.deleteSubjects().subscribe(() => {
        if(this.subjectList != undefined) {
          this.subjectList.length = 0;
        }
      }
    );
  }

  update(subjectName: string, teacherId: number, chosenToUpdateSubject: Subject): void {
    const id = chosenToUpdateSubject.id;
    subjectName = subjectName.trim();
    console.log(id);
    console.log(teacherId);
    if (id !== undefined) {
      for (const teacher of this.teacherList) {
        if (teacher.id === teacherId) {
          this.tempTeacher = teacher;
          break;
        }
      }
      if (this.tempTeacher !== undefined) {
        // Créer le nouvel objet Subject avec le subjectName et le teacher
        const updatedSubject: Subject = {
          id: chosenToUpdateSubject.id,
          subjectName: subjectName,
          teacher: this.tempTeacher,
        };
        // Effectuer l'opération de mise à jour avec le nouvel objet Subject
        this.subjectService.updateSubject(updatedSubject, id)
          .subscribe((subject: Subject) => {
            if (this.subjectList !== undefined) {
              const index = this.subjectList.indexOf(chosenToUpdateSubject);
              this.subjectList[index] = subject;
            }
          });
      } else {
        console.log('Teacher non trouvé pour l\'ID donné');
      }
    }
  }

  addStandBy(subjectName: string): void {
    subjectName = subjectName.trim();


    this.values = [subjectName];
    this.listSubject.push(this.values);
  }

  putAll(listSubject: string[][]): void {
    this.subjectService.deleteSubjects().subscribe(() => {
        if (this.subjectList != undefined) {
          this.subjectList.length = 0;
        }
      }
    );
    for (const subjectList of listSubject) {
      let subjectName: string = subjectList[this.numberSubjectInList];
      this.numberSubjectInList++;
      subjectName = subjectName.trim();

      this.subjectService.addSubject({subjectName} as Subject)
        .subscribe({
          next: (subject: Subject) => {
            this.subjectList?.push(subject);
            this.subjectService.getSubjects().subscribe(subjects => {
              this.subjectList = subjects;
              this.subjectService.totalItems.next(this.subjectList.length);
            });
          },
          error: () => {},
          complete: () => {}
        });
    }
    this.listSubject = [];
  }
  partialUpdate(chosenToUpdateSubject: Subject, newName?: string, newTeacherId?: number): void {
    const id = chosenToUpdateSubject.id;
    if (id !== undefined) {
      const updates: Partial<Subject> = {id: id};
      if (newName) {
        updates.subjectName = newName.trim();
      }
      if (newTeacherId) {
        const teacher = { id: newTeacherId } as Teacher;
        updates.teacher = teacher;
      }
      this.subjectService.partialUpdateSubject(updates, id).pipe(
        switchMap(() => this.subjectService.getSubjects()) // update the subjects list after partial update
      ).subscribe({
        next: (subjects: Subject[]) => {
          this.subjectList = subjects;
        },
        error: () => {
        },
        complete: () => {
          this.subjectService.totalItems.next(this.subjectList?.length || 0);
        }
      });
    }
  }


  setSelectedTeacher(event: any){
    this.selectedTeacherId = event.target.value;
  }
  deleteList() {
    this.listSubject = [];
  }
}

