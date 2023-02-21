import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { PermissionService } from '../../service/permission.service';
import { Table, TableModule } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Permission } from 'src/app/xgarage/common/model/permission';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';

@Component({
  selector: 'app-persmissions',
  templateUrl: './permissions.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['../../../../demo/view/tabledemo.scss'],
  styles: [`
        :host ::ng-deep  .p-frozen-column {
            font-weight: bold;
        }

        :host ::ng-deep .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        :host ::ng-deep .p-progressbar {
            height:.5rem;
        }
    `]
})
export class PermissionsComponent implements OnInit {

  permissions: Permission[];

  permission: Permission;

  selectedPermissions: Permission[];

  permissionDialog: boolean;

  deletePermissionDialog: boolean = false;

  deletePermissionsDialog: boolean = false;

  submitted: boolean;

  cols: any[];

  rowsPerPageOptions = [5, 10, 20];

  loading: boolean = true;

  @ViewChild('dt') table: Table;

  @ViewChild('filter') filter: ElementRef;

  constructor(private breadcrumbService: AppBreadcrumbService, private permissionService: PermissionService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef) { }


  ngOnInit() {
    this.permissionService.getPermissions().then(permissions => {
      this.permissions = permissions;
      this.loading = false;

      this.cols = [
        { field: 'id', header: 'Id' },
        { field: 'createdAt', header: 'Created At' },
        { field: 'permissionName', header: 'Permission Name' },
        { field: 'permissionUrl', header: 'Permission Url' },
      ];
    });

    this.breadcrumbService.setItems([{'label': 'Permissions', 'routerLink': ['permission']}]);
  }

  openNew() {
    this.permission = {};
    this.submitted = false;
    this.permissionDialog = true;
  }

  deleteSelectedPermissions() {
    this.deletePermissionsDialog = true;
  }

  editPermission(permission: Permission) {
    this.permission = { ...permission };
    this.permissionDialog = true;
  }

  deletePermission(permission: Permission) {
    this.deletePermissionDialog = true;
    this.permission = { ...permission };
  }

  confirmDeleteSelected() {
    this.deletePermissionsDialog = false;
    this.permissions = this.permissions.filter(val => !this.selectedPermissions.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Permissions Deleted', life: 3000 });
    this.selectedPermissions = null;
  }

  confirmDelete() {
    this.deletePermissionDialog = false;
    this.permissions = this.permissions.filter(val => val.id !== this.permission.id);
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Permission Deleted', life: 3000 });
    this.permission = {};
  }

  hideDialog() {
    this.permissionDialog = false;
    this.submitted = false;
  }

  savePermission() {
    this.submitted = true;

    if (this.permission.permissionName.trim()) {
      if (this.permission.id) {
        // @ts-ignore
        this.permissionService.updatePermission(this.permission).subscribe(
          {
            next: (data) => {
              this.permission = data;
              this.permissions[this.findIndexById(this.permission.id)] = this.permission;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Permission Updated', life: 3000 });
            },
            error: (e) => alert(e)
          }
        );
      } else {
        // this.culture.id = this.createId();
        // @ts-ignore
        this.permissionService.savePermission(this.permission).subscribe(
          {
            next: (data) => {
              this.permission = data;
              this.permissions.push(this.permission);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Permission Created', life: 3000 });
            },
            error: (e) => alert(e)
          }
        );
      }
      this.permissions = [...this.permissions];
      this.permissionDialog = false;
      this.permission = {};
    }
  }

  findIndexById(id: Number): number {
    let index = -1;
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i].id === id) {
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

