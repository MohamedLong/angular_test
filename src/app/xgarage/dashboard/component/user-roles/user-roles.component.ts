import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { UserRoleService } from '../../service/userrole.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserRole } from 'src/app/xgarage/common/model/userrole';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
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
export class UserRolesComponent implements OnInit {

  userRoles : UserRole[];

    userRole : UserRole;

    selectedUserRoles: UserRole[];

    userRoleDialog: boolean;

    deleteUserRoleDialog: boolean = false;

    deleteUserRolesDialog: boolean = false;

    submitted: boolean;

    cols: any[];

    rowsPerPageOptions = [5, 10, 20];

    loading:boolean = true;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    constructor(private userRoleService: UserRoleService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef) {}


  ngOnInit() {
    this.userRoleService.getUserRoles().then(userRoles => {
        this.userRoles = userRoles;
        this.loading = false;

        this.cols = [
          {field: 'userId', header: 'User Id'},
          {field: 'roleId', header: 'Role Id'},
        ];
    });
}

openNew() {
  this.userRole = {};
  this.submitted = false;
  this.userRoleDialog = true;
}

deleteSelectedUserRoles() {
  this.deleteUserRolesDialog = true;
}

editUserRole(userRole: UserRole) {
  this.userRole = {...userRole};
  this.userRoleDialog = true;
}

deleteUserRole(userRole: UserRole) {
  this.deleteUserRoleDialog = true;
  this.userRole = {...userRole};
}

confirmDeleteSelected(){
  this.deleteUserRolesDialog = false;
  this.userRoles = this.userRoles.filter(val => !this.selectedUserRoles.includes(val));
  this.messageService.add({severity: 'success', summary: 'Successful', detail: 'User Role Deleted', life: 3000});
  this.selectedUserRoles = null;
}

confirmDelete(){
  this.deleteUserRoleDialog = false;
  this.userRoles = this.userRoles.filter(val => val.userId !== this.userRole.userId);
  this.messageService.add({severity: 'success', summary: 'Successful', detail: 'User Role Deleted', life: 3000});
  this.userRole = {};
}

hideDialog() {
  this.userRoleDialog = false;
  this.submitted = false;
}

saveUserRole(){}
// saveUserRole() {
//   this.submitted = true;

//   if (this.userRole.subjectName.trim()) {
//       if (this.userRole.id) {
//           // @ts-ignore
//           this.userRoles[this.findIndexById(this.userRole.id)] = this.userRole;
//           this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Advise Call Updated', life: 3000});
//       } else {
//           this.userRole.id = this.createId();
//           // @ts-ignore
//           this.userRoles.push(this.userRole);
//           this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Advise Call Created', life: 3000});
//       }

//       this.userRoles = [...this.userRoles];
//       this.userRoleDialog = false;
//       this.userRole = {};
//   }
// }

findIndexById(id: Number): number {
  let index = -1;
  for (let i = 0; i < this.userRoles.length; i++) {
      if (this.userRoles[i].userId === id) {
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
