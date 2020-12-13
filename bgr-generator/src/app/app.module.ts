import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import 'hammerjs';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';

import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputToHtmlPipe } from './input-to-html.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ColorTranslatePipe } from './color-translate.pipe';
import { ColorPickerModule } from 'ngx-color-picker';
import { ImageToPaletteComponent } from './image-to-palette/image-to-palette.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DisplayPaletteComponent } from './display-palette/display-palette.component';
import { LogoColorsComponent } from './logo-colors/logo-colors.component';
import { SampleAppColorsComponent } from './sample-app-colors/sample-app-colors.component';
import { PaletteOverviewComponent } from './palette-overview/palette-overview.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PaletteGeneratorComponent } from './palette-generator/palette-generator.component';
import { PalettePresetGeneratorComponent } from './palette-preset-generator/palette-preset-generator.component';
import { DiscretizedPipe } from './discretized.pipe';
import { ScaleGeneratorComponent } from './scale-generator/scale-generator.component';
import { CombineGeneratorComponent } from './combine-generator/combine-generator.component';
import { PaletteDataViewComponent } from './palette-data-view/palette-data-view.component';
import { ArrayToTextareaComponent } from './array-to-textarea/array-to-textarea.component';
import { BackgroundGeneratorComponent } from './background-generator/background-generator.component';
import { NgxSvgModule } from 'ngx-svg';
import { MatRadioModule } from '@angular/material/radio';
import { SvgPathModule } from 'angular-svg';
import { AnimatingLogoComponent } from './animating-logo/animating-logo.component';
import { LicensesComponent } from './licenses/licenses.component';

const modules = [
  MatSnackBarModule,
  MatSlideToggleModule,
  DragDropModule,
  NgxSvgModule,
  SvgPathModule,
  MatRadioModule,
  MatDividerModule,
  MatButtonToggleModule,
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  MatButtonModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatCardModule,
  MatInputModule,
  MatGridListModule,
  FormsModule,
  MatTooltipModule,
  MatIconModule,
  MatCheckboxModule,
  MatSliderModule,
  MatExpansionModule,
  MatMenuModule,
  RouterModule,
  NoopAnimationsModule,
  ColorPickerModule,
  MatSelectModule,
];

@NgModule({
  declarations: [
    AppComponent,
    InputToHtmlPipe,
    ColorTranslatePipe,
    ImageToPaletteComponent,
    ColorPaletteComponent,
    DisplayPaletteComponent,
    LogoColorsComponent,
    SampleAppColorsComponent,
    PaletteOverviewComponent,
    PaletteGeneratorComponent,
    PalettePresetGeneratorComponent,
    DiscretizedPipe,
    ScaleGeneratorComponent,
    CombineGeneratorComponent,
    PaletteDataViewComponent,
    ArrayToTextareaComponent,
    BackgroundGeneratorComponent,
    AnimatingLogoComponent,
    LicensesComponent,
  ],
  imports: [ModalModule.forRoot(), modules],
  exports: [modules],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
