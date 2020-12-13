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
import { FireflyConstantService } from './firefly-constant.service';

@Injectable({
  providedIn: 'root',
})
export class FireflyContrastProcessorService {
  constructor(private constants: FireflyConstantService) {}
  lut = this.constants.getLut();
  getCanvasData(canvas) {
    const context = canvas.getContext('2d');
    return context.getImageData(0, 0, canvas.width, canvas.height);
  }

  setCanvasData(canvas, data) {
    const context = canvas.getContext('2d');
    context.putImageData(data, 0, 0);
  }

  performFirefly(originalCanvas, resultCanvas, isFiltered) {
    const resultContext = resultCanvas.getContext('2d');

    let originalData = this.getCanvasData(originalCanvas);

    const grayscaleData = resultContext.createImageData(
      originalCanvas.width,
      originalCanvas.height
    );
    const meanData = resultContext.createImageData(
      originalCanvas.width,
      originalCanvas.height
    );
    const mappedData = resultContext.createImageData(
      originalCanvas.width,
      originalCanvas.height
    );

    const grayscale = this.getGrayscale(originalData.data);
    grayscaleData.data.set(grayscale);

    const mean = this.calculateMean(grayscaleData, 30, 5, 2);
    meanData.data.set(mean);

    originalData = this.getCanvasData(originalCanvas);
    const mapped = this.mapBrightness(
      originalData,
      grayscaleData,
      meanData,
      isFiltered
    );
    mappedData.data.set(mapped);

    this.setCanvasData(resultCanvas, mappedData);
  }

  getGrayscale(d) {
    for (let i = 0; i < d.length; i += 4) {
      const red = d[i];
      const green = d[i + 1];
      const blue = d[i + 2];
      const gray = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      d[i] = d[i + 1] = d[i + 2] = gray;
    }
    return d;
  }

