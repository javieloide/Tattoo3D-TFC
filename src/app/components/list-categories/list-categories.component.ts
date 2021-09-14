import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent implements OnInit {
  categories: any[] = [];
  isAdmin: any = null;
  userUid: string = null;
  page = 1;
  pageSize = 5;

  // tslint:disable-next-line:variable-name
  constructor(private _categoriesService: CategoriesService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getCategories();
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

  // tslint:disable-next-line:typedef
  deleteCategory(id: string) {
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
        this._categoriesService.deleteCategory(id).then(() => {
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
