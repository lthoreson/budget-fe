import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService implements OnInit {
  private mode: string = "dashboard"

  constructor() {

    // restores session state so user can refresh the current page without starting over
    switch (localStorage.getItem("mode")) {
      case "accounts":
        this.mode = "accounts"
        break
      case "budgets":
        this.mode = "budgets"
        break
      case "transactions":
        this.mode = "transactions"
        break
    }
  }
  ngOnInit(): void {
  }

  public getMode(): string {
    return this.mode
  }
  public setMode(input: string = "dashboard"): void {
    this.mode = input
    this.storeMode(input)
  }
  private storeMode(input: string): void {
    localStorage.setItem("mode", input)
  }
}
