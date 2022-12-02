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
  public displayedColumns: string[] = ['id', 'destination', 'amount', 'budget'];
  public filters: Filter = {
    id: null,
    destination: null,
    amount: null,
    budget: null
  }

  constructor(public data: DataService, public ui: UiService) {
    console.log("transactions constructed")
  }

  ngOnInit(): void {
    console.log("transactions initialized")
    this.data.loadTrans()
    this.data.loadBudgets()
  }

  public getBudgetName(id: number): string | undefined {
    return this.data.getBudgets().find((budget) => budget.id === Number(id))?.name
  }

  public filterTransactions(): Transaction[] {
    let result = this.data.getTransactions()
    for (let k in this.filters) {
      if (this.filters[k as keyof Filter]) {
        result = result.filter((trans) => trans[k as keyof Filter] === this.filters[k as keyof Filter])
      }
    }
    return result
  }

}
