import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UiService } from 'src/app/services/ui.service';
import { Account } from 'src/data/account';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent {
  public userInput: Account = new Account(null,"","Checking", 0)

  constructor(public data: DataService, private ui: UiService) { }

  addAccount(): void {
    if (this.userInput.name === "") {
      this.ui.prompt("Please enter a name")
      return
    }
    this.data.addAccount(this.userInput)
  }
}
