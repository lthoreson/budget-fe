import { transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Account } from 'src/data/account';
import { Budget } from 'src/data/budget'
import { Transaction } from 'src/data/transaction';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'http://localhost:3000'
  private accounts: Account[] = []
  private budgets: Budget[] = []
  private transactions: Transaction[] = []

  constructor(private http: HttpClient, private ui: UiService) {
    console.log("data service constructed")
  }

  private searchDb(category: string, key: string, value: number | string): Observable<any> {
    return this.http.get<any>(this.url + "/" + category + "?" + key + "=" + value).pipe(take(1))
  }

  public addAccount(input: Account): void {
    this.http.post<Account>(this.url + "/accounts", input).pipe(take(1))
      .subscribe({
        next: (result) => {
          this.accounts.push(result)
          this.ui.setMode("accounts")
        }
      })
  }
  public addBudget(input: Budget): void {
    this.http.post<Budget>(this.url + "/budgets", input).pipe(take(1))
      .subscribe({
        next: (result) => {
          this.budgets.push(result)
          this.ui.setMode("budgets")
        }
      })
  }
  public addTrans(input: Transaction): void {
    this.http.post<Transaction>(this.url + "/transactions", input).pipe(take(1))
      .subscribe({
        next: (result) => {
          this.transactions.push(result)
          this.ui.setMode("transactions")
        }
      })
  }

  public addAssociation(input: Transaction): void {
    // stop if destination is already associated with a budget
    for (let budget of this.getBudgets()) {
      if (budget.associations.includes(input.destination)) {
        return
      }
    }

    // otherwise, add the transaction's destination to the budget's associations array
    let modBudget = this.getBudgets().find((budget) => budget.id === input.budget)
    modBudget?.associations.push(input.destination)
    this.http.put(this.url + "/budgets/" + input.budget, modBudget).pipe(take(1))
      .subscribe({
        next: () => this.loadBudgets()
      })
  }

  public autoAssign(): void {
    for (let transaction of this.transactions) {
      if (transaction.budget === 0) {
        let associatedBudget = this.budgets.find((budget) => budget.associations.includes(transaction.destination))
        if (associatedBudget) {
          const copy = {...transaction}
          copy.budget = associatedBudget.id
          this.http.put<Transaction>(this.url + "/transactions/" + transaction.id, copy).pipe(take(1))
            .subscribe({
              next: (result) => transaction.budget = result.budget
            })
        }
      }
    }
  }

  public loadAccts(): void {
    console.log("accts requested")
    this.http.get<Account[]>(this.url + "/accounts").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.accounts = result
          console.log("accounts received")
        }
      })
  }
  public loadBudgets(): void {
    console.log("budgets requested")
    this.http.get<Budget[]>(this.url + "/budgets").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.budgets = result
          console.log("budgets received")
        }
      })
  }
  public loadTrans(): void {
    console.log("trans requested")
    this.http.get<Transaction[]>(this.url + "/transactions").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.transactions = result
          console.log("trans received")
        }
      })
  }

  public getAccounts(): Account[] {
    // console.log("accounts updated from memory")
    return this.accounts
  }
  public getBudgets(): Budget[] {
    // console.log("budgets updated from memory")
    return this.budgets
  }
  public getTransactions(): Transaction[] {
    // console.log("transactions updated from memory")
    return this.transactions
  }
  // returns list of all unique destinations
  public getDestinations(): string[] {
    let result: string[] = []
    for (let transaction of this.transactions) {
      if (!result.includes(transaction.destination)) {
        result.push(transaction.destination)
      }
    }
    return result
  }
}
