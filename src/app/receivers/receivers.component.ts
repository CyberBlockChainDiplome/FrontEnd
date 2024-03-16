import {Component, NgModule, OnInit} from '@angular/core';
import {Receiver} from "./receiver.model";
import {ReceiverService} from "./receiver.service";
import {switchMap} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {User} from "../user/user.model";
import {SignupInfo} from "../auth/signup-info";


@Component({
  selector: 'app-receiver',
  templateUrl: './receivers.component.html',
  styleUrls: ['./receivers.component.css']
})
export class ReceiversComponent implements OnInit {
  receiverList?: Receiver[];
  receiver?: Receiver;
  values: string[] = [];
  listReceiver: string[][] = [];
  numberReceiverInList: number = 0;
  filterValue: string = '';
  originalReceiverList: Receiver[] = [];
  userList: User[] = [];
  signupInfo?: SignupInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private receiverService: ReceiverService, private authService: AuthService) { }

  ngOnInit() { this.getReceivers();   }
  getReceivers(): void {
    this.receiverService.getReceivers()
      .subscribe(receiverList => {
        this.receiverList = receiverList;
        this.originalReceiverList = receiverList;
        // Émettre les nouvelles données
        this.receiverService.totalItems.next(this.receiverList.length);
        console.log(this.receiverList); // Vérifiez si la liste est correctement récupérée
      });
  }

  getUsers(): void {
    this.authService.getUsers()
      .subscribe(userList => {
        this.userList = userList;
      });
  }
  filterTable() {
    // Convertir la valeur de filtrage en minuscules pour une comparaison insensible à la casse
    const filter = this.filterValue.toLowerCase();

    if (filter === '') {
      // Restaurer la liste complète des étudiants
      this.receiverList = this.originalReceiverList;
    } else {
      // Appliquer le filtre au tableau
      this.receiverList = this.originalReceiverList.filter((receiver) =>
        receiver.lastname.toLowerCase().includes(filter)
      );
    }
  }
  add(firstname: string, lastname: string, email: string, telephone: string, identifier: string): void {
    if( firstname == null || lastname == null || email == null || telephone == null || identifier == null ){
      return;
    }
    let password: string = "receiver123";
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    identifier = identifier.trim();
    /*
        this.receiverService.addReceiver({ firstname, lastname, email, telephone, identifier } as Receiver)
          .subscribe({
            next: (receiver: Receiver) => { this.receiverList?.push(receiver); },
            error: () => {},
            complete: () => {
              if (this.receiverList != undefined) {
                this.receiverService.totalItems.next(this.receiverList.length);
                console.log(this.receiverList.length);
              }
            }
      });

     */
    this.signupInfo = new SignupInfo(
      identifier,
      firstname,
      lastname,
      email,
      telephone,
      ["receiver"],
      password);

    this.authService.signUp(this.signupInfo).subscribe(
      data => {
        console.log(data);
        this.isSignedUp = true;
        this.isSignUpFailed = false;
        this.getReceivers();
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;

      }
    );

  }

  delete(receiver: Receiver): void {
    let check = true;
    try {
      this.userList = this.userList?.filter(user => user?.username !== receiver?.identifier);
      this.authService.deleteUser(receiver.identifier).subscribe(() => {
        // for automatic update of number of users in parent component
        if (this.userList != undefined) {
          this.receiverService.totalItems.next(this.userList.length);
          console.log(this.userList.length);
        }
      });
    } catch (error) {
      console.error(error);
      check = false;
    }
    if (check) {
      this.receiverList = this.receiverList?.filter(c => c !== receiver);
      this.receiverService.deleteReceiver(receiver).subscribe(() => {
          // for automatic update of number of receiver in parent component
          if (this.receiverList != undefined) {
            this.receiverService.totalItems.next(this.receiverList.length);
            console.log(this.receiverList.length);
          }
        }
      );
    }
  }

  deleteAll(): void {
    this.receiverService.deleteReceivers().subscribe(() => {
        if(this.receiverList != undefined) {
          this.receiverList.length = 0;
        }
      }
    );
  }

  update(firstname: string, lastname: string, email: string, telephone: string, identifier: string, chosenToUpdateReceiver:Receiver):void {
    let id = chosenToUpdateReceiver.id;
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    identifier = identifier.trim();
    console.log(id);
    if (id != undefined) {
      this.receiverService.updateReceiver({firstname, lastname, email, telephone, identifier} as Receiver, id)
        .subscribe({
          next: (receiver: Receiver) => {
            if (this.receiverList != undefined) {
              let index = this.receiverList?.indexOf(chosenToUpdateReceiver);
              this.receiverList[index] = receiver;
            }
          },
          error: () => {
          },
          complete: () => {
            if (this.receiverList != undefined) {
              this.receiverService.totalItems.next(this.receiverList.length);
              console.log(this.receiverList.length);
            }
          }
        })
    }
  }

  addStandBy(firstname: string, lastname: string, email: string, telephone: string, identifier: string): void {
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    identifier = identifier.trim();

    this.values = [firstname, lastname, email, telephone, identifier];
    this.listReceiver.push(this.values);
  }

  putAll(listReceiver: string[][]): void {
    this.receiverService.deleteReceivers().subscribe(() => {
        if (this.receiverList != undefined) {
          this.receiverList.length = 0;
        }
      }
    );
    for (const receiverList of listReceiver) {
      let firstname: string = receiverList[this.numberReceiverInList];
      this.numberReceiverInList++;
      let lastname: string = receiverList[this.numberReceiverInList];
      this.numberReceiverInList++;
      let email: string = receiverList[this.numberReceiverInList];
      this.numberReceiverInList++;
      let telephone: string = receiverList[this.numberReceiverInList];
      this.numberReceiverInList++;
      let identifier: string = receiverList[this.numberReceiverInList];
      this.numberReceiverInList = 0;

      firstname = firstname.trim();
      lastname = lastname.trim();
      email = email.trim();
      telephone = telephone.trim();
      identifier = identifier.trim();
      this.receiverService.addReceiver({ firstname, lastname, email, telephone, identifier } as Receiver)
        .subscribe({
          next: (receiver: Receiver) => {
            this.receiverList?.push(receiver);
            this.receiverService.getReceivers().subscribe(receiver => {
              this.receiverList = receiver;
              this.receiverService.totalItems.next(this.receiverList.length);
            });
          },
          error: () => {},
          complete: () => {}
        });
    }
    this.listReceiver = [];
  }
  partialUpdate(chosenToUpdateReceiver: Receiver, firstname?: string, lastname?: string, email?: string, telephone?: string, identifier?: string): void {
    const id = chosenToUpdateReceiver.id;
    if (id !== undefined) {
      const updates: Partial<Receiver> = {};
      if (firstname) {
        updates.firstname = firstname.trim();
      }
      if (lastname) {
        updates.lastname = lastname.trim();
      }
      if (email) {
        updates.email = email.trim();
      }
      if (telephone) {
        updates.telephone = telephone.trim();
      }
      if (identifier) {
        updates.identifier = identifier.trim();
      }
      this.receiverService.partialUpdateReceiver(updates, id).pipe(
        switchMap(() => this.receiverService.getReceivers()) // update the receiver list after partial update
      ).subscribe({
        next: (receiver: Receiver[]) => {
          this.receiverList = receiver;
        },
        error: () => {
        },
        complete: () => {
          this.receiverService.totalItems.next(this.receiverList?.length || 0);
        }
      });
    }
  }
  deleteList() {
    this.listReceiver = [];
  }
}

