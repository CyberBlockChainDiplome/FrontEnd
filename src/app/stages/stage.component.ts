import { Component, OnInit } from '@angular/core';
import {Stage} from "./stage.model";
import {StageService} from "./stage.service";
import {switchMap} from "rxjs";
import {Diploma} from "../diploma/diploma.model";
import {Receiver} from "../receiver/receiver.model";
import {ReceiverService} from "../receiver/receiver.service";
import {DiplomaService} from "../diploma/diploma.service";
import {Transmitter} from "../transmitter/transmitter.model";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {
  stageList?: Stage[];
  receiverList: Receiver[] = [];
  diplomaList: Diploma[] = [];
  values: string[] = [];
  listStage: string[][] = [];
  numberStageInList: number = 0;
  originalReceiverList: Receiver[] = [];
  filterValue: string = '';
  constructor(private stageService: StageService, private receiverService: ReceiverService, private diplomaService: DiplomaService) { }

  ngOnInit() {
    this.getStage();
    this.getReceiver();
    this.getDiploma();
  }

  getStage(): void {
    this.stageService.getStage()
      .subscribe(stageList => this.stageList = stageList);
  }
  getReceiver(): void {
    this.receiverService.getReceiver()
      .subscribe(receiverList => {
        this.receiverList = receiverList,
          this.originalReceiverList = receiverList
      });
  }
  getDiploma(): void {
    this.diplomaService.getDiploma()
      .subscribe(diplomaList => this.diplomaList = diplomaList);
  }

  add(value: string, receiverId: number, diplomaId: number): void {
    console.log('Stage value:', value);
    console.log('Stage Receiver Id:', receiverId);
    console.log('Stage Diploma Id:', diplomaId);
    if( value == null || receiverId == null || diplomaId == null){
      return;
    }
    const stage: Stage = {
      value: parseFloat(value),
      receiver: { id: receiverId } as Receiver,
      diploma: { id: diplomaId } as Diploma,
    };

    this.stageService.addStage(stage)
      .pipe(
        switchMap(() => this.stageService.getStage()) // Récupérer la liste des sujets mise à jour
      )
      .subscribe({
        next: (stageList: Stage[]) => {
          this.stageList = stageList;
          this.stageService.totalItems.next(stageList.length);
          console.log(stageList.length);
        },
        error: () => {},
        complete: () => {}
      });
  }
  delete(stage: Stage): void {
    this.stageList = this.stageList?.filter(c => c !== stage);
    this.stageService.deleteStage(stage).subscribe(() => {
        // for automatic update of number of stage in parent component
        if(this.stageList != undefined) {
          this.stageService.totalItems.next(this.stageList.length);
          console.log(this.stageList.length);
        }
      }
    );
  }

  deleteAll(): void {
    this.stageService.deleteStage().subscribe(() => {
        if(this.stageList != undefined) {
          this.stageList.length = 0;
        }
      }
    );
  }


  addStandBy(stageName: string): void {
    stageName = stageName.trim();


    this.values = [stageName];
    this.listStage.push(this.values);
  }

  putAll(listStage: string[][]): void {
    this.stageService.deleteStage().subscribe(() => {
        if (this.stageList != undefined) {
          this.stageList.length = 0;
        }
      }
    );
    for (const stageList of listStage) {
      let value: number= parseFloat(stageList[this.numberStageInList])
      this.numberStageInList++;
      this.stageService.addStage({value} as Stage)
        .subscribe({
          next: (stage: Stage) => {
            this.stageList?.push(stage);
            this.stageService.getStage().subscribe(stage => {
              this.stageList = stage;
              this.stageService.totalItems.next(this.stageList.length);
            });
          },
          error: () => {},
          complete: () => {}
        });
    }
    this.listStage = [];
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
      this.receiverList = this.originalReceiverList;

      // Restaurer la liste complète des notes
      this.getStage();
    } else {
      // Filtrer les étudiants en fonction du nom de famille
      this.receiverList = this.originalReceiverList.filter((receiver) =>
        receiver.lastname.toLowerCase().includes(filter)
      );

      // Filtrer les notes en fonction du nom de famille
      this.stageList = this.stageList?.filter((stage) =>
        stage.receiver.lastname.toLowerCase().includes(filter)
      );
    }
  }


  partialUpdate(chosenToUpdateStage: Stage, newValue?: number): void {
    const id = chosenToUpdateStage.id;
    if (id !== undefined) {
      const updates: Partial<Stage> = { id:id};
      if (newValue) {
        updates.value = newValue
        console.log(updates.value);
      }
      this.stageService.partialUpdateStage(updates, id).pipe(
        switchMap(() => this.stageService.getStage()) // update the diploma list after partial update
      ).subscribe({
        next: (stage: Stage[]) => {
          this.stageList = stage;
        },
        error: () => {
        },
        complete: () => {
          this.stageService.totalItems.next(this.stageList?.length || 0);
        }
      });
    }
  }
  deleteList() {
    this.listStage = [];
  }


}

