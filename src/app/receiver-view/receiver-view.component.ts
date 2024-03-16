import { Component, OnInit } from '@angular/core';
import { StageService } from '../stages/stage.service';
import { ReceiverService } from '../receivers/receiver.service';
import { SubjectService } from '../subjects/subjects.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { Receiver } from '../receivers/receiver.model';
import { Stage } from '../stages/stage.model';
import { Subject } from '../subjects/subjects.model';

@Component({
  selector: 'app-receiver-view',
  templateUrl: './receiver-view.component.html',
  styleUrls: ['./receiver-view.component.css']
})
export class ReceiverViewComponent implements OnInit {
  receiver?: Receiver;
  listStages: Stage[] = [];
  listStagesOfReceiver: Stage[] = [];
  listReceiver: Receiver[] = [];
  listSubject: Subject[] = [];
  username?: string;
  selectedStage: Stage[] = [];
  selectedStageIndex: number = -1;

  constructor(
    private stageService: StageService,
    private receiverService: ReceiverService,
    private subjectService: SubjectService,
    private tokenStorage: TokenStorageService
  ) {}


  showStageBySubject(subject: Subject): void {
    this.selectedStage = this.listStagesOfReceiver.filter(stage => stage.subject.id === subject.id);
  }




  ngOnInit(): void {
    this.username = this.tokenStorage.getUsername();
    console.log('Voici le username : ' + this.username);
    this.getReceivers();
  }

  getReceivers(): void {
    this.receiverService.getReceivers().subscribe(receiverList => {
      this.listReceiver = receiverList;
      console.log(this.listReceiver.length);
      // @ts-ignore
      this.getReceiver(this.username);
      console.log('ID Receiver : ' + this.receiver?.id);
      this.getStages();
    });
  }

  getReceiver(username: string) {
    for (const receiver of this.listReceiver) {
      if (receiver.identifier === username) {
        this.receiver = receiver;
        break;
      }
    }
  }

  getStages() {
    this.stageService.getStages().subscribe(stageList => {
      this.listStages = stageList;
      console.log(this.listStages.length);
      this.getStagesOfReceiver(this.receiver?.id);
    });
  }

  getStagesOfReceiver(receiverId: number | undefined) {
    const uniqueSubjects: Subject[] = [];

    for (const stage of this.listStages) {
      if (stage.receiver.id === receiverId) {
        const subject = stage.subject;

        if (!uniqueSubjects.some(s => s.id === subject.id)) {
          uniqueSubjects.push(subject);
        }
      }
    }

    this.listStagesOfReceiver = this.listStages.filter(stage => stage.receiver.id === receiverId);
    this.listSubject = uniqueSubjects;
  }





}
