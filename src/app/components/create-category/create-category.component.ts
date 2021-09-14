import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import {CategoryInterface} from '../../models/category';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  categories: any[] = [];
  createCategory: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Add Category';

  constructor(private fb: FormBuilder,
              // tslint:disable-next-line:variable-name
              private _categoriesService: CategoriesService,
              private router: Router,
              private aRoute: ActivatedRoute) {
    this.createCategory = this.fb.group({
      name: ['', Validators.required],
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
  addEditCategory() {
    this.submitted = true;

    if (this.createCategory.invalid) {
      return;
    }

    if (this.id === null) {
      this.addCategory();
    } else {
      this.editCategory(this.id);
    }

  }

  // tslint:disable-next-line:typedef
  addCategory() {
    const category: CategoryInterface = {
      name: this.createCategory.value.name
    };
    this.loading = true;
    this._categoriesService.addCategory(category).then(() => {
      this.loading = false;
      this.router.navigate(['/list-categories']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    });
  }

  // tslint:disable-next-line:typedef
  editCategory(id: string) {

    const category: CategoryInterface = {
      name: this.createCategory.value.name,
    };

    this.loading = true;

    this._categoriesService.updateCategory(id, category).then(() => {
      this.loading = false;
      this.router.navigate(['/list-categories']);
    });
  }


  // tslint:disable-next-line:typedef
  isEdit() {
    if (this.id !== null) {
      this.titulo = 'Edit Category';
      this.loading = true;
      this._categoriesService.getCategory(this.id).then(data => {
        this.loading = false;
        this.createCategory.setValue({
          name: data.name
        });
      });
    }
  }
}
