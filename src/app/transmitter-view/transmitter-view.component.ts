import { Component, OnInit } from '@angular/core';
import { StageService } from '../stages/stage.service';
import { ReceiverService } from '../receivers/receiver.service';
import { DiplomaService } from '../diploma/diploma.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { Receiver } from '../receivers/receiver.model';
import { Stage } from '../stages/stage.model';
import { Diploma } from '../diploma/diploma.model';
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
  listStage: Stage[] = [];
  listStageOfDiplomaOfTransmitter: Stage[] = [];
  listDiplomaOfTransmitter: Diploma[] = [];
  listReceiver: Receiver[] = [];
  listTransmitter: Transmitter[] = [];
  listDiploma: Diploma[] = [];
  username?: string;
  filterValue: string = '';

  originalReceiverList: Receiver[] = [];

  constructor(
    private stageService: StageService,
    private receiverService: ReceiverService,
    private transmitterService: TransmitterService,
    private diplomaService: DiplomaService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.username = this.tokenStorage.getUsername();
    console.log('Voici le username : ' + this.username);
    this.getTransmitter();
  }
  getReceiver(): void {
    this.receiverService.getReceiver().subscribe(receiverList => {
      this.listReceiver = receiverList;
      this.originalReceiverList = receiverList;
      this.getStage();
    });
  }
  getTransmitter(): void {
    this.transmitterService.getTransmitter().subscribe(transmitterList => {
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
    this.listStageOfDiplomaOfTransmitter = [];
    this.listStage = [];
    this.stageService.getStage().subscribe(stageList => {
      this.listStage = stageList;
      this.getDiploma();
    });
  }

  private getDiploma() {
    this.listDiplomaOfTransmitter = [];
    this.listDiploma = [];
    this.diplomaService.getDiploma().subscribe(diplomaList => {
      this.listDiploma = diplomaList;
      this.getDiplomaOfTransmitter(this.transmitter?.id);
    });
  }

  private getDiplomaOfTransmitter(transmitterId: number | undefined) {
    for (const diploma of this.listDiploma) {
      if (diploma.transmitter.id === transmitterId) {
        this.listDiplomaOfTransmitter.push(diploma);
      }
    }
    this.getStageOfDiplomaOfTransmitter(this.transmitter?.id);
  }
  getStageOfDiplomaOfTransmitter(transmitterId: number | undefined){
    for (const stage of this.listStage) {
      if (stage.diploma.transmitter.id === transmitterId) {
        this.listStageOfDiplomaOfTransmitter.push(stage);
      }
    }
  }
  delete(stage: Stage): void {
    this.listStage = this.listStage?.filter(c => c !== stage);
    this.stageService.deleteStage(stage).subscribe(() => {
        // for automatic update of number of stage in parent component
        if(this.listStage != undefined) {
          this.stageService.totalItems.next(this.listStage.length);
          console.log(this.listStage.length);
        }
      }
    );
    const index = this.listStageOfDiplomaOfTransmitter.findIndex(g => g.id === stage.id);
    if (index !== -1) {
      this.listStageOfDiplomaOfTransmitter.splice(index, 1);
    }
  }

  add(value: string, receiverId: number, diplomaId: number): void {
    console.log('Stage value:', value);
    console.log('Stage Receiver Id:', receiverId);
    console.log('Stage Diploma Id:', diplomaId);
    const stage: Stage = {
      value: parseFloat(value),
      receiver: { id: receiverId } as Receiver,
      diploma: { id: diplomaId } as Diploma,
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
      this.listStageOfDiplomaOfTransmitter = this.listStage.filter((stage) =>
        stage.receiver.lastname.toLowerCase().includes(filter) &&
        this.listDiplomaOfTransmitter.some(diploma => diploma.id === stage.diploma.id)
      );
    }
  }

}
