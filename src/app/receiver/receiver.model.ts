export class Receiver {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  identifier: string

  constructor(firstname: string, lastname: string, email: string, telephone: string, identifier: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.telephone = telephone;
    this.identifier = identifier;
  }

}
