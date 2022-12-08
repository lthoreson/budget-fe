import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UiService } from 'src/app/services/ui.service';
import { Account } from 'src/data/account';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy {
  private news: Subscription
  public userInput: Account[] = []
  private edits: number[] = []

  constructor(public data: DataService, public ui: UiService) {
    console.log("accounts constructed")
    this.news = this.data.sendAccts()
      .subscribe((result) => this.userInput = result)
  }

  ngOnInit(): void {
    console.log("accounts initialized")
    this.data.loadAccts()
  }
  ngOnDestroy(): void {
    this.news.unsubscribe()
  }

  public edit(id: number | null): void {
    if (!this.edits.includes(Number(id))) {
      this.edits.push(Number(id))
    }
  }

  public saveAccts(): void {
    for (let id of this.edits) {
      const index = this.userInput.findIndex((t) => t.id === id)
      if (index !== -1) {
        const target = this.userInput[index]
        target.balance = Number(target.balance)
        this.data.save<Account>(target, "accounts")
      }
    }
    this.ui.setEdit(false)
  }

}
