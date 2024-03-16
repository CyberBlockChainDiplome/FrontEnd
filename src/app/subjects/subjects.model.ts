import {Transmitter} from "../transmitters/transmitter.model";

export class Subject {
  id?: number;
  subjectName: string;
  transmitter: Transmitter;

  constructor(subjectName: string, transmitter: Transmitter) {
    this.subjectName = subjectName;
    this.transmitter = transmitter;
  }

}
