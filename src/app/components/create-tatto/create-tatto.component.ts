import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TattosService } from '../../services/tattos.service';
import { CategoriesService } from '../../services/categories.service';
import {TattooInterface} from '../../models/tattoo';
import {CategoryInterface} from '../../models/category';

@Component({
  selector: 'app-create-tatto',
  templateUrl: './create-tatto.component.html',
  styleUrls: ['./create-tatto.component.css']
})
export class CreateTattoComponent implements OnInit {
  categories: CategoryInterface[] = [];
  createTattoo: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Add Tattoo';

  constructor(private fb: FormBuilder,
              // tslint:disable-next-line:variable-name
              private _tattoosService: TattosService,
              // tslint:disable-next-line:variable-name
              private _categoriesService: CategoriesService,
              private router: Router,
              private aRoute: ActivatedRoute) {
    this.createTattoo = this.fb.group({
      image: ['', Validators.required],
      name: ['', Validators.required],
      size: ['', Validators.required],
      has_color: [''],
      category: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  // tslint:disable-next-line:typedef
  getCategories() {
    this._categoriesService.getCategories().subscribe(data => {
      this.categories = [];
      data.forEach((element: any) => {
        this.categories.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.isEdit();
  }

  // tslint:disable-next-line:typedef
  addEditTattoo() {
    this.submitted = true;
    if (this.createTattoo.invalid) {
      return;
    }

    if (this.id === null) {
      this.addTattoo();
    } else {
      this.editTattoo(this.id);
    }

  }

  // tslint:disable-next-line:typedef
  addTattoo() {
    const tattoo: TattooInterface = {
      category: this.createTattoo.value.category,
      has_color: this.createTattoo.value.has_color ? this.createTattoo.value.has_color : false,
      image: this.createTattoo.value.image,
      name: this.createTattoo.value.name,
      price: this.createTattoo.value.price,
      size: this.createTattoo.value.size,
    };
    this.loading = true;
    this._tattoosService.addTattoo(tattoo).then(() => {
      this.loading = false;
      this.router.navigate(['/list-tattoos']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    });
  }

  // tslint:disable-next-line:typedef
  editTattoo(id: string) {
    const tattoo: TattooInterface = {
      category: this.createTattoo.value.category,
      has_color: this.createTattoo.value.has_color ? this.createTattoo.value.has_color : false,
      image: this.createTattoo.value.image,
      name: this.createTattoo.value.name,
      price: this.createTattoo.value.price,
      size: this.createTattoo.value.size,
    };

    this.loading = true;

    this._tattoosService.updateTattoo(id, tattoo).then(() => {
      this.loading = false;
      this.router.navigate(['/list-tattoos']);
    });
  }


  // tslint:disable-next-line:typedef
  isEdit() {
    if (this.id !== null) {
      this.titulo = 'Edit Tattoo';
      this.loading = true;
      this._tattoosService.getTattoo(this.id).then(data => {
        this.loading = false;
        this.createTattoo.setValue({
          image: data.image,
          name: data.name,
          size: data.size,
          has_color: data.has_color ? data.has_color : false,
          category: data.category,
          price: data.price
        });
      });
    }
  }
}
