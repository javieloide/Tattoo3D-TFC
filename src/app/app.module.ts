import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateTattoComponent } from './components/create-tatto/create-tatto.component';
import { ListTattosComponent } from './components/list-tattos/list-tattos.component';
// @ts-ignore
import { ListCategoriesComponent } from './components/list-categories/list-categories.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
// @ts-ignore
import { ListPiercingsComponent } from './components/list-piercings/list-piercings.component';
import { CreatePiercingComponent } from './components/create-piercing/create-piercing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SliderComponent } from './components/slider/slider.component';
import { BackgroundThreejsComponent } from './components/background-threejs/background-threejs.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { CartComponent } from './components/cart/cart.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AboutComponent } from './components/about/about.component';
import { CreateEmployeeComponent } from './components/create-employee/create-employee.component';
import { ListEmployeesComponent } from './components/list-employees/list-employees.component';
import { LocationComponent } from './components/location/location.component';
import { RequestTattooComponent } from './components/request-tattoo/request-tattoo.component';
import { ListRequestsTattoosComponent } from './components/list-requests-tattoos/list-requests-tattoos.component';
// Google Maps Api
import { AgmCoreModule } from '@agm/core';
import { ListImgComponent } from './components/list-img/list-img.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CreateTattoComponent,
    ListTattosComponent,
    ListCategoriesComponent,
    CreateCategoryComponent,
    ListPiercingsComponent,
    CreatePiercingComponent,
    FilterPipe,
    SliderComponent,
    BackgroundThreejsComponent,
    CartComponent,
    ListUsersComponent,
    HomeComponent,
    UserProfileComponent,
    AboutComponent,
    CreateEmployeeComponent,
    ListEmployeesComponent,
    LocationComponent,
    RequestTattooComponent,
    ListRequestsTattoosComponent,
    ListImgComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    IvyCarouselModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAYJj4QvIrs-Qax20xxYccDRSmwS4bDJxQ'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
