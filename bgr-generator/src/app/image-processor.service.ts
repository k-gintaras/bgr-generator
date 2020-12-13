// Copyright: 2020, https://github.com/k-gintaras
// LICENSES:
// Chroma.js, custom (MIT like) and Apache 2
// RgbQuant.js, MIT
// ColorThief, MIT
// node-vibrant, MIT

import { Injectable } from '@angular/core';
import * as chroma from 'chroma-js/chroma.js';
import ColorThief from 'colorthief';

@Injectable({
  providedIn: 'root',
})
export class ImageProcessorService {
  constructor() {}

  // onFileSelected(event) {
  //   let f = event.target.files[0];
  //   this.file = f;
  //   this.imageSize = f.size;
  //   this.imageType = f.type;
  //   this.processFile();
  // }

  // processFile() {
  //   this.canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  //   this.img = new Image();
  //   const url = URL.createObjectURL(this.file);
  //   this.img.src = url;
  //   this.img.onload = (event) => {
  //     this.imageProcessor.displayFitImageOnCanvas(this.img, this.canvas, 1000);
  //   };
  // }

  // this.img = new Image();
  // const url = URL.createObjectURL(this.file);
  // this.img.src = url;
  displayFitImageOnCanvas(image, canvas, size: number) {
    this.fitImageResizeCanvas(image, canvas, size);
  }

  getImageFromUrl(url) {
    const img = new Image();
    img.src = url;
    return img;
  }

  getColorsFromCanvas(canvas, skipPixels) {
    return this.getColorsFromImageData(
      this.getImageDataFromCanvas(canvas),
      skipPixels
    );
  }

  displayImageOnCanvas(image, canvas) {
    this.fitImageToCanvas(image, canvas);
  }

  getColorsFromImageData(imageData, skipPixels: number): any[] {
    const colors = [];
    for (let i = 0; i < imageData.data.length; i += 4 * skipPixels) {
      const red = imageData.data[i];
      const green = imageData.data[i + 1];
      const blue = imageData.data[i + 2];
      // const alpha = imageData.data[i + 3]; chroma does not like alpha added
      const col = [red, green, blue];
      const chromaColor = chroma(col);
      colors.push(chromaColor);
    }
    return colors;
  }

  getImageDataFromCanvas(canvas) {
    return canvas
      .getContext('2d')
      .getImageData(0, 0, canvas.width, canvas.height);
  }

  // so that color scheme generators would not pick canvas background
  fitImageResizeCanvas(image, canvas, size) {
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const wrh = image.width / image.height;
    let newWidth = canvas.width;
    let newHeight = newWidth / wrh;
    if (newHeight > canvas.height) {
      newHeight = canvas.height;
      newWidth = newHeight * wrh;
    }
    // resize canvas back to fit image
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
  }

  displayCanvasOnCanvas(
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement
  ) {
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.drawImage(canvas1, 0, 0, canvas2.width, canvas2.height);
  }

  // fit image into whatever the size of canvas
  fitImageToCanvas(image, canvas) {
    const ctx = canvas.getContext('2d');
    let x = 0;
    let y = 0;

    const wrh = image.width / image.height;
    let newWidth = canvas.width;
    let newHeight = newWidth / wrh;
    if (newHeight > canvas.height) {
      newHeight = canvas.height;
      newWidth = newHeight * wrh;
    }
    // center image, not just draw from top
    if (canvas.height > newHeight) {
      y = Math.round((canvas.height - newHeight) / 2);
    }
    if (canvas.width > newWidth) {
      x = Math.round((canvas.width - newWidth) / 2);
    }
    // clear previous image in case it was loaded
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y, newWidth, newHeight);
  }

  // img = new Image();
  // const url = URL.createObjectURL(this.file);
  // img.src = url;
  // onload
  getColorThiefPalette(img: HTMLImageElement, colorCount) {
    const colorThief = new ColorThief();
    const imgCopy = img;
    const p = colorThief.getPalette(imgCopy, parseInt(colorCount, 10));
    const colors = this.getMatrixToHexArr(p);
    return colors;
  }

  // img.src
  // onload
  getVibrantPalette(imgSrc: HTMLImageElement) {
    const Vibrant = require('node-vibrant');
    const pal = Vibrant.from(imgSrc, { colorCount: 64 }, 3)
      .getPalette()
      .then((palette) => {
        const col = [];
        col.push(palette.DarkMuted.hex);
        col.push(palette.DarkVibrant.hex);
        // col.push(palette.LightMuted.hex); //not very interesting color
        col.push(palette.LightVibrant.hex);
        col.push(palette.Muted.hex);
        col.push(palette.Vibrant.hex);
        return col;
      });
    return pal;
  }

  getMatrixToHexArr(matrix) {
    const colors = [];
    for (const item of matrix) {
      const row = item.slice(0, 3);
      const hex = chroma(row).hex();
      colors.push(hex);
    }
    return colors;
  }

  getRgbQuantPalette(canvas, colorCount) {
    const RgbQuant = require('rgbquant');
    const q = new RgbQuant({
      colors: colorCount,
      method: 1, // histogram method, 2: min-population threshold within subregions; 1: global top-population,
      // boxSize: [64, 64],
      // minHueCols: 5,
      // colorDist: 'manhattan', //euclidean
    });
    q.sample(canvas);
    const pal = q.palette(true);
    const colors = this.getMatrixToHexArr(pal);
    return colors;
  }

  getImageToMatrix(canvas, skipPixelCount): [][] {
    const matrix = [];
    const rowsY = Math.round(canvas.width / skipPixelCount);
    const colsX = Math.round(canvas.height / skipPixelCount);
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < rowsY; i++) {
      const row = [];
      const x1 = i * skipPixelCount;
      for (let j = 0; j < colsX; j++) {
        const y1 = j * skipPixelCount;
        const px = this.getPixel(ctx, x1, y1);
        const col = this.getPixelColor(px);
        row.push(col);
      }
      matrix.push(row);
    }
    return matrix;
  }

  getPixelColor(px) {
    return 'rgba(' + px[0] + ',' + px[1] + ',' + px[2] + ',' + px[3] + ')';
  }

  getPixel(ctx: CanvasRenderingContext2D, x: number, y: number) {
    return ctx.getImageData(x, y, 1, 1).data;
  }
}
