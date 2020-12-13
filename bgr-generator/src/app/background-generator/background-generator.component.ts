// Copyright: 2020, https://github.com/k-gintaras
// License MIT for code that does not include below licenses
// Chroma.js, custom (MIT like) and Apache 2
// colorbrewer (through Chroma.js), Apache 2
// html2canvas, MIT
// jquery, MIT

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as $ from 'jquery/dist/jquery.min.js';
import html2canvas from 'html2canvas';
import * as chroma from 'chroma-js/chroma.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputsOutputsService } from '../inputs-outputs.service';
import { MathfriendService } from '../mathfriend.service';
import { ColorSchemeSetsService } from '../color-scheme-sets.service';
import { RotationatorSettings } from '../rotationator-settings';
import { RotationatorSettingsGeneratorService } from '../rotationator-settings-generator.service';

@Component({
  selector: 'app-background-generator',
  templateUrl: './background-generator.component.html',
  styleUrls: ['./background-generator.component.css'],
})
export class BackgroundGeneratorComponent implements OnInit, OnDestroy {
  niceBorder = `.custom {\nbox-shadow:0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048),
      0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072),
      0 41.8px 33.4px rgba(0, 0, 0, 0.086),
      0 100px 80px rgba(0, 0, 0, 0.12);\n}`;

  textInputExample =
    '<style>\n.custom{\n background-color: white;\n width:20px;\n}\n</style>\n<div id="baseElementId" class="custom">\n?\n</div>';
  textInputExample2 = `<style>\n.custom{\n background-color: white;\n width:20px;\n
    border-radius:100%;\n}\n</style>\n<div id="baseElementId" class="custom">\n?\n</div>`;

  @Input() colorPalette = this.presets.generateSchemeSinebowColors(1000);

  modes = [
    'Random Size Position',
    'Matrix Random Size',
    'Matrix Fit',
    'Rotationator',
    'Rotationator Random',
    'Rotationator Random Decreasing',
    'Rotationator Random Circular',
  ];

  anglePresets;
  rotationatorPresets;
  colorPresetsPresets;
  sticky = [false, false, false, false, false];

  // varying variables
  @Input() htmlInput = this.textInputExample2;
  @Input() selectedMode = 'Random Size Position';
  // export background
  @Input() quality = 1;

  // matrix specific
  @Input() density = 1000;
  // matrices
  @Input() isRandomRotated = false;
  @Input() sizeVariation = 100;
  @Input() maxElementWidth = 100;
  @Input() maxElementHeight = 100;
  @Input() maxTextSize = 100;

  // both
  @Input() isElementVisible = true;
  @Input() isElementRandomColor = false;
  @Input() isElementOriginalColor = false;
  @Input() isTextVisible = false;
  @Input() isTextRandomColor = false;
  @Input() isTextOriginalColor = false;

  // rotationator pacific
  @Input() isElementOriginalSize = false;
  @Input() isElementRotated = true;
  @Input() isTextOriginalSize = false;
  @Input() isTextRotated = true;
  @Input() isDecreasing = false;
  @Input() isSpiral = true;
  @Input() isJustRotated = false;
  @Input() startingAngle = 0;
  @Input() startingRadius = 30;
  @Input() startingSize = 20;
  @Input() angleIncrease = 2.3999632297286535;
  @Input() radiusIncrease = 1;
  @Input() sizeIncrease = 0.05;
  @Input() selectedPreset = 'smoothStar';

  // other
  @Input() backgroundColor = '#ffffff';
  @Input() selectedRadian = 'goldenAngle';
  @Input() selectedColorPresetPreset = 'Sinebow';

  // assisted degree to radian translation
  @Input() startingDegree = 0;
  @Input() degreeIncrement = 0;
  stickyHeight = 50;

  constructor(
    private snackBar: MatSnackBar,
    private ioService: InputsOutputsService,
    private mathFriend: MathfriendService,
    private presets: ColorSchemeSetsService,
    private rotationatorGenerator: RotationatorSettingsGeneratorService
  ) {}

  ngOnInit() {
    if (this.ioService.backgroundSettings) {
      this.setAllInputsFromArr(this.ioService.backgroundSettings);
    } else {
    }
    this.rotationatorPresets = this.rotationatorGenerator.getPresets();
    this.anglePresets = {
      goldenAngle: this.mathFriend.GOLDEN_ANGLE_PRECISE,
      e: this.mathFriend.E_ANGLE_PRECISE,
    };
    this.colorPresetsPresets = this.presets.getGeneratorTitles();
    this.ioService.getColorsObservable().subscribe((colorArray) => {
      if (colorArray.length && colorArray.length > 0) {
        this.colorPalette = colorArray;
      }
    });
  }

