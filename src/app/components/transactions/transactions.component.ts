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
  private sort: Sort = { active: '', direction: '' }
  private csv = encodeURI("data:text/csv;charset=utf-8,")

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
  public getBudgetName(id: number | null): string {
    const matched = this.data.getBudgets().find((budget) => budget.id === id)
    return matched ? matched.name : ""
  }
  public getAccountName(id: number | null): string {
    const matched = this.data.getAccounts().find((account) => account.id === id)
    return matched ? matched.name : ""
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
          return compare(Number(a.id), Number(b.id), isAsc);
        case 'destination':
          return compare(a.destination, b.destination, isAsc);
        case 'amount':
          return compare(a.amount, b.amount, isAsc);
        case 'budget':
          return compare(this.getBudgetName(a.budget), this.getBudgetName(b.budget), isAsc);
        case 'account':
          return compare(this.getAccountName(a.account), this.getAccountName(b.account), isAsc);
        default:
          return 0;
      }
    })
    return sorted
  }
  public generateCsv() {
    let allData = this.sortData(this.filterTransactions())
    let csvContent = "data:text/csv;charset=utf-8,ID,Destination,Amount,Budget,Account\n"
    for (let row of allData) {
      csvContent += row.id + "," + row.destination + "," + row.amount + "," +
        this.getBudgetName(Number(row.budget)) + "," +
        this.getAccountName(row.account) + "\n"
    }
    window.open(encodeURI(csvContent))
  }

}
