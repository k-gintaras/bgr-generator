// Copyright: 2020, https://github.com/k-gintaras
// License MIT
import { Injectable } from '@angular/core';
import { MathfriendService } from './mathfriend.service';
import { RotationatorSettings } from './rotationator-settings';

@Injectable({
  providedIn: 'root',
})
export class RotationatorSettingsGeneratorService {
  constructor(private mathFriend: MathfriendService) {}

  presets = {
    multiBranchStar: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      2.276105440239662,
      4.0582128398049555,
      7.126631202086877,
      4.064860866688693,
      0.830753543191862,
      0.16721293782047897,
    ],
    quadSmoothSpiral: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      2.161567987630102,
      4.438366837244756,
      7.957597832287471,
      1.5610196521965123,
      1.0778552900090783,
      0.7389167366955767,
    ],
    smoothDuo: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      0.46365309957703643,
      4.876250977498506,
      3.421609670168033,
      3.1455183833353417,
      1.3472160424279969,
      0.6250571398365394,
    ],
    smoothStar: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      2.405260345389171,
      6.942960641883316,
      8.039595026394275,
      3.9310757084291095,
      1.3565418928632162,
      0.6811738598799366,
    ],
    goldenAnglePolka: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      false,
      4.929944887752208,
      6.6752438840889505,
      7.116400990961081,
      2.399963229728652,
      1.0047600953601967,
      0.044855880994147945,
    ],
    sharpSmoothStar: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      4.881209467314397,
      4.556325027609988,
      1.6548700262781613,
      2.6916589753754625,
      1.9885004507270412,
      0.8161197998145511,
    ],
    decreasingSharpStar: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      0.8222018146428294,
      42.90100787227546,
      78.23172823356276,
      2.417732240625121,
      1.0991073755832759,
      0.08860058200098567,
    ],
    decreasingDensity: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      2.807139132439647,
      33.899663027641346,
      75.55226487289801,
      2.399963229728652,
      1.4442229780328482,
      0.06552008051667534,
    ],
    decreasingSpiral: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      3.1861441988054047,
      33.55639769601832,
      69.89300669128212,
      2.164267524810311,
      1.8373435785334198,
      0.08643711868654658,
    ],
    circleRing: [
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      true,
      0.18042864300972028,
      227.52604162156516,
      8.871901882137339,
      0.008702261133289202,
      0.003917102942698758,
      0.037154320989629855,
    ],
  };

  getPresets() {
    return this.presets;
  }

  getRandomFastSizeIncrease() {
    const arr = [
      true, // isElementVisible,
      false, // isElementRandomColor,
      false, // isElementOriginalColor,
      false, // isElementOriginalSize,
      true, // isElementRotated,
      false, // isTextVisible,
      false, // isTextRandomColor,
      false, // isTextOriginalColor,
      false, // isTextOriginalSize,
      true, // isTextRotated,
      false, // decreasing
      Math.random() > 0.5 ? true : false, // spiral
      false, // rotated
      this.mathFriend.getRandomLimited(0, this.mathFriend.TAU), // start ang
      this.mathFriend.getRandomLimited(0, 10), // start rad
      this.mathFriend.getRandomLimited(0, 5), // start size
      Math.random() > 0.5
        ? this.mathFriend.getRandomLimited(0, this.mathFriend.TAU)
        : this.mathFriend.GOLDEN_ANGLE_PRECISE, // angle incr
      this.mathFriend.getRandomLimited(0, 5), // rad incr
      this.mathFriend.getRandomLimited(0, 5), // size incr
    ];
    const settings = new RotationatorSettings();
    settings.setFromArray(arr);
    return settings;
  }

  getRandomFastSizeDecrease() {
    const arr = [
      true, // isElementVisible,
      false, // isElementRandomColor,
      false, // isElementOriginalColor,
      false, // isElementOriginalSize,
      true, // isElementRotated,
      false, // isTextVisible,
      false, // isTextRandomColor,
      false, // isTextOriginalColor,
      false, // isTextOriginalSize,
      true, // isTextRotated,
      true, // decreasing
      Math.random() > 0.5 ? true : false, // spiral
      false, // rotated
      this.mathFriend.getRandomLimited(0, this.mathFriend.TAU), // start ang
      this.mathFriend.getRandomLimited(25, 50), // start rad
      this.mathFriend.getRandomLimited(50, 100), // start size
      Math.random() > 0.5
        ? this.mathFriend.getRandomLimited(0, this.mathFriend.TAU)
        : this.mathFriend.GOLDEN_ANGLE_PRECISE, // angle incr
      this.mathFriend.getRandomLimited(0.5, 3), // rad incr
      this.mathFriend.getRandomLimited(0, 0.1), // size incr
    ];
    const settings = new RotationatorSettings();
    settings.setFromArray(arr);
    return settings;
  }

  getRandomCircular() {
    const arr = [
      true, // isElementVisible,
      false, // isElementRandomColor,
      false, // isElementOriginalColor,
      false, // isElementOriginalSize,
      true, // isElementRotated,
      false, // isTextVisible,
      false, // isTextRandomColor,
      false, // isTextOriginalColor,
      false, // isTextOriginalSize,
      true, // isTextRotated,
      false, // decreasing
      false, // spiral
      true, // rotated
      this.mathFriend.getRandomLimited(0, this.mathFriend.TAU), // start ang
      this.mathFriend.getRandomLimited(100, 500), // start rad
      this.mathFriend.getRandomLimited(0, 10), // start size
      this.mathFriend.getRandomLimited(0, 0.5), // angle incr
      this.mathFriend.getRandomLimited(0, 10), // rad incr
      this.mathFriend.getRandomLimited(0, 0.2), // size incr
    ];
    const settings = new RotationatorSettings();
    settings.setFromArray(arr);
    return settings;
  }

  getRandomSlowSizeIncrease() {
    const arr = [
      true, // isElementVisible,
      false, // isElementRandomColor,
      false, // isElementOriginalColor,
      false, // isElementOriginalSize,
      true, // isElementRotated,
      false, // isTextVisible,
      false, // isTextRandomColor,
      false, // isTextOriginalColor,
      false, // isTextOriginalSize,
      true, // isTextRotated,
      false, // decreasing
      Math.random() > 0.5 ? true : false, // spiral
      false, // rotated
      this.mathFriend.getRandomLimited(0, this.mathFriend.TAU), // start ang
      this.mathFriend.getRandomLimited(0, 10), // start rad
      this.mathFriend.getRandomLimited(0, 10), // start size
      Math.random() > 0.5
        ? this.mathFriend.getRandomLimited(0, this.mathFriend.TAU)
        : this.mathFriend.GOLDEN_ANGLE_PRECISE, // angle incr
      this.mathFriend.getRandomLimited(0, 3), // rad incr
      this.mathFriend.getRandomLimited(0, 1), // size incr
    ];
    const settings = new RotationatorSettings();
    settings.setFromArray(arr);
    return settings;
  }
}