  getStickyHeight() {
    return Math.round(window.innerHeight / 10);
  }

  ngOnDestroy() {
    this.ioService.backgroundSettings = this.getAllInputsAsArr();
  }

  onColorPresetSelect() {
    this.colorPalette = this.presets.getGenerateColors(
      this.selectedColorPresetPreset,
      1000
    );

    this.ioService.setColorsObservable(
      this.selectedColorPresetPreset,
      this.colorPalette
    );
  }

  onPresetSelect() {
    const settings = new RotationatorSettings();
    settings.setFromArray(this.rotationatorPresets[this.selectedPreset]);
    this.rotationatorSettingsToInputs(settings);
    this.onSettingsUpdate();
  }

  onAngleSelect() {
    this.angleIncrease = this.anglePresets[this.selectedRadian];
    this.degreeIncrement = this.mathFriend.getRadiansToDegrees(
      this.angleIncrease
    );
    this.onSettingsUpdate();
  }

  onStartingDegreeUpdate() {
    this.startingAngle = this.mathFriend.getDegreesToRadians(
      this.startingDegree
    );
    this.onSettingsUpdate();
  }

  onDegreeIncrementUpdate() {
    this.angleIncrease = this.mathFriend.getDegreesToRadians(
      this.degreeIncrement
    );
    this.onSettingsUpdate();
  }

  onRadianIncreaseUpdate() {
    this.degreeIncrement = this.mathFriend.getRadiansToDegrees(
      this.angleIncrease
    );
  }

  onRadianStartingUpdate() {
    this.startingDegree = this.mathFriend.getRadiansToDegrees(
      this.startingAngle
    );
  }

  onSettingsUpdate() {
    this.whatToDisplay();
  }

  rotationatorRandomSlow() {
    const settings = this.rotationatorGenerator.getRandomSlowSizeIncrease();
    this.rotationatorSettingsToInputs(settings);
    this.rotationatorPrecise(settings, this.colorPalette);
  }

  rotationatorRandomDecreasing() {
    const settings = this.rotationatorGenerator.getRandomFastSizeDecrease();
    this.rotationatorSettingsToInputs(settings);
    this.rotationatorPrecise(settings, this.colorPalette);
  }

  rotationatorRandomCircular() {
    const settings = this.rotationatorGenerator.getRandomCircular();
    this.rotationatorSettingsToInputs(settings);
    this.rotationatorPrecise(settings, this.colorPalette);
  }

  rotationator() {
    const settings = this.inputsToRotationatorSettings();
    this.rotationatorPrecise(settings, this.colorPalette);
  }

  inputsToRotationatorSettings() {
    const settings = new RotationatorSettings();
    settings.setFromArray(this.getRotationatorInputsAsArr());
    return settings;
  }

  getRotationatorInputsAsArr() {
    const arr = [
      this.isElementVisible,
      this.isElementRandomColor,
      this.isElementOriginalColor,
      this.isElementOriginalSize,
      this.isElementRotated,
      this.isTextVisible,
      this.isTextRandomColor,
      this.isTextOriginalColor,
      this.isTextOriginalSize,
      this.isTextRotated,
      this.isDecreasing,
      this.isSpiral,
      this.isJustRotated,
      this.startingAngle,
      this.startingRadius,
      this.startingSize,
      this.angleIncrease,
      this.radiusIncrease,
      this.sizeIncrease,
    ];
    return arr;
  }

  getAllInputsAsArr() {
    const arr = [
      this.htmlInput,
      this.selectedMode,
      this.quality,
      this.density,
      this.isRandomRotated,
      this.sizeVariation,
      this.maxElementWidth,
      this.maxElementHeight,
      this.maxTextSize,
      this.isElementVisible,
      this.isElementRandomColor,
      this.isElementOriginalColor,
      this.isTextVisible,
      this.isTextRandomColor,
      this.isTextOriginalColor,
      this.isElementOriginalSize,
      this.isElementRotated,
      this.isTextOriginalSize,
      this.isTextRotated,
      this.isDecreasing,
      this.isSpiral,
      this.isJustRotated,
      this.startingAngle,
      this.startingRadius,
      this.startingSize,
      this.angleIncrease,
      this.radiusIncrease,
      this.sizeIncrease,
      this.selectedPreset,
      this.backgroundColor,
      this.selectedRadian,
      this.selectedColorPresetPreset,
      this.startingDegree,
      this.degreeIncrement,
    ];
    return arr;
  }

