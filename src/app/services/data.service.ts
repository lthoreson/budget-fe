import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Account } from 'src/data/account';
import { Budget } from 'src/data/budget'
import { Database } from 'src/data/database';
import { Transaction } from 'src/data/transaction';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'http://localhost:3000/data/'
  private accounts: Account[] = []
  private budgets: Budget[] = []
  private transactions: Transaction[] = []

  constructor(private http: HttpClient) {
    console.log("data constructed")
    this.refreshData()
   }

  private searchDb(category: string, key: string, value: number | string): Observable<any> {
    return this.http.get<any>(this.url + "/" + category + "?" + key + "=" + value).pipe(take(1))
  }

  public addAccount(input: Account): void {
    this.http.post(this.url + "/accounts", input).pipe(take(1))
      .subscribe({
        next: () => this.refreshData()
      })
  }

  public refreshData(): void {
    this.http.get<Database>(this.url).pipe(take(1))
      .subscribe({
        next: (result) => {
          this.accounts = result.accounts
          this.budgets = result.budgets
          this.transactions = result.transactions
          console.log("data refreshed")
        }
      })
  }

  public getAccounts(): Account[] {
    console.log("accounts retrieved")
    return this.accounts
  }
  public getBudgets(): Budget[] {
    return this.budgets
  }
  public getTransactions(): Transaction[] {
    return this.transactions
  }
}
