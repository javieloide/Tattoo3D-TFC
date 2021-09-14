import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TattosService} from '../../services/tattos.service';
import {CategoriesService} from '../../services/categories.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TattooInterface} from '../../models/tattoo';
import {UsersService} from '../../services/users.service';
import {UserInterface} from '../../models/user';
import {AuthService} from '../../auth/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userProfileForm: FormGroup;
  loading = false;
  id: string | null;
  currentUser: UserInterface;
  constructor(private fb: FormBuilder,
              private userService: UsersService,
              private router: Router,
              private authService: AuthService,
              private aRoute: ActivatedRoute) {
    this.userProfileForm = this.fb.group({
      photo: [''],
      country: [''],
      city: [''],
      street: [''],
      zip_code: [''],
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.isEdit();
  }

  editUserProfile(): void {
    this.userService.getUser(this.id).then((currentUser) => {
      const user: UserInterface = {
        email: currentUser.email ? currentUser.email : '',
        roles: currentUser.roles ? currentUser.roles : {},
        photo: this.userProfileForm.value.photo ? this.userProfileForm.value.photo : '',
        country: this.userProfileForm.value.country ? this.userProfileForm.value.country  : '',
        city: this.userProfileForm.value.city ? this.userProfileForm.value.city : '',
        street: this.userProfileForm.value.street ? this.userProfileForm.value.street : '',
        zip_code: this.userProfileForm.value.zip_code ? this.userProfileForm.value.zip_code : ''
      };

      this.loading = true;

      this.userService.updateUser(this.id, user).then(() => {
        this.loading = false;
        this.router.navigate(['/home']);
      });
    });
  }

  isEdit(): void {
    this.loading = true;
    this.userService.getUser(this.id).then((currentUser) => {
      this.loading = false;
      this.userProfileForm.setValue({
          photo: currentUser.photo ? currentUser.photo : '',
          country: currentUser.country ? currentUser.country : '',
          city: currentUser.city ? currentUser.city : '',
          street: currentUser.street ? currentUser.street : '',
          zip_code: currentUser.zip_code ? currentUser.zip_code : ''
        });
      });
    }
}
