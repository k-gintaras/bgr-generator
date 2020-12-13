// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses.
// TinyColor, MIT
//
// inspired by @brehaut's color.js
// https://raw.githubusercontent.com/brehaut/color-js/master/color.js
// https://github.com/brehaut/color-js
//
// thanks for formulas generated using
// http://www.electrictactics.com/poly/polyin.html

import { Injectable } from '@angular/core';
import * as tinycolor from 'tinycolor2/tinycolor.js';

@Injectable({
  providedIn: 'root',
})
export class ColorAnglerService {
  currentColorHex: string;
  private complementAngle = 180;
  private splitComplementAngle = 150;
  private triadAngle = 120;
  private tetradAngle = 90;
  private hexadAngle = 60;
  private octadAngle = 45;
  private teradAngle = 30;
  private yottadAngle = 15;
  private equiAngle = 5;
  private flowerAngles = [0, 240, 150];
  private duoAngles = [0, 20, 45, 110, 115];
  private bouquetAngles = [0, 350, 350, 315, 90];

  constructor() {}
  // constructor(private mathFriend: MathfriendService) {}

  getHueFlower(colorHex: string): string[] {
    const cols = this.getColorsByHueAngles(colorHex, this.flowerAngles);
    const col1 = cols[0];
    const col2 = tinycolor(cols[1]).saturate(30).darken(35).toString();
    const col3 = tinycolor(cols[2]).saturate(50).lighten(10).toString();
    const col4 = tinycolor(cols[0]).desaturate(20).lighten(30).toString();
    const col5 = tinycolor(cols[2]).desaturate(10).lighten(10).toString();
    return [col1, col2, col3, col4, col5];
  }

  getHueDuo(colorHex: string): string[] {
    const cols = this.getColorsByHueAngles(colorHex, this.duoAngles);
    const col1 = cols[0];
    const col2 = tinycolor(cols[1]).desaturate(10).darken(5).toString();
    const col3 = tinycolor(cols[2]).desaturate(40).darken(30).toString();
    const col4 = tinycolor(cols[3]).saturate(15).darken(40).toString();
    const col5 = tinycolor(cols[4]).saturate(5).darken(5).toString();
    return [col1, col2, col3, col4, col5];
  }

  getHueBouquet(colorHex: string): string[] {
    const cols = this.getColorsByHueAngles(colorHex, this.bouquetAngles);
    const col1 = cols[0];
    const col2 = tinycolor(cols[1]).lighten(20).toString();
    const col3 = tinycolor(cols[2]).lighten(10).toString();
    const col4 = tinycolor(cols[3]).desaturate(5).lighten(25).toString();
    const col5 = tinycolor(cols[4]).desaturate(25).darken(15).toString();
    return [col1, col2, col3, col4, col5];
  }

  getHueSplitComplementA(colorHex: string, amount: number): string[] {
    const preset = [0, 150, 320];
    // y = -5 x2 +125 x -120

    if (amount === preset.length) {
      return this.getColorsByHueAngles(colorHex, preset);
    }
    if (amount < preset.length) {
      return this.getColorsByHueAngles(colorHex, preset).slice(0, amount);
    }
    const colors = [];
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateSplitComplementA(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateSplitComplementB(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateSplitComplementC(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateFourToneA(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateFourToneB(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateFourToneB(x: number): number {
    return 20 * (x * x * x) - 150 * (x * x) + 430 * x - 300;
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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateFiveToneA(x);
      y = Math.abs(Math.round(y));
      if (y > 360) {
        y = y % 360;
      }

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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateFiveToneB(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

      const c = tinycolor(colorHex).spin(y).toString();
      colors.push(c);
    }
    return colors;
  }
  calculateFiveToneB(x: number): number {
    return (
      (35 / 8) * (x * x * x * x) -
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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateFiveToneC(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateFiveToneD(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateFiveToneE(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateSixToneA(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

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
    for (let x = 1; x <= amount; x++) {
      let y = this.calculateSixToneB(x);
      y = Math.abs(Math.round(y));

      if (y > 360) {
        y = y % 360;
      }

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
}
