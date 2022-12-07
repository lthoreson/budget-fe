import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UiService } from 'src/app/services/ui.service';
import { Account } from 'src/data/account';
import { Budget } from 'src/data/budget';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(public data: DataService, public ui: UiService) { }

  ngOnInit(): void {
    this.data.loadAccts()
    this.data.loadBudgets()
    this.data.loadTrans()
  }

  public getAccountBalance(account: Account): number {
    const acctTrans = this.data.getTransactions().filter((transaction) => transaction.account === account.id)
    let balance = account.balance
    for (let transaction of acctTrans) {
      balance -= transaction.amount
    }
    return balance
  }

  public getBudgetBalance(budget: Budget): number {
    const acctTrans = this.data.getTransactions().filter((transaction) => transaction.budget === budget.id)
    let balance = budget.total
    for (let transaction of acctTrans) {
      balance -= transaction.amount
    }
    return balance
  }

  public getMeterColor(amount: number): string {
    let color = "primary"
    if (amount < 50) {
      color = "accent"
    }
    if (amount < 20) {
      color = "warn"
    }
    return color
  }

}
