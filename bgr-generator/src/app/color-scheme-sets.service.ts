// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
// d3, BSD 3

import { Injectable } from '@angular/core';
import * as chroma from 'chroma-js/chroma.js';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root',
})
export class ColorSchemeSetsService {
  constructor() {}

  generators = [
    'PRGn',
    'BrBG',
    'PiYG',
    'PuOr',
    'RdBu',
    'RdGy',
    'RdYlBu',
    'RdYlGn',
    'Spectral',
    'Turbo',
    'Viridis',
    'Inferno',
    'Magma',
    'Plasma',
    'Cividis',
    'Warm',
    'Cool',
    'Cubehelix',
    'Rainbow',
    'Sinebow',
  ];

  getCubeHelixColors(
    colorAmount: number,
    cubeHelixStart: number,
    cubeHelixRotations: number,
    cubeHelixGamma: number,
    cubeHelixHue: number,
    cubeHelixContrast: number,
    cubeHelixBrightness: number
  ) {
    return chroma
      .cubehelix()
      .start(cubeHelixStart)
      .rotations(cubeHelixRotations)
      .gamma(cubeHelixGamma)
      .hue([cubeHelixContrast, cubeHelixHue])
      .lightness([cubeHelixContrast, cubeHelixBrightness])
      .scale()
      .correctLightness()
      .colors(colorAmount);
  }

  getGeneratorTitles() {
    return this.generators;
  }

  getDefaultCubeHelix(colorAmount: number) {
    const cubeHelixStart = 200;
    const cubeHelixRotations = -0.35;
    const cubeHelixGamma = 0.7;
    const cubeHelixHue = 1;
    const cubeHelixBrightness = 0.8;
    const cubeHelixContrast = 0.3;
    return this.getCubeHelixColors(
      colorAmount,
      cubeHelixStart,
      cubeHelixRotations,
      cubeHelixGamma,
      cubeHelixHue,
      cubeHelixContrast,
      cubeHelixBrightness
    );
  }

  generateSchemePRGnColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolatePRGn(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeBrBGColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateBrBG(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }
  generateSchemePiYGColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolatePiYG(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }
  generateSchemePuOrColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolatePuOr(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }
  generateSchemeRdBuColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateRdBu(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }
  generateSchemeRdGyColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateRdGy(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeRdYlBuColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateRdYlBu(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeRdYlGnColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateRdYlGn(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }
  generateSchemeSpectralColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateSpectral(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeTurboColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateTurbo(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeViridisColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateViridis(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeInfernoColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateInferno(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeMagmaColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateMagma(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemePlasmaColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolatePlasma(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeCividisColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateCividis(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeWarmColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateWarm(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeCoolColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateCool(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeCubehelixDefaultColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateCubehelixDefault(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeRainbowColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateRainbow(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  generateSchemeSinebowColors(colorCount: number): string[] {
    const colors = [];
    let start = 0;
    const increment = 1000 / colorCount / 1000;
    for (let i = 0; i < colorCount; i++) {
      const inter = d3.interpolateSinebow(start);
      colors.push(chroma(inter).hex());
      start += increment;
    }
    return colors;
  }

  getGenerateColors(generator, colorAmount) {
    switch (generator) {
      case this.generators[0]:
        return this.generateSchemePRGnColors(colorAmount);

      case this.generators[1]:
        return this.generateSchemeBrBGColors(colorAmount);

      case this.generators[2]:
        return this.generateSchemePiYGColors(colorAmount);

      case this.generators[3]:
        return this.generateSchemePuOrColors(colorAmount);

      case this.generators[4]:
        return this.generateSchemeRdBuColors(colorAmount);

      case this.generators[5]:
        return this.generateSchemeRdGyColors(colorAmount);

      case this.generators[6]:
        return this.generateSchemeRdYlBuColors(colorAmount);

      case this.generators[7]:
        return this.generateSchemeRdYlGnColors(colorAmount);

      case this.generators[8]:
        return this.generateSchemeSpectralColors(colorAmount);

      case this.generators[9]:
        return this.generateSchemeTurboColors(colorAmount);

      case this.generators[10]:
        return this.generateSchemeViridisColors(colorAmount);

      case this.generators[11]:
        return this.generateSchemeInfernoColors(colorAmount);

      case this.generators[12]:
        return this.generateSchemeMagmaColors(colorAmount);

      case this.generators[13]:
        return this.generateSchemePlasmaColors(colorAmount);

      case this.generators[14]:
        return this.generateSchemeCividisColors(colorAmount);

      case this.generators[15]:
        return this.generateSchemeWarmColors(colorAmount);

      case this.generators[16]:
        return this.generateSchemeCoolColors(colorAmount);

      case this.generators[17]:
        return this.generateSchemeCubehelixDefaultColors(colorAmount);

      case this.generators[18]:
        return this.generateSchemeRainbowColors(colorAmount);

      case this.generators[19]:
        return this.generateSchemeSinebowColors(colorAmount);
      default:
        return this.generateSchemeRainbowColors(colorAmount);
    }
  }
}
