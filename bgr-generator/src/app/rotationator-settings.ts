// Copyright: 2020, https://github.com/k-gintaras
// License MIT
export class RotationatorSettings {
  private isElementVisible = true;
  private isElementRandomColor = false;
  private isElementOriginalColor = false;
  private isElementOriginalSize = false;
  private isElementRotated = true;
  private isTextVisible = false;
  private isTextRandomColor = true;
  private isTextOriginalColor = false;
  private isTextOriginalSize = false;
  private isTextRotated = true;
  private isDecreasing = false;
  private isSpiral = true;
  private isJustRotated = false;
  private startingAngle = 0;
  private startingRadius = 30;
  private startingSize = 20;
  private angleIncrease = 2.39996322972865332;
  private radiusIncrease = 1;
  private sizeIncrease = 0.05;

  constructor() {}

  getObject() {
    const ob = {
      isElementVisible: this.isElementVisible,
      isElementRandomColor: this.isElementRandomColor,
      isElementOriginalColor: this.isElementOriginalColor,
      isElementOriginalSize: this.isElementOriginalSize,
      isElementRotated: this.isElementRotated,
      isTextVisible: this.isTextVisible,
      isTextRandomColor: this.isTextRandomColor,
      isTextOriginalColor: this.isTextOriginalColor,
      isTextOriginalSize: this.isTextOriginalSize,
      isTextRotated: this.isTextRotated,
      isDecreasing: this.isDecreasing,
      isSpiral: this.isSpiral,
      isJustRotated: this.isJustRotated,
      startingAngle: this.startingAngle,
      startingRadius: this.startingRadius,
      startingElementSize: this.startingSize,
      angleIncrease: this.angleIncrease,
      radiusIncrease: this.radiusIncrease,
      sizeIncrease: this.sizeIncrease,
    };
    return ob;
  }

  getString() {
    const str =
      this.isElementVisible +
      ',' +
      +this.isElementRandomColor +
      ',' +
      +this.isElementOriginalColor +
      ',' +
      +this.isElementOriginalSize +
      ',' +
      +this.isElementRotated +
      ',' +
      +this.isTextVisible +
      ',' +
      +this.isTextRandomColor +
      ',' +
      +this.isTextOriginalColor +
      ',' +
      +this.isTextOriginalSize +
      ',' +
      +this.isTextRotated +
      ',' +
      +this.isDecreasing +
      ',' +
      +this.isSpiral +
      ',' +
      +this.isJustRotated +
      ',' +
      +this.startingAngle +
      ',' +
      +this.startingRadius +
      ',' +
      +this.startingSize +
      ',' +
      +this.angleIncrease +
      ',' +
      +this.radiusIncrease +
      ',' +
      +this.sizeIncrease;
    return str;
  }

  setFromString(str) {
    const arr = str.split(',');
    if (arr.length === 19) {
      this.isElementVisible =
        arr[0] === 'true' || arr[0] === '1' ? true : false;
      this.isElementRandomColor =
        arr[1] === 'true' || arr[1] === '1' ? true : false;
      this.isElementOriginalColor =
        arr[2] === 'true' || arr[2] === '1' ? true : false;
      this.isElementOriginalSize =
        arr[3] === 'true' || arr[3] === '1' ? true : false;
      this.isElementRotated =
        arr[4] === 'true' || arr[4] === '1' ? true : false;
      this.isTextVisible = arr[5] === 'true' || arr[5] === '1' ? true : false;
      this.isTextRandomColor =
        arr[6] === 'true' || arr[6] === '1' ? true : false;
      this.isTextOriginalColor =
        arr[7] === 'true' || arr[7] === '1' ? true : false;
      this.isTextOriginalSize =
        arr[8] === 'true' || arr[8] === '1' ? true : false;
      this.isTextRotated = arr[9] === 'true' || arr[9] === '1' ? true : false;
      this.isDecreasing = arr[10] === 'true' || arr[10] === '1' ? true : false;
      this.isSpiral = arr[11] === 'true' || arr[11] === '1' ? true : false;
      this.isJustRotated = arr[12] === 'true' || arr[12] === '1' ? true : false;
      this.startingAngle = parseFloat(arr[13]);
      this.startingRadius = parseFloat(arr[14]);
      this.startingSize = parseFloat(arr[15]);
      this.angleIncrease = parseFloat(arr[16]);
      this.radiusIncrease = parseFloat(arr[17]);
      this.sizeIncrease = parseFloat(arr[18]);
    }
  }

  setFromArray(arr) {
    if (arr.length === 19) {
      this.isElementVisible = arr[0];
      this.isElementRandomColor = arr[1];
      this.isElementOriginalColor = arr[2];
      this.isElementOriginalSize = arr[3];
      this.isElementRotated = arr[4];
      this.isTextVisible = arr[5];
      this.isTextRandomColor = arr[6];
      this.isTextOriginalColor = arr[7];
      this.isTextOriginalSize = arr[8];
      this.isTextRotated = arr[9];
      this.isDecreasing = arr[10];
      this.isSpiral = arr[11];
      this.isJustRotated = arr[12];
      this.startingAngle = arr[13];
      this.startingRadius = arr[14];
      this.startingSize = arr[15];
      this.angleIncrease = arr[16];
      this.radiusIncrease = arr[17];
      this.sizeIncrease = arr[18];
    }
  }
}
