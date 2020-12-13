// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below
// TinyColor, MIT
// color-js, BSD 2
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
//
// inspired by @brehaut's color.js
// https://raw.githubusercontent.com/brehaut/color-js/master/color.js
//
// thanks for formulas generated using
// http://www.electrictactics.com/poly/polyin.html


import { Injectable } from '@angular/core';
import * as tinycolor from 'tinycolor2/tinycolor.js';
import * as chroma from 'chroma-js/chroma.js';
import { MathfriendService } from './mathfriend.service';

@Injectable({
  providedIn: 'root',
})
export class ColoratorService {
  currentColorHex: string;
  // private fourToneCWAngles: number[] = [0, 60, 180, 240];
  // private fourToneCCWAngles: number[] = [0, 120, 180, 300];
  // private fiveToneAAngles: number[] = [0, 115, 155, 205, 245];
  // private fiveToneBAngles: number[] = [0, 40, 90, 130, 245];
  // private fiveToneCAngles: number[] = [0, 50, 90, 205, 320];
  // private fiveToneDAngles: number[] = [0, 40, 155, 270, 310];
  // private fiveToneEAngles: number[] = [0, 115, 230, 270, 320];
  // private sixToneCWAngles: number[] = [0, 30, 120, 150, 240, 270];
  // private sixToneCCWAngles: number[] = [0, 90, 120, 210, 240, 330];

  private complementAngle = 180;
  private splitComplementAngle = 150;
  private triadAngle = 120;
  private tetradAngle = 90;
  private hexadAngle = 60;
  private octadAngle = 45;
  private teradAngle = 30;
  private yottadAngle = 15;
  private equiAngle = 5;

  constructor(private mathFriend: MathfriendService) {}

  getAllDarkened(colors: string[]): string[] {
    const cols = [];
    for (const c of colors) {
      const col = chroma(c).darken();
      cols.push(col.hex());
    }
    return cols;
  }

  getAllLightened(colors: string[]): string[] {
    const cols = [];
    for (const c of colors) {
      const col = chroma(c).brighten();
      cols.push(col.hex());
    }
    return cols;
  }

  getAllSaturated(colors: string[]): string[] {
    const cols = [];
    for (const c of colors) {
      const col = chroma(c).saturate();
      cols.push(col.hex());
    }
    return cols;
  }

  getAllDeSaturated(colors: string[]): string[] {
    const cols = [];
    for (const c of colors) {
      const col = chroma(c).desaturate();
      cols.push(col.hex());
    }
    return cols;
  }

