import {Transmitter} from "../transmitters/transmitter.model";
import {Receiver} from "../receivers/receiver.model";
import {Subject} from "../subjects/subjects.model";

export class User {
  id?: number;
  username: string;
  password: string;


  constructor( username: string, password: string) {
    this.username = username;
    this.password = password;
  }

}