  calculateMean(imageData, sprayPoolResolution, spread, refine) {
    const integral = new Array(sprayPoolResolution * sprayPoolResolution);
    const average = new Array(sprayPoolResolution * sprayPoolResolution);

    const rows = imageData.height;
    const cols = imageData.width;

    const data = new Array(imageData.data.length / 4);
    for (let i = 0; i < data.length; ++i) {
      data[i] = imageData.data[i * 4];
    }

    const mean = new Array(imageData.data.length);
    const result = new Uint8ClampedArray(imageData.data.length);

    for (let i = 0; i < sprayPoolResolution; ++i) {
      for (let j = 0; j < sprayPoolResolution; ++j) {
        const cr = Math.floor((i * (rows - 1)) / (sprayPoolResolution - 1));
        const cc = Math.floor((j * (cols - 1)) / (sprayPoolResolution - 1));

        integral[i * sprayPoolResolution + j] = data[cr * cols + cc];

        if (i > 0 && j > 0) {
          integral[i * sprayPoolResolution + j] +=
            integral[(i - 1) * sprayPoolResolution + j] +
            integral[i * sprayPoolResolution + (j - 1)] -
            integral[(i - 1) * sprayPoolResolution + (j - 1)];
        } else if (i > 0) {
          integral[i * sprayPoolResolution + j] +=
            integral[(i - 1) * sprayPoolResolution + j];
        } else if (j > 0) {
          integral[i * sprayPoolResolution + j] +=
            integral[i * sprayPoolResolution + (j - 1)];
        }
      }
    }

    for (let i = 0; i < sprayPoolResolution; ++i) {
      let i1 = i - spread - 1;
      let i2 = i + spread;
      if (i1 < 0) {
        i1 = 0;
      }
      if (i2 >= sprayPoolResolution) {
        i2 = sprayPoolResolution - 1;
      }
      for (let j = 0; j < sprayPoolResolution; ++j) {
        let j1 = j - spread - 1;
        let j2 = j + spread;
        if (j1 < 0) {
          j1 = 0;
        }
        if (j2 >= sprayPoolResolution) {
          j2 = sprayPoolResolution - 1;
        }
        average[i * sprayPoolResolution + j] =
          integral[i2 * sprayPoolResolution + j2] -
          integral[i2 * sprayPoolResolution + j1] -
          integral[i1 * sprayPoolResolution + j2] +
          integral[i1 * sprayPoolResolution + j1];
        average[i * sprayPoolResolution + j] /= (i2 - i1) * (j2 - j1);
      }
    }

    for (let r = 0; r < refine; ++r) {
      for (let i = 0; i < sprayPoolResolution; ++i) {
        for (let j = 0; j < sprayPoolResolution; ++j) {
          const cr = Math.floor((i * (rows - 1)) / (sprayPoolResolution - 1));
          const cc = Math.floor((j * (cols - 1)) / (sprayPoolResolution - 1));
          integral[i * sprayPoolResolution + j] =
            average[i * sprayPoolResolution + j];

          if (i > 0 && j > 0) {
            integral[i * sprayPoolResolution + j] +=
              integral[(i - 1) * sprayPoolResolution + j] +
              integral[i * sprayPoolResolution + (j - 1)] -
              integral[(i - 1) * sprayPoolResolution + (j - 1)];
          } else if (i > 0) {
            integral[i * sprayPoolResolution + j] +=
              integral[(i - 1) * sprayPoolResolution + j];
          } else if (j > 0) {
            integral[i * sprayPoolResolution + j] +=
              integral[i * sprayPoolResolution + (j - 1)];
          }
        }
      }

      for (let i = 0; i < sprayPoolResolution; ++i) {
        let i1 = i - spread - 1;
        let i2 = i + spread;
        if (i1 < 0) {
          i1 = 0;
        }
        if (i2 >= sprayPoolResolution) {
          i2 = sprayPoolResolution - 1;
        }
        for (let j = 0; j < sprayPoolResolution; ++j) {
          let j1 = j - spread - 1;
          let j2 = j + spread;
          if (j1 < 0) {
            j1 = 0;
          }
          if (j2 >= sprayPoolResolution) {
            j2 = sprayPoolResolution - 1;
          }
          average[i * sprayPoolResolution + j] =
            integral[i2 * sprayPoolResolution + j2] -
            integral[i2 * sprayPoolResolution + j1] -
            integral[i1 * sprayPoolResolution + j2] +
            integral[i1 * sprayPoolResolution + j1];
          average[i * sprayPoolResolution + j] /= (i2 - i1) * (j2 - j1);
        }
      }
    }

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const resolutionRow = Math.floor(
          ((sprayPoolResolution - 1) * row) / (rows - 1)
        );
        const resolutionCol = Math.floor(
          ((sprayPoolResolution - 1) * col) / (cols - 1)
        );

        let current = 0.0;

        const r1 = resolutionRow;
        let r2 = resolutionRow + 1;
        const c1 = resolutionCol;
        let c2 = resolutionCol + 1;

        if (r2 >= sprayPoolResolution) {
          r2 = r1;
        }
        if (c2 >= sprayPoolResolution) {
          c2 = c1;
        }

        const cr = Math.floor((r1 * (rows - 1)) / (sprayPoolResolution - 1));
        const cc = Math.floor((c1 * (cols - 1)) / (sprayPoolResolution - 1));
        const cr2 = Math.floor((r2 * (rows - 1)) / (sprayPoolResolution - 1));
        const cc2 = Math.floor((c2 * (cols - 1)) / (sprayPoolResolution - 1));

        const v00 = average[r1 * sprayPoolResolution + c1];
        const v01 = average[r1 * sprayPoolResolution + c2];
        const v10 = average[r2 * sprayPoolResolution + c1];
        const v11 = average[r2 * sprayPoolResolution + c2];

        const w00 = (cr2 - row) * (cc2 - col);
        const w01 = (cr2 - row) * (col - cc);
        const w10 = (row - cr) * (cc2 - col);
        const w11 = (row - cr) * (col - cc);

        if (w00 + w01 + w10 + w11 === 0) {
          current = average[r1 * sprayPoolResolution + c1];
        } else {
          current = w00 * v00 + w01 * v01 + w10 * v10 + w11 * v11;
          current /= w00 + w01 + w10 + w11;
        }

        mean[row * cols + col] = current;
      }
    }

    for (let i = 0; i < mean.length; ++i) {
      result[4 * i] = result[4 * i + 1] = result[4 * i + 2] = Math.floor(
        mean[i]
      );
      result[4 * i + 3] = 255;
    }

    return result;
  }

  mapBrightness(imageData, grayscale, mean, filtering) {
    const rows = imageData.height;
    const cols = imageData.width;

    const result = new Uint8ClampedArray(imageData.data.length);
    const factors = new Array(rows * cols);
    const data = grayscale.data;
    const meanData = mean.data;
    for (let i = 0; i < imageData.data.length; ++i) {
      result[i] = imageData.data[i];
    }

    const upperBound = 255;
    const lowerBound = 0;

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const t = meanData[4 * (row * cols + col)];
        const grayOriginal = data[4 * (row * cols + col)];

        const x = grayOriginal;
        const y = t;

        let grayNew = this.lut[256 * grayOriginal + t];
        // let grayNew = this.constants.getLut[256 * grayOriginal + t];

        if (grayNew > upperBound) {
          grayNew = upperBound;
        } else if (grayNew < lowerBound) {
          grayNew = lowerBound;
        }

        let factor = 1.0;
        if (grayOriginal === 0) {
          factor = 1.0;
        } else {
          factor = grayNew / grayOriginal;
        }

        for (let ch = 0; ch < 3; ++ch) {
          if (factor * result[4 * (row * cols + col) + ch] > upperBound) {
            factor = upperBound / result[4 * (row * cols + col) + ch];
          }
        }
        factors[row * cols + col] = factor;
      }
    }

    if (filtering) {
      const rowD = 1;
      const colD = 1;

      /*
		var a=new Array(rows*cols);
		var b=new Array(rows*cols);

		var epsilon=0.015*0.015;

		for (var row=0;row<rows;++row){
			for (var col=0;col<cols;++col){

				var count=0;

				var meanI=0;
				var meanp=0;
				var corrI=0;
				var corrIp=0;

				for (var i=row-rowD;i<=row+rowD;++i){
					for (var j=col-colD;j<=col+colD;++j){

						if (i>=0 && i<rows && j>=0 && j<cols){
							var w=0;
							w=1;
							meanI+=w*factors[i*cols+j];
							var d=data[4*(row*cols+col)]/100.0;
							meanp+=w*d;
							corrI+=w*factors[i*cols+j]*factors[i*cols+j];
							corrIp+=w*factors[i*cols+j]*d;

							count+=w;
						}
					}
				}

				meanI/=count;
				meanp/=count;
				corrI/=count;
				corrIp/=count;
				var varI=corrI-meanI*meanI;
				var covIp=corrIp-meanI*meanp;
				a[row*cols+col]=covIp/(varI+epsilon);
				b[row*cols+col]=meanp-a[row*cols+col]*meanI;
			}
		}

		for (var row=0;row<rows;++row){
			for (var col=0;col<cols;++col){

				var count=0;

				var meana=0;
				var meanb=0;

				for (var i=row-rowD;i<=row+rowD;++i){
					for (var j=col-colD;j<=col+colD;++j){
						if (i>=0 && i<rows && j>=0 && j<cols){
							var w=0;
							w=1;
							meana+=w*a[i*cols+j];
							meanb+=w*b[i*cols+j];

							count+=w;
						}
					}
				}

				meana/=count;
				meanb/=count;
				factors[row*cols+col]=meana*factors[row*cols+col]+meanb;
			}
		}
    */
      for (let row = 0; row < rows; ++row) {
        for (let col = 0; col < cols; ++col) {
          let count = 0;
          let sum = 0;

          for (let i = row - rowD; i <= row + rowD; ++i) {
            for (let j = col - colD; j <= col + colD; ++j) {
              // if ((i!=row && j!=col) || (i>row || j>col)){
              if (
                !(
                  (i === row && j === col) ||
                  (i === row - 1 && j === col - 1) ||
                  (i === row + 1 && j === col + 1)
                )
              ) {
                // continue;
              }
              if (i >= 0 && i < rows && j >= 0 && j < cols) {
                let w = 0;

                /// *
                const d = Math.abs(
                  data[4 * (row * cols + col)] - data[4 * (i * cols + j)]
                );
                let m = data[4 * (row * cols + col)];
                if (m < data[4 * (i * cols + j)]) {
                  m = data[4 * (i * cols + j)];
                }
                if (m < 1) {
                  m = 1;
                }
                // m=255;
                // w=(255-d)/255;

                w = (m - d) / m;
                // */

                /*
							var x=data[4*(row*cols+col)];
							var y=data[4*(i*cols+j)];

							if (x<y){
								w=x/y;
							} else{
								w=y/x;
							}
							*/

                // w=w*w;

                sum += w * factors[i * cols + j];
                count += w;
              }
            }
          }

          const factor = sum / count;
          factors[row * cols + col] = factor;
        }
      }
    }

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const factor = factors[row * cols + col];

        for (let ch = 0; ch < 3; ++ch) {
          result[4 * (row * cols + col) + ch] *= factor;
        }
      }
    }

    return result;
  }
}
