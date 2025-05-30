import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
 {path:'charts',children:[ {
  path: 'apexcharts',
  loadComponent: () =>
    import('./apexcharts/apexcharts.component').then((m) => m.ApexchartsComponent),
},
{
  path: 'chartjs',
  loadComponent: () =>
    import('./chartjs/chartjs.component').then((m) => m.ChartjsComponent),
},
{
  path: 'echarts',
  loadComponent: () =>
    import('./echarts/echarts.component').then((m) => m.EchartsComponent),
},


]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class chartsRoutingModule {
  static routes = admin;
}