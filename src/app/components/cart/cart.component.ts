import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';
import {OrderInterface} from '../../models/order';
import {AuthService} from '../../auth/services/auth.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {Utils} from '../../../utils/utils';
import {UsersService} from '../../services/users.service';
import {UserInterface} from '../../models/user';
import Swal from 'sweetalert2';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  constructor(private cartService: CartService,
              private userService: UsersService,
              private authService: AuthService) { }
  piercingsCart: OrderInterface[] = [];
  total = 0;
  userUid: string;
  isAdmin: boolean;
  emailUser = '';
  user: UserInterface = null;
  logoDataUrl: string;

  ngOnInit(): void {
    this.getCurrentUser();
    this.getOrders();
    Utils.getImageDataUrlFromLocalPath1('assets/logo3.png').then(
      result => this.logoDataUrl = result
    );
  }
  // tslint:disable-next-line:typedef
  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.emailUser =  auth.email;
        this.userService.getUser(this.userUid).then((data) => {
          this.user = data;
        });
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        });
      }
    });
  }
  getOrders(): void {
    this.cartService.getOrders().subscribe(data => {
      this.piercingsCart = [];
      if (!this.isAdmin) {
        data.forEach((element: any) => {
          if (element.payload.doc.data().userId === this.userUid) {
            this.piercingsCart.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            });
          }
        });
      } else {
        data.forEach((element: any) => {
            this.piercingsCart.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            });
        });
      }
    });
  }
  calcularTotalOrder(order: OrderInterface): number{
    let total = 0;
    for (const piercing of order.products){
      total += piercing.price;
    }
    return total;
  }

  // tslint:disable-next-line:typedef
  confirmOrder(order: OrderInterface){
    this.generarPDF(order);
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-left',
      showConfirmButton: false,
      timer: 3000,
      width: 600,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Order confirmed'
    });
  }
  deleteOrder(id: string): void{
    if (!this.isAdmin) {
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
          this.cartService.deleteOrder(id).then(() => {
          }).catch((error) => {
            console.log(error);
          });
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        }
      });
    } else {
      this.cartService.deleteOrder(id).then(() => {
      }).catch((error) => {
        console.log(error);
      });
      Swal.fire(
        'Confirmed!',
        'The order has been sent.',
        'success'
      );
    }
  }
  // tslint:disable-next-line:typedef
  generarPDF(order: OrderInterface) {
    let products = [['Name', 'Material', 'Body area', 'Price']];
    for (let piercing of order.products){
      products.push([piercing.name, piercing.material, piercing.body_area, String(piercing.price) + '$']);
    }
    const documentDefinition = {
      content: [
        {
         image: this.logoDataUrl,
         alignment: 'center',
        },
        'User: ' + this.emailUser,
        'Date: ' + new Date(order.date).toLocaleDateString(),
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],

            body: products
          }
        },
        { text: 'Total Price: ' + this.calcularTotalOrder(order) + '$', alignment: 'right' },
        { text: 'Country: ' + this.user.country},
        { text: 'City: ' + this.user.city},
        { text: 'Street: ' + this.user.street},
        { text: 'Zip code: ' + this.user.zip_code},
      ],
    };
    pdfMake.createPdf(documentDefinition).open();
  }
  mostrarTabla(idOrder: string, idUser: string): void{
    const table = document.getElementById(idOrder);
    if (table.style.display === 'none') {
      table.style.display = '';
    } else {
      table.style.display = 'none';
    }
    const span = document.getElementById(idUser);
    if (span.style.display === 'none') {
      span.style.display = '';
    } else {
      span.style.display = 'none';
    }
  }

}
