import {Transmitter} from "../transmitters/transmitter.model";
import {Receiver} from "../receivers/receiver.model";
import {Subject} from "../subjects/subjects.model";

export class Stage {
  id?: number;
  value: number;
  receiver: Receiver;
  subject: Subject;

  constructor(value: number, receiver: Receiver, subject: Subject) {
    this.value = value;
    this.receiver = receiver;
    this.subject = subject;
  }

}
