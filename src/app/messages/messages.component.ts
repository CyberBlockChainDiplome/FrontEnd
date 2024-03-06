import { Component } from '@angular/core';
import { MessageService } from '../messages.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  constructor(public messageService: MessageService) {}
  showPopup() { alert('Here is the log of the heroes you clicked on.');
  }

}