  setAllInputsFromArr(arr) {
    this.htmlInput = arr[0];
    this.selectedMode = arr[1];
    this.quality = arr[2];
    this.density = arr[3];
    this.isRandomRotated = arr[4];
    this.sizeVariation = arr[5];
    this.maxElementWidth = arr[6];
    this.maxElementHeight = arr[7];
    this.maxTextSize = arr[8];
    this.isElementVisible = arr[9];
    this.isElementRandomColor = arr[10];
    this.isElementOriginalColor = arr[11];
    this.isTextVisible = arr[12];
    this.isTextRandomColor = arr[13];
    this.isTextOriginalColor = arr[14];
    this.isElementOriginalSize = arr[15];
    this.isElementRotated = arr[16];
    this.isTextOriginalSize = arr[17];
    this.isTextRotated = arr[18];
    this.isDecreasing = arr[19];
    this.isSpiral = arr[20];
    this.isJustRotated = arr[21];
    this.startingAngle = arr[22];
    this.startingRadius = arr[23];
    this.startingSize = arr[24];
    this.angleIncrease = arr[25];
    this.radiusIncrease = arr[26];
    this.sizeIncrease = arr[27];
    this.selectedPreset = arr[28];
    this.backgroundColor = arr[29];
    this.selectedRadian = arr[30];
    this.selectedColorPresetPreset = arr[31];
    this.startingDegree = arr[32];
    this.degreeIncrement = arr[33];
  }

  rotationatorSettingsToInputs(settings: RotationatorSettings) {
    const so = settings.getObject();
    this.isElementVisible = so.isElementVisible;
    this.isElementRandomColor = so.isElementRandomColor;
    this.isElementOriginalColor = so.isElementOriginalColor;
    this.isElementOriginalSize = so.isElementOriginalSize;
    this.isElementRotated = so.isElementRotated;
    this.isTextVisible = so.isTextVisible;
    this.isTextRandomColor = so.isTextRandomColor;
    this.isTextOriginalColor = so.isTextOriginalColor;
    this.isTextOriginalSize = so.isTextOriginalSize;
    this.isTextRotated = so.isTextRotated;
    this.isDecreasing = so.isDecreasing;
    this.isSpiral = so.isSpiral;
    this.isJustRotated = so.isJustRotated;
    this.startingAngle = so.startingAngle;
    this.startingRadius = so.startingRadius;
    this.startingSize = so.startingElementSize;
    this.angleIncrease = so.angleIncrease;
    this.radiusIncrease = so.radiusIncrease;
    this.sizeIncrease = so.sizeIncrease;
  }

  randomPrimary() {
    this.backgroundColor = chroma.random().hex();
    this.ioService.setResetObservable();
    this.ioService.setPrimaryColorObservable(this.backgroundColor);
  }

  onSettingsInputUpdate() {}

  getFontSize(el) {
    const style = window
      .getComputedStyle(el, null)
      .getPropertyValue('font-size');
    return parseFloat(style);
  }

  copyToClipboard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  whatToDisplay() {
    switch (this.selectedMode) {
      case this.modes[0]:
        this.generateRandom();
        break;
      case this.modes[1]:
        this.generateMatrix();
        break;
      case this.modes[2]:
        this.generateFitMatrix();
        break;
      case this.modes[3]:
        this.rotationator();
        break;
      case this.modes[4]:
        this.rotationatorRandomSlow();
        break;
      case this.modes[5]:
        this.rotationatorRandomDecreasing();
        break;
      case this.modes[6]:
        this.rotationatorRandomCircular();
        break;
      default:
        break;
    }
  }

