import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhysicianListComponent } from './physician-list/physician-list.component';
import { PhysicianWrapperComponent } from './physician-wrapper/physician-wrapper.component';
import { ShowPhysicianComponent } from './show-physician/show-physician.component';

const routes: Routes = [
  {
    path: '',
    component: PhysicianWrapperComponent,
    children: [
        {
          path: 'list',
          component: PhysicianListComponent
        },
        {
          path: 'show-physician/:id',
          component: ShowPhysicianComponent
        }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysicianRoutingModule { }
