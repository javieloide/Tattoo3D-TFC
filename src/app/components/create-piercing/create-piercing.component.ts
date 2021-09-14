import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PiercingsService } from 'src/app/services/piercings.service';
import { CategoriesService } from '../../services/categories.service';
import {PiercingInterface} from '../../models/piercing';

@Component({
  selector: 'app-create-piercing',
  templateUrl: './create-piercing.component.html',
  styleUrls: ['./create-piercing.component.css']
})
export class CreatePiercingComponent implements OnInit {
  piercings:any[]=[];
  createPiercing: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Add Piercing';

  constructor(private fb: FormBuilder,
    private _piercingsService: PiercingsService,
    private _categoriesService: CategoriesService,
    private router: Router,
    private aRoute: ActivatedRoute) {
    this.createPiercing = this.fb.group({
      image: ['', Validators.required],
      name: ['', Validators.required],
      material: ['', Validators.required],
      body_area: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  getPiercings() {
    this._piercingsService.getPiercings().subscribe(data => {
      this.piercings = [];
      data.forEach((element: any) => {
        this.piercings.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    });
  }


  ngOnInit(): void {
    this.getPiercings();
    this.isEdit();
  }

  addEditPiercing() {
    this.submitted = true;

    if (this.createPiercing.invalid) {
      return;
    }

    if (this.id === null) {
      this.addPiercing();
    } else {
      this.editPiercing(this.id);
    }

  }

  // tslint:disable-next-line:typedef
  addPiercing() {
    const piercing: PiercingInterface = {
      image: this.createPiercing.value.image,
      name: this.createPiercing.value.name,
      body_area: this.createPiercing.value.body_area,
      material: this.createPiercing.value.material,
      price: this.createPiercing.value.price
    };
    this.loading = true;
    this._piercingsService.addPiercing(piercing).then(() => {
      this.loading = false;
      this.router.navigate(['/list-piercings']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    });
  }

  // tslint:disable-next-line:typedef
  editPiercing(id: string) {

    const piercing: PiercingInterface = {
      image: this.createPiercing.value.image,
      name: this.createPiercing.value.name,
      body_area: this.createPiercing.value.body_area,
      material: this.createPiercing.value.material,
      price: this.createPiercing.value.price,
    };

    this.loading = true;

    this._piercingsService.updatePiercing(id, piercing).then(() => {
      this.loading = false;
      this.router.navigate(['/list-piercings']);
    });
  }


  // tslint:disable-next-line:typedef
  isEdit() {
    if (this.id !== null) {
      this.titulo = 'Edit Piercing';
      this.loading = true;
      this._piercingsService.getPiercing(this.id).then(data => {
        this.loading = false;
        this.createPiercing.setValue({
          image: data.image,
          name: data.name,
          body_area: data.body_area,
          material: data.material,
          price: data.price
        });
      });
    }
  }
}
