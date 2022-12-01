import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserWrapperComponent } from './user-wrapper/user-wrapper.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    component: UserWrapperComponent,
    children: [
        {
          path: 'list',
          component: UserListComponent
        },
        {
          path: 'new',
          component: UserComponent
        },
        {
          path: 'show-user/:id',
          component: UserComponent
        }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
