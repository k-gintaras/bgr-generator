import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageToPaletteComponent } from './image-to-palette/image-to-palette.component';
import { PaletteGeneratorComponent } from './palette-generator/palette-generator.component';
import { PalettePresetGeneratorComponent } from './palette-preset-generator/palette-preset-generator.component';
import { ScaleGeneratorComponent } from './scale-generator/scale-generator.component';
import { CombineGeneratorComponent } from './combine-generator/combine-generator.component';
import { PaletteOverviewComponent } from './palette-overview/palette-overview.component';
import { PaletteDataViewComponent } from './palette-data-view/palette-data-view.component';
import { BackgroundGeneratorComponent } from './background-generator/background-generator.component';

const routes: Routes = [
  // { path: '', redirectTo: '/bgr-generator', pathMatch: 'full' },
  { path: '', redirectTo: '/image-extractor', pathMatch: 'full' },

  {
    path: 'image-extractor',
    component: ImageToPaletteComponent,
  },
  {
    path: 'angle-extractor',
    component: PaletteGeneratorComponent,
  },
  {
    path: 'preset-extractor',
    component: PalettePresetGeneratorComponent,
  },
  {
    path: 'scale-extractor',
    component: ScaleGeneratorComponent,
  },
  {
    path: 'combine-extractor',
    component: CombineGeneratorComponent,
  },
  {
    path: 'overview',
    component: PaletteOverviewComponent,
  },
  {
    path: 'color-data',
    component: PaletteDataViewComponent,
  },
  {
    path: 'bgr-generator',
    component: BackgroundGeneratorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