  decideColors(
    userElement,
    isElementVisible,
    isTextVisible,
    isElementRandomColor,
    isElementOriginalColor,
    isTextOriginalColor,
    isTextRandomColor
  ) {
    let elementColors = this.colorPalette;
    let textColors = this.colorPalette;
    if (!isElementVisible) {
      elementColors = this.getColorArray(
        'transparent',
        this.colorPalette.length
      );
    }
    if (!isTextVisible) {
      textColors = this.getColorArray('transparent', this.colorPalette.length);
    }
    if (isElementRandomColor) {
      elementColors = this.getShuffledColorArray(this.colorPalette);
    }
    if (isElementOriginalColor) {
      const colB = userElement.style.backgroundColor;
      elementColors = this.getColorArray(colB, this.colorPalette);
    }
    if (isTextOriginalColor) {
      const colT = userElement.style.color;
      textColors = this.getColorArray(colT, this.colorPalette);
    }
    if (isTextRandomColor) {
      textColors = this.getShuffledColorArray(this.colorPalette);
    }
    return { element: elementColors, text: textColors };
  }

  decideRotationatorColors(
    userElement,
    isElementVisible,
    isTextVisible,
    isElementRandomColor,
    isElementOriginalColor,
    isTextOriginalColor,
    isTextRandomColor
  ) {
    let colors;
    if (this.density > this.colorPalette.length) {
      colors = this.getAddedRandomColors(
        this.colorPalette,
        Math.abs(this.density - this.colorPalette.length)
      );
    } else {
      colors = this.mathFriend.copyArray(this.colorPalette);
    }

    let elementColors = colors;
    let textColors = colors;

    if (!isElementVisible) {
      elementColors = this.getColorArray('transparent', colors.length);
    }
    if (!isTextVisible) {
      textColors = this.getColorArray('transparent', colors.length);
    }
    if (isElementRandomColor) {
      elementColors = this.getShuffledColorArray(colors);
    }
    if (isTextRandomColor) {
      textColors = this.getShuffledColorArray(colors);
    }
    if (isElementOriginalColor) {
      const colB = userElement.style.backgroundColor;
      elementColors = this.getColorArray(colB, colors);
    }
    if (isTextOriginalColor) {
      const colT = userElement.style.color;
      textColors = this.getColorArray(colT, colors);
    }

    return { element: elementColors, text: textColors };
  }

  save() {
    this.feedback('loading...');
    this.downloadCanvas();
  }

  getAddedRandomColors(colors, addAmount) {
    const col = this.mathFriend.copyArray(colors);
    for (let i = 0; i < addAmount; i++) {
      const ran = this.getRandomArrayItem(this.colorPalette);
      col.push(ran);
    }
    return col;
  }

  rotationatorPrecise(settings: RotationatorSettings, colorPalette) {
    this.reset();
    const backgroundElement = this.getElementById('htmlImage');
    const userElement = this.getElementById('baseElementId');

    const measureBackgroundElement = this.getElementMeasurements(
      backgroundElement
    );
    const measureUserElement = this.getElementMeasurements(userElement);
    const centerX = measureBackgroundElement[2] / 2;
    const centerY = measureBackgroundElement[3] / 2;
    // start element location at center of background
    const elementX = centerX; // centerX - measureUserElement[2] / 2; I am not sure why I did this.
    const elementY = centerY; // centerY - measureUserElement[3] / 2;

    let angle = settings.getObject().startingAngle;
    let howFarMultiplier = settings.getObject().startingRadius;
    let textSize = settings.getObject().startingElementSize;
    let elementSize = settings.getObject().startingElementSize;
    let elementSizeW = settings.getObject().startingElementSize;
    let elementSizeH = settings.getObject().startingElementSize;
    let isNextRotation = 1;
    let justRotated = 1;
    let elementRotated = 0;
    let textSizeIncrease = settings.getObject().sizeIncrease;

    let sizeIncrease = settings.getObject().sizeIncrease;

    let rotations = this.colorPalette.length;
    if (this.density > colorPalette.length) {
      rotations = this.density;
    }

    const colors = this.decideRotationatorColors(
      userElement,
      settings.getObject().isElementVisible,
      settings.getObject().isTextVisible,
      settings.getObject().isElementRandomColor,
      settings.getObject().isElementOriginalColor,
      settings.getObject().isTextOriginalColor,
      settings.getObject().isTextRandomColor
    );
    const elementColors = colors.element;
    const textColors = colors.text;

    if (settings.getObject().isElementOriginalSize) {
      elementSizeW = measureUserElement[2];
      elementSizeH = measureUserElement[3];
      sizeIncrease = 0;
    }
    if (settings.getObject().isTextOriginalSize) {
      textSize = this.getFontSize(userElement);
      textSizeIncrease = 0;
    }
    if (
      settings.getObject().isElementRotated ||
      settings.getObject().isTextRotated
    ) {
      elementRotated = 1;
    }

    if (settings.getObject().isDecreasing) {
      sizeIncrease *= -1;
    }
    if (settings.getObject().isJustRotated) {
      justRotated = 0;
    }

    if (!settings.getObject().isTextVisible) {
      textSizeIncrease = 0;
      textSize = 0;
    }

    for (let i = 0; i < rotations; i++) {
      angle += settings.getObject().angleIncrease;
      elementSize += sizeIncrease;
      elementSizeW += sizeIncrease;
      elementSizeH += sizeIncrease;
      textSize += textSizeIncrease;

      // if it is only jumping each complete rotation
      // non spiral
      if (!settings.getObject().isSpiral) {
        if (angle >= this.mathFriend.TAU) {
          angle = angle % this.mathFriend.TAU;
          isNextRotation = 1;
        } else {
          isNextRotation = 0;
        }
      }

      howFarMultiplier +=
        isNextRotation * (settings.getObject().radiusIncrease * justRotated);

      const xy = this.mathFriend.getRotatedAround(
        centerX,
        centerY,
        elementX,
        elementY,
        angle,
        true
      );

      const xyMoveFromCenter = this.mathFriend.getMovedInLine(
        xy[0],
        xy[1],
        angle,
        howFarMultiplier
      );

      const x = xyMoveFromCenter[0];
      const y = xyMoveFromCenter[1];

      this.displayElementPrecise(
        x,
        y,
        elementSizeW,
        elementSizeH,
        textSize,
        elementColors[i],
        textColors[i],
        angle * elementRotated
      );
    }
  }

