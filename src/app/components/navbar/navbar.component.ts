import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {CartService} from '../../services/cart.service';
import Scrollbar from 'smooth-scrollbar';
import {UsersService} from '../../services/users.service';
import {UserInterface} from '../../models/user';
import {LocationService} from '../../services/location.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService]
})
export class NavbarComponent implements OnInit {

  public isLogged =  false;
  public user$: Observable<any> = this.authService.afAuth.user;
  private userUid: string;
  photo: string;
  userS: UserInterface;
  isAdmin: any = null;
  idLocation: string;

  constructor(private authService: AuthService,
              private usersService: UsersService,
              private cartService: CartService,
              private locationService: LocationService,
              private router: Router) { }

  // tslint:disable-next-line:typedef
  async ngOnInit(){
    this.getLocation();
    this.getCurrentUser();
  }

  // tslint:disable-next-line:typedef
   getCurrentUser(){
     this.authService.isAuth().subscribe( auth => {
      if (auth){
        this.userUid = auth.uid;
        this.usersService.getUser(this.userUid).then((data) => {
          this.userS = data;
          this.photo = this.userS.photo;
        });
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        });
      }
    });
  }

  getLocation(): void {
    this.locationService.getLocations().subscribe(data => {
      this.idLocation = data[0].payload.doc.id;
    });
  }
  // tslint:disable-next-line:typedef
  async onLogout(){
    try{

      await this.authService.logout();
      // tslint:disable-next-line:no-unused-expression
      this.router.navigate['/login'];

    } catch (error){console.log(error); }
  }

  toTattos(): void {
    const dom  = document.getElementById('my-scrollbar');
    if (dom === null){
      this.router.navigate(['/home']);
    }
    const scrollbar = Scrollbar.init(dom);
    scrollbar.scrollTo(0, 850, 600);
  }

  toPiercings(): void{
    const dom  = document.getElementById('my-scrollbar');
    if (dom === null){
      this.router.navigate(['/home']);
    }
    const scrollbar = Scrollbar.init(dom);
    scrollbar.scrollTo(0, 2080, 600);
  }

  toLocation(): void {
    const dom  = document.getElementById('my-scrollbar');
    if (dom === null){
      this.router.navigate(['/home']);
    }
    const scrollbar = Scrollbar.init(dom);
    scrollbar.scrollTo(0, 3780, 600);
  }

  toAbout(): void{
    const dom  = document.getElementById('my-scrollbar');
    if (dom === null){
      this.router.navigate(['/home']);
    }
    const scrollbar = Scrollbar.init(dom);
    scrollbar.scrollTo(0, 4900, 600);
  }

}
