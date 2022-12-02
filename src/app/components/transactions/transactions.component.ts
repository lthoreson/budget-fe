import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UiService } from 'src/app/services/ui.service';
import { Filter } from 'src/data/filter';
import { Transaction } from 'src/data/transaction';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  public displayedColumns: string[] = ['id', 'destination', 'amount', 'budget', 'account'];
  public filters: Filter = {
    id: null,
    destination: null,
    account: null,
    budget: null
  }

  constructor(public data: DataService, public ui: UiService) {
    console.log("transactions constructed")
  }

  ngOnInit(): void {
    console.log("transactions initialized")
    this.data.loadTrans()
    this.data.loadBudgets()
    this.data.loadAccts()
  }

  public getBudgetName(id: number): string | undefined {
    return this.data.getBudgets().find((budget) => budget.id === id)?.name
  }
  public getAccountName(id: number): string | undefined {
    return this.data.getAccounts().find((account) => account.id === id)?.name
  }
  public getDestinations(): string[] {
    let result: string[] = []
    for (let transaction of this.data.getTransactions()) {
      if (!result.includes(transaction.destination)) {
        result.push(transaction.destination)
      }
    }
    return result
  }

  public filterTransactions(): Transaction[] {
    let result = this.data.getTransactions()
    for (let k in this.filters) {
      if (this.filters[k as keyof Filter]) {
        // if user selects a filter, modify result to include only transactions with matching field value
        result = result.filter((transaction) => transaction[k as keyof Transaction]?.toString() === this.filters[k as keyof Filter])
      }
    }
    return result
  }

}
