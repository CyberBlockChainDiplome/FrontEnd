export class SignupInfo {

  username: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone:string;
  role: string[];
  password: string;

  constructor(username: string,firstname: string,lastname: string, email: string,telephone:string,roles: string[],  password: string) {
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.telephone = telephone;
    this.role = roles;
    this.password = password;
  }
}
