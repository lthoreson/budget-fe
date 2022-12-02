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
    console.log(input)
    this.http.post<Account>(this.url + "/accounts", input).pipe(take(1))
      .subscribe({
        next: (result) => {
          this.accounts.push(result)
          this.ui.setMode("accounts")
        }
      })
  }
  public addBudget(input: Budget): void {
    console.log(input)
    this.http.post<Budget>(this.url + "/budgets", input).pipe(take(1))
      .subscribe({
        next: (result) => {
          this.budgets.push(result)
          this.ui.setMode("budgets")
        }
      })
  }

  public loadAccts(): void {
    console.log("accts requested")
    this.http.get<Account[]>(this.url+"/accounts").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.accounts = result
          console.log("accounts received")
        }
      })
  }
  public loadBudgets(): void {
    console.log("budgets requested")
    this.http.get<Budget[]>(this.url+"/budgets").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.budgets = result
          console.log("budgets received")
        }
      })
  }
  public loadTrans(): void {
    console.log("trans requested")
    this.http.get<Transaction[]>(this.url+"/transactions").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.transactions = result
          console.log("trans received")
        }
      })
  }

  public getAccounts(): Account[] {
    console.log("accounts updated from memory")
    return this.accounts
  }
  public getBudgets(): Budget[] {
    console.log("budgets updated from memory")
    return this.budgets
  }
  public getTransactions(): Transaction[] {
    return this.transactions
    console.log("transactions updated from memory")
  }
}
