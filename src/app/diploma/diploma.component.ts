import {Component, NgModule, OnInit} from '@angular/core';
import {Diploma} from "./diploma.model";
import {DiplomaService} from "./diploma.service";
import {mergeMap, switchMap} from "rxjs";
import {TransmitterService} from "../transmitter/transmitter.service";
import {Transmitter} from "../transmitter/transmitter.model";


@Component({
  selector: 'app-diploma',
  templateUrl: './diploma.component.html',
  styleUrls: ['./diploma.component.css']
})

export class DiplomaComponent implements OnInit {
  diplomaList?: Diploma[];
  transmitterList: Transmitter[] = [];
  values: string[] = [];
  listDiploma: string[][] = [];
  numberDiplomaInList: number = 0;
  selectedTransmitterId!: number;
  tempTransmitter?: Transmitter;
  originalDiplomaList: Diploma[] = [];
  filterValue: string = '';

  constructor(private diplomaService: DiplomaService, private transmitterService: TransmitterService) {

  }

  ngOnInit() {
    this.getDiplomas();
    this.getTransmitters();
  }

  getDiplomas(): void {
    this.diplomaService.getDiploma()
      .subscribe(diplomaList => {
        this.diplomaList = diplomaList;
        this.originalDiplomaList = diplomaList;
      });
  }
  getTransmitters(): void {
    this.transmitterService.getTransmitter()
      .subscribe(transmitterList => this.transmitterList = transmitterList);
  }


  add(diplomaName: string, transmitterId: number): void {
    if(diplomaName == '' || transmitterId == null ){
      return;
    }
    console.log('Diploma Name:', diplomaName);
    console.log('Diploma Transmitter Id:', transmitterId);
    const diploma: Diploma = {
      diplomaName: diplomaName.trim(),
      transmitter: { id: transmitterId } as Transmitter,
    };

    this.diplomaService.addDiploma(diploma)
      .pipe(
        switchMap(() => this.diplomaService.getDiploma()) // Récupérer la liste des sujets mise à jour
      )
      .subscribe({
        next: (diplomaList: Diploma[]) => {
          this.diplomaList = diplomaList;
          this.diplomaService.totalItems.next(diplomaList.length);
          console.log(diplomaList.length);
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
      this.diplomaList = this.originalDiplomaList;
    } else {
      // Appliquer le filtre au tableau
      this.diplomaList = this.originalDiplomaList.filter((diploma) =>
        diploma.diplomaName.toLowerCase().includes(filter)
      );
    }
  }
  resetDropdown(dropDown: HTMLSelectElement) {
    dropDown.selectedIndex = 0;
  }
  delete(diploma: Diploma): void {
    this.diplomaList = this.diplomaList?.filter(c => c !== diploma);
    this.diplomaService.deleteDiploma(diploma).subscribe(() => {
        // for automatic update of number of diplomas in parent component
        if(this.diplomaList != undefined) {
          this.diplomaService.totalItems.next(this.diplomaList.length);
          console.log(this.diplomaList.length);
        }
      }
    );
  }

  deleteAll(): void {
    this.diplomaService.deleteDiploma().subscribe(() => {
        if(this.diplomaList != undefined) {
          this.diplomaList.length = 0;
        }
      }
    );
  }

  update(diplomaName: string, transmitterId: number, chosenToUpdateDiploma: Diploma): void {
    const id = chosenToUpdateDiploma.id;
    diplomaName = diplomaName.trim();
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
        // Créer le nouvel objet Diploma avec le diplomaName et le transmitter
        const updatedDiploma: Diploma = {
          id: chosenToUpdateDiploma.id,
          diplomaName: diplomaName,
          transmitter: this.tempTransmitter,
        };
        // Effectuer l'opération de mise à jour avec le nouvel objet Diploma
        this.diplomaService.updateDiploma(updatedDiploma, id)
          .subscribe((diploma: Diploma) => {
            if (this.diplomaList !== undefined) {
              const index = this.diplomaList.indexOf(chosenToUpdateDiploma);
              this.diplomaList[index] = diploma;
            }
          });
      } else {
        console.log('Transmitter non trouvé pour l\'ID donné');
      }
    }
  }

  addStandBy(diplomaName: string): void {
    diplomaName = diplomaName.trim();


    this.values = [diplomaName];
    this.listDiploma.push(this.values);
  }

  putAll(listDiploma: string[][]): void {
    this.diplomaService.deleteDiplomas().subscribe(() => {
        if (this.diplomaList != undefined) {
          this.diplomaList.length = 0;
        }
      }
    );
    for (const diplomaList of listDiploma) {
      let diplomaName: string = diplomaList[this.numberDiplomaInList];
      this.numberDiplomaInList++;
      diplomaName = diplomaName.trim();

      this.diplomaService.addDiploma({diplomaName} as Diploma)
        .subscribe({
          next: (diploma: Diploma) => {
            this.diplomaList?.push(diploma);
            this.diplomaService.getDiplomas().subscribe(diplomas => {
              this.diplomaList = diplomas;
              this.diplomaService.totalItems.next(this.diplomaList.length);
            });
          },
          error: () => {},
          complete: () => {}
        });
    }
    this.listDiploma = [];
  }
  partialUpdate(chosenToUpdateDiploma: Diploma, newName?: string, newTransmitterId?: number): void {
    const id = chosenToUpdateDiploma.id;
    if (id !== undefined) {
      const updates: Partial<Diploma> = {id: id};
      if (newName) {
        updates.diplomaName = newName.trim();
      }
      if (newTransmitterId) {
        const transmitter = { id: newTransmitterId } as Transmitter;
        updates.transmitter = transmitter;
      }
      this.diplomaService.partialUpdateDiploma(updates, id).pipe(
        switchMap(() => this.diplomaService.getDiplomas()) // update the diplomas list after partial update
      ).subscribe({
        next: (diplomas: Diploma[]) => {
          this.diplomaList = diplomas;
        },
        error: () => {
        },
        complete: () => {
          this.diplomaService.totalItems.next(this.diplomaList?.length || 0);
        }
      });
    }
  }


  setSelectedTransmitter(event: any){
    this.selectedTransmitterId = event.target.value;
  }
  deleteList() {
    this.listDiploma = [];
  }
}

