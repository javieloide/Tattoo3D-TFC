import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { PiercingsService } from 'src/app/services/piercings.service';
import {CartService} from '../../services/cart.service';
import {PiercingInterface} from '../../models/piercing';
import {OrderInterface} from '../../models/order';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-piercings',
  templateUrl: './list-piercings.component.html',
  styleUrls: ['./list-piercings.component.css']
})
export class ListPiercingsComponent implements OnInit {

  piercings: PiercingInterface[] = [];
  isAdmin: any = null;
  userUid: string = null;
  filterPiercing = '';
  cartPiercings: any[] = [];
  logged: any = null;
  page = 1;
  pageSize = 4;
  // tslint:disable-next-line:variable-name
  constructor(private _piercingsService: PiercingsService,
              private  cartService: CartService,
              private  router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLogged();
    this.getPiercings();
    this.getCurrentUser();
  }
  // tslint:disable-next-line:typedef
  isLogged(){
    this.authService.isAuth().subscribe(auth => {
      if (auth){
        this.logged = true;
      }
    });
  }
  // tslint:disable-next-line:typedef
  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        });
      }
    });
  }

  // tslint:disable-next-line:typedef
  getPiercings() {
    this._piercingsService.getPiercings().subscribe(data => {
      this.piercings = [];
      data.forEach((element: any) => {
        this.piercings.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    });
  }
  // tslint:disable-next-line:typedef
  deletePiercing(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._piercingsService.deletePiercing(id).then(() => {
        }).catch(error => {
          console.log(error);
        });
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    });
  }

  // tslint:disable-next-line:typedef
  addCart(piercing: PiercingInterface){
    this.cartPiercings.push(piercing);
  }
  // tslint:disable-next-line:typedef
  addOrder(){
    const order: OrderInterface = {
      userId: this.userUid,
      date: String(new Date()),
      products: this.cartPiercings
    };
    this.cartService.addOrder(order).then(() => {
      this.router.navigate(['/cart']);
    }).catch(error => {
      console.log(error);
    });
  }
}
