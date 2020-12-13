// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
import { Component, OnInit, Input } from '@angular/core';
import { InputsOutputsService } from '../inputs-outputs.service';
import { ColorAnglerService } from '../color-angler.service';
import * as chroma from 'chroma-js/chroma.js';

@Component({
  selector: 'app-palette-generator',
  templateUrl: './palette-generator.component.html',
  styleUrls: ['./palette-generator.component.css'],
})
export class PaletteGeneratorComponent implements OnInit {
  @Input() colorArray = [
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
  ];
  @Input() colorAmount = 5;
  @Input() primaryColor = chroma.random().hex();
  @Input() secondaryColor = chroma.random().hex();
  generators = [
    'Complement',
    'SplitComplement',
    'Flower',
    'Duo',
    'Bouquet',
    'Mono',
    'Analogous',
    'Triad',
    'Tetrad',
    'Hexad',
    'Octad',
    'Neutral',
    'SplitA',
    'SplitB',
    'SplitC',
    'Tone4A',
    'Tone4B',
    'Tone5A',
    'Tone5B',
    'Tone5C',
    'Tone5D',
    'Tone5E',
    'Tone6A',
    'Tone6B',
  ];
  matrix: any[];

  constructor(
    private ioService: InputsOutputsService,
    private paletteAngles: ColorAnglerService
  ) {}

  ngOnInit() {
    this.ioService.getColorAmountObservable().subscribe((amount) => {
      this.colorAmount = amount;
    });
    this.ioService.getPrimaryColorObservable().subscribe((color) => {
      if (color !== undefined && color !== '') {
        this.primaryColor = color;
      }
    });
  }

  random() {
    this.primaryColor = chroma.random().hex();
    this.ioService.setResetObservable();
    this.ioService.setPrimaryColorObservable(this.primaryColor);
  }

  onPrimaryColorPick(event) {
    this.ioService.setPrimaryColorObservable(event);
  }

  setColorMatrix() {
    this.matrix = [];
    for (const generator of this.generators) {
      const palette = this.getGenerateAngleColors(generator);
      this.matrix.push(palette);
    }
  }

  getSizeCorrected(arr) {
    const filler = '#ffffff';
    if (arr.length >= this.colorAmount) {
      return arr;
    } else {
      for (let i = 0; i < this.colorAmount; i++) {}
    }
  }

  getGenerateAngleColors(generator) {
    switch (generator) {
      case this.generators[0]:
        return [this.complementAngle()];

      case this.generators[1]:
        return [this.splitComplementAngle()];

      case this.generators[2]:
        return this.flowerAngle();

      case this.generators[3]:
        return this.duoAngle();

      case this.generators[4]:
        return this.bouquetAngle();

      case this.generators[5]:
        return this.monoAngle();

      case this.generators[6]:
        return this.analogousAngle();

      case this.generators[7]:
        return this.triadAngle();

      case this.generators[8]:
        return this.tetradAngle();

      case this.generators[9]:
        return this.hexadAngle();

      case this.generators[10]:
        return this.octadAngle();

      case this.generators[11]:
        return this.neutralAngle();

      case this.generators[12]:
        return this.splitA();

      case this.generators[13]:
        return this.splitB();

      case this.generators[14]:
        return this.splitC();

      case this.generators[15]:
        return this.tone4A();

      case this.generators[16]:
        return this.tone4B();

      case this.generators[17]:
        return this.tone5A();

      case this.generators[18]:
        return this.tone5B();

      case this.generators[19]:
        return this.tone5C();

      case this.generators[20]:
        return this.tone5D();

      case this.generators[21]:
        return this.tone5E();

      case this.generators[22]:
        return this.tone6A();

      case this.generators[23]:
        return this.tone6B();

      default:
        return this.duoAngle();
    }
  }

