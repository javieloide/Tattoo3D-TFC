import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/services/auth.service';
import Swal from 'sweetalert2';
import {RequestsTattoosService} from '../../services/requests_tattoos.service';
import {RequestTattooInterface} from '../../models/requestTattoo';

@Component({
  selector: 'app-list-requests-tattoos',
  templateUrl: './list-requests-tattoos.component.html',
  styleUrls: ['./list-requests-tattoos.component.css']
})
export class ListRequestsTattoosComponent implements OnInit {
  requestsTattoos: RequestTattooInterface[] = [];
  isAdmin: any = null;
  userUid: string = null;
  page = 1;
  pageSize = 4;
  // tslint:disable-next-line:variable-name
  constructor(private requestsTattoosService: RequestsTattoosService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getRequestsTattoos();
  }

  // tslint:disable-next-line:typedef
  getCurrentUser(){
    this.authService.isAuth().subscribe(auth => {
      if (auth){
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        });
      }
    });
  }
  // tslint:disable-next-line:typedef
  getRequestsTattoos() {
    this.requestsTattoosService.getRequestsTattoos().subscribe(data => {
      this.requestsTattoos = [];
      if (!this.isAdmin) {
        data.forEach((element: any) => {
          if (element.payload.doc.data().idUser === this.userUid) {
            this.requestsTattoos.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            });
          }
        });
      } else {
        data.forEach((element: any) => {
            this.requestsTattoos.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            });
        });
      }
    });
  }
  // tslint:disable-next-line:typedef
  deleteRequestTattoo(id: string) {
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
          this.requestsTattoosService.deleteRequestTattoo(id).then(() => {
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
    } else {
      this.requestsTattoosService.deleteRequestTattoo(id).then(() => {
      }).catch(error => {
        console.log(error);
      });
      Swal.fire(
        'Confirmed!',
        'The request of the tattoo has been confirmed.',
        'success'
      );
    }
  }
}
