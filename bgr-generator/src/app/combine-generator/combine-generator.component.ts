// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Component, OnInit, Input } from '@angular/core';
import { InputsOutputsService } from '../inputs-outputs.service';
import { ColorMixerService } from '../color-mixer.service';
import * as chroma from 'chroma-js/chroma.js';

@Component({
  selector: 'app-combine-generator',
  templateUrl: './combine-generator.component.html',
  styleUrls: ['./combine-generator.component.css'],
})
export class CombineGeneratorComponent implements OnInit {
  @Input() colorArr = [
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
  ];
  @Input() colorAmount = 10;
  @Input() secondaryColor = chroma.random().hex();
  @Input() mixDistance = 1;
  colorMixerMatrix;

  colorMode = 'hsl'; // 'lch', hsl brighter colors
  colorModes = ['rgb', 'lrgb', 'hsl', 'lch', 'lab'];
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
  arrayMixingTechnique = ['neighbour', 'opposite'];

  constructor(
    private ioService: InputsOutputsService,
    private mixer: ColorMixerService
  ) {}

  ngOnInit() {
    this.colorMixerMatrix = this.getColorMixerMatrix();
    this.ioService.getColorsObservable().subscribe((colorArray) => {
      if (colorArray.length && colorArray.length > 0) {
        this.colorArr = colorArray;
      }
    });
    this.ioService.getColorAmountObservable().subscribe((amount) => {
      this.colorAmount = amount;
    });
  }

  generateMixColors() {
    this.colorArr = this.mixer.mixArrayOpposites(this.colorArr, 'rgb', 'mix');
  }

  getColorMixerMatrix() {
    const mixTypes = [];
    for (const arrayMixingTechnique of this.arrayMixingTechnique) {
      for (const typeOfColorMix of this.mixingTechnique) {
        for (const colorMode of this.colorModes) {
          mixTypes.push([arrayMixingTechnique, typeOfColorMix, colorMode]);
        }
      }
    }
    return mixTypes;
  }
  mixColors(arr: string[]) {
    switch (arr[0]) {
      case 'neighbour':
        this.ioService.setColorsObservable(
          'neighbour' + ' ' + arr[2] + ' ' + arr[1],
          this.mixer.mixArray(this.colorArr, arr[2], arr[1], this.mixDistance)
        );

        break;
      case 'opposite':
        this.ioService.setColorsObservable(
          'opposite' + ' ' + arr[2] + ' ' + arr[1],
          this.mixer.mixArrayOpposites(this.colorArr, arr[2], arr[1])
        );
        break;

      default:
        break;
    }
  }

  getMixColors(arr: string[]) {
    switch (arr[0]) {
      case 'neighbour':
        return this.mixer.mixArray(
          this.colorArr,
          arr[2],
          arr[1],
          this.mixDistance
        );
      case 'opposite':
        return this.mixer.mixArrayOpposites(this.colorArr, arr[2], arr[1]);

      default:
        break;
    }
  }
}