  getColorArray(color, amount) {
    const arr = [];
    for (let i = 0; i < amount; i++) {
      arr.push(color);
    }
    return arr;
  }

  getShuffledColorArray(arr) {
    const arrC = this.mathFriend.copyArray(arr);
    this.mathFriend.shuffle(arrC);
    return arrC;
  }

  getElementById(id) {
    return document.getElementById(id);
  }

  getElementMeasurements(element) {
    const coords = element.getBoundingClientRect();
    return [coords.left, coords.top, coords.width, coords.height];
  }

  getScrollData(element) {
    return [
      element.scrollLeft,
      element.scrollTop,
      window.scrollX,
      window.scrollY,
    ];
  }

  getCreateElement(id, idWhere, elementType) {
    const element = document.createElement(elementType);
    element.setAttribute('id', id);
    this.getElementById(idWhere).appendChild(element);
    return element;
  }

  getAppendedElement(appendWhat, appendTo) {
    appendTo.appendChild(appendWhat);
    return appendWhat;
  }

  getClonedElement(element) {
    return element.cloneNode(true);
  }

  getClonedElementWithId(element, id) {
    const el = this.getClonedElement(element);

    return this.setElementId(el, id);
  }

  setElementId(element, id) {
    element.setAttribute('id', id);
    return element;
  }

  setElementColor(element, color) {
    element.style.color = color;
  }

  onElementInputChange() {}

  addNiceShadow() {
    this.addStyle(this.niceBorder);
  }

  addStyle(style) {
    const styleInsert = '<style>\n' + style + '\n</style>\n';
    this.htmlInput = styleInsert + this.htmlInput;
  }

  displayElement(x, y, elementSize, textSize, elementColor, textColor, angle) {
    const eleObject = $('#baseElementId');
    const eleObjectCopy = eleObject.clone();

    eleObjectCopy.css('position', 'absolute');
    eleObjectCopy.css('transform', 'rotate(' + angle + 'deg' + ')');
    eleObjectCopy.css('width', elementSize + 'px');
    eleObjectCopy.css('height', elementSize + 'px');
    eleObjectCopy.css('font-size', textSize + 'px');
    eleObjectCopy.css('left', x - eleObjectCopy.width() / 2 + 'px');
    eleObjectCopy.css('top', y - eleObjectCopy.height() / 2 + 'px');
    eleObjectCopy.css('background-color', elementColor);
    eleObjectCopy.css('color', textColor);
    eleObjectCopy.prop('id', Math.random() * 999999999);
    document.getElementById('htmlImage').appendChild(eleObjectCopy[0]);
  }

