import {Transmitter} from "../transmitter/transmitter.model";
import {Receiver} from "../receiver/receiver.model";
import {Diploma} from "../diploma/diploma.model";

export class User {
  id?: number;
  username: string;
  password: string;


  constructor( username: string, password: string) {
    this.username = username;
    this.password = password;
  }

}
