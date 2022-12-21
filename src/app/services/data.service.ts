import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { Account } from 'src/data/account';
import { Budget } from 'src/data/budget';
import { Destination } from 'src/data/destination';
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
  private destinations: Destination[] = []
  private transUpdate: Subject<Transaction[]> = new Subject()
  private budgetUpdate: Subject<Budget[]> = new Subject()
  private acctUpdate: Subject<Account[]> = new Subject()
  private destUpdate: Subject<Destination[]> = new Subject()

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
          this.ui.setMode("transactions")
          this.ui.prompt("a transaction was added")
        },
        error: () => this.ui.prompt("Error: submission failed")
      })
  }
  private add<T extends (Transaction | Budget | Account)>(input: T, path: string): Observable<T> {
    return this.http.post<T>(`${this.url}/${path}`, input).pipe(take(1))
  }

  // saves edited objects to the server
  public save<T extends (Transaction | Budget | Account)>(input: T, path: string): void {
    this.http.put<T>(`${this.url}/${path}/${input.id}`, input).pipe(take(1)).subscribe({
      next: (result) => console.log(`saved ${path}`, result),
      error: () => this.ui.prompt("Error: Server did not respond")
    })
  }

  public deleteTrans(id: number): void {
    console.log("trans delete attempt: ", id)
    this.http.delete(`${this.url}/transactions/${id}`).pipe(take(1))
    .subscribe({
      next: () => {
        this.loadTrans()
        this.ui.prompt("Deleted transaction "+id)
      },
      error: () => this.ui.prompt("Error: Server did not respond")
    })
  }

  public autoAssign(): void {
    let complete = true
    let found = false
    for (let transaction of this.transactions) {
      if (transaction.budget === null) {
        complete = false
        let associatedDest = this.destinations.find((dest) => dest.name === transaction.destination)
        const associatedBudget = associatedDest?.budget.id
        if (associatedBudget) {
          found = true
          let copy = {...transaction}
          copy.budget = associatedBudget
          this.http.put<Transaction>(this.url + "/transactions/" + copy.id, copy).pipe(take(1))
            .subscribe({
              next: () => this.loadTrans(),
              error: () => this.ui.prompt("Error: server did not respond")
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
  public loadDest(): void {
    console.log("dest requested")
    this.http.get<Destination[]>(this.url + "/destinations").pipe(take(1))
      .subscribe({
        next: (result) => {
          this.destinations = result
          this.destUpdate.next(result)
          console.log("dest received")
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
  public getDestinations(): Destination[] {
    return this.destinations;
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
  
}
