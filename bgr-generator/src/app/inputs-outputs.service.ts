// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InputsOutputsService {
  private colorsIn = new BehaviorSubject<string[]>([]);
  private resetIn = new BehaviorSubject<boolean>(false);
  private schemeIn = new BehaviorSubject<string>('');
  private colorAmount = new BehaviorSubject<number>(5);
  private primaryColor = new BehaviorSubject<string>('');
  private secondaryColor = new BehaviorSubject<string>('');
  private currentData = new BehaviorSubject<string>('');
  private currentDataTitle = new BehaviorSubject<string>('');

  private colorObservable: Observable<string[]> = this.colorsIn.asObservable();
  private resetObservable: Observable<boolean> = this.resetIn.asObservable();
  private schemeObservable: Observable<string> = this.schemeIn.asObservable();
  private colorAmountObservable: Observable<
    number
  > = this.colorAmount.asObservable();
  private primaryColorObservable: Observable<
    string
  > = this.primaryColor.asObservable();
  private secondaryColorObservable: Observable<
    string
  > = this.secondaryColor.asObservable();

  private currentDataObservable: Observable<
    string
  > = this.currentData.asObservable();
  private currentDataTitleObservable: Observable<
    string
  > = this.currentDataTitle.asObservable();

  private colorHistory = [];
  private historyLimit = 3;

  public backgroundSettings;

  constructor() {}

  setColorsObservable(colorScheme: string, colors: string[]) {
    this.addToColorHistory(colors);
    this.colorsIn.next(colors);
    this.schemeIn.next(colorScheme);
  }

  setColorsObservableSame(colors: string[]) {
    this.addToColorHistory(colors);
    this.colorsIn.next(colors);
  }

  setResetObservable() {
    this.resetIn.next(false);
  }

  setSchemeObservable(scheme: string) {
    this.schemeIn.next(scheme);
  }

  setColorAmountObservable(amount: number) {
    this.colorAmount.next(amount);
  }

  setPrimaryColorObservable(color: string) {
    this.primaryColor.next(color);
  }

  setSecondaryColorObservable(color: string) {
    this.secondaryColor.next(color);
  }

  setCurrentData(currentData: string) {
    this.currentData.next(currentData);
    //throw new Error('Method not implemented.');
  }
  setCurrentDataTitle(currentDataTitle: string) {
    this.currentDataTitle.next(currentDataTitle);
  }

  getColorsObservable() {
    return this.colorObservable;
  }

  getResetObservable() {
    return this.resetObservable;
  }

  getSchemeObservable() {
    return this.schemeObservable;
  }

  getColorAmountObservable() {
    return this.colorAmountObservable;
  }

  getPrimaryColorObservable() {
    return this.primaryColorObservable;
  }

  getSecondaryColorObservable() {
    return this.secondaryColorObservable;
  }

  getColorHistory() {
    return this.colorHistory;
  }

  getCurrentDataObservable() {
    return this.currentDataObservable;
  }

  getCurrentDataTitleObservable() {
    return this.currentDataTitleObservable;
  }

  addToColorHistory(colors) {
    if (this.colorHistory.length <= this.historyLimit) {
      this.colorHistory.push(colors);
    } else {
      this.colorHistory.shift();
      this.colorHistory.push(colors);
    }
  }

  getLastColors(): string[] {
    return this.colorsIn.getValue();
  }
}
