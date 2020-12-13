// LICENSE: depends on authors of original paper.
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

import { Injectable } from '@angular/core';
import { CartesianTree } from './cartesian-tree';

@Injectable({
  providedIn: 'root',
})
export class RetinexWhiteProcessorService {
  constructor() {}

  // adjustmentExponent = 0.5;
  // kernelSize = 25;
  // finalFilterSize = 5;
  // upperBound = 255;
  // rFactor = 1.0;
  // N = sprayAmount; // 1-100 // size of cartesian trees, high processing
  // n = spraySize; // 1-500 or 3
  // k = kernelSize; // 1-201 or 25

  getCanvasData(canvas) {
    const context = canvas.getContext('2d');
    return context.getImageData(0, 0, canvas.width, canvas.height);
  }

  setCanvasData(canvas, data) {
    const context = canvas.getContext('2d');
    context.putImageData(data, 0, 0);
  }

  applyRSR(sprayAmount, spraySize, originalCanvas, resultCanvas) {
    const N = sprayAmount; // 1-100
    const n = spraySize; // 1-500
    const resultContext = resultCanvas.getContext('2d');
    const originalData = this.getCanvasData(originalCanvas);
    const resultData = resultContext.createImageData(
      originalCanvas.width,
      originalCanvas.height
    );
    const rsr = this.RandomSprayRetinexPerformWhiteBalance(
      originalData.data,
      originalData.width,
      originalData.height,
      N,
      n,
      255,
      1
    );
    resultData.data.set(rsr);
    this.setCanvasData(resultCanvas, resultData);
  }

  applyRMSR(sprayAmount, spraySize, originalCanvas, resultCanvas) {
    const N = sprayAmount;
    const n = spraySize;
    const resultContext = resultCanvas.getContext('2d');
    const originalData = this.getCanvasData(originalCanvas);
    const resultData = resultContext.createImageData(
      originalCanvas.width,
      originalCanvas.height
    );
    const rmsr = this.RandomMemorySprayRetinexPerformWhiteBalance(
      originalData,
      N,
      n,
      255,
      1
    );
    resultData.data.set(rmsr);
    this.setCanvasData(resultCanvas, resultData);
  }

  applyLRSR(sprayAmount, spraySize, kernelSize, originalCanvas, resultCanvas) {
    const N = sprayAmount;
    const n = spraySize; // 56
    const k = kernelSize; // 25
    const resultContext = resultCanvas.getContext('2d');
    const originalData = this.getCanvasData(originalCanvas);
    const resultData = resultContext.createImageData(
      originalCanvas.width,
      originalCanvas.height
    );
    const rsr = this.RandomSprayRetinexPerformWhiteBalance(
      originalData.data,
      originalCanvas.height,
      originalCanvas.width,
      N,
      n,
      255,
      1
    );
    const lrsr = this.EnhanceRandomRetinex(
      originalData.data,
      rsr,
      originalCanvas.height,
      originalCanvas.width,
      4,
      3,
      k,
      255
    );
    resultData.data.set(lrsr);
    this.setCanvasData(resultCanvas, resultData);
  }

  applyLRMSR(sprayAmount, spraySize, kernelSize, originalCanvas, resultCanvas) {
    const N = sprayAmount;
    const n = spraySize; // 19
    const k = kernelSize; // 25
    const resultContext = resultCanvas.getContext('2d');
    const originalData = this.getCanvasData(originalCanvas);
    const resultData = resultContext.createImageData(
      originalCanvas.width,
      originalCanvas.height
    );
    const rmsr = this.RandomMemorySprayRetinexPerformWhiteBalance(
      originalData,
      N,
      n,
      255,
      1
    );
    const lrmsr = this.EnhanceRandomRetinex(
      originalData.data,
      rmsr,
      originalCanvas.height,
      originalCanvas.width,
      4,
      3,
      k,
      255
    );
    resultData.data.set(lrmsr);
    this.setCanvasData(resultCanvas, resultData);
  }

