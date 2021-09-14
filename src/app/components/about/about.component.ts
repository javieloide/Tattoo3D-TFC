import { Component, OnInit } from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {EmployeeInterface} from '../../models/employee';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  employees: EmployeeInterface[] = [];
  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees();
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
}
