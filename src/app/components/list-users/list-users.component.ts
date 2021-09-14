import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/services/auth.service';
import {UsersService} from '../../services/users.service';
import {UserInterface} from '../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  users: UserInterface[] = [];
  isAdmin: any = null;
  userUid: string = null;
  page = 1;
  pageSize = 5;

  // tslint:disable-next-line:variable-name
  constructor(private usersService: UsersService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCurrentUser();
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
  getUsers() {
    this.usersService.getUsers().subscribe(data => {
      this.users = [];
      data.forEach((element: any) => {
        this.users.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.users);
    });
  }

  // tslint:disable-next-line:typedef
  deleteUser(id: string) {
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
        this.usersService.deleteUser(id).then(() => {
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

  doAdmin(user: UserInterface): void{
    const data: UserInterface = {
      id: user.id,
      email: user.email,
      roles: {
        admin: true
      }
    };
    this.usersService.updateUser(user.id, data).then(() => {
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
        title: 'The user ' + user.email + ' its now admin'
      });
    });
  }

  unsetAdmin(user: UserInterface): void {
    const data: UserInterface = {
      id: user.id,
      email: user.email,
      roles: {
        client: true
      }
    };
    this.usersService.updateUser(user.id, data).then(() => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 3000,
        width: 600,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });

      Toast.fire({
        icon: 'success',
        title: 'The user ' + user.email + ' its now client'
      });
    });
  }
}