  applySLRMSR(
    isBrightAdjust,
    isColorCorrect,
    isGif,
    intensityAmount,
    spraySize,
    originalCanvas,
    resultCanvas
  ) {
    const n = spraySize; // 1-200 or 3
    const resultContext = resultCanvas.getContext('2d');
    const originalData = this.getCanvasData(originalCanvas);
    const resultData = resultContext.createImageData(
      originalCanvas.width,
      originalCanvas.height
    );
    const a = intensityAmount; // 0.05-10 or 0.5
    const brightnessAdjustment = isBrightAdjust;
    const colorCorrection = isColorCorrect;
    const gif = isGif;
    const slrmsr = this.SmartLightRandomSpraysRetinexAdjust(
      originalData,
      brightnessAdjustment,
      colorCorrection,
      n,
      gif,
      a,
      25,
      5,
      255.0
    );
    resultData.data.set(slrmsr);
    this.setCanvasData(resultCanvas, resultData);
  }

  RandomSprayRetinexCreateSprays(spraysCount, n, R) {
    const sprays = new Array(spraysCount);

    for (let i = 0; i < spraysCount; ++i) {
      sprays[i] = new Array(n);

      for (let j = 0; j < n; ++j) {
        const angle = 2 * Math.PI * Math.random();
        const r = R * Math.random();

        sprays[i][j] = new Array(2);
        sprays[i][j][0] = Math.floor(r * Math.cos(angle));
        sprays[i][j][1] = Math.floor(r * Math.sin(angle));
      }
    }

    return sprays;
  }

  RandomSprayRetinexPerformWhiteBalance(
    pixelData,
    width,
    height,
    N,
    n,
    upperBound,
    rFactor
  ) {
    const rows = height;
    const cols = width;

    const data = pixelData;
    const result = new Uint8ClampedArray(data.length);

    const R = rFactor * Math.sqrt(rows * rows + cols * cols) + 0.5;

    const spraysCount = 1000 * N;
    const sprays = this.RandomSprayRetinexCreateSprays(spraysCount, n, R);

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const inputPoint = [
          data[4 * (row * cols + col)],
          data[4 * (row * cols + col) + 1],
          data[4 * (row * cols + col) + 2],
          data[4 * (row * cols + col) + 3],
        ];
        const finalPoint = [0, 0, 0, 255];

        for (let i = 0; i < N; ++i) {
          const selectedSpray = Math.floor(Math.random() * (spraysCount - 1));
          const max = [0, 0, 0, 255];

          let restart = true;
          for (let j = 0; j < n; ++j) {
            const newRow = row + sprays[selectedSpray][j][1];
            const newCol = col + sprays[selectedSpray][j][0];

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              restart = false;
              const newPoint = [
                data[4 * (newRow * cols + newCol)],
                data[4 * (newRow * cols + newCol) + 1],
                data[4 * (newRow * cols + newCol) + 2],
                data[4 * (newRow * cols + newCol) + 3],
              ];

              for (let k = 0; k < 3; ++k) {
                if (max[k] < newPoint[k]) {
                  max[k] = newPoint[k];
                }
              }
            }
          }

          if (restart) {
            --i;
            continue;
          }

          for (let k = 0; k < 3; ++k) {
            if (max[k] === 0) {
              max[k] = 1;
            }
            finalPoint[k] += inputPoint[k] / max[k];
          }
        }

