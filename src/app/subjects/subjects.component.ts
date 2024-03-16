import {Component, NgModule, OnInit} from '@angular/core';
import {Subject} from "./subjects.model";
import {SubjectService} from "./subjects.service";
import {mergeMap, switchMap} from "rxjs";
import {TransmitterService} from "../transmitters/transmitter.service";
import {Transmitter} from "../transmitters/transmitter.model";


@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})

export class SubjectsComponent implements OnInit {
  subjectList?: Subject[];
  transmitterList: Transmitter[] = [];
  values: string[] = [];
  listSubject: string[][] = [];
  numberSubjectInList: number = 0;
  selectedTransmitterId!: number;
  tempTransmitter?: Transmitter;
  originalSubjectList: Subject[] = [];
  filterValue: string = '';

  constructor(private subjectService: SubjectService, private transmitterService: TransmitterService) {

  }

  ngOnInit() {
    this.getSubjects();
    this.getTransmitters();
  }

  getSubjects(): void {
    this.subjectService.getSubjects()
      .subscribe(subjectList => {
        this.subjectList = subjectList;
        this.originalSubjectList = subjectList;
      });
  }
  getTransmitters(): void {
    this.transmitterService.getTransmitters()
      .subscribe(transmitterList => this.transmitterList = transmitterList);
  }


  add(subjectName: string, transmitterId: number): void {
    if(subjectName == '' || transmitterId == null ){
      return;
    }
    console.log('Subject Name:', subjectName);
    console.log('Subject Transmitter Id:', transmitterId);
    const subject: Subject = {
      subjectName: subjectName.trim(),
      transmitter: { id: transmitterId } as Transmitter,
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

  update(subjectName: string, transmitterId: number, chosenToUpdateSubject: Subject): void {
    const id = chosenToUpdateSubject.id;
    subjectName = subjectName.trim();
    console.log(id);
    console.log(transmitterId);
    if (id !== undefined) {
      for (const transmitter of this.transmitterList) {
        if (transmitter.id === transmitterId) {
          this.tempTransmitter = transmitter;
          break;
        }
      }
      if (this.tempTransmitter !== undefined) {
        // Créer le nouvel objet Subject avec le subjectName et le transmitter
        const updatedSubject: Subject = {
          id: chosenToUpdateSubject.id,
          subjectName: subjectName,
          transmitter: this.tempTransmitter,
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
        console.log('Transmitter non trouvé pour l\'ID donné');
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
  partialUpdate(chosenToUpdateSubject: Subject, newName?: string, newTransmitterId?: number): void {
    const id = chosenToUpdateSubject.id;
    if (id !== undefined) {
      const updates: Partial<Subject> = {id: id};
      if (newName) {
        updates.subjectName = newName.trim();
      }
      if (newTransmitterId) {
        const transmitter = { id: newTransmitterId } as Transmitter;
        updates.transmitter = transmitter;
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


  setSelectedTransmitter(event: any){
    this.selectedTransmitterId = event.target.value;
  }
  deleteList() {
    this.listSubject = [];
  }
}

