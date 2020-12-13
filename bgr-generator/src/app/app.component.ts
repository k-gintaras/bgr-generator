// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2

import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputsOutputsService } from './inputs-outputs.service';
import { MathfriendService } from './mathfriend.service';
import { ColorAveragerService } from './color-averager.service';
import { ColorSchemeSetsService } from './color-scheme-sets.service';
import * as chroma from 'chroma-js/chroma.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  canvas: HTMLCanvasElement;

  @Input() colorAmount = 5;
  @Input() colorArray = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];
  @Input() previousArray = [
    '#ffffff',
    '#ffffff',
    '#ffffff',
    '#ffffff',
    '#ffffff',
  ];

  @Input() isSticky = true;
  @Input() colorScheme = 'Palette Name';
  @Input() previousScheme = 'Previous Palette';
  @Input() currentDataTitle = 'Palette Text';
  @Input() currentData: string;
  @Input() currentDataArray: string[];
  paletteHeight: number;
  logoColors: string[];

  constructor(
    private snackBar: MatSnackBar,
    private ioService: InputsOutputsService,
    private mathFriend: MathfriendService,
    private colorAverager: ColorAveragerService,
    private presets: ColorSchemeSetsService
  ) {}

  ngOnInit() {
    this.ioService.getColorsObservable().subscribe((generatedColors) => {
      this.previousArray = this.mathFriend.copyArray(this.colorArray);
      if (generatedColors && generatedColors.length) {
        this.colorArray = generatedColors;
      }
    });
    this.ioService.getSchemeObservable().subscribe((scheme) => {
      this.previousScheme = this.colorScheme;
      this.colorScheme = scheme;
    });
    this.ioService.getCurrentDataObservable().subscribe((data) => {
      this.currentData = data;
      this.currentDataArray = this.currentData.split(', ');
    });
    this.ioService.getCurrentDataTitleObservable().subscribe((dataTitle) => {
      if (dataTitle.length > 1) {
        this.currentDataTitle = dataTitle;
      }
    });
    this.ioService.setColorAmountObservable(this.colorAmount);
    this.ioService.setPrimaryColorObservable(chroma.random().hex());
    this.ioService.setSecondaryColorObservable(chroma.random().hex());
    this.ioService.setColorsObservable('Palette Name', this.colorArray);
    this.ioService.setColorsObservable('Palette Name', this.colorArray);
    this.paletteHeight = Math.round(window.innerHeight / 10);

    this.animateLogo();
    this.feedback('Hey!');
  }

  animateLogo() {
    // for some reason interval and timer causes other components constantly refreshed
    const cubeHelixStart = 200;
    const cubeHelixRotations = -0.65;
    const cubeHelixGamma = 1;
    const cubeHelixHue = 1;
    const cubeHelixBrightness = 0.8;
    const cubeHelixContrast = 0.3;
    this.logoColors = this.presets.getCubeHelixColors(
      20,
      cubeHelixStart,
      cubeHelixRotations,
      cubeHelixGamma,
      cubeHelixHue,
      cubeHelixContrast,
      cubeHelixBrightness
    );
    // const source = interval(100);
    // const subscribe = source.subscribe((val) => {
    //   this.arrayRotate(this.logoColors, true);
    // });
    // timer(0, 100).subscribe(() => {
    //   this.arrayRotate(this.logoColors, true);
    // });
  }

  arrayRotate(arr, reverse) {
    if (reverse) {
      arr.unshift(arr.pop());
    } else {
      arr.push(arr.shift());
    }
    return arr;
  }

  activatePreviousPalette() {
    this.colorArray = this.mathFriend.copyArray(this.previousArray);
    this.colorScheme = this.previousScheme;

    this.ioService.setColorsObservable(this.colorScheme, this.colorArray);
  }

  activateMainPalette() {
    this.previousArray = this.mathFriend.copyArray(this.colorArray);
    this.previousScheme = this.colorScheme;
    this.ioService.setColorsObservable(this.colorScheme, this.colorArray);
  }

  onPrimaryColorPick(event) {
    this.ioService.setPrimaryColorObservable(event);
  }

  onSecondaryColorPick(event) {
    this.ioService.setSecondaryColorObservable(event);
  }

  onAmountColorPick() {
    this.ioService.setColorAmountObservable(this.colorAmount);
  }

  onResize() {
    if (window.innerWidth <= 500 * 3) {
      this.isSticky = false;
    } else {
      this.isSticky = true;
    }
  }

  shuffle() {
    this.colorArray = this.mathFriend.shuffle(this.colorArray);
  }

  sort() {
    this.colorArray = this.colorAverager.getSortedBySuperLab(
      this.colorArray,
      '#ffffff'
    );
    this.ioService.setColorsObservable(this.colorScheme, this.colorArray);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  trackByTitle(index: number, obj: any): any {
    return obj;
  }

  feedback(s) {
    this.snackBar.open(s, 'Close', {
      duration: 5000,
    });
  }
}
