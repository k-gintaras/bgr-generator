// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses.
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
// d3, BSD 3

import { Injectable } from '@angular/core';
import * as chroma from 'chroma-js/chroma.js';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root',
})
export class ColorInterpolatorService {
  interpolatorTypes = [
    'Rgb',
    'Hue',
    'Hsl',
    'HslLong',
    'Lab',
    'Hcl',
    'HclLong',
    'Cubehelix',
    'CubehelixLong',
  ];
  constructor() {}

  getInterpolatorTypes() {
    return this.interpolatorTypes;
  }

  getInterpolated(color1, color2, colorCount, interpolatorType) {
    let interpolator = d3.interpolateRgb(color1, color2);
    switch (interpolatorType) {
      case this.interpolatorTypes[0]:
        interpolator = d3.interpolateRgb(color1, color2);
        return this.interpolated(colorCount, interpolator);
      case this.interpolatorTypes[1]:
        interpolator = d3.interpolateHsl(color1, color2);
        return this.interpolated(colorCount, interpolator);
      case this.interpolatorTypes[2]:
        interpolator = d3.interpolateHsl(color1, color2);
        return this.interpolated(colorCount, interpolator);
      case this.interpolatorTypes[3]:
        interpolator = d3.interpolateHslLong(color1, color2);
        return this.interpolated(colorCount, interpolator);
      case this.interpolatorTypes[4]:
        interpolator = d3.interpolateLab(color1, color2);
        return this.interpolated(colorCount, interpolator);
      case this.interpolatorTypes[5]:
        interpolator = d3.interpolateHcl(color1, color2);
        return this.interpolated(colorCount, interpolator);
      case this.interpolatorTypes[6]:
        interpolator = d3.interpolateHclLong(color1, color2);
        return this.interpolated(colorCount, interpolator);
      case this.interpolatorTypes[7]:
        interpolator = d3.interpolateCubehelix(color1, color2);
        return this.interpolated(colorCount, interpolator);
      case this.interpolatorTypes[8]:
        interpolator = d3.interpolateCubehelixLong(color1, color2);
        return this.interpolated(colorCount, interpolator);
      default:
        return this.interpolated(colorCount, interpolator);
    }
  }

  interpolated(colorCount, interpolator): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount - 1; i++) {
      const clr = interpolator(start);
      colors.push(chroma(clr).hex());
      start += increment;
    }
    // insert last one as last color
    const col = interpolator(1);
    colors.push(chroma(col).hex());
    return colors;
  }
}
