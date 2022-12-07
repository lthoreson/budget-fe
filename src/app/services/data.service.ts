import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
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
  private editedTrans: number[] = []

  constructor(private http: HttpClient, private ui: UiService) {
    console.log("data service constructed")
  }

  public addAccount(input: Account): void {
    this.http.post<Account>(this.url + "/accounts", input).pipe(take(1))
      .subscribe({
        next: (result) => {
          this.accounts.push(result)
          this.ui.setMode("accounts")
        },
        error: (e) => this.ui.prompt("Error: submission failed")
      })
  }
  public addBudget(input: Budget): void {
    this.http.post<Budget>(this.url + "/budgets", input).pipe(take(1))
      .subscribe({
        next: (result) => {
          this.budgets.push(result)
          this.ui.setMode("budgets")
        },
        error: (e) => this.ui.prompt("Error: submission failed")
      })
  }
  public addTrans(input: Transaction): void {
    this.http.post<Transaction>(this.url + "/transactions", input).pipe(take(1))
      .subscribe({
        next: (result) => {
          this.transactions.push(result)
          this.addAssociation(result)
        },
        error: (e) => this.ui.prompt("Error: submission failed")
      })
  }

  public addAssociation(input: Transaction): void {
    if (!input.budget) {
      this.ui.setMode("transactions")
      return
    }
    // stop if destination is already associated with a budget
    for (let budget of this.getBudgets()) {
      if (budget.associations.includes(input.destination)) {
        this.ui.setMode("transactions")
        return
      }
    }
    // otherwise, add the transaction's destination to its budget's associations array
    let modBudget = this.getBudgets().find((budget) => budget.id === input.budget)
    if (!modBudget) {
      return // budget reference was invalid
    }
    modBudget.associations.push(input.destination)
    this.http.put(this.url + "/budgets/" + input.budget, modBudget).pipe(take(1))
      .subscribe({
        next: () => this.ui.setMode("transactions"),
        error: () => this.ui.prompt("Error: budget association not saved")
      })
  }

  public edit(input: Transaction, key: keyof Transaction, value: string): void {
    const index = this.transactions.findIndex((t) => t.id === input.id)
    const transaction = this.transactions[index]
    function editor<T extends keyof Transaction>(k: T, v: Transaction[T]): void {
      transaction[k] = v
    }
    if (key === "destination") {
      editor<"destination">("destination",value)
    } else {
      editor<keyof Transaction>(key, Number(value))
    }
    if (!this.editedTrans.includes(Number(transaction.id))) {
      this.editedTrans.push(Number(transaction.id))
    }
    this.ui.afterEdit()
  }

  public saveTrans(): void {
    for (let id of this.editedTrans) {
      const index = this.transactions.findIndex((t) => t.id === id)
      if (index !== -1) {
        this.http.put<Transaction>(this.url + "/transactions/" + id, this.transactions[index]).pipe(take(1)).subscribe({
          next: (result) => {
            this.transactions[index] = result
            console.log("saved", result)
          },
          error: () => this.ui.prompt("Error: Server did not respond")
        })
      }
    }
    this.ui.afterSave()
  }

  public autoAssign(): void {
    let complete = true
    let found = false
    for (let transaction of this.transactions) {
      if (!transaction.budget) {
        complete = false
        let associatedBudget = this.budgets.find((budget) => budget.associations.includes(transaction.destination))
        if (associatedBudget) {
          found = true
          const copy = { ...transaction }
          copy.budget = associatedBudget.id
          this.http.put<Transaction>(this.url + "/transactions/" + transaction.id, copy).pipe(take(1))
            .subscribe({
              next: (result) => transaction.budget = result.budget,
              error: (e) => this.ui.prompt("Error: server did not respond")
            })
        }
      }
    }
    if (complete) {
      this.ui.prompt("All transactions have been assigned already")
    }
    if (!complete && !found) {
      this.ui.prompt("Some destinations do not have a default budget. Add or edit a transaction to set the default budget.")
    }
  }

  public loadAccts(): void {
    console.log("accts requested")
    this.http.get<Account[]>(this.url + "/accounts").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.accounts = result
          console.log("accounts received")
        },
        error: (e) => this.ui.prompt("Error: lost connection to server")
      })
  }
  public loadBudgets(): void {
    console.log("budgets requested")
    this.http.get<Budget[]>(this.url + "/budgets").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.budgets = result
          console.log("budgets received")
        },
        error: (e) => this.ui.prompt("Error: lost connection to server")
      })
  }
  public loadTrans(): void {
    console.log("trans requested")
    this.http.get<Transaction[]>(this.url + "/transactions").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.transactions = result
          console.log("trans received")
        },
        error: (e) => this.ui.prompt("Error: lost connection to server")
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
