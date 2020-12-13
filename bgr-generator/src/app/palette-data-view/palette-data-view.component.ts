// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
// color-namer, MIT
import { Component, OnInit, Input } from '@angular/core';
import { InputsOutputsService } from '../inputs-outputs.service';
import * as chroma from 'chroma-js/chroma.js';
import * as colorNamer from 'color-namer';

@Component({
  selector: 'app-palette-data-view',
  templateUrl: './palette-data-view.component.html',
  styleUrls: ['./palette-data-view.component.css'],
})
export class PaletteDataViewComponent implements OnInit {
  constructor(private ioService: InputsOutputsService) {}
  dataTitles = [
    'Name',
    'Hex',
    'Luminance',
    'Css',
    'Rgb',
    'Rgba',
    'Hsl',
    'Hsv',
    'Hsi',
    'Lab',
    'Lch',
    'Hcl',
    'Temperature',
    'Gl',
    'Html Hex',
    'Html Name',
  ];
  fastDataTitles = [
    'Hex',
    'Luminance',
    'Css',
    'Rgb',
    'Rgba',
    'Hsl',
    'Hsv',
    'Hsi',
    'Lab',
    'Lch',
    'Hcl',
    'Temperature',
    'Gl',
  ];
  slowDataTitles = ['Name', 'Html Hex', 'Html Name'];

  @Input() colorPalette = [
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
  ];

  currentDataTitle = '';
  currentData = [];
  currentDataText = '';
  @Input() isArrayHuge = false;
  @Input() selectedTitle = 'Hex';

  colorArrayData = new Map();

  ngOnInit() {
    this.refresh();
    this.currentDataTitle = 'Hex';
    this.currentDataText = this.getNewColorArrayData('Hex').join(', ');
    if (this.colorPalette.length > 50) {
      this.isArrayHuge = true;
    }
  }

  refresh() {
    const colorArray: string[] = this.ioService.getLastColors();
    if (colorArray !== undefined) {
      if (colorArray.length && colorArray.length > 0) {
        this.colorPalette = colorArray;
      }
    }

    this.colorArrayData = new Map();
  }

  isArraysEqual(a1, a2) {
    return JSON.stringify(a1) === JSON.stringify(a2);
  }

  getColorArrayData(typeOfData) {
    if (
      this.colorArrayData &&
      this.colorArrayData.size === this.dataTitles.length
    ) {
      return this.colorArrayData.get(typeOfData);
    } else {
      const data = this.getNewColorArrayData(typeOfData);
      this.colorArrayData.set(typeOfData, data);
      return data;
    }
  }

  getNewColorArrayData(typeOfData) {
    const data = [];
    for (const color of this.colorPalette) {
      const colorData = this.getColorData(typeOfData, color);
      data.push(colorData);
    }
    return data;
  }

  displayColorArrayData(typeOfData) {
    const data = this.getColorArrayData(typeOfData);
    this.currentDataTitle = typeOfData;

    this.currentData = data;
    this.currentDataText = data.join(', ');
  }

  asString(data) {
    if (data) {
      return data.join(', ');
    } else {
      return '';
    }
  }

  getColorData(typeOfData, color) {
    switch (typeOfData) {
      case this.dataTitles[0]:
        return this.getName(color);

      case this.dataTitles[1]:
        return this.getHex(color);

      case this.dataTitles[2]:
        return this.getLuminance(color);

      case this.dataTitles[3]:
        return this.getCss(color);

      case this.dataTitles[4]:
        return this.getRgb(color);

      case this.dataTitles[5]:
        return this.getRgba(color);

      case this.dataTitles[6]:
        return this.getHsl(color);

      case this.dataTitles[7]:
        return this.getHsv(color);

      case this.dataTitles[8]:
        return this.getHsi(color);

      case this.dataTitles[9]:
        return this.getLab(color);

      case this.dataTitles[10]:
        return this.getLch(color);

      case this.dataTitles[11]:
        return this.getHcl(color);

      case this.dataTitles[12]:
        return this.getTemperature(color);

      case this.dataTitles[13]:
        return this.getGl(color);

      case this.dataTitles[14]:
        return this.getHtmlHex(color);

      case this.dataTitles[15]:
        return this.getHtmlName(color);

      default:
        return this.getHex(color);
    }
  }

  getHtmlName(color) {
    return colorNamer(color).html[0].name;
  }

  getHtmlHex(color) {
    return colorNamer(color).html[0].hex;
  }

  getName(color) {
    return colorNamer(color).ntc[0].name;
  }

  getHex(color) {
    return chroma(color).hex();
  }

  getLuminance(color) {
    return chroma(color).luminance();
  }

  getCss(color) {
    return chroma(color).css();
  }

  getRgb(color) {
    return chroma(color).rgb();
  }

  getRgba(color) {
    return chroma(color).rgba();
  }

  getHsl(color) {
    return chroma(color).hsl();
  }

  getHsv(color) {
    return chroma(color).hsv();
  }

  getHsi(color) {
    return chroma(color).hsi();
  }

  getLab(color) {
    return chroma(color).lab();
  }

  getLch(color) {
    return chroma(color).lch();
  }

  getHcl(color) {
    return chroma(color).hcl();
  }

  getTemperature(color) {
    return chroma(color).temperature();
  }

  getGl(color) {
    return chroma(color).gl();
  }
}
