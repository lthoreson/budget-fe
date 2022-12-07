import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private mode: string = "dashboard"
  private modes: string[] = [
    "accounts","budgets","transactions","add-account","add-budget","add-transaction"
  ]
  private edit: boolean = false

  constructor(private snackBar: MatSnackBar) {
    // restores session state so user can refresh the current page without starting over
    const lastSession = String(localStorage.getItem("mode"))
    if (this.modes.includes(lastSession)) {
      this.setMode(lastSession)
    }
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
  public prompt(message: string): void {
    this.snackBar.open(message, "Close")
  }
  public afterEdit(): void {
    this.edit = true
  }
  public afterSave(): void {
    this.edit = false
  }
  public getEditState(): boolean {
    return this.edit
  }
}
