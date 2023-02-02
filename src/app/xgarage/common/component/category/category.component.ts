import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Category } from '../../model/category';
import { CategoryService } from '../../service/category.service';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api'
import { Message, MessageService } from 'primeng/api';
import {AppBreadcrumbService} from '../../../../app.breadcrumb.service';

@Component({
  templateUrl: './category.component.html',
    styleUrls: ['../../../../demo/view/tabledemo.scss'],
    styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }

        @media screen and (max-width: 960px) {
            :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
                text-align: center;
            }

            :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
                display: flex;
            }
        }

    `],
    providers: [MessageService, ConfirmationService]
})
export class CategoryComponent implements OnInit {

    categories : Category[];

    category : Category;

    selectedEntries: Category[];

    categoryDialog: boolean;

    msgs: Message[] = [];

    deleteSingleDialog: boolean = false;

    deleteMultipleDialog: boolean = false;

    submitted: boolean;

    cols: any[];

    rowsPerPageOptions = [5, 10, 20];

    loading:boolean = true;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;
  confirmationService: any;

    constructor(private categoryService: CategoryService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef,
      private breadcrumbService: AppBreadcrumbService) {
        this.breadcrumbService.setItems([
          { label: 'Pages' },
          { label: 'Crud', routerLink: ['/pages/crud'] }
      ]);
      }


  ngOnInit() {
    this.getAll();

  }

getAll() {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        // categories.forEach(category => this.categoryService.savecategory(category).subscribe());
        this.categories = categories;
        this.loading = false;

        this.cols = [
          {field: 'id', header: 'Id'},
          {field: 'name', header: 'Category Name'},
        ];
      },
      error: (e) => alert(e)
        // @ts-ignore
        //this.accents.forEach(accent => accent.date = new Date(customer.date));
    });
  }

openNew() {
  this.category = {};
  this.submitted = false;
  this.categoryDialog = true;
}

deleteSelectedEntries() {
  this.deleteMultipleDialog = true;
}

editAction(category: Category) {
  this.category = {...category};
  this.categoryDialog = true;
}

deleteAction(category: Category) {
  this.deleteSingleDialog = true;
  this.category = {...category};
}

confirmDeleteSelected(){
  this.deleteMultipleDialog = false;
  this.categories = this.categories.filter(val => !this.selectedEntries.includes(val));
  this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Categories Deleted', life: 3000});
  this.selectedEntries = null;
}

confirmDelete(){
  this.deleteSingleDialog = false;
  this.categoryService.delete(this.category.id).subscribe(
    {
      next: (data) => {
        //this.categories = this.categories.filter(val => val.id !== this.category.id);
        // this.messageService.add({severity: 'success', summary: 'Successful', detail: 'category Deleted', life: 3000});
        if(data.messageCode === 200) {
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000});
          this.getAll();
          this.category = {};
        }
      },
      error: (e) => alert(e)
    });
}

hideDialog() {
  this.categoryDialog = false;
  this.submitted = false;
}

save() {
  this.submitted = true;

  if (this.category.name.trim()) {
      if (this.category.id) {
          // @ts-ignore
          this.categoryService.update(this.category).subscribe(
            {
              next: (data) => {
                this.category = data;
                this.categories[this.findIndexById(this.category.id)] = this.category;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000});
              },
              error: (e) => alert(e)
            }
          );
      } else {
          // this.accent.id = this.createId();
          // @ts-ignore
          this.categoryService.add(this.category).subscribe(
            {
              next: (data) => {
                this.category = data;
                this.categories.push(this.category);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000});
              },
              error: (e) => alert(e)
            }
          );
      }

      this.categories = [...this.categories];
      this.categoryDialog = false;
      this.category = {};
  }
}

findIndexById(id: Number): number {
  let index = -1;
  for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id === id) {
          index = i;
          break;
      }
  }

  return index;
}

createId(): number {
  return Math.floor(Math.random() * 1000);
}

clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
}

}
