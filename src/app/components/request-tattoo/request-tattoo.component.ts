import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestsTattoosService} from '../../services/requests_tattoos.service';
import {RequestTattooInterface} from '../../models/requestTattoo';
import {TattosService} from '../../services/tattos.service';
import {TattooInterface} from '../../models/tattoo';
import {AuthService} from '../../auth/services/auth.service';

@Component({
  selector: 'app-request-tattoo',
  templateUrl: './request-tattoo.component.html',
  styleUrls: ['./request-tattoo.component.css']
})
export class RequestTattooComponent implements OnInit {
  requestsTattoos: any[] = [];
  createRequestTattoo: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  tattoo: TattooInterface;
  userUid: string;

  constructor(private fb: FormBuilder,
              // tslint:disable-next-line:variable-name
              private requestTattooService: RequestsTattoosService,
              private tattooService: TattosService,
              private router: Router,
              private authService: AuthService,
              private aRoute: ActivatedRoute) {
    this.createRequestTattoo = this.fb.group({
      date: ['', Validators.required],
      hour: ['', Validators.required]
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  // tslint:disable-next-line:typedef
  getRequestsTattoos() {
    this.requestTattooService.getRequestsTattoos().subscribe(data => {
      this.requestsTattoos = [];
      data.forEach((element: any) => {
        if (element.payload.doc.data().idUser === this.userUid) {
          this.requestsTattoos.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        }
      });
    });
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getRequestsTattoos();
  }
  getCurrentUser(): void {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
      }
    });
  }
  // tslint:disable-next-line:typedef
  addEditCategory() {
    this.submitted = true;

    if (this.createRequestTattoo.invalid) {
      return;
    }
    this.addRequestTattoo();
  }

  // tslint:disable-next-line:typedef
  addRequestTattoo() {
    this.tattooService.getTattoo(this.id).then((data) => {
      const requestTattoo: RequestTattooInterface = {
        date: this.createRequestTattoo.value.date,
        hour: this.createRequestTattoo.value.hour,
        idTattoo: this.id,
        idUser: this.userUid,
        photo: data.image,
        price: data.price
      };
      this.loading = true;
      this.requestTattooService.addRequestTattoo(requestTattoo).then(() => {
        this.loading = false;
        this.router.navigate(['/home']);
      }).catch(error => {
        console.log(error);
        this.loading = false;
      });
    });
  }
}