  generateAngleColors(generator) {
    switch (generator) {
      case this.generators[0]:
        this.secondaryColor = this.complementAngle();
        this.colorArray = [this.secondaryColor];
        this.ioService.setColorsObservable(
          'Complement' + ' Hue Angle 180',
          this.colorArray
        );
        break;

      case this.generators[1]:
        this.secondaryColor = this.splitComplementAngle();
        this.colorArray = [this.secondaryColor];

        this.ioService.setColorsObservable(
          'SplitComplement' + ' Hue Angle 150',
          this.colorArray
        );
        break;

      case this.generators[2]:
        this.colorArray = this.flowerAngle();
        this.ioService.setColorsObservable(
          'Flower' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[3]:
        this.colorArray = this.duoAngle();
        this.ioService.setColorsObservable(
          'Duo' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[4]:
        this.colorArray = this.bouquetAngle();
        this.ioService.setColorsObservable(
          'Bouquet' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[5]:
        this.colorArray = this.monoAngle();
        this.ioService.setColorsObservable(
          'Mono' + ' Hue Angle 5',
          this.colorArray
        );
        break;

      case this.generators[6]:
        this.colorArray = this.analogousAngle();
        this.ioService.setColorsObservable(
          'Analogous' + ' Hue Angle 30',
          this.colorArray
        );
        break;

      case this.generators[7]:
        this.colorArray = this.triadAngle();
        this.ioService.setColorsObservable(
          'Triad' + ' Hue Angle 120',
          this.colorArray
        );
        break;

      case this.generators[8]:
        this.colorArray = this.tetradAngle();
        this.ioService.setColorsObservable(
          'Tetrad' + ' Hue Angle 90',
          this.colorArray
        );
        break;

      case this.generators[9]:
        this.colorArray = this.hexadAngle();
        this.ioService.setColorsObservable(
          'Hexad' + ' Hue Angle 60',
          this.colorArray
        );
        break;

      case this.generators[10]:
        this.colorArray = this.octadAngle();
        this.ioService.setColorsObservable(
          'Octad' + ' Hue Angle 45',
          this.colorArray
        );
        break;

      case this.generators[11]:
        this.colorArray = this.neutralAngle();
        this.ioService.setColorsObservable(
          'Neutral' + ' Hue Angle 15',
          this.colorArray
        );
        break;

      case this.generators[12]:
        this.colorArray = this.splitA();
        this.ioService.setColorsObservable(
          'SplitA' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[13]:
        this.colorArray = this.splitB();
        this.ioService.setColorsObservable(
          'SplitB' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[14]:
        this.colorArray = this.splitC();
        this.ioService.setColorsObservable(
          'SplitC' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[15]:
        this.colorArray = this.tone4A();
        this.ioService.setColorsObservable(
          'Tone4A' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[16]:
        this.colorArray = this.tone4B();
        this.ioService.setColorsObservable(
          'Tone4B' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[17]:
        this.colorArray = this.tone5A();
        this.ioService.setColorsObservable(
          'Tone5A' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[18]:
        this.colorArray = this.tone5B();
        this.ioService.setColorsObservable(
          'Tone5B' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[19]:
        this.colorArray = this.tone5C();
        this.ioService.setColorsObservable(
          'Tone5C' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[20]:
        this.colorArray = this.tone5D();
        this.ioService.setColorsObservable(
          'Tone5D' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[21]:
        this.colorArray = this.tone5E();
        this.ioService.setColorsObservable(
          'Tone5E' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[22]:
        this.colorArray = this.tone6A();
        this.ioService.setColorsObservable(
          'Tone6A' + ' Hue Angle',
          this.colorArray
        );
        break;

      case this.generators[23]:
        this.colorArray = this.tone6B();
        this.ioService.setColorsObservable(
          'Tone6B' + ' Hue Angle',
          this.colorArray
        );
        break;

      default:
        this.colorArray = this.duoAngle();
        this.ioService.setColorsObservable(
          'Duo' + ' Hue Angle',
          this.colorArray
        );
        break;
    }
  }

  complementAngle() {
    return this.paletteAngles.getHueComplement(this.primaryColor);
  }

  splitComplementAngle() {
    return this.paletteAngles.getHueSplitComplement(this.primaryColor);
  }

  monoAngle() {
    return this.paletteAngles.getHueMonoChromatic(
      this.primaryColor,
      this.colorAmount
    );
  }

  analogousAngle() {
    return this.paletteAngles.getHueAnalogous(
      this.primaryColor,
      this.colorAmount
    );
  }

  triadAngle() {
    return this.paletteAngles.getHueTriad(this.primaryColor, this.colorAmount);
  }

  tetradAngle() {
    return this.paletteAngles.getHueTetrad(this.primaryColor, this.colorAmount);
  }

  hexadAngle() {
    return this.paletteAngles.getHueHexad(this.primaryColor, this.colorAmount);
  }

  octadAngle() {
    return this.paletteAngles.getHueOctad(this.primaryColor, this.colorAmount);
  }

  neutralAngle() {
    return this.paletteAngles.getHueNeutral(
      this.primaryColor,
      this.colorAmount
    );
  }

  flowerAngle() {
    return this.paletteAngles.getHueFlower(this.primaryColor);
  }

  duoAngle() {
    return this.paletteAngles.getHueDuo(this.primaryColor);
  }

  bouquetAngle() {
    return this.paletteAngles.getHueBouquet(this.primaryColor);
  }

  splitA() {
    return this.paletteAngles.getHueSplitComplementA(
      this.primaryColor,
      this.colorAmount
    );
  }

  splitB() {
    return this.paletteAngles.getHueSplitComplementB(
      this.primaryColor,
      this.colorAmount
    );
  }

  splitC() {
    return this.paletteAngles.getHueSplitComplementC(
      this.primaryColor,
      this.colorAmount
    );
  }

  tone4A() {
    return this.paletteAngles.getHueFourToneA(
      this.primaryColor,
      this.colorAmount
    );
  }

  tone4B() {
    return this.paletteAngles.getHueFourToneB(
      this.primaryColor,
      this.colorAmount
    );
  }

  tone5A() {
    return this.paletteAngles.getHueFiveToneA(
      this.primaryColor,
      this.colorAmount
    );
  }

  tone5B() {
    return this.paletteAngles.getHueFiveToneB(
      this.primaryColor,
      this.colorAmount
    );
  }

  tone5C() {
    return this.paletteAngles.getHueFiveToneC(
      this.primaryColor,
      this.colorAmount
    );
  }

  tone5D() {
    return this.paletteAngles.getHueFiveToneD(
      this.primaryColor,
      this.colorAmount
    );
  }

  tone5E() {
    return this.paletteAngles.getHueFiveToneE(
      this.primaryColor,
      this.colorAmount
    );
  }

  tone6A() {
    return this.paletteAngles.getHueSixToneA(
      this.primaryColor,
      this.colorAmount
    );
  }

  tone6B() {
    return this.paletteAngles.getHueSixToneB(
      this.primaryColor,
      this.colorAmount
    );
  }
}
