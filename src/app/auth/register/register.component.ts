import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {isObject} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  data_required: string =  null;
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    photo: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    street: new FormControl(''),
    zip_code: new FormControl('')
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  async onRegister(){
    if (this.registerForm.valid){
    const  {email, password, photo, country, city, street, zip_code} = this.registerForm.value;
    const extraData = {
      photo,
      country,
      city,
      street,
      zip_code
    };

    try{
      const user = await this.authService.register(email, password, extraData);
      if (user && isObject(user)){
        await this.router.navigate(['/home']);
      } else {
        if (!isObject(user)){
            this.data_required = user;
        }
      }
    } catch (error){
      this.data_required = error;
    }
    } else{
      this.data_required = 'The form its invalid';
    }
  }


  // tslint:disable-next-line:typedef
  get email(){
    return this.registerForm.get('email');
  }
  // tslint:disable-next-line:typedef
  get password(){
    return this.registerForm.get('password');
  }

}
