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
  public userInput: Transaction = new Transaction(null, '', 0, 0, 0)

  constructor(public data: DataService, public ui: UiService) {
    console.log("budgets constructed")
  }

  ngOnInit(): void {
    console.log("budgets initialized")
    this.data.loadBudgets()
    this.data.loadAccts()
  }

  public addTrans(): void {
    this.userInput.budget = Number(this.userInput.budget)
    this.userInput.account = Number(this.userInput.account)
    this.data.addTrans(this.userInput)
  }

}
