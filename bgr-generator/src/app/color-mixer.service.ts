// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses.
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
import { Injectable } from '@angular/core';
import * as chroma from 'chroma-js/chroma.js';

@Injectable({
  providedIn: 'root',
})
export class ColorMixerService {
  constructor() {}

  colorMode = 'hsl'; // 'lch', hsl brighter colors
  colorModes = ['rgb', 'lrgb', 'hsl', 'lch', 'lab', 'cmyk'];

  mixingTechnique = [
    'mix',
    'average',
    'multiply',
    'darken',
    'lighten',
    'screen',
    'overlay',
    'burn',
    'dodge',
  ];
  blendTypes = [
    'multiply',
    'darken',
    'lighten',
    'screen',
    'overlay',
    'burn',
    'dodge',
  ];

  generateScaleColors(
    color1: string,
    color2: string,
    mode: string,
    colorCount: number
  ): string[] {
    const generated = chroma
      .scale([color1, color2])
      .mode(mode)
      .colors(colorCount);
    return generated;
  }

  generateBezierColors(
    color1: string,
    color2: string,
    colorCount: number
  ): string[] {
    const generated = chroma
      .bezier([color1, color2])
      .scale()
      .colors(colorCount);
    return generated;
  }

  mixColors(
    color1: string,
    color2: string,
    mode: string,
    mixingTechnique: string
  ): string[] {
    switch (mixingTechnique) {
      case 'mix':
        return chroma.mix(color1, color2, 0.5, mode).hex();
      case 'average':
        return chroma.average([color1, color2], mode).hex();
      default:
        // blend
        return chroma.blend(color1, color2, mixingTechnique).hex();
    }
  }

  mixArray(colorArr: string[], mode, mixingTechnique, distance) {
    if (colorArr.length > 1) {
      const result = [];
      for (let i = 0; i < colorArr.length; i++) {
        const colorHex = colorArr[i];
        if (i < colorArr.length - distance) {
          const colorNeighbour = colorArr[i + distance];
          const mixed = this.mixColors(
            colorHex,
            colorNeighbour,
            mode,
            mixingTechnique
          );
          result.push(mixed);
        }
      }
      return result;
    } else {
      return colorArr;
    }
  }

  mixArrayOpposites(colorArr: string[], mode, mixingTechnique) {
    if (colorArr.length > 1) {
      const result = [];
      for (let i = 0; i < colorArr.length; i++) {
        const colorHex = colorArr[i];
        if (i < Math.floor(colorArr.length / 2)) {
          const colorNeighbour = colorArr[colorArr.length - 1 - i];
          const mixed = this.mixColors(
            colorHex,
            colorNeighbour,
            mode,
            mixingTechnique
          );
          result.push(mixed);
        }
      }
      return result;
    } else {
      return colorArr;
    }
  }
}
