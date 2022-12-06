import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UiService } from 'src/app/services/ui.service';
import { Transaction } from 'src/data/transaction';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {
  public userInput: Transaction = new Transaction(null, '', 0, null, 1)
  public budgetID: string | undefined = ''
  public accountType: string = '1'

  constructor(public data: DataService, public ui: UiService) {
    console.log("budgets constructed")
  }

  ngOnInit(): void {
    console.log("budgets initialized")
    this.data.loadBudgets()
    this.data.loadAccts()
    this.data.loadTrans()
  }

  public addTrans(): void {
    if (this.userInput.destination === '') {
      this.ui.prompt("Please enter a destination")
      return
    }
    this.userInput.budget = this.budgetID ? Number(this.budgetID) : null
    this.userInput.account = Number(this.accountType)
    this.data.addTrans(this.userInput)
  }

  public suggestBudget(): void {
    let suggestion = this.data.getBudgets().find((budget) => budget.associations.includes(this.userInput.destination))
    if (suggestion) {
      this.budgetID = String(suggestion.id)
    }
  }

}
