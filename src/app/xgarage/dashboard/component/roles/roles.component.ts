import { Router, ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { RoleService } from '../../service/role.service';
import { Table, TableModule } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Permission } from 'src/app/xgarage/common/model/permission';
import { PermissionService } from '../../service/permission.service';
import { Role } from 'src/app/xgarage/common/model/role';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  providers: [MessageService, ConfirmationService, DialogService],
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
export class RolesComponent implements OnInit {

  roles: Role[];

  role: Role;

  selectedRoles: Role[];

  roleDialog: boolean;

  deleteRoleDialog: boolean = false;

  deleteRolesDialog: boolean = false;

  submitted: boolean;

  cols: any[];

  rowsPerPageOptions = [5, 10, 20];

  loading: boolean = true;

  @ViewChild('dt') table: Table;

  @ViewChild('filter') filter: ElementRef;

  selectedPermissions: Permission[];

  permissions: Permission[];

  ref: DynamicDialogRef;

  newAuth: boolean;

  editAuth: boolean;

  deleteAuth: boolean;

  printAuth: boolean;

  constructor(private route: ActivatedRoute, private roleService: RoleService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef, private dialogService: DialogService) {
    this.extractPermissions();
   }


  extractPermissions() {
    this.editAuth = this.route.routeConfig.data && this.route.routeConfig.data.editAuth ? this.route.routeConfig.data.editAuth : false;
    this.newAuth = this.route.routeConfig.data && this.route.routeConfig.data.newAuth ? this.route.routeConfig.data.newAuth : false;
    this.printAuth = this.route.routeConfig.data && this.route.routeConfig.data.printAuth ? this.route.routeConfig.data.printAuth : false;
    this.deleteAuth = this.route.routeConfig.data && this.route.routeConfig.data.deleteAuth ? this.route.routeConfig.data.deleteAuth : false;
}
  ngOnInit() {
    this.roleService.getRoles().then(roles => {
      this.roles = roles;
      this.loading = false;

      this.cols = [
        { field: 'id', header: 'Id' },
        { field: 'createdAt', header: 'Created At' },
        { field: 'roleDescription', header: 'Role Description' },
        { field: 'roleName', header: 'Name' },
      ];

    });
  }

  openNew() {
    this.role = {};
    this.submitted = false;
    this.roleDialog = true;
  }

  deleteSelectedRoles() {
    this.deleteRolesDialog = true;
  }

  editRole(role: Role) {
    this.role = { ...role };
    this.roleDialog = true;
  }

  deleteRole(role: Role) {
    this.deleteRoleDialog = true;
    this.role = { ...role };
  }

  confirmDeleteSelected() {
    this.deleteRolesDialog = false;
    this.roles = this.roles.filter(val => !this.selectedRoles.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Roles Deleted', life: 3000, key: 'tst' });
    this.selectedRoles = null;
  }

  confirmDelete() {
    this.deleteRoleDialog = false;
    this.deleteRoleDialog = false;
    this.roleService.deleteRole(this.role.id).subscribe(
      {
        next: (data) => {
          if (data.message === 'Success') {
            this.roles = this.roles.filter(val => val.id !== this.role.id);
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Successful', detail: 'Role Deleted' });
            this.role = {};
          }
        },
        error: (e) => {
          console.log("error : " + e.message);
          alert(e);
        }
      }
    );
  }

  hideDialog() {
    this.roleDialog = false;
    this.submitted = false;
  }

  saveRole() {
    console.log(this.selectedPermissions);
    this.submitted = true;

    if (this.role.roleName.trim()) {
      if (this.selectedPermissions) {
        this.role.permissions = this.selectedPermissions;
      }
      if (this.role.id) {
        // @ts-ignore
        this.roleService.updateRole(this.role).subscribe(
          {
            next: (data) => {
              this.role = data;
              this.roles[this.findIndexById(this.role.id)] = this.role;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Role Updated', life: 3000, key: 'tst' });
            },
            error: (e) => alert(e)
          }
        );
      } else {
        // this.culture.id = this.createId();
        // @ts-ignore
        this.roleService.saveRole(this.role).subscribe(
          {
            next: (data) => {
              this.role = data;
              this.roles.push(this.role);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Role Created', life: 3000, key: 'tst' });
            },
            error: (e) => alert(e)
          }
        );
      }
      this.roles = [...this.roles];
      this.roleDialog = false;
      this.role = {};
    }
  }

  // showPermissions(permissions: Permission[]) {
  //   console.log(permissions);
  //   this.ref = this.dialogService.open(RolePermissionsComponent, {
  //     header: 'Available Permissions',
  //     width: '70%',
  //     contentStyle: { "max-height": "500px", "overflow": "auto" },
  //     baseZIndex: 10000,
  //     data: { permissions: permissions }
  //   });
  // }

  findIndexById(id: Number): number {
    let index = -1;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].id === id) {
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
