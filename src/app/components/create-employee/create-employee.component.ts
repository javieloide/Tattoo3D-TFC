import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoriesService} from '../../services/categories.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryInterface} from '../../models/category';
import {EmployeeService} from '../../services/employee.service';
import {EmployeeInterface} from '../../models/employee';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employees: any[] = [];
  createEmployee: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Add Employee';

  constructor(private fb: FormBuilder,
              // tslint:disable-next-line:variable-name
              private employeeService: EmployeeService,
              private router: Router,
              private aRoute: ActivatedRoute) {
    this.createEmployee = this.fb.group({
      age: [''],
      email: ['', Validators.required],
      name: ['', Validators.required],
      photo: ['']
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
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

  ngOnInit(): void {
    this.getEmployees();
    this.isEdit();
  }

  // tslint:disable-next-line:typedef
  addEditEmployee() {
    this.submitted = true;

    if (this.createEmployee.invalid) {
      return;
    }

    if (this.id === null) {
      this.addEmployee();
    } else {
      this.editEmployee(this.id);
    }

  }

  // tslint:disable-next-line:typedef
  addEmployee() {
    const employee: EmployeeInterface = {
      age: this.createEmployee.value.age,
      email: this.createEmployee.value.email,
      name: this.createEmployee.value.name,
      photo: this.createEmployee.value.photo
    };
    this.loading = true;
    this.employeeService.addEmployee(employee).then(() => {
      this.loading = false;
      this.router.navigate(['/list-employees']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    });
  }

  // tslint:disable-next-line:typedef
  editEmployee(id: string) {

    const employee: EmployeeInterface = {
      age: this.createEmployee.value.age,
      email: this.createEmployee.value.email,
      name: this.createEmployee.value.name,
      photo: this.createEmployee.value.photo
    };

    this.loading = true;

    this.employeeService.updateEmployee(id, employee).then(() => {
      this.loading = false;
      this.router.navigate(['/list-employees']);
    });
  }


  // tslint:disable-next-line:typedef
  isEdit() {
    if (this.id !== null) {
      this.titulo = 'Edit Employee';
      this.loading = true;
      this.employeeService.getEmployee(this.id).then(data => {
        this.loading = false;
        this.createEmployee.setValue({
          age: data.age,
          email: data.email,
          name: data.name,
          photo: data.photo
        });
      });
    }
  }
}

