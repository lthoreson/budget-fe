import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private mode: string = "dashboard"

  constructor() { }

  public getMode(): string {
    return this.mode
  }
  public setMode(input: string = "dashboard"): void {
    this.mode = input
  }
}
