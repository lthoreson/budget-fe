import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { Account } from 'src/data/account';
import { Budget } from 'src/data/budget'
import { Transaction } from 'src/data/transaction';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'http://localhost:8080'
  private accounts: Account[] = []
  private budgets: Budget[] = []
  private transactions: Transaction[] = []
  private transUpdate: Subject<Transaction[]> = new Subject()
  private budgetUpdate: Subject<Budget[]> = new Subject()
  private acctUpdate: Subject<Account[]> = new Subject()

  constructor(private http: HttpClient, private ui: UiService) {
    console.log("data service constructed")
  }

  public addAccount(input: Account): void {
    this.add<Account>(input, "accounts")
      .subscribe({
        next: (result) => {
          this.accounts.push(result)
          this.ui.setMode("accounts")
        },
        error: () => this.ui.prompt("Error: submission failed")
      })
  }
  public addBudget(input: Budget): void {
    this.add<Budget>(input, "budgets")
      .subscribe({
        next: (result) => {
          this.budgets.push(result)
          this.ui.setMode("budgets")
        },
        error: () => this.ui.prompt("Error: submission failed")
      })
  }
  public addTrans(input: Transaction): void {
    this.add<Transaction>(input, "transactions")
      .subscribe({
        next: (result) => {
          this.transactions.push(result)
          this.addAssociation(result)
        },
        error: () => this.ui.prompt("Error: submission failed")
      })
  }
  private add<T extends (Transaction | Budget | Account)>(input: T, path: string): Observable<T> {
    return this.http.post<T>(`${this.url}/${path}`, input).pipe(take(1))
  }

  // called whenever you add or save a transaction
  public addAssociation(input: Transaction): void {
    console.log("addAssociation input: ",input)
    if (input.budget === null) {
      this.ui.setMode("transactions")
      return
    }
    // stop if destination is already associated with a budget
    for (let budget of this.budgets) {
      if (budget.associations.includes(input.destination)) {
        this.ui.setMode("transactions")
        return
      }
    }
    // stop if budget field doesn't match an existing budget id
    let modBudget = this.getBudgets().find((budget) => budget.id === input.budget)
    if (!modBudget) {
      this.ui.prompt("budget reference was invalid")
      return
    }
    // otherwise, add the transaction's destination to its budget's associations array
    modBudget.associations.push(input.destination)
    console.log("updated budget sent to server", modBudget)
    this.http.put(this.url + "/budgets/" + input.budget, modBudget).pipe(take(1))
      .subscribe({
        next: (result) => {
          console.log("addAssociation result", result)
          this.ui.setMode("transactions")
          this.loadBudgets()
        },
        error: () => this.ui.prompt("Error: budget association not saved")
      })
  }

  // saves edited objects to the server
  public save<T extends (Transaction | Budget | Account)>(input: T, path: string): void {
    this.http.put<T>(`${this.url}/${path}/${input.id}`, input).pipe(take(1)).subscribe({
      next: (result) => console.log(`saved ${path}`, result),
      error: () => this.ui.prompt("Error: Server did not respond")
    })
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
          let copy = {...transaction}
          copy.budget = associatedBudget.id
          this.http.put<Transaction>(this.url + "/transactions/" + copy.id, copy).pipe(take(1))
            .subscribe({
              error: () => this.ui.prompt("Error: server did not respond")
            })
        }
      }
    }
    this.loadTrans()
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
          this.acctUpdate.next(result)
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
          this.budgetUpdate.next(result)
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
          this.transUpdate.next(result)
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

  public sendUpdate(): Observable<Transaction[]> {
    return this.transUpdate.asObservable()
  }
  public sendBudgets(): Observable<Budget[]> {
    return this.budgetUpdate.asObservable()
  }
  public sendAccts(): Observable<Account[]> {
    return this.acctUpdate.asObservable()
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
