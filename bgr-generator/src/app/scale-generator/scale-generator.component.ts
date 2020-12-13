// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2

import { Component, OnInit, Input } from '@angular/core';
import { InputsOutputsService } from '../inputs-outputs.service';
import * as chroma from 'chroma-js/chroma.js';
import { ColorMixerService } from '../color-mixer.service';
import { ColorInterpolatorService } from '../color-interpolator.service';

@Component({
  selector: 'app-scale-generator',
  templateUrl: './scale-generator.component.html',
  styleUrls: ['./scale-generator.component.css'],
})
export class ScaleGeneratorComponent implements OnInit {
  @Input() colorArray = [
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
  ];
  @Input() colorAmount = 10;
  @Input() secondaryColor = chroma.random().hex();
  @Input() primaryColor = chroma.random().hex();
  @Input() mixDistance = 1;

  colorMode = 'lch'; // 'lch', hsl brighter colors, lch in scale is smoother
  colorModes = ['rgb', 'lrgb', 'hsl', 'lch', 'lab'];
  interpolatorModes;

  constructor(
    private mixer: ColorMixerService,
    private interpol: ColorInterpolatorService,
    private ioService: InputsOutputsService
  ) {}

  ngOnInit() {
    this.interpolatorModes = this.interpol.getInterpolatorTypes();

    this.ioService.getColorAmountObservable().subscribe((amount) => {
      this.colorAmount = amount;
    });
    this.ioService.getPrimaryColorObservable().subscribe((color) => {
      if (color !== undefined && color !== '') {
        this.primaryColor = color;
      }
    });
    this.ioService.getSecondaryColorObservable().subscribe((color) => {
      if (color !== undefined && color !== '') {
        this.secondaryColor = color;
      }
    });
  }

  randomPrimary() {
    this.primaryColor = chroma.random().hex();
    this.ioService.setResetObservable();
    this.ioService.setPrimaryColorObservable(this.primaryColor);
  }

  randomSecondary() {
    this.secondaryColor = chroma.random().hex();
    this.ioService.setResetObservable();
    this.ioService.setSecondaryColorObservable(this.secondaryColor);
  }

  onPrimaryColorPick(event) {
    this.ioService.setPrimaryColorObservable(event);
  }

  onSecondaryColorPick(event) {
    this.ioService.setSecondaryColorObservable(event);
  }

  generateScaleColors(mode) {
    this.colorArray = this.mixer.generateScaleColors(
      this.primaryColor,
      this.secondaryColor,
      mode,
      this.colorAmount
    );
    this.ioService.setColorsObservable('Scale ' + mode, this.colorArray);
  }

  generateInterpolateColors(mode) {
    this.colorArray = this.interpol.getInterpolated(
      this.primaryColor,
      this.secondaryColor,
      this.colorAmount,
      mode
    );
    this.ioService.setColorsObservable('Interpolator ' + mode, this.colorArray);
  }

  getGenerateScaleColors(mode) {
    return this.mixer.generateScaleColors(
      this.primaryColor,
      this.secondaryColor,
      mode,
      this.colorAmount
    );
  }

  getGenerateInterpolateColors(mode) {
    return this.interpol.getInterpolated(
      this.primaryColor,
      this.secondaryColor,
      this.colorAmount,
      mode
    );
  }

  generateBezierColors() {
    this.colorArray = this.mixer.generateBezierColors(
      this.primaryColor,
      this.secondaryColor,
      this.colorAmount
    );
    this.ioService.setColorsObservable('Bezier ', this.colorArray);
  }

  getGenerateBezierColors() {
    return this.mixer.generateBezierColors(
      this.primaryColor,
      this.secondaryColor,
      this.colorAmount
    );
  }
}
