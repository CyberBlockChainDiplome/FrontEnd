import { Component, OnInit } from '@angular/core';
import { StageService } from '../stages/stage.service';
import { ReceiverService } from '../receivers/receiver.service';
import { SubjectService } from '../subjects/subjects.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { Receiver } from '../receivers/receiver.model';
import { Stage } from '../stages/stage.model';
import { Subject } from '../subjects/subjects.model';
import { TransmitterService } from '../transmitters/transmitter.service';
import { Transmitter } from '../transmitters/transmitter.model';
import {switchMap} from "rxjs";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-transmitter-view',
  templateUrl: './transmitter-view.component.html',
  styleUrls: ['./transmitter-view.component.css']
})
export class TransmitterViewComponent implements OnInit {
  transmitter?: Transmitter;
  listStages: Stage[] = [];
  listStagesOfSubjectOfTransmitter: Stage[] = [];
  listSubjectsOfTransmitter: Subject[] = [];
  listReceiver: Receiver[] = [];
  listTransmitter: Transmitter[] = [];
  listSubject: Subject[] = [];
  username?: string;
  filterValue: string = '';

  originalReceiverList: Receiver[] = [];

  constructor(
    private stageService: StageService,
    private receiverService: ReceiverService,
    private transmitterService: TransmitterService,
    private subjectService: SubjectService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.username = this.tokenStorage.getUsername();
    console.log('Voici le username : ' + this.username);
    this.getTransmitters();
  }
  getReceiver(): void {
    this.receiverService.getReceivers().subscribe(receiverList => {
      this.listReceiver = receiverList;
      this.originalReceiverList = receiverList;
      this.getStage();
    });
  }
  getTransmitters(): void {
    this.transmitterService.getTransmitters().subscribe(transmitterList => {
      this.listTransmitter = transmitterList;
      // @ts-ignore
      this.getTransmitter(this.username);
    });
  }

  getTransmitter(username: string) {
    for (const transmitter of this.listTransmitter) {
      if (transmitter.identifier === username) {
        this.transmitter = transmitter;
        this.getReceiver();
        break;
      }
    }
  }

  getStage() {
    this.listStagesOfSubjectOfTransmitter = [];
    this.listStages = [];
    this.stageService.getStages().subscribe(stageList => {
      this.listStages = stageList;
      this.getSubject();
    });
  }

  private getSubject() {
    this.listSubjectsOfTransmitter = [];
    this.listSubject = [];
    this.subjectService.getSubjects().subscribe(subjectList => {
      this.listSubject = subjectList;
      this.getSubjectOfTransmitter(this.transmitter?.id);
    });
  }

  private getSubjectOfTransmitter(transmitterId: number | undefined) {
    for (const subject of this.listSubject) {
      if (subject.transmitter.id === transmitterId) {
        this.listSubjectsOfTransmitter.push(subject);
      }
    }
    this.getStageOfSubjectOfTransmitter(this.transmitter?.id);
  }
  getStageOfSubjectOfTransmitter(transmitterId: number | undefined){
    for (const stage of this.listStages) {
      if (stage.subject.transmitter.id === transmitterId) {
        this.listStagesOfSubjectOfTransmitter.push(stage);
      }
    }
  }
  delete(stage: Stage): void {
    this.listStages = this.listStages?.filter(c => c !== stage);
    this.stageService.deleteStage(stage).subscribe(() => {
        // for automatic update of number of stage in parent component
        if(this.listStages != undefined) {
          this.stageService.totalItems.next(this.listStages.length);
          console.log(this.listStages.length);
        }
      }
    );
    const index = this.listStagesOfSubjectOfTransmitter.findIndex(g => g.id === stage.id);
    if (index !== -1) {
      this.listStagesOfSubjectOfTransmitter.splice(index, 1);
    }
  }

  add(value: string, receiverId: number, subjectId: number): void {
    console.log('Stage value:', value);
    console.log('Stage Receiver Id:', receiverId);
    console.log('Stage Subject Id:', subjectId);
    const stage: Stage = {
      value: parseFloat(value),
      receiver: { id: receiverId } as Receiver,
      subject: { id: subjectId } as Subject,
    };

    this.stageService.addStage(stage).subscribe(() => {
      this.refresh(); // Appeler la méthode refresh() pour mettre à jour les données
    });
  }

  refresh(): void {
    this.getStage(); // Récupérer à nouveau les notes pour mettre à jour les données
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
      this.listReceiver = this.originalReceiverList;

      // Restaurer la liste complète des notes
      this.getStage();
    } else {
      // Filtrer les étudiants en fonction du nom de famille
      this.listReceiver = this.originalReceiverList.filter((receiver) =>
        receiver.lastname.toLowerCase().includes(filter)
      );

      // Filtrer les notes en fonction du nom de famille de l'étudiant et des sujets de l'enseignant
      this.listStagesOfSubjectOfTransmitter = this.listStages.filter((stage) =>
        stage.receiver.lastname.toLowerCase().includes(filter) &&
        this.listSubjectsOfTransmitter.some(subject => subject.id === stage.subject.id)
      );
    }
  }

}
