import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTattosComponent } from './components/list-tattos/list-tattos.component';
import { CreateTattoComponent } from './components/create-tatto/create-tatto.component';
// @ts-ignore
import { ListCategoriesComponent } from './components/list-categories/list-categories.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
// @ts-ignore
import { ListPiercingsComponent } from './components/list-piercings/list-piercings.component';
import { CreatePiercingComponent } from './components/create-piercing/create-piercing.component';
import {BackgroundThreejsComponent} from './components/background-threejs/background-threejs.component';
import {CartComponent} from './components/cart/cart.component';
import {ListUsersComponent} from './components/list-users/list-users.component';
import {HomeComponent} from './components/home/home.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {CreateEmployeeComponent} from './components/create-employee/create-employee.component';
import {ListEmployeesComponent} from './components/list-employees/list-employees.component';
import {LocationComponent} from './components/location/location.component';
import {RequestTattooComponent} from './components/request-tattoo/request-tattoo.component';
import {ListRequestsTattoosComponent} from './components/list-requests-tattoos/list-requests-tattoos.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent},
  { path: 'list-tattoos', component: ListTattosComponent },
  { path: 'create-tattoo', component: CreateTattoComponent },
  { path: 'editTattoo/:id', component: CreateTattoComponent },

  { path: 'create-piercing', component: CreatePiercingComponent },
  { path: 'list-piercings', component: ListPiercingsComponent },
  { path: 'editPiercing/:id', component: CreatePiercingComponent },

  { path: 'list-categories', component: ListCategoriesComponent },
  { path: 'create-category', component: CreateCategoryComponent },
  { path: 'editCategory/:id', component: CreateCategoryComponent },

  { path: 'list-employees', component: ListEmployeesComponent },
  { path: 'create-employee', component: CreateEmployeeComponent },
  { path: 'editEmployee/:id', component: CreateEmployeeComponent },

  { path: 'list-users', component: ListUsersComponent },
  { path: 'user-profile/:id', component: UserProfileComponent},

  { path: 'threejs', component: BackgroundThreejsComponent},

  { path: 'cart', component: CartComponent},

  { path: 'location/:id', component: LocationComponent},

  { path: 'request-tattoo/:id', component: RequestTattooComponent},
  { path: 'list-requests-tattoos', component: ListRequestsTattoosComponent},

  { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule) },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