  displayElementPrecise(
    x,
    y,
    elementSizeW,
    elementSizeH,
    textSize,
    elementColor,
    textColor,
    angle
  ) {
    const eleObject = $('#baseElementId');
    const eleObjectCopy = eleObject.clone();
    eleObjectCopy.css('position', 'absolute');
    eleObjectCopy.css('transform', 'rotate(' + angle + 'deg' + ')');
    eleObjectCopy.css('width', elementSizeW + 'px');
    eleObjectCopy.css('height', elementSizeH + 'px');
    eleObjectCopy.css('font-size', textSize + 'px');
    eleObjectCopy.css('left', x - eleObjectCopy.width() / 2 + 'px');
    eleObjectCopy.css('top', y - eleObjectCopy.height() / 2 + 'px');
    eleObjectCopy.css('background-color', elementColor);
    eleObjectCopy.css('color', textColor);
    eleObjectCopy.prop('id', Math.random() * 999999999);
    document.getElementById('htmlImage').appendChild(eleObjectCopy[0]);
  }

  displayElementKeepSize(x, y, color, angle) {
    const eleObject = $('#baseElementId');
    const eleObjectCopy = eleObject.clone();

    eleObjectCopy.css('position', 'absolute');
    eleObjectCopy.css('transform', 'rotate(' + angle + 'deg' + ')');
    eleObjectCopy.css('left', x - eleObjectCopy.width() / 2 + 'px');
    eleObjectCopy.css('top', y - eleObjectCopy.height() / 2 + 'px');
    eleObjectCopy.css('background-color', color);
    eleObjectCopy.css('color', color);
    eleObjectCopy.prop('id', Math.random() * 999999999);
    document.getElementById('htmlImage').appendChild(eleObjectCopy[0]);
  }

  rotateDivH(idToRotate, angle) {
    document.getElementById(idToRotate).style.transform =
      'rotate(' + angle + 'deg)';
  }

  generateRandom() {
    this.reset();
    const background = this.getElementById('htmlImage');
    const userElement = this.getElementById('baseElementId');
    const backgroundMeasurements = this.getElementMeasurements(background);
    const elementMeasurements = this.getElementMeasurements(userElement);
    const colors = this.decideColors(
      userElement,
      this.isElementVisible,
      this.isTextVisible,
      this.isElementRandomColor,
      this.isElementOriginalColor,
      this.isTextOriginalColor,
      this.isTextRandomColor
    );

    let angleMultiplier = 1;
    if (!this.isRandomRotated) {
      angleMultiplier = 0;
    }

    for (let i = 0; i < this.density; i++) {
      const angle = angleMultiplier * (Math.random() * 360);
      const x =
        Math.random() * (backgroundMeasurements[2] - elementMeasurements[2]) +
        elementMeasurements[2] / 2;
      const y =
        Math.random() * (backgroundMeasurements[3] - elementMeasurements[3]) +
        elementMeasurements[3] / 2;
      const elementW = this.decideRandomSize(
        elementMeasurements[2],
        this.maxElementWidth
      );
      const elementH = this.decideRandomSize(
        elementMeasurements[3],
        this.maxElementHeight
      );
      const textSize = this.decideRandomSize(
        elementMeasurements[3],
        this.maxTextSize
      );

      const elementColor = this.getRandomArrayItem(colors.element);
      const textColor = this.getRandomArrayItem(colors.text);

      this.displayElementPrecise(
        x,
        y,
        elementW,
        elementH,
        textSize,
        elementColor,
        textColor,
        angle
      );
    }
  }

