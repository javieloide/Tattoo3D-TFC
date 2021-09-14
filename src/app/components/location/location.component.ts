import { Component, OnInit } from '@angular/core';
import {LocationService} from '../../services/location.service';
import {LocationInterface} from '../../models/location';
import {AuthService} from '../../auth/services/auth.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UsersService} from '../../services/users.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  userUid: string;
  isAdmin: boolean;
  lat: number;
  lng: number;
  zoom: number;
  mapTypeId: string;
  location: LocationInterface;

  locationForm: FormGroup;
  loading = false;
  id: string | null;

  constructor(private locationService: LocationService,
              private fb: FormBuilder,
              private userService: UsersService,
              private router: Router,
              private authService: AuthService,
              private aRoute: ActivatedRoute) {
    this.locationForm = this.fb.group({
      latitude: [0],
      longitude: [0],
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getLocation();
    this.isEdit();
  }

  editLocation(): void {

      const location: LocationInterface = {
        latitude:  this.locationForm.value.latitude ? this.locationForm.value.latitude : 0,
        longitude: this.locationForm.value.longitude ? this.locationForm.value.longitude : 0
      };

      this.loading = true;

      this.locationService.updateLocation(this.id, location).then(() => {
        this.loading = false;
        this.router.navigate(['/home']);
      });
  }

  isEdit(): void {
    this.loading = true;
    this.locationService.getLocation(this.id).then((data) => {
      this.loading = false;
      this.locationForm.setValue({
        latitude: data.latitude ? data.latitude : 0,
        longitude: data.longitude ? data.longitude : 0
      });
    });
  }
  getCurrentUser(): void{
    this.authService.isAuth().subscribe( auth => {
      if (auth){
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        });
      }
    });
  }
  getLocation(): void {
    if (this.id === null) {
      this.locationService.getLocations().subscribe(data => {
        this.location = data[0].payload.doc.data();
        this.lat = this.location.latitude;
        this.lng = this.location.longitude;
        this.zoom = 16;
        this.mapTypeId = 'hybrid';
      });
    } else {
      this.locationService.getLocation(this.id).then((data) => {
        this.location = data;
        this.lat = data.latitude;
        this.lng = data.longitude;
        this.zoom = 16;
        this.mapTypeId = 'hybrid';
      });
    }
  }
  // tslint:disable-next-line:typedef
  getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(position => {
      this.lat =  position.coords.latitude;
      this.lng = position.coords.longitude;
      this.zoom = 57;
      this.mapTypeId = 'hybrid';
    });
  }
}
