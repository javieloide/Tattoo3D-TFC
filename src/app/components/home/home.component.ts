import { Component, OnInit } from '@angular/core';
import Scrollbar from 'smooth-scrollbar';
import {AuthService} from '../../auth/services/auth.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userUid: string;
  isAdmin: boolean;
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.getCurrentUser();
    Scrollbar.init(document.querySelector('#my-scrollbar'));
  }
  getCurrentUser(): void {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
          if (this.isAdmin) {
            this.router.navigate(['/list-tattoos']);
          }
        });
      }
    });
  }
}