  generateMatrix() {
    this.reset();
    const background = this.getElementById('htmlImage');
    const userElement = this.getElementById('baseElementId');
    const backgroundMeasurements = this.getElementMeasurements(background);
    const elementMeasurements = this.getElementMeasurements(userElement);
    const colors = this.decideColors(
      userElement,
      this.isElementVisible,
      this.isTextVisible,
      this.isElementRandomColor,
      this.isElementOriginalColor,
      this.isTextOriginalColor,
      this.isTextRandomColor
    );

    let angleMultiplier = 1;
    if (!this.isRandomRotated) {
      angleMultiplier = 0;
    }
    let iterations = Math.sqrt(this.density);
    iterations = Math.round(iterations);
    for (let i = 0; i < iterations; i++) {
      for (let j = 0; j < iterations; j++) {
        const angle = angleMultiplier * (Math.random() * 360);
        const x =
          this.normalize(
            i,
            0,
            iterations,
            0,
            backgroundMeasurements[2] - elementMeasurements[2]
          ) +
          elementMeasurements[2] / 2;
        const y =
          this.normalize(
            j,
            0,
            iterations,
            0,
            backgroundMeasurements[3] - elementMeasurements[3]
          ) +
          elementMeasurements[3] / 2;
        const elementW = this.decideRandomSize(
          elementMeasurements[3],
          this.maxElementWidth
        );
        const elementH = this.decideRandomSize(
          elementMeasurements[3],
          this.maxElementHeight
        );
        const textSize = this.decideRandomSize(
          elementMeasurements[3],
          this.maxTextSize
        );

        const elementColor = this.getRandomArrayItem(colors.element);
        const textColor = this.getRandomArrayItem(colors.text);
        this.displayElementPrecise(
          x,
          y,
          elementW,
          elementH,
          textSize,
          elementColor,
          textColor,
          angle
        );
      }
    }
  }

  generateFitMatrix() {
    this.reset();
    const background = this.getElementById('htmlImage');
    const userElement = this.getElementById('baseElementId');
    const backgroundMeasurements = this.getElementMeasurements(background);
    const elementMeasurements = this.getElementMeasurements(userElement);
    const textSize = this.getFontSize(userElement);
    const colors = this.decideColors(
      userElement,
      this.isElementVisible,
      this.isTextVisible,
      this.isElementRandomColor,
      this.isElementOriginalColor,
      this.isTextOriginalColor,
      this.isTextRandomColor
    );

    let angleMultiplier = 1;
    if (!this.isRandomRotated) {
      angleMultiplier = 0;
    }

    const width = elementMeasurements[2];
    const height = elementMeasurements[3];
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const fitWidth = backgroundMeasurements[2] - halfWidth;
    const fitHeight = backgroundMeasurements[3] - halfHeight;
    const columns = Math.round(fitWidth / width);
    const rows = Math.round(fitHeight / height);
    if (columns < 2) {
      this.feedback('element is very wide, maybe add style width and height');
    }
    if (rows > 1000 || columns > 100) {
      this.feedback('this might lag');
    }
    let x = 0;
    let y = halfHeight;
    for (let i = 0; i < rows; i++) {
      x = halfWidth;
      for (let j = 0; j < columns; j++) {
        const angle = angleMultiplier * (Math.random() * 360);
        const elementColor = this.getRandomArrayItem(colors.element);
        const textColor = this.getRandomArrayItem(colors.text);
        this.displayElementPrecise(
          x,
          y,
          width,
          height,
          textSize,
          elementColor,
          textColor,
          angle
        );
        x += width;
      }
      y += height;
    }
  }

  reset() {
    $('#htmlImage').empty();
  }

  feedback(s) {
    this.snackBar.open(s, 'Close', {
      duration: 5000,
    });
  }

  downloadCanvas() {
    // width and height should be exactly same as element
    html2canvas(document.querySelector('#htmlImage'), {
      scale: this.quality,
      backgroundColor: null,
      scrollX: 0,
      scrollY: -window.scrollY,
    })
      .then((canvasImage) => {
        // var win = window.open();
        // win.document.write(
        //   '<img src="' + canvasImage.toDataURL('image/png') + '"/>'
        // );

        this.exportCanvasAsPNG(canvasImage, 'bgr.png');
      })
      .catch((err) => {
        this.feedback('Error with Canvas!');
        console.log(err);
      });
  }

  decideRandomSize(originalSize, maxSize) {
    if (this.sizeVariation === 0) {
      return originalSize;
    }
    const min = maxSize - (maxSize * this.sizeVariation) / 100;
    return this.getRandomLimited(min, maxSize);
  }

  getRandomLimited(min, max) {
    return Math.random() * (max - min) + min;
  }

  exportCanvasAsPNG(canvas, fileName) {
    const a = document.createElement('a');
    const MIME_TYPE = 'image/png';
    a.href = canvas
      .toDataURL('image/png', 1.0)
      .replace('image/png', 'image/octet-stream');
    a.download = fileName;
    document.body.appendChild(a);

    a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');

    a.click();
    document.body.removeChild(a);
  }

  normalize(num, min, max, newMin, newMax) {
    let normalized = 0;

    normalized = ((num - min) / (max - min)) * (newMax - newMin) + newMin;

    return normalized;
  }

  getRandomArrayItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
