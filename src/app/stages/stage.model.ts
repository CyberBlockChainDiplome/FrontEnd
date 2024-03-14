import {Transmitter} from "../transmitter/transmitter.model";
import {Receiver} from "../receiver/receiver.model";
import {Diploma} from "../diploma/diploma.model";

export class Stage {
  id?: number;
  value: number;
  receiver: Receiver;
  diploma: Diploma;

  constructor(value: number, receiver: Receiver, diploma: Diploma) {
    this.value = value;
    this.receiver = receiver;
    this.diploma = diploma;
  }

}
