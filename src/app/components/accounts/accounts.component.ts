import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  constructor(public data: DataService, public ui: UiService) {
    console.log("accounts constructed")
  }

  ngOnInit(): void {
    console.log("accounts initialized")
  }

}
