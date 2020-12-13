// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses.
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
// colorlab, MIT

import { Injectable } from '@angular/core';
import * as chroma from 'chroma-js/chroma.js';
import colorlab from 'colorlab';

@Injectable({
  providedIn: 'root',
})
export class ColorAveragerService {
  constructor() {}
  colorModes: string[] = ['rgb', 'hsl', 'lab', 'lch', 'lrgb'];

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageColorsBySuperLabMedium(
    colorArray: any[],
    colorAmount: number,
    brightness: number,
    maxBrightness: number,
    sortingColor: string
  ): string[] {
    const sorted = this.getChromaSortedBySuperLab(colorArray, sortingColor);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);

    const averagedColors = this.getPicksFromDiscretized(
      discretizedColors,
      brightness,
      maxBrightness
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv', '#ffffff')
  getAverageColorsBySuperLabSaturation(
    colorArray: any[],
    colorAmount: number,
    brightness: number,
    maxBrightness: number,
    mode: string,
    sortingColor: string
  ): string[] {
    const sorted = this.getChromaSortedBySuperLab(colorArray, sortingColor);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedBySaturation(
      discretizedColors,
      brightness,
      maxBrightness,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv', '#ffffff')
  getAverageColorsBySuperLabHue(
    colorArray: any[],
    colorAmount: number,
    brightness: number,
    maxBrightness: number,
    mode: string,
    sortingColor: string
  ): string[] {
    const sorted = this.getChromaSortedBySuperLab(colorArray, sortingColor);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedByHue(
      discretizedColors,
      brightness,
      maxBrightness,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv', '#ffffff')
  getAverageColorsBySuperLabLightness(
    colorArray: any[],
    colorAmount: number,
    brightness: number,
    maxBrightness: number,
    mode: string,
    sortingColor: string
  ): string[] {
    const sorted = this.getChromaSortedBySuperLab(colorArray, '#ffffff');
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedBySuperLab(
      discretizedColors,
      brightness,
      maxBrightness,
      mode,
      sortingColor
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv', '#ffffff')
  getAverageColorsBySuperLabLab(
    colorArray: any[],
    colorAmount: number,
    brightness: number,
    maxBrightness: number,
    mode: string,
    sortingColor: string
  ): string[] {
    const sorted = this.getChromaSortedBySuperLab(colorArray, '#ffffff');
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedBySuperLab(
      discretizedColors,
      brightness,
      maxBrightness,
      mode,
      sortingColor
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageColorsByHueLightness(
    colorArray: any[],
    colorAmount: number,
    brightness: number,
    maxBrightness: number,
    mode: string
  ) {
    const sorted = this.getSortedByHue(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedBySaturation(
      discretizedColors,
      brightness,
      maxBrightness,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageHueSaturationColors(
    colorArray: any[],
    colorAmount: number,
    whichBin: number,
    amountOfBins: number,
    mode: string
  ) {
    const sorted = this.getChromaSortedByHue(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedBySaturation(
      discretizedColors,
      whichBin,
      amountOfBins,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageHueLightnessColors(
    colorArray: any[],
    colorAmount: number,
    whichBin: number,
    amountOfBins: number,
    mode: string
  ) {
    const sorted = this.getChromaSortedByHue(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedByLightness(
      discretizedColors,
      whichBin,
      amountOfBins,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageHueHueColors(
    colorArray: any[],
    colorAmount: number,
    whichBin: number,
    amountOfBins: number,
    mode: string
  ) {
    const sorted = this.getChromaSortedByHue(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedByHue(
      discretizedColors,
      whichBin,
      amountOfBins,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageSaturationHueColors(
    colorArray: any[],
    colorAmount: number,
    whichBin: number,
    amountOfBins: number,
    mode: string
  ) {
    const sorted = this.getChromaSortedBySaturation(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedByHue(
      discretizedColors,
      whichBin,
      amountOfBins,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageSaturationLightnessColors(
    colorArray: any[],
    colorAmount: number,
    whichBin: number,
    amountOfBins: number,
    mode: string
  ) {
    const sorted = this.getChromaSortedBySaturation(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedByLightness(
      discretizedColors,
      whichBin,
      amountOfBins,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageSaturationSaturationColors(
    colorArray: any[],
    colorAmount: number,
    whichBin: number,
    amountOfBins: number,
    mode: string
  ) {
    const sorted = this.getChromaSortedBySaturation(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedBySaturation(
      discretizedColors,
      whichBin,
      amountOfBins,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageLightnessSaturationColors(
    colorArray: any[],
    colorAmount: number,
    whichBin: number,
    amountOfBins: number,
    mode: string
  ) {
    const sorted = this.getChromaSortedByLightness(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedBySaturation(
      discretizedColors,
      whichBin,
      amountOfBins,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageLightnessHueColors(
    colorArray: any[],
    colorAmount: number,
    whichBin: number,
    amountOfBins: number,
    mode: string
  ) {
    const sorted = this.getChromaSortedByLightness(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedByHue(
      discretizedColors,
      whichBin,
      amountOfBins,
      mode
    );
    return averagedColors;
  }

  // default(['#aaaaaa', '#bbbbbb', '#cccccc'], 5, 0, 3, 'hsv')
  getAverageLightnessLightnessColors(
    colorArray: any[],
    colorAmount: number,
    whichBin: number,
    amountOfBins: number,
    mode: string
  ) {
    const sorted = this.getChromaSortedByLightness(colorArray);
    const discretizedColors = this.getDiscretizedMatrix(sorted, colorAmount);
    const averagedColors = this.getAveragedByLightness(
      discretizedColors,
      whichBin,
      amountOfBins,
      mode
    );
    return averagedColors;
  }

  // default([['#aaaaaa', '#bbbbbb', '#cccccc'], ['#aaaaaa', '#bbbbbb', '#cccccc']], 0, 3, 'hsv')
  getAveragedBySaturation(
    discretizedColors: any[][],
    whichBin: number,
    amountOfBins: number,
    averagingMode: string
  ): string[] {
    const averagedColors = [];
    for (const colorSet of discretizedColors) {
      const brightnessSort = this.getChromaSortedBySaturation(colorSet);
      const lightnessMedium = this.getDiscretizedMatrix(
        brightnessSort,
        amountOfBins
      )[whichBin];
      const col = chroma.average(lightnessMedium, averagingMode);
      averagedColors.push(col.hex());
    }
    return averagedColors;
  }

  // default([['#aaaaaa', '#bbbbbb', '#cccccc'], ['#aaaaaa', '#bbbbbb', '#cccccc']], 0, 3, 'hsv')
  getAveragedByLightness(
    discretizedColors: any[][],
    whichBin: number,
    amountOfBins: number,
    averagingMode: string
  ): string[] {
    const averagedColors = [];
    for (const colorSet of discretizedColors) {
      const brightnessSort = this.getChromaSortedByLightness(colorSet);
      const lightnessMedium = this.getDiscretizedMatrix(
        brightnessSort,
        amountOfBins
      )[whichBin];
      const col = chroma.average(lightnessMedium, averagingMode);
      averagedColors.push(col.hex());
    }
    return averagedColors;
  }

  // default([['#aaaaaa', '#bbbbbb', '#cccccc'], ['#aaaaaa', '#bbbbbb', '#cccccc']], 0, 3, 'hsv')
  getAveragedBySuperLab(
    discretizedColors: any[][],
    whichBin: number,
    amountOfBins: number,
    averagingMode: string,
    sortingColor: string
  ): string[] {
    const averagedColors = [];
    for (const colorSet of discretizedColors) {
      const brightnessSort = this.getChromaSortedBySuperLab(
        colorSet,
        sortingColor
      );
      const lightnessMedium = this.getDiscretizedMatrix(
        brightnessSort,
        amountOfBins
      )[whichBin];
      const col = chroma.average(lightnessMedium, averagingMode);
      averagedColors.push(col.hex());
    }
    return averagedColors;
  }

  // default([['#aaaaaa', '#bbbbbb', '#cccccc'], ['#aaaaaa', '#bbbbbb', '#cccccc']], 0, 3, 'hsv')
  getAveragedByHue(
    discretizedColors: any[][],
    whichBin: number,
    amountOfBins: number,
    averagingMode: string
  ): string[] {
    const averagedColors = [];
    for (const colorSet of discretizedColors) {
      const brightnessSort = this.getChromaSortedByHue(colorSet);
      const lightnessMedium = this.getDiscretizedMatrix(
        brightnessSort,
        amountOfBins
      )[whichBin];
      const col = chroma.average(lightnessMedium, averagingMode);
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
      cols.push(chr.hex());
    }
    return cols;
  }

  getSortedBySuperLab(cols: string[], sortingColor: string): string[] {
    return this.getFromChromaJsColors(
      this.getChromaSortedBySuperLab(
        this.getToChromaJsColors(cols),
        sortingColor
      )
    );
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

  getSortedByLabLightness(cols: string[]): string[] {
    return this.getFromChromaJsColors(
      this.getChromaSortedByLabLightness(this.getToChromaJsColors(cols))
    );
  }

  getChromaSortedBy(colorArray: string[], sortBy: string): string[] {
    return colorArray.sort((a: any, b: any) =>
      a.get(sortBy) > b.get(sortBy) ? -1 : 1
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

  getChromaSortedBySuperLabWhite(colors: any[]): any[] {
    return this.getChromaSortedBySuperLab(colors, '#ffffff');
  }

  getChromaSortedBySuperLab(colors: any[], compareColor: string): any[] {
    const cfrom = chroma(compareColor);
    return colors.sort((a: any, b: any) => {
      const l1 = a.lab();
      const l2 = b.lab();
      const l3 = cfrom.lab();
      const c1 = new colorlab.CIELAB(l1[0], l1[1], l1[2]);
      const c2 = new colorlab.CIELAB(l2[0], l2[1], l2[2]);
      const c3 = new colorlab.CIELAB(l3[0], l3[1], l3[2]);
      const d1 = c3.CIEDE2000(c1);
      const d2 = c3.CIEDE2000(c2);

      return d1 > d2 ? -1 : 1;
    });
  }

  getChromaSortedByLabLightness(colors: any[]): any[] {
    return colors.sort((a: any, b: any) => {
      return a.lab()[0] > b.lab()[0] ? -1 : 1;
    });
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

  getPicksFromDiscretized(
    discretizedColors: any[][],
    whichBin: number,
    amountOfBins: number
  ): string[] {
    const averagedColors = [];
    for (const colorSet of discretizedColors) {
      const brightnessSort = this.getChromaSortedBySaturation(colorSet);
      const lightnessMedium = this.getDiscretizedMatrix(
        brightnessSort,
        amountOfBins
      )[whichBin];
      const col = lightnessMedium[0];
      averagedColors.push(col.hex());
    }
    return averagedColors;
  }

  getCopy(arr: any[]): any[] {
    const copy = [];
    for (const i of arr) {
      copy.push(i);
    }
    return copy;
  }
}
