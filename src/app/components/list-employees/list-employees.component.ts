import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/services/auth.service';
import Swal from 'sweetalert2';
import {EmployeeService} from '../../services/employee.service';
import {EmployeeInterface} from '../../models/employee';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {

  employees: EmployeeInterface[] = [];
  isAdmin: any = null;
  userUid: string = null;
  page = 1;
  pageSize = 4;
  // tslint:disable-next-line:variable-name
  constructor(private employeeService: EmployeeService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getEmployees();
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
  getEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = [];
      data.forEach((element: any) => {
        this.employees.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    });
  }

  // tslint:disable-next-line:typedef
  deleteEmployee(id: string) {
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
        this.employeeService.deleteEmployee(id).then(() => {
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
