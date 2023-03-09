import { SubCategory } from './../../model/subcategory';
import { Category } from './../../model/category';
import { SubCategoryService } from './../../service/subcategory.service';
import { PartService } from './../../service/part.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../../auth/services/auth.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['../../../../demo/view/tabledemo.scss'],

  providers: [MessageService, ConfirmationService, DatePipe]
})
export class PartComponent  extends GenericComponent implements OnInit {

  constructor(public route: ActivatedRoute, private authService: AuthService,
    public messageService: MessageService, public datePipe: DatePipe, private partService: PartService,
    private categoryService: CategoryService, private subCategoryService: SubCategoryService,
    breadcrumbService: AppBreadcrumbService) {
    super(route, datePipe, breadcrumbService);
   }

  category: Category;
  categories: Category[];
  subCategory: SubCategory;
  subCategories: SubCategory[];

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllSubCategories();
    this.getAll();

    this.breadcrumbService.setItems([{'label': 'Parts', routerLink: ['parts']}]);
  }

  getAll() {
    this.partService.getAll().subscribe({
      next: (parts) => {
        this.masters = parts.map(part => {
          this.category = this.categories.find(c => c.id === part.categoryId);
          this.subCategory = this.subCategories.find(sc => sc.id === part.subCategoryId);
          return {
            ...part,
            categoryName: this.category?.name,
            subCategoryName: this.subCategory?.name
          };
        });
        this.cols = [
          { field: 'id', header: 'id' },
          { field: 'name', header: 'Part Name' },
          { field: 'status', header: 'Status' },
          { field: 'subCategoryName', header: 'Sub-Category' },
          { field: 'categoryName', header: 'Category' }
        ];
        this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
    });
  }

  getAllCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (e) => alert(e)
    })
  }

  getAllSubCategories() {
    this.subCategoryService.getAll().subscribe({
      next: (data) => {
        this.subCategories = data;
      },
      error: (e) => alert(e)
    })
  }

}
