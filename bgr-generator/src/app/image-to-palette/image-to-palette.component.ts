// Copyright: 2020, https://github.com/k-gintaras
// LICENSE: depends on authors of original paper.
//
// Authors of Firefly and Retinex papers:
// Nikola Banic and Sven Loncaric
//
// Original code available at:
// https://ipg.fer.hr/ipg/resources/color_constancy?
//
// Firefly (Firefly: A Hardware-friendly Real-Time Local Brightness Adjustment) paper:
// https://ipg.fer.hr/_download/repository/Firefly_-_A_Hardware-friendly_Real-Time_Local_Brightness_Adjustment.pdf
//
// Retinex (Smart Light Random Memory Sprays Retinex) paper:
// https://ipg.fer.hr/_download/repository/Light_Random_Sprays_Retinex_-_Exploiting_the_Noisy_Illumination_Estimation.pdf
//
// Code modified and adapted to typescript by:
// https://github.com/k-gintaras
//
// Other Licenses:
// TinyColor, MIT
// CamanJS, BSD 3
// RgbQuant.js, MIT
// ColorThief, MIT

import { Component, OnInit, Input } from '@angular/core';
import { ImageProcessorService } from '../image-processor.service';
import { InputsOutputsService } from '../inputs-outputs.service';
import { ColorAveragerService } from '../color-averager.service';
import * as caman2 from '../../assets/caman2.full.js';
import { RetinexWhiteProcessorService } from '../retinex-white-processor.service';
import { FireflyContrastProcessorService } from '../firefly-contrast-processor.service';

@Component({
  selector: 'app-image-to-palette',
  templateUrl: './image-to-palette.component.html',
  styleUrls: ['./image-to-palette.component.css'],
})
export class ImageToPaletteComponent implements OnInit {
  @Input() averagingPrecision = 50;

  img: HTMLImageElement;
  imgUrl: string | ArrayBuffer = '../../assets/flower.jpg';
  imageUrls = [
    // '../../assets/test/1.jpg',
  ];

  file;
  canvas;
  canvas2;
  originalCanvas;

  generatedColors = [];
  @Input() colorAmount = 5;
  colorMode = 'hsl'; // 'lch', hsl brighter colors
  colorModes = ['rgb', 'lrgb', 'hsl', 'lch', 'lab', 'cmyk'];

  // window adaptation
  colBreakpoint = 5;
  colSpan1 = 3;
  colSpan2 = 2;
  rowSpan = 4;

  next = 0;
  currentPalette = 'rgbQuantPalette';
  nextPalette = 0;
  paletteNames = [
    'rgbQuantPalette',
    'vibrantPalette',
    'colorThiefPalette',
    'averageSuperLabLabPalette',
    'averageSuperLabHuePalette',
    'averageSuperLabSaturationPalette',
    'averageSuperLabLightnessPalette',
    'averageHueHuePalette',
    'averageHueSaturationPalette',
    'averageHueLightnessPalette',
    'averageLightnessHuePalette',
    'averageLightnessSaturationPalette',
    'averageLightnessLightnessPalette',
    'averageSaturationHuePalette',
    'averageSaturationSaturationPalette',
    'averageSaturationLightnessPalette',
  ];

  constructor(
    private imageProcessor: ImageProcessorService,
    private ioService: InputsOutputsService,
    private colorAverager: ColorAveragerService,
    private retinex: RetinexWhiteProcessorService,
    private firefly: FireflyContrastProcessorService
  ) {}

  ngOnInit() {
    this.setColBreakpoint();
    this.canvas = document.querySelector('#canvasImage') as HTMLCanvasElement;
    this.originalCanvas = document.querySelector(
      '#canvasImage3'
    ) as HTMLCanvasElement;
    this.canvas2 = document.querySelector('#canvasImage2') as HTMLCanvasElement;
    this.setFromUrlToImage('../../assets/flower.jpg', true);

    this.ioService.getColorAmountObservable().subscribe((amount) => {
      this.colorAmount = amount;
    });
  }

  onResize() {
    this.setColBreakpoint();
  }

  setColBreakpoint() {
    if (window.innerWidth <= window.innerHeight + 200) {
      this.colBreakpoint = 1;
      this.colSpan1 = 1;
      this.colSpan2 = 1;
      this.rowSpan = 1;
    } else {
      this.colBreakpoint = 5;
      this.colSpan1 = 2;
      this.colSpan2 = 3;
      this.rowSpan = 4;
    }
  }

