// Copyright: 2020, https://github.com/k-gintaras
// License MIT

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

// TODO: promise and img useful stuff
//  let promise = new Promise((resolve, reject) => {
// do stuff
//          resolve(string); // result
// if fails
//          reject(string); // error
//       });
//     });
//     return promise;
//  returnedResult.then((result) => {
//     // do stuff
//   });

// this.img.crossOrigin = 'Anonymous'; // for some reason it fixes color thief destroying loaded image colors

// normalize guide available at normalize function
export class MathfriendService {
  GOLDEN_RATIO_PHI = 1.6180339887498948482045868343656381177203091798057628621354486227052604628189;
  GOLDEN_RATIO_1PHI = 0.6180339887498948482045868343656381177203091798057628621354486227052604628189;
  GOLDEN_ANGLE = 2.39996322972865332;
  PI = 3.1415926535897932384626433832795028841971693993751;
  58209749445923078164062862089986280348253421170679;
  TAU = 2 * this.PI;
  E = 2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274;

  GOLDEN_ANGLE_PRECISE = this.normalizeConstant(
    this.GOLDEN_RATIO_PHI,
    0,
    this.TAU
  );
  E_ANGLE_PRECISE = this.normalizeConstant(this.E, 0, this.TAU);
  // GOLDEN_ANGLE_PRECISE = this.normalize(
  //   1 - this.GOLDEN_RATIO_1PHI,
  //   0,
  //   1,
  //   0,
  //   this.TAU
  // );
  constructor() {}
  // setTimeout( () => { /*Your Code*/ }, Milliseconds );

  getRadiansToDegrees(radians) {
    return radians * (180 / this.PI);
  }
  getDegreesToRadians(degrees) {
    return degrees * (this.PI / 180);
  }

  copyArray(arr: string[]): string[] {
    const copy = [];
    for (const c of arr) {
      copy.push(c);
    }
    return copy;
  }

  // normalize when not clear of min max: use number 1/constant and also may need to use  1-constant as min
  // normalize(num, 1-1/above 1 constant, 0, 1, newMin, newMax)
  // for example constant is 1.61, you want to get 1/x version of it so it is like 0.61 something...
  // then you want to get smaller one 1- 0.61, to get min.
  normalize(
    num: number,
    min: number,
    max: number,
    newMin: number,
    newMax: number
  ): number {
    return ((num - min) / (max - min)) * (newMax - newMin) + newMin;
  }

  // i.e. 1.6 golden ratio to radians
  normalizeConstant(num: number, newMin: number, newMax: number): number {
    const newNum = 1 / num;
    const min = 1 - newNum;
    return ((newNum - min) / (1 - min)) * (newMax - newMin) + newMin;
  }

  getDiscretizedMatrix(arr: any[], pieces: number): any[][] {
    const discretized = [];
    const arraySize = arr.length;
    const remainder = arraySize % pieces;
    const otherChunks = (arraySize - remainder) / pieces;
    let p1 = 0;
    let p2 = otherChunks;

    for (let i = 0; i < pieces; i++) {
      // last chunk must include remainder length
      if (i < pieces - 1) {
        discretized.push(this.copyRange(arr, p1, p2));
        p1 += otherChunks;
        p2 += otherChunks;
      } else {
        discretized.push(this.copyRange(arr, p1, p2 + remainder));
      }
    }

    return discretized;
  }

  copyRange(arr: any[], a: number, b: number): any[] {
    const copy = [];
    for (let i = a; i < b; i++) {
      copy.push(arr[i]);
    }

    return copy;
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

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // max exclusive min inclusive
  }

  getRandomLimited(min: number, max: number): number {
    return Math.random() * (max - min) + min; // max exclusive min inclusive
  }

  getRectangleCenter(x, y, w, h) {
    return [w + x - w / 2, h + y - h / 2];
  }

  getRotatedAround(
    aroundX: number,
    aroundY: number,
    whatX: number,
    whatY: number,
    angle: number,
    isClockWise: boolean
  ): number[] {
    let clockWise = -1;
    if (isClockWise) {
      clockWise = 1;
    }

    const phi = clockWise * angle;

    return [
      Math.cos(phi) * (whatX - aroundX) -
        Math.sin(phi) * (whatY - aroundY) +
        aroundX,
      Math.sin(phi) * (whatX - aroundX) +
        Math.cos(phi) * (whatY - aroundY) +
        aroundY,
    ];
  }

  getRotatedArray(arr, reverse) {
    if (reverse) {
      arr.unshift(arr.pop());
    } else {
      arr.push(arr.shift());
    }
    return arr;
  }

  getMovedInLine(x, y, angle, howFarMultiplier) {
    return [
      x + Math.cos(angle) * howFarMultiplier,
      y + Math.sin(angle) * howFarMultiplier,
    ];
  }

  getDistance(x1, y1, x2, y2) {
    const x = x1 - x2;
    const y = y1 - y2;

    return Math.sqrt(x * x + y * y);
  }

  getAngle(x1, y1, x2, y2) {
    const x = x1 - x2;

    const y = y1 - y2;

    let radians = Math.atan2(y, x);

    if (radians <= 0) {
      radians = radians + Math.PI * 2;
    } // when it is negative, means on the opposite side, therefore add radian

    return radians;
  }

  getAcceleratedDistance(initialSpeed, time, acceleration) {
    return initialSpeed * time + (1 / 2) * (acceleration * (time * time));
  }

  isArraysEqual(a1, a2) {
    return JSON.stringify(a1) === JSON.stringify(a2);
  }

  getAspectRatioFit(w, h, toWidth, toHeight) {
    const ratio = Math.min(toWidth / w, toHeight / h);

    return { width: w * ratio, height: h * ratio };
  }
}
