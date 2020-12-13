// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
import { Component, OnInit, Input } from '@angular/core';
import { InputsOutputsService } from '../inputs-outputs.service';
import { MathfriendService } from '../mathfriend.service';
import * as chroma from 'chroma-js/chroma.js';

@Component({
  selector: 'app-palette-overview',
  templateUrl: './palette-overview.component.html',
  styleUrls: ['./palette-overview.component.css'],
})
export class PaletteOverviewComponent implements OnInit {
  // @Input() backgroundMainColor = '#fffff';
  // @Input() backgroundColor = '#ffffff';
  // @Input() borderColor = '#000fff';
  // @Input() squareColor = '#00ffff';
  // @Input() circleColor = '#0fffff';

  colorPalette = [
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
    chroma.random().hex(),
  ];
  @Input() exampleHeight = 400 + 'px';
  @Input() isNotWhiteBackground = false;

  constructor(
    private ioService: InputsOutputsService,
    private m: MathfriendService
  ) {}

  ngOnInit() {
    if (window.innerWidth > window.innerHeight) {
      this.exampleHeight = Math.round(window.innerWidth / 3) - 10 + 'px';
    }

    this.ioService.getColorsObservable().subscribe((colorArray) => {
      if (colorArray.length && colorArray.length > 0) {
        this.colorPalette = colorArray;
      }
    });
  }

  setWhite() {
    if (this.isNotWhiteBackground) {
      this.isNotWhiteBackground = false;
    } else {
      this.isNotWhiteBackground = true;
    }
  }

  shuffle() {
    this.colorPalette = this.m.shuffle(this.colorPalette);
  }

  getGradient() {
    if (this.colorPalette.length > 1) {
      const styles = {
        'background-image':
          'linear-gradient(135deg,' + this.colorPalette.join(',') + ')',
        'background-repeat': 'no-repeat',
      };
      return styles;
    }
    return {
      'background-image': 'linear-gradient(135deg,' + 'black,white' + ')',
      'background-repeat': 'no-repeat',
    };
  }
}
