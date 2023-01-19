import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { RolePermissionService } from '../../service/rolepermission.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Permission } from 'src/app/xgarage/common/model/permission';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
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
export class RolePermissionsComponent implements OnInit {

  rolePermissions: Permission[];

  rolePermission: Permission;

  selectedRolePermissions: Permission[];

  rolePermissionDialog: boolean;

  deleteRolePermissionDialog: boolean = false;

  deleteRolePermissionsDialog: boolean = false;

  submitted: boolean;

  cols: any[];

  rowsPerPageOptions = [5, 10, 20];

  loading: boolean = true;

  @ViewChild('dt') table: Table;

  @ViewChild('filter') filter: ElementRef;

  constructor(private config: DynamicDialogConfig, private rolePermissionService: RolePermissionService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef) { }


  ngOnInit() {
    this.rolePermissions = this.config.data.permissions;
    this.loading = false;

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'createdAt', header: 'Created At' },
      { field: 'permissionName', header: 'Permission Name' },
      { field: 'permissionUrl', header: 'Permission Url' },
    ];

}

// openNew() {
//   this.rolePermission = {};
//   this.submitted = false;
//   this.rolePermissionDialog = true;
// }

deleteSelectedRolePermissions() {
  this.deleteRolePermissionsDialog = true;
}

// editRolePermission(rolePermission: RolePermission) {
//   this.rolePermission = { ...rolePermission };
//   this.rolePermissionDialog = true;
// }

// deleteRolePermission(rolePermission: RolePermission) {
//   this.deleteRolePermissionDialog = true;
//   this.rolePermission = { ...rolePermission };
// }

// confirmDeleteSelected(){
//   this.deleteRolePermissionsDialog = false;
//   this.rolePermissions = this.rolePermissions.filter(val => !this.selectedRolePermissions.includes(val));
//   this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Role Permissions Deleted', life: 3000 });
//   this.selectedRolePermissions = null;
// }

// confirmDelete(){
//   this.deleteRolePermissionDialog = false;
//   this.rolePermissions = this.rolePermissions.filter(val => val.roleId !== this.rolePermission.roleId);
//   this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Role Permission Deleted', life: 3000 });
//   this.rolePermission = {};
// }

hideDialog() {
  this.rolePermissionDialog = false;
  this.submitted = false;
}

saveRolePermission(){ }
// saveRolePermission() {
//   this.submitted = true;

//   if (this.rolePermission.subjectName.trim()) {
//       if (this.rolePermission.id) {
//           // @ts-ignore
//           this.rolePermissions[this.findIndexById(this.rolePermission.id)] = this.rolePermission;
//           this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Advise Call Updated', life: 3000});
//       } else {
//           this.rolePermission.id = this.createId();
//           // @ts-ignore
//           this.rolePermissions.push(this.rolePermission);
//           this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Advise Call Created', life: 3000});
//       }

//       this.rolePermissions = [...this.rolePermissions];
//       this.rolePermissionDialog = false;
//       this.rolePermission = {};
//   }
// }

findIndexById(id: Number): number {
  let index = -1;
  for (let i = 0; i < this.rolePermissions.length; i++) {
    if (this.rolePermissions[i].id === id) {
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
