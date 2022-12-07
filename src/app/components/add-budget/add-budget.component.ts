import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UiService } from 'src/app/services/ui.service';
import { Budget } from 'src/data/budget';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.css']
})
export class AddBudgetComponent {
  public userInput: Budget = new Budget(null, '', 0)

  constructor(public data: DataService, private ui: UiService) { }

  public addBudget(): void {
    if (this.userInput.name === "") {
      this.ui.prompt("Please enter a name")
      return
    }
    this.data.addBudget(this.userInput)
  }

}
