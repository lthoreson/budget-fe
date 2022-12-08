import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UiService } from 'src/app/services/ui.service';
import { Budget } from 'src/data/budget';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit, OnDestroy {
  private news: Subscription
  public userInput: Budget[] = []
  private edits: number[] = []

  constructor(public data: DataService, public ui: UiService) {
    console.log("budgets constructed")
    this.news = this.data.sendBudgets()
      .subscribe((result) => this.userInput = result)
  }

  ngOnInit(): void {
    console.log("budgets initialized")
    this.data.loadBudgets()
  }
  ngOnDestroy(): void {
    this.news.unsubscribe()
  }

  public edit(id: number | null): void {
    if (!this.edits.includes(Number(id))) {
      this.edits.push(Number(id))
    }
  }

  public saveBudgets(): void {
    for (let id of this.edits) {
      const index = this.userInput.findIndex((t) => t.id === id)
      if (index !== -1) {
        const target = this.userInput[index]
        target.total = Number(target.total)
        this.data.saveBudget(target)
      }
    }
    this.ui.setEdit(false)
  }

}
