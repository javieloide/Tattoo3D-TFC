import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {isObject} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  data_required: string = null;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  // tslint:disable-next-line:typedef
  async onLogin(){
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value;
      try {
        // tslint:disable-next-line:no-shadowed-variable
        const user = await this.authService.login(email, password);
        if (user && isObject(user)) {
          // redirect
          await this.router.navigate(['/home']);
        } else {
          if (!isObject(user)) {
            this.data_required = user;
          }
        }
      } catch (error) {
        this.data_required = error;
      }
    } else {
      this.data_required = 'The form its invalid';
    }
  }

  // tslint:disable-next-line:typedef
  get email(){
    return this.loginForm.get('email');
  }
  // tslint:disable-next-line:typedef
  get password(){
    return this.loginForm.get('password');
  }

}
