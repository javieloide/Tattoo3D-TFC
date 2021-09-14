import { Component, OnInit } from '@angular/core';
import { TattosService } from '../../services/tattos.service';
import { AuthService } from '../../auth/services/auth.service';
import Swal from 'sweetalert2';
import {TattooInterface} from '../../models/tattoo';

@Component({
  selector: 'app-list-tattos',
  templateUrl: './list-tattos.component.html',
  styleUrls: ['./list-tattos.component.css']
})
export class ListTattosComponent implements OnInit {

  tattoos: TattooInterface[] = [];
  isAdmin: any = null;
  userUid: string = null;
  filterTattoo = '';
  logged: any = null;
  // Pagination
  page = 1;
  pageSize = 4;

  // tslint:disable-next-line:variable-name
  constructor(private _tattoosService: TattosService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getTattoos();
  }

  // tslint:disable-next-line:typedef
  getCurrentUser(){
    this.authService.isAuth().subscribe(auth => {
      if (auth){
        this.logged = true;
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        });
      }
    });
  }

  // tslint:disable-next-line:typedef
  getTattoos() {
    this._tattoosService.getTattoos().subscribe(data => {
      this.tattoos = [];
      data.forEach((element: any) => {
        this.tattoos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    });
  }

  // tslint:disable-next-line:typedef
  deleteTattoo(id: string) {
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
        this._tattoosService.deleteTattoo(id).then(() => {
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

}