        for (let i = 0; i < 3; ++i) {
          finalPoint[i] /= N;
          if (finalPoint[i] > 1) {
            finalPoint[i] = 1;
          }
          result[4 * (row * cols + col) + i] = finalPoint[i] * upperBound;
        }
        result[4 * (row * cols + col) + 3] = 255;
      }
    }

    return result;
  }

  RandomMemorySprayRetinexPerformWhiteBalance(
    source,
    N,
    n,
    upperBound,
    rFactor
  ) {
    const rows = source.height;
    const cols = source.width;

    const data = source.data;
    const result = new Uint8ClampedArray(data.length);

    const R = rFactor * Math.sqrt(rows * rows + cols * cols) + 0.5;

    const spraysCount = 1000 * N;
    const sprays = this.RandomSprayRetinexCreateSprays(spraysCount, n, R);

    const cts = new Array(N);
    for (let i = 0; i < N; ++i) {
      cts[i] = new Array(3);
      for (let j = 0; j < 3; ++j) {
        cts[i][j] = new CartesianTree(1007);
      }
    }

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const inputPoint = [
          data[4 * (row * cols + col)],
          data[4 * (row * cols + col) + 1],
          data[4 * (row * cols + col) + 2],
          data[4 * (row * cols + col) + 3],
        ];
        const finalPoint = [0, 0, 0, 255];

        for (let i = 0; i < N; ++i) {
          const max = [0, 0, 0, 255];

          while (cts[i][0].size() < n) {
            const angle = 2 * Math.PI * Math.random();
            const r = R * Math.random();

            const newRow = row + Math.floor(r * Math.sin(angle));
            const newCol = col + Math.floor(r * Math.cos(angle));

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              const newPoint = [
                data[4 * (newRow * cols + newCol)],
                data[4 * (newRow * cols + newCol) + 1],
                data[4 * (newRow * cols + newCol) + 2],
                data[4 * (newRow * cols + newCol) + 3],
              ];
              for (let k = 0; k < 3; ++k) {
                cts[i][k].push(newPoint[k]);
              }
            }
          }

          for (let k = 0; k < 3; ++k) {
            if (max[k] < cts[i][k].max()) {
              max[k] = cts[i][k].max();
            }

            cts[i][k].pop();
          }

          for (let k = 0; k < 3; ++k) {
            if (max[k] === 0) {
              max[k] = 1;
            }
            finalPoint[k] += inputPoint[k] / max[k];
          }
        }

        for (let i = 0; i < 3; ++i) {
          finalPoint[i] /= N;
          if (finalPoint[i] > 1) {
            finalPoint[i] = 1;
          }
          result[4 * (row * cols + col) + i] = finalPoint[i] * upperBound;
        }
        result[4 * (row * cols + col) + 3] = 255;
      }
    }

    return result;
  }

  BoxFilter(data, rows, cols, channels, processChannels: number, k) {
    const result = new Array(rows * cols * channels);

    const s = new Array((rows + 1) * (cols + 1) * processChannels);

    for (let i = 0; i < s.length; ++i) {
      s[i] = 0;
    }

    for (let ch = 0; ch < processChannels; ++ch) {
      for (let i = 1; i <= rows; ++i) {
        for (let j = 1; j <= cols; ++j) {
          s[processChannels * (i * (cols + 1) + j) + ch] =
            data[channels * ((i - 1) * cols + j - 1) + ch] +
            s[processChannels * (i * (cols + 1) + j - 1) + ch] +
            s[processChannels * ((i - 1) * (cols + 1) + j) + ch] -
            s[processChannels * ((i - 1) * (cols + 1) + j - 1) + ch];
        }
      }
    }

    for (let ch = processChannels; ch < channels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            data[channels * (i * cols + j) + ch];
        }
      }
    }

    const move = Math.floor(k / 2);
    const back = (k + 1) % 2;

    for (let ch = 0; ch < processChannels; ++ch) {
      for (let row = 1; row <= rows; ++row) {
        let startRow = row - move - back - 1;
        let endRow = row + move;

        if (startRow < 0) {
          startRow = 0;
        }
        if (endRow > rows) {
          endRow = rows;
        }

        for (let col = 1; col <= cols; ++col) {
          let startCol = col - move - back - 1;
          let endCol = col + move;

          if (startCol < 0) {
            startCol = 0;
          }
          if (endCol > cols) {
            endCol = cols;
          }

          const sum =
            s[processChannels * (endRow * (cols + 1) + endCol) + ch] -
            s[processChannels * (startRow * (cols + 1) + endCol) + ch] -
            s[processChannels * (endRow * (cols + 1) + startCol) + ch] +
            s[processChannels * (startRow * (cols + 1) + startCol) + ch];
          const count = (endRow - startRow) * (endCol - startCol);

          result[channels * ((row - 1) * cols + col - 1) + ch] = sum / count;
        }
      }
    }

    return result;
  }

  NormalizeIlluminant(
    illuminant,
    rows,
    cols,
    channels,
    processChannels: number
  ) {
    const result = new Array(rows * cols * channels);

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        let sum = 0;
        for (let ch = 0; ch < 3; ++ch) {
          sum += illuminant[channels * (i * cols + j) + ch];
        }
        const avg = (sum /= 3);
        for (let ch = 0; ch < 3; ++ch) {
          result[channels * (i * cols + j) + ch] =
            illuminant[channels * (i * cols + j) + ch] / avg;
        }
      }
    }

    for (let ch = processChannels; ch < channels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            illuminant[channels * (i * cols + j) + ch];
        }
      }
    }

    return result;
  }

  GuidedImageFilter(p, I, rows, cols, channels, processChannels, r, epsilon) {
    const meanI = this.BoxFilter(I, rows, cols, channels, processChannels, r);

    const meanP = this.BoxFilter(p, rows, cols, channels, processChannels, r);

    const corrI = this.BoxFilter(
      this.multiply(I, I, rows, cols, channels, processChannels),
      rows,
      cols,
      channels,
      processChannels,
      r
    );

    const corrIp = this.BoxFilter(
      this.multiply(I, p, rows, cols, channels, processChannels),
      rows,
      cols,
      channels,
      processChannels,
      r
    );

    const varI = this.subtract(
      corrI,
      this.multiply(meanI, meanI, rows, cols, channels, processChannels),
      rows,
      cols,
      channels,
      processChannels
    );

    const covIp = this.subtract(
      corrIp,
      this.multiply(meanI, meanP, rows, cols, channels, processChannels),
      rows,
      cols,
      channels,
      processChannels
    );

    const a = this.divide(
      covIp,
      this.addNumber(varI, epsilon, rows, cols, channels, processChannels),
      rows,
      cols,
      channels,
      processChannels,
      255
    );

    const b = this.subtract(
      meanP,
      this.multiply(a, meanI, rows, cols, channels, processChannels),
      rows,
      cols,
      channels,
      processChannels
    );

    const meanA = this.BoxFilter(a, rows, cols, channels, processChannels, r);

    const meanB = this.BoxFilter(b, rows, cols, channels, processChannels, r);

    const result = this.add(
      this.multiply(meanA, I, rows, cols, channels, processChannels),
      meanB,
      rows,
      cols,
      channels,
      processChannels
    );

    return result;
  }

  EnhanceRandomRetinex(
    source,
    retinex,
    rows,
    cols,
    channels,
    processChannels,
    k,
    upperBound
  ) {
    let inputSource = new Array(source.length);
    for (let i = 0; i < source.length; ++i) {
      inputSource[i] = source[i];
    }

    let inputRetinex = new Array(retinex.length);
    for (let i = 0; i < retinex.length; ++i) {
      inputRetinex[i] = retinex[i];
    }

    if (k > 1) {
      inputSource = this.BoxFilter(
        inputSource,
        rows,
        cols,
        channels,
        processChannels,
        k
      );
      inputRetinex = this.BoxFilter(
        inputRetinex,
        rows,
        cols,
        channels,
        processChannels,
        k
      );
    }

    let illuminant = this.divide(
      inputSource,
      inputRetinex,
      rows,
      cols,
      channels,
      processChannels,
      upperBound
    );

    if (k > 1) {
      illuminant = this.BoxFilter(
        illuminant,
        rows,
        cols,
        channels,
        processChannels,
        k
      );
    }

    const result = this.divide(
      source,
      illuminant,
      rows,
      cols,
      channels,
      processChannels,
      upperBound
    );

    return result;
  }

  addNumber(a, b, rows, cols, channels, processChannels: number) {
    const result = new Array(rows * cols * channels);

    for (let ch = 0; ch < processChannels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch] + b;
        }
      }
    }

    for (let ch = processChannels; ch < channels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch];
        }
      }
    }

    return result;
  }

  pow(a, b, rows, cols, channels, processChannels: number) {
    const result = new Array(rows * cols * channels);

    for (let ch = 0; ch < processChannels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] = Math.pow(
            a[channels * (i * cols + j) + ch],
            b
          );
        }
      }
    }

    for (let ch = processChannels; ch < channels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch];
        }
      }
    }

    return result;
  }

  subtract(a, b, rows, cols, channels, processChannels: number) {
    const result = new Array(rows * cols * channels);

    for (let ch = 0; ch < processChannels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch] -
            b[channels * (i * cols + j) + ch];
        }
      }
    }

    for (let ch = processChannels; ch < channels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch];
        }
      }
    }

    return result;
  }

  add(a, b, rows, cols, channels, processChannels: number) {
    const result = new Array(rows * cols * channels);

    for (let ch = 0; ch < processChannels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch] +
            b[channels * (i * cols + j) + ch];
        }
      }
    }

    for (let ch = processChannels; ch < channels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch];
        }
      }
    }

    return result;
  }

  multiply(a, b, rows, cols, channels, processChannels: number) {
    const result = new Array(rows * cols * channels);

    for (let ch = 0; ch < processChannels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch] *
            b[channels * (i * cols + j) + ch];
        }
      }
    }

    for (let ch = processChannels; ch < channels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch];
        }
      }
    }

    return result;
  }

  divide(a, b, rows, cols, channels, processChannels: number, max) {
    const result = new Array(rows * cols * channels);

    for (let ch = 0; ch < processChannels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          if (b[channels * (i * cols + j) + ch] === 0) {
            if (a[channels * (i * cols + j) + ch] === 0) {
              result[channels * (i * cols + j) + ch] = 0;
            } else {
              result[channels * (i * cols + j) + ch] = max;
            }
          } else {
            result[channels * (i * cols + j) + ch] =
              a[channels * (i * cols + j) + ch] /
              b[channels * (i * cols + j) + ch];
          }
        }
      }
    }

    for (let ch = processChannels; ch < channels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            a[channels * (i * cols + j) + ch];
        }
      }
    }

    return result;
  }

  EstimateLocalIlumination(
    source,
    N,
    n,
    inputKernelSize,
    illuminantKernelSize,
    upperBound,
    rFactor
  ) {
    const retinex = this.RandomMemorySprayRetinexPerformWhiteBalance(
      source,
      N,
      n,
      255,
      1
    );

    let inputSource = new Array(source.data.length);
    for (let i = 0; i < source.data.length; ++i) {
      inputSource[i] = source.data[i];
    }

    let inputRetinex = new Array(retinex.length);
    for (let i = 0; i < retinex.length; ++i) {
      inputRetinex[i] = retinex[i];
    }

    const rows = source.height;
    const cols = source.width;
    const channels = 4;
    const processChannels = 3;

    if (inputKernelSize > 1) {
      inputSource = this.BoxFilter(
        inputSource,
        rows,
        cols,
        channels,
        processChannels,
        inputKernelSize
      );
      inputRetinex = this.BoxFilter(
        inputRetinex,
        rows,
        cols,
        channels,
        processChannels,
        inputKernelSize
      );
    }

    let illuminant = this.divide(
      inputSource,
      inputRetinex,
      rows,
      cols,
      channels,
      processChannels,
      255
    );

    if (illuminantKernelSize > 1) {
      illuminant = this.BoxFilter(
        illuminant,
        rows,
        cols,
        channels,
        processChannels,
        illuminantKernelSize
      );
    }

    return illuminant;
  }

  GuidedEstimateLocalIlumination(
    source,
    N,
    n,
    inputKernelSize,
    illuminantKernelSize,
    upperBound,
    rFactor
  ) {
    const retinex = this.RandomMemorySprayRetinexPerformWhiteBalance(
      source,
      N,
      n,
      255,
      1
    );

    let inputSource = new Array(source.data.length);
    for (let i = 0; i < source.data.length; ++i) {
      inputSource[i] = source.data[i];
    }

    let inputRetinex = new Array(retinex.length);
    for (let i = 0; i < retinex.length; ++i) {
      inputRetinex[i] = retinex[i];
    }

    const rows = source.height;
    const cols = source.width;
    const channels = 4;
    const processChannels = 3;

    const value = 40;
    const epsilon = value * value;
    if (inputKernelSize > 1) {
      inputSource = this.GuidedImageFilter(
        inputSource,
        source.data,
        rows,
        cols,
        channels,
        processChannels,
        inputKernelSize,
        epsilon
      );
      inputRetinex = this.GuidedImageFilter(
        inputRetinex,
        source.data,
        rows,
        cols,
        channels,
        processChannels,
        inputKernelSize,
        epsilon
      );
    }

    let illuminant = this.divide(
      inputSource,
      inputRetinex,
      rows,
      cols,
      channels,
      processChannels,
      255
    );

    if (illuminantKernelSize > 1) {
      illuminant = this.GuidedImageFilter(
        illuminant,
        source.data,
        rows,
        cols,
        channels,
        processChannels,
        illuminantKernelSize,
        epsilon
      );
    }

    return illuminant;
  }

  ApplyIllumination(source, illuminant, upperBound) {
    const result = this.divide(
      source.data,
      illuminant,
      source.height,
      source.width,
      4,
      3,
      255
    );
    return result;
  }

  CombineImages(img1, img2, map, rows, cols, channels, processChannels) {
    const result = new Array(rows * cols * channels);

    const g1 = this.GetGrayscale(img1, 4);
    const g2 = this.GetGrayscale(img2, 4);

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        const a = g2[i * cols + j];
        const b = g1[i * cols + j];

        const f = map[i * cols + j];

        for (let k = 0; k < 3; ++k) {
          result[channels * (i * cols + j) + k] =
            img1[channels * (i * cols + j) + k] * f +
            img2[channels * (i * cols + j) + k] * (1 - f);
        }
      }
    }

    for (let ch = processChannels; ch < channels; ++ch) {
      for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {
          result[channels * (i * cols + j) + ch] =
            img1[channels * (i * cols + j) + ch];
        }
      }
    }

    return result;
  }

  GetGrayscale(data, channels) {
    const result = new Array(data.length / channels);
    for (let i = 0; i < data.length; i += channels) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const gray = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      result[i / channels] = gray;
    }
    return result;
  }

  // adjustmentExponent 0.05-10
  SmartLightRandomSpraysRetinexAdjust(
    source,
    adjustBrightness,
    adjustColors,
    n,
    guidedFilter,
    adjustmentExponent,
    kernelSize,
    finalFilterSize,
    upperBound
  ) {
    if (adjustBrightness === false && adjustColors === false) {
      return source.data;
    }

    const gray = this.GetGrayscale(source.data, 4);

    let illumination;

    if (guidedFilter) {
      illumination = this.GuidedEstimateLocalIlumination(
        source,
        1,
        n,
        kernelSize,
        kernelSize,
        upperBound,
        1
      );
    } else {
      illumination = this.EstimateLocalIlumination(
        source,
        1,
        n,
        kernelSize,
        kernelSize,
        upperBound,
        1
      );
    }

    const rows = source.height;
    const cols = source.width;

    let result;
    if (adjustBrightness) {
      const lrsr = this.ApplyIllumination(source, illumination, upperBound);

      const lrsrGray = this.GetGrayscale(lrsr, 4);

      const f = this.divide(lrsrGray, gray, rows, cols, 1, 1, 255);

      const result1 = new Array(source.data.length);
      for (let i = 0; i < source.data.length; i += 4) {
        result1[i + 0] = source.data[i + 0] * f[i / 4];
        result1[i + 1] = source.data[i + 1] * f[i / 4];
        result1[i + 2] = source.data[i + 2] * f[i / 4];
        result1[i + 3] = source.data[i + 3];
      }

      let grayMap = new Array(gray.length);
      for (let i = 0; i < gray.length; ++i) {
        grayMap[i] = gray[i] / upperBound;
      }

      grayMap = this.pow(grayMap, adjustmentExponent, rows, cols, 1, 1);

      result = this.CombineImages(
        source.data,
        result1,
        grayMap,
        rows,
        cols,
        4,
        3
      );

      const gray1 = gray;
      const gray2 = this.GetGrayscale(result, 4);

      let f2 = this.divide(gray2, gray1, rows, cols, 1, 1, 255);

      if (guidedFilter) {
        const value = 30;
        const epsilon = value * value;
        f2 = this.GuidedImageFilter(
          f2,
          gray,
          rows,
          cols,
          1,
          1,
          finalFilterSize,
          epsilon
        );
      } else {
        f2 = this.BoxFilter(f2, rows, cols, 1, 1, finalFilterSize);
      }

      const result2 = new Array(source.data.length);
      for (let i = 0; i < source.data.length; i += 4) {
        result2[i + 0] = source.data[i + 0] * f2[i / 4];
        result2[i + 1] = source.data[i + 1] * f2[i / 4];
        result2[i + 2] = source.data[i + 2] * f2[i / 4];
        result2[i + 3] = source.data[i + 3];
      }

      result = result2;
    } else {
      result = new Array(source.data.length);
      for (let i = 0; i < source.data.length; ++i) {
        result[i] = source.data[i];
      }
    }

    if (adjustColors) {
      illumination = this.NormalizeIlluminant(illumination, rows, cols, 4, 3);

      result = this.divide(result, illumination, rows, cols, 4, 3, 255);
    }

    return result;
  }
}
