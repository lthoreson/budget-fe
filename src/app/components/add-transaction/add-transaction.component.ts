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

  constructor(public data: DataService, public ui: UiService) {
    console.log("add trans constructed")
  }

  ngOnInit(): void {
    console.log("add trans initialized")
    this.data.loadBudgets()
    this.data.loadAccts()
    this.data.loadTrans()
    this.data.loadDest()
  }

  public addTrans(): void {
    if (this.userInput.destination === '') {
      this.ui.prompt("Please enter a destination")
      return
    }
    this.data.addTrans(this.userInput)
  }

  public suggestBudget(): void {
    let suggestion = this.data.getDestinations().find((destination) => destination.name === this.userInput.destination)
    if (suggestion) {
      this.userInput.budget = suggestion.budget.id
    }
  }

}
