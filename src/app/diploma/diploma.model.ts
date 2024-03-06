import {Transmitter} from "../transmitter/transmitter.model";

export class Diploma {
  id?: number;
  subjectName: string;
  transmitter: Transmitter;

  constructor(subjectName: string, transmitter: Transmitter) {
    this.subjectName = subjectName;
    this.transmitter = transmitter;
  }

}
