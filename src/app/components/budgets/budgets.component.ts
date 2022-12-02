import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {
  constructor(public data: DataService, public ui: UiService) {
    console.log("budgets constructed")
  }

  ngOnInit(): void {
    console.log("budgets initialized")
    this.data.loadBudgets()
  }

}
