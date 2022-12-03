import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
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

  // uses ngModel to track selected filters
  public filters: Filter = {
    id: null,
    destination: null,
    account: null,
    budget: null
  }

  // receives event when user clicks a sort header
  private sort: Sort = {active: '', direction: ''}

  constructor(public data: DataService, public ui: UiService) {
    console.log("transactions constructed")
  }

  ngOnInit(): void {
    console.log("transactions initialized")
    this.data.loadTrans()
    this.data.loadBudgets()
    this.data.loadAccts()
  }

  // event handler for sort buttons
  public setSort(input: Sort) {
    this.sort = input
  }

  // converts ids to names for better table presentation
  public getBudgetName(id: number): string | undefined {
    return this.data.getBudgets().find((budget) => budget.id === id)?.name
  }
  public getAccountName(id: number): string | undefined {
    return this.data.getAccounts().find((account) => account.id === id)?.name
  }

  // eliminates duplicate destinations from the filter options
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

  public sortData(result: Transaction[]): Transaction[] {
    const sorted = result.slice()
    if (!this.sort.active || this.sort.direction === '') {
      return sorted;
    }

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    sorted.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'id':
          return compare(a.id?a.id:0, b.id?b.id:0, isAsc);
        case 'destination':
          return compare(a.destination, b.destination, isAsc);
        case 'amount':
          return compare(a.amount, b.amount, isAsc);
        case 'budget':
          return compare(a.budget, b.budget, isAsc);
        case 'account':
          return compare(a.account, b.account, isAsc);
        default:
          return 0;
      }
    })
    return sorted
  }

}
