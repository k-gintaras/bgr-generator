// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
import { Component, OnInit, Input } from '@angular/core';
import { ColorSchemeSetsService } from '../color-scheme-sets.service';
import { InputsOutputsService } from '../inputs-outputs.service';
import * as chroma from 'chroma-js/chroma.js';

@Component({
  selector: 'app-palette-preset-generator',
  templateUrl: './palette-preset-generator.component.html',
  styleUrls: ['./palette-preset-generator.component.css'],
})
export class PalettePresetGeneratorComponent implements OnInit {
  @Input() colorArray = [
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
  ];
  @Input() colorAmount = 10;
  colorMode = 'hsl'; // 'lch', hsl brighter colors
  colorModes = ['rgb', 'lrgb', 'hsl', 'lch', 'lab', 'cmyk'];
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
  matrix: any[] = [];
  constructor(
    private presetPalettes: ColorSchemeSetsService,
    private ioService: InputsOutputsService
  ) {}

  ngOnInit() {
    this.ioService.getColorAmountObservable().subscribe((amount) => {
      this.colorAmount = amount;
    });
  }

  setColorMatrix() {
    this.matrix = [];
    for (const generator of this.generators) {
      const palette = this.getGenerateColors(generator);
      this.matrix.push(palette);
    }
  }

  generateColors(generator) {
    switch (generator) {
      case this.generators[0]:
        this.colorArray = this.presetPalettes.generateSchemePRGnColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable('PRGn' + ' Scheme', this.colorArray);
        break;

      case this.generators[1]:
        this.colorArray = this.presetPalettes.generateSchemeBrBGColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable('BrBG' + ' Scheme', this.colorArray);
        break;

      case this.generators[2]:
        this.colorArray = this.presetPalettes.generateSchemePiYGColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable('PiYG' + ' Scheme', this.colorArray);
        break;

      case this.generators[3]:
        this.colorArray = this.presetPalettes.generateSchemePuOrColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable('PuOr' + ' Scheme', this.colorArray);
        break;

      case this.generators[4]:
        this.colorArray = this.presetPalettes.generateSchemeRdBuColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable('RdBu' + ' Scheme', this.colorArray);
        break;

      case this.generators[5]:
        this.colorArray = this.presetPalettes.generateSchemeRdGyColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable('RdGy' + ' Scheme', this.colorArray);
        break;

      case this.generators[6]:
        this.colorArray = this.presetPalettes.generateSchemeRdYlBuColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'RdYlBu' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[7]:
        this.colorArray = this.presetPalettes.generateSchemeRdYlGnColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'RdYlGn' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[8]:
        this.colorArray = this.presetPalettes.generateSchemeSpectralColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Spectral' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[9]:
        this.colorArray = this.presetPalettes.generateSchemeTurboColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Turbo' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[10]:
        this.colorArray = this.presetPalettes.generateSchemeViridisColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Viridis' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[11]:
        this.colorArray = this.presetPalettes.generateSchemeInfernoColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Inferno' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[12]:
        this.colorArray = this.presetPalettes.generateSchemeMagmaColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Magma' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[13]:
        this.colorArray = this.presetPalettes.generateSchemePlasmaColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Plasma' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[14]:
        this.colorArray = this.presetPalettes.generateSchemeCividisColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Cividis' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[15]:
        this.colorArray = this.presetPalettes.generateSchemeWarmColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable('Warm' + ' Scheme', this.colorArray);
        break;

      case this.generators[16]:
        this.colorArray = this.presetPalettes.generateSchemeCoolColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable('Cool' + ' Scheme', this.colorArray);
        break;

      case this.generators[17]:
        this.colorArray = this.presetPalettes.generateSchemeCubehelixDefaultColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Cubehelix' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[18]:
        this.colorArray = this.presetPalettes.generateSchemeRainbowColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Rainbow' + ' Scheme',
          this.colorArray
        );
        break;

      case this.generators[19]:
        this.colorArray = this.presetPalettes.generateSchemeSinebowColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Sinebow' + ' Scheme',
          this.colorArray
        );
        break;

      default:
        this.colorArray = this.presetPalettes.generateSchemeRainbowColors(
          this.colorAmount
        );
        this.ioService.setColorsObservable(
          'Rainbow' + ' Scheme',
          this.colorArray
        );

        break;
    }
  }

  getGenerateColors(generator) {
    switch (generator) {
      case this.generators[0]:
        return this.presetPalettes.generateSchemePRGnColors(this.colorAmount);

      case this.generators[1]:
        return this.presetPalettes.generateSchemeBrBGColors(this.colorAmount);

      case this.generators[2]:
        return this.presetPalettes.generateSchemePiYGColors(this.colorAmount);

      case this.generators[3]:
        return this.presetPalettes.generateSchemePuOrColors(this.colorAmount);

      case this.generators[4]:
        return this.presetPalettes.generateSchemeRdBuColors(this.colorAmount);

      case this.generators[5]:
        return this.presetPalettes.generateSchemeRdGyColors(this.colorAmount);

      case this.generators[6]:
        return this.presetPalettes.generateSchemeRdYlBuColors(this.colorAmount);

      case this.generators[7]:
        return this.presetPalettes.generateSchemeRdYlGnColors(this.colorAmount);

      case this.generators[8]:
        return this.presetPalettes.generateSchemeSpectralColors(
          this.colorAmount
        );

      case this.generators[9]:
        return this.presetPalettes.generateSchemeTurboColors(this.colorAmount);

      case this.generators[10]:
        return this.presetPalettes.generateSchemeViridisColors(
          this.colorAmount
        );

      case this.generators[11]:
        return this.presetPalettes.generateSchemeInfernoColors(
          this.colorAmount
        );

      case this.generators[12]:
        return this.presetPalettes.generateSchemeMagmaColors(this.colorAmount);

      case this.generators[13]:
        return this.presetPalettes.generateSchemePlasmaColors(this.colorAmount);

      case this.generators[14]:
        return this.presetPalettes.generateSchemeCividisColors(
          this.colorAmount
        );

      case this.generators[15]:
        return this.presetPalettes.generateSchemeWarmColors(this.colorAmount);

      case this.generators[16]:
        return this.presetPalettes.generateSchemeCoolColors(this.colorAmount);

      case this.generators[17]:
        return this.presetPalettes.generateSchemeCubehelixDefaultColors(
          this.colorAmount
        );

      case this.generators[18]:
        return this.presetPalettes.generateSchemeRainbowColors(
          this.colorAmount
        );

      case this.generators[19]:
        return this.presetPalettes.generateSchemeSinebowColors(
          this.colorAmount
        );
      default:
        return this.presetPalettes.generateSchemeRainbowColors(
          this.colorAmount
        );
    }
  }
}