  onFileSelected(event) {
    const f = event.target.files[0];
    this.file = f;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imgUrl = reader.result;
      this.setFromUrlToImage(URL.createObjectURL(this.file), false);
    };
  }

  sortColors() {
    this.generatedColors = this.colorAverager.getSortedBySuperLab(
      this.generatedColors,
      '#ffffff'
    );
  }

  initPalette() {
    this.runPalette(8);
    // this.averageHueSaturationPalette();
  }

  setFromUrlToImage(url, isCrossOrigin) {
    this.img = new Image();
    this.img.src = url;

    if (isCrossOrigin) {
      this.img.crossOrigin = 'Anonymous'; // for some reason it fixes color thief destroying loaded image colors
    }

    this.img.onload = (event) => {
      this.imageProcessor.displayFitImageOnCanvas(this.img, this.canvas, 1000);
      this.imageProcessor.displayFitImageOnCanvas(this.img, this.canvas2, 1000);
      this.imageProcessor.displayFitImageOnCanvas(
        this.img,
        this.originalCanvas,
        1000
      );
      // this.runPalette();
      this.initPalette();
    };
  }

  resetCanvas() {
    this.displayCanvas(this.originalCanvas, this.canvas);
    this.displayCanvas(this.canvas, this.canvas2);
  }

  displayCanvas(canvas1, canvas2) {
    this.imageProcessor.displayCanvasOnCanvas(canvas1, canvas2);
  }

  // COLOR PALETTE METHODS
  //
  //
  fireflyFix() {
    new Promise((resolve, reject) => {
      this.firefly.performFirefly(this.canvas, this.canvas2, true); // creates lots of bright colors
      resolve();
      // reject(string);
    }).then(() => {
      this.displayCanvas(this.canvas2, this.canvas);
    });
  }

  retinexFix() {
    new Promise((resolve, reject) => {
      this.retinex.applySLRMSR(
        true,
        true,
        false,
        0.5,
        3,
        this.canvas,
        this.canvas2
      ); // very bright
      // this.retinex.applyRSR(5, 100, this.canvas, this.canvas2); // brightened averaged, more same colors, more weird noise //slow
      // this.retinex.applyRMSR(5, 100, this.canvas, this.canvas2); // bright averaged, medium brightened, weird lines appear
      // this.retinex.applyLRSR(3, 50, 25, this.canvas, this.canvas2); // bit more variety, bit more brights
      resolve();
      // reject(string);
    }).then(() => {
      this.displayCanvas(this.canvas2, this.canvas);
    });
  }

  retinexFixSlower() {
    new Promise((resolve, reject) => {
      //   this.retinex.applySLRMSR(
      //     true,
      //     true,
      //     false,
      //     0.5,
      //     3,
      //     this.canvas,
      //     this.canvas2
      //   ); // very bright
      // this.retinex.applyRSR(5, 100, this.canvas, this.canvas2); // brightened averaged, more same colors, more weird noise //slow
      // this.retinex.applyRMSR(5, 100, this.canvas, this.canvas2); // bright averaged, medium brightened, weird lines appear
      this.retinex.applyLRSR(3, 50, 25, this.canvas, this.canvas2); // bit more variety, bit more brights
      resolve();
    }).then(() => {
      this.displayCanvas(this.canvas2, this.canvas);
    });
  }

  camanFix() {
    const c = caman2.Caman(this.canvas, this.canvas2);
    c.clarity()
      .render()
      .then(() => {
        this.displayCanvas(this.canvas2, this.canvas);
      });
  }

  rgbQuantPalette() {
    const amount = this.colorAmount + 2;
    this.generatedColors = this.imageProcessor.getRgbQuantPalette(
      this.canvas,
      amount
    );
    this.generatedColors.shift();
    this.generatedColors.pop();

    this.sortColors();
    this.ioService.setColorsObservable('RgbQuant', this.generatedColors);
  }

  // this.img.crossOrigin = 'Anonymous'; // for some reason it fixes color thief destroying loaded image colors
  colorThiefPalette() {
    this.generatedColors = this.imageProcessor.getColorThiefPalette(
      this.img,
      this.colorAmount
    );
    this.sortColors();
    this.ioService.setColorsObservable('ColorThief', this.generatedColors);
  }

  vibrantPalette() {
    const p = this.imageProcessor.getVibrantPalette(this.img);
    p.then((col) => {
      this.generatedColors = col;
      this.sortColors();
      this.ioService.setColorsObservable('Vibrant', this.generatedColors);
    });
  }

  averageHueSaturationPalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageHueSaturationColors(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode
    );
    this.sortColors();
    this.ioService.setColorsObservable(
      'Hue Saturation, Colorator',
      this.generatedColors
    );
  }

  averageSuperLabSaturationPalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageColorsBySuperLabSaturation(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode,
      '#ffffff'
    );
    this.sortColors();
    this.ioService.setColorsObservable('Lab Saturation', this.generatedColors);
  }

  averageSuperLabHuePalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageColorsBySuperLabHue(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode,
      '#ffffff'
    );
    this.sortColors();
    this.ioService.setColorsObservable('Lab Hue', this.generatedColors);
  }

  averageSuperLabLightnessPalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageColorsBySuperLabLightness(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode,
      '#ffffff'
    );
    this.sortColors();
    this.ioService.setColorsObservable('Lab Lightness', this.generatedColors);
  }

  averageSuperLabLabPalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageColorsBySuperLabLab(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode,
      '#ffffff'
    );
    this.sortColors();
    this.ioService.setColorsObservable('Lab Lab', this.generatedColors);
  }

  averageHueLightnessPalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageHueLightnessColors(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode
    );
    this.sortColors();
    this.ioService.setColorsObservable(
      'Hue Lightness, Light',
      this.generatedColors
    );
  }

  averageHueHuePalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageHueHueColors(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode
    );
    this.sortColors();
    this.ioService.setColorsObservable(
      'Hue Hue, Average',
      this.generatedColors
    );
  }

  averageLightnessSaturationPalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageLightnessSaturationColors(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode
    );
    this.sortColors();
    this.ioService.setColorsObservable(
      'Lightness Saturation, Warm',
      this.generatedColors
    );
  }

  averageLightnessHuePalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageLightnessHueColors(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode
    );
    this.sortColors();
    this.ioService.setColorsObservable('Lightness Hue', this.generatedColors);
  }

  averageLightnessLightnessPalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageLightnessLightnessColors(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode
    );
    this.sortColors();
    this.ioService.setColorsObservable(
      'Lightness Lightness, Cold',
      this.generatedColors
    );
  }

  averageSaturationLightnessPalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageSaturationLightnessColors(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode
    );
    this.sortColors();
    this.ioService.setColorsObservable(
      'Saturation Lightness, Pastel',
      this.generatedColors
    );
  }

  averageSaturationHuePalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageSaturationHueColors(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode
    );
    this.sortColors();
    this.ioService.setColorsObservable('Saturation Hue', this.generatedColors);
  }

  averageSaturationSaturationPalette() {
    const cols = this.imageProcessor.getColorsFromCanvas(
      this.canvas,
      this.averagingPrecision
    );
    this.generatedColors = this.colorAverager.getAverageSaturationSaturationColors(
      cols,
      this.colorAmount,
      0,
      3,
      this.colorMode
    );
    this.sortColors();
    this.ioService.setColorsObservable(
      'Saturation Saturation',
      this.generatedColors
    );
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
  trackByTitle(index: number, obj: any): any {
    return obj;
  }

  nextImageTest() {
    this.setFromUrlToImage(this.imageUrls[this.next], true);
    this.next++;
    if (this.next > this.imageUrls.length - 1) {
      this.next = 0;
    }
  }

  nextPaletteTest() {
    this.nextPalette++;
    if (this.nextPalette > this.paletteNames.length - 1) {
      this.nextPalette = 0;
    }
    this.currentPalette = this.paletteNames[this.nextPalette];
  }

  runPalette(whichPalette: number) {
    switch (whichPalette) {
      case 0:
        this.rgbQuantPalette(); // slow very contrasting
        break;
      case 1:
        this.vibrantPalette(); // balanced
        break;
      case 2:
        this.colorThiefPalette(); // balanced not as good
        break;
      case 3:
        this.averageSuperLabLabPalette(); // sometimes good, usually very contrasting
        break;
      case 4:
        this.averageSuperLabHuePalette(); // weird large contract
        break;
      case 5:
        this.averageSuperLabSaturationPalette(); // nice average colors
        break;
      case 6:
        this.averageSuperLabLightnessPalette(); // sometimes good, usually very contrasting
        break;
      case 7:
        this.averageHueHuePalette(); // nice average colors
        break;
      case 8:
        this.averageHueSaturationPalette(); // nice bright colors
        break;
      case 9:
        this.averageHueLightnessPalette(); // bright pastel
        break;
      case 10:
        this.averageLightnessHuePalette(); // high contrast weird
        break;
      case 11:
        this.averageLightnessSaturationPalette(); // very contrasting
        break;
      case 12:
        this.averageLightnessLightnessPalette(); // kinda very contrasting
        break;
      case 13:
        this.averageSaturationHuePalette(); // low saturation darker colors
        break;
      case 14:
        this.averageSaturationSaturationPalette(); // low brightness kinda similar colors
        break;
      case 15:
        this.averageSaturationLightnessPalette(); // pastel
        break;
      default:
        break;
    }
  }
}