  shuffle(array: any[]): any[] {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      const index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      const temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  getRandomArrayItem(arr: any[]): any {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  getHueSplitComplementA(colorHex: string, amount: number): string[] {
    const preset = [0, 150, 320];
    // y = +10 x2 +120 x -130

    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateSplitComplementA(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }

  calculateSplitComplementA(x: number): number {
    return 10 * (x * x) + 120 * x - 130;
  }

  getHueSplitComplementB(colorHex: string, amount: number): string[] {
    const preset = [0, 60, 210];
    // y = +45 x2 -75 x +30
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateSplitComplementB(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateSplitComplementB(x: number): number {
    return 45 * (x * x) - 75 * x + 30;
  }

  getHueSplitComplementC(colorHex: string, amount: number): string[] {
    const preset = [0, 90, 270];
    // y = +45 x2 -45 x
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateSplitComplementC(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateSplitComplementC(x: number): number {
    return 45 * (x * x) - 45 * x;
  }

  getHueFourToneA(colorHex: string, amount: number): string[] {
    const preset = [0, 60, 180, 240];
    // y = -20 x3 +150 x2 -250 x +120
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateFourToneA(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateFourToneA(x: number): number {
    return -20 * (x * x * x) + 150 * (x * x) - 250 * x + 120;
  }

  getHueFourToneB(colorHex: string, amount: number): string[] {
    const preset = [0, 120, 180, 300];
    // y = +20 x3 -150 x2 +430 x -300
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateFourToneB(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateFourToneB(x: number): number {
    return 20 * (x * x * x) + 150 * (x * x) + 430 * x - 300;
  }

  getHueFiveToneA(colorHex: string, amount: number): string[] {
    const preset = [0, 115, 155, 205, 245];
    // y = -35/8 x4 +695/12 x3 -2205/8 x2 +7225/12 x -380
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateFiveToneA(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateFiveToneA(x: number): number {
    return (
      (-35 / 8) * (x * x * x * x) +
      (695 / 12) * (x * x * x) -
      (2205 / 8) * (x * x) +
      (7225 / 12) * x -
      380
    );
  }

  getHueFiveToneB(colorHex: string, amount: number): string[] {
    const preset = [0, 40, 90, 130, 245];
    // y = +35/8 x4 -565/12 x3 +1425/8 x2 -2765/12 x +95
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateFiveToneB(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateFiveToneB(x: number): number {
    return (
      (-35 / 8) * (x * x * x * x) -
      (565 / 12) * (x * x * x) +
      (1425 / 8) * (x * x) -
      (2765 / 12) * x +
      95
    );
  }

  getHueFiveToneC(colorHex: string, amount: number): string[] {
    const preset = [0, 50, 90, 205, 320];
    // y = -20/3 x4 +485/6 x3 -970/3 x2 +3325/6 x -305
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateFiveToneC(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateFiveToneC(x: number): number {
    return (
      (-20 / 3) * (x * x * x * x) +
      (485 / 6) * (x * x * x) -
      (970 / 3) * (x * x) +
      (3325 / 6) * x -
      305
    );
  }

  getHueFiveToneD(colorHex: string, amount: number): string[] {
    const preset = [0, 40, 155, 270, 310];
    // y = -25/2 x3 +225/2 x2 -210 x +110
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateFiveToneD(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateFiveToneD(x: number): number {
    return (-25 / 2) * (x * x * x) + (225 / 2) * (x * x) - 210 * x + 110;
  }
  getHueFiveToneE(colorHex: string, amount: number): string[] {
    const preset = [0, 115, 230, 270, 320];
    // y = +20/3 x4 -475/6 x3 +925/3 x2 -2135/6 x +120
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateFiveToneE(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateFiveToneE(x: number): number {
    return (
      (20 / 3) * (x * x * x * x) -
      (475 / 6) * (x * x * x) +
      (925 / 3) * (x * x) -
      (2135 / 6) * x +
      120
    );
  }

  getHueSixToneA(colorHex: string, amount: number): string[] {
    const preset = [0, 30, 120, 150, 240, 270];
    // y = -4 x5 +70 x4 -460 x3 +1400 x2 -1876 x +870
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateSixToneA(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateSixToneA(x: number): number {
    return (
      -4 * (x * x * x * x * x) +
      70 * (x * x * x * x) -
      460 * (x * x * x) +
      1400 * (x * x) -
      1876 * x +
      870
    );
  }
  getHueSixToneB(colorHex: string, amount: number): string[] {
    const preset = [0, 90, 120, 210, 240, 330];
    // y = +4 x5 -70 x4 +460 x3 -1400 x2 +1996 x -990
    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 0; x < amount; x++) {
      const y = this.calculateSixToneB(x);
      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateSixToneB(x: number) {
    return (
      4 * (x * x * x * x * x) -
      70 * (x * x * x * x) +
      460 * (x * x * x) -
      1400 * (x * x) +
      1996 * x -
      990
    );
  }

  getHueComplement(colorHex: string): string {
    return tinycolor(colorHex).spin(this.complementAngle).toString();
  }
  getHueSplitComplement(colorHex: string): string {
    return tinycolor(colorHex).spin(this.splitComplementAngle).toString();
  }
  getHueMonoChromatic(colorHex: string, amount: number): string[] {
    return this.getColorsByHueAngle(colorHex, this.equiAngle, amount);
  }
  getHueAnalogous(colorHex: string, amount: number): string[] {
    return this.getColorsByHueAngle(colorHex, this.teradAngle, amount);
  }
  getHueNeutral(colorHex: string, amount: number): string[] {
    return this.getColorsByHueAngle(colorHex, this.yottadAngle, amount);
  }
  getHueOctad(colorHex: string, amount: number): string[] {
    return this.getColorsByHueAngle(colorHex, this.octadAngle, amount);
  }
  getHueHexad(colorHex: string, amount: number): string[] {
    return this.getColorsByHueAngle(colorHex, this.hexadAngle, amount);
  }
  getHueTetrad(colorHex: string, amount: number): string[] {
    return this.getColorsByHueAngle(colorHex, this.tetradAngle, amount);
  }
  getHueTriad(colorHex: string, amount: number): string[] {
    return this.getColorsByHueAngle(colorHex, this.triadAngle, amount);
  }

  getColorsByHueAngle(
    colorHex: string,
    angle: number,
    amount: number
  ): string[] {
    const colors: string[] = [];
    let a = 0;
    for (let i = 0; i < amount; i++) {
      const c = tinycolor(colorHex).spin(a).toString();
      colors.push(c);
      a += angle;
    }
    return colors;
  }

  getColorsByHueAngles(colorHex: string, angles: number[]): string[] {
    const colors: string[] = [];
    for (const angle of angles) {
      const c = tinycolor(colorHex).spin(angle).toString();
      colors.push(c);
    }
    return colors;
  }

  getTextColor(colors: string[]): string {
    return tinycolor.mostReadable(colors[0], colors);
  }

  getColorArrayFromCanvas(canvas, skipPixels: number) {
    const imageData = canvas
      .getContext('2d')
      .getImageData(0, 0, canvas.width, canvas.height);
    const colorArray = this.getColorsFromImageData(imageData, skipPixels);
  }

  getColorsFromImageData(imageData, skipPixels: number): any[] {
    const colors = [];
    for (let i = 0; i < imageData.data.length; i += 4 * skipPixels) {
      const red = imageData.data[i];
      const green = imageData.data[i + 1];
      const blue = imageData.data[i + 2];
      // const alpha = imageData.data[i + 3]; chroma does not like alpha added
      const col = [red, green, blue];
      const chromaColor = chroma(col);
      colors.push(chromaColor);
    }
    return colors;
  }

  getAverageColorsByHueLightness(
    colorArray: any[],
    colorAmount: number,
    brightness: number,
    maxBrightness: number
  ) {
    const sorted = this.getSortedByHue(colorArray);
    const discretizedColors = this.mathFriend.getDiscretizedMatrix(
      sorted,
      colorAmount
    );
    const averagedColors = this.getAveragedBySaturation(
      discretizedColors,
      brightness,
      maxBrightness
    );
    return averagedColors;
  }

  // brightness 0-maxBrightness
  getAverageHueSaturationColors(
    colorArray: any[],
    colorAmount: number,
    brightness: number,
    maxBrightness: number
  ) {
    const sorted = this.getChromaSortedByHue(colorArray);
    const discretizedColors = this.mathFriend.getDiscretizedMatrix(
      sorted,
      colorAmount
    );
    const averagedColors = this.getAveragedBySaturation(
      discretizedColors,
      brightness,
      maxBrightness
    );
    return averagedColors;
  }

  getAveragedBySaturation(
    discretizedColors: any[][],
    whichBin: number,
    amountOfBins: number
  ): string[] {
    const averagedColors = [];
    for (const colorSet of discretizedColors) {
      const brightnessSort = this.getChromaSortedBySaturation(colorSet);
      const lightnessMedium = this.mathFriend.getDiscretizedMatrix(
        brightnessSort,
        amountOfBins
      )[whichBin];
      const col = chroma.average(lightnessMedium, 'hsl');
      averagedColors.push(col.hex());
    }
    return averagedColors;
  }

  getAveragedByLightness(
    discretizedColors: any[][],
    whichBin: number,
    amountOfBins: number
  ): string[] {
    const averagedColors = [];
    for (const colorSet of discretizedColors) {
      const brightnessSort = this.getChromaSortedByLightness(colorSet);
      const lightnessMedium = this.mathFriend.getDiscretizedMatrix(
        brightnessSort,
        amountOfBins
      )[whichBin];
      const col = chroma.average(lightnessMedium, 'hsl');
      averagedColors.push(col.hex());
    }
    return averagedColors;
  }

  getAveragedByHue(
    discretizedColors: any[][],
    whichBin: number,
    amountOfBins: number
  ): string[] {
    const averagedColors = [];
    for (const colorSet of discretizedColors) {
      const brightnessSort = this.getChromaSortedByHue(colorSet);
      const lightnessMedium = this.mathFriend.getDiscretizedMatrix(
        brightnessSort,
        amountOfBins
      )[whichBin];
      const col = chroma.average(lightnessMedium, 'hsl');
      averagedColors.push(col.hex());
    }
    return averagedColors;
  }

  getToChromaJsColors(colorHexArr: string[]): any[] {
    const cols = [];
    for (const hex of colorHexArr) {
      cols.push(chroma(hex));
    }
    return cols;
  }

  getFromChromaJsColors(chromaArr: any[]): string[] {
    const cols = [];
    for (const chr of chromaArr) {
      cols.push(chroma(chr.toHex()));
    }
    return cols;
  }

  getSortedByHue(cols: string[]): string[] {
    return this.getFromChromaJsColors(
      this.getChromaSortedByHue(this.getToChromaJsColors(cols))
    );
  }

  getSortedBySaturation(cols: string[]): string[] {
    return this.getFromChromaJsColors(
      this.getChromaSortedBySaturation(this.getToChromaJsColors(cols))
    );
  }

  getSortedByLightness(cols: string[]): string[] {
    return this.getFromChromaJsColors(
      this.getChromaSortedByLightness(this.getToChromaJsColors(cols))
    );
  }

  getChromaSortedByHue(colorArray: any[]): any[] {
    return colorArray.sort((a: any, b: any) =>
      a.get('hsl.h') > b.get('hsl.h') ? -1 : 1
    );
  }

  getChromaSortedBySaturation(colorArray: any[]): any[] {
    return colorArray.sort((a: any, b: any) =>
      a.get('hsl.s') > b.get('hsl.s') ? -1 : 1
    );
  }

  getChromaSortedByLightness(colorArray: any[]): any[] {
    return colorArray.sort((a: any, b: any) =>
      a.get('hsl.l') > b.get('hsl.l') ? -1 : 1
    );
  }
}
