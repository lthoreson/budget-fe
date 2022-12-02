import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Budget } from 'src/data/budget';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.css']
})
export class AddBudgetComponent {
  public userInput: Budget = new Budget(null, '', 0)

  constructor(public data: DataService) { }

  public addBudget(): void {
    this.data.addBudget(this.userInput)
  }

}
