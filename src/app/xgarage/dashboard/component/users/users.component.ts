import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from './../../service/roleservice';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { UserService } from '../../service/userservice';
import { Table, TableModule } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Role } from 'src/app/xgarage/common/model/role';
import { User } from 'src/app/xgarage/common/model/user';
import { TenantService } from 'src/app/xgarage/common/service/tenantservice';
import { Tenant } from 'src/app/xgarage/common/model/tenant';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
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
export class UsersComponent implements OnInit {

    users: User[];

    user: User;

    roles: Role[];

    selectedUsers: User[];

    userDialog: boolean;

    deleteUserDialog: boolean = false;

    deleteUsersDialog: boolean = false;

    submitted: boolean;

    cols: any[];

    rowsPerPageOptions = [5, 10, 20];

    loading: boolean = true;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    checked1: boolean = false;

    checked2: boolean = true;

    selectedRole: Role;

    role: Role;

    selectedRoleHidden: boolean = true;

    newAuth: boolean;

    editAuth: boolean;

    deleteAuth: boolean;

    printAuth: boolean;

    tenants: Tenant[];

    selectedTenant: Tenant;

    constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private messageService: MessageService, private roleService: RoleService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef, private tenantService: TenantService) { }


    ngOnInit() {
        this.getUsers();
        this.getTenants();
    }

    getTenants() {
        this.tenantService.getAll().subscribe((res: Tenant[]) => {
            this.tenants = res;
        })
    }

    getUsers() {
        this.userService.getUsers().then(users => {
            console.log(this.route)
            this.editAuth = this.route.routeConfig.data.editAuth;
            this.newAuth = this.route.routeConfig.data.newAuth;
            this.printAuth = this.route.routeConfig.data.printAuth;
            this.deleteAuth = this.route.routeConfig.data.deleteAuth;
            this.users = users;
            this.loading = false;

            this.cols = [
                { field: 'id', header: 'Id' },
                { field: 'createdDate', header: 'Created Date' },
                { field: 'email', header: 'Email' },
                { field: 'enabled', header: 'Enabled' },
                { field: 'firstName', header: 'First Name' },
                { field: 'lastName', header: 'Last Name' },
                { field: 'phone', header: 'Phone' },
                { field: 'authProvider', header: 'Auth Provider' },
                { field: 'providerId', header: 'Provider Id' },
                { field: 'token', header: 'Token' },
                { field: 'userId', header: 'User Id' },
                { field: 'documentId', header: 'Document Id' },
            ];
        });
    }
    openNew() {
        this.user = {};
        this.selectedTenant = {};
        this.submitted = false;
        this.selectedRoleHidden = true;
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.deleteUsersDialog = true;
    }

    editUser(user: User) {
        this.user = { ...user };
        this.selectedTenant = this.user.tenant;
        this.roleService.getRoles().then(roles => this.roles = roles);
        this.selectedRoleHidden = false;
        this.userDialog = true;
    }

    deleteUser(user: User) {
        this.deleteUserDialog = true;
        this.user = { ...user };
    }

    confirmDeleteSelected() {
        this.deleteUsersDialog = false;
        this.users = this.users.filter(val => !this.selectedUsers.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000, key: 'tst' });
        this.selectedUsers = null;
    }

    confirmDelete() {
        this.deleteUserDialog = false;
        this.userService.deleteUser(this.user.id).subscribe(
            {
                next: (data) => {
                    if (data.message === 'Success') {
                        this.users = this.users.filter(val => val.id !== this.user.id);
                        this.messageService.add({ severity: 'info', summary: 'Successful', detail: 'User Deleted', life: 3000, key: 'tst' });
                        this.user = {};
                    }
                },
                error: (e) => {
                    console.error(e.message);
                    alert(e.message);
                }
            }
        );
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    changeStatus(id: number) {
        if (id != null) {
            console.log(id);
            this.userService.changeStatus(id);
        }
    }

    saveUser() {
        this.submitted = true;
        if (!this.selectedRoleHidden) {
            this.selectedRole.roleName;
        }

        if (this.user.email.trim()) {
            this.user.provider = "local";
            this.user.tenant = this.selectedTenant;
            if (this.user.id) {
                // @ts-ignore
                this.userService.updateUser(this.user).subscribe(
                    {
                        next: (data) => {
                            this.user = data;
                            this.users[this.findIndexById(this.user.id)] = this.user;
                            this.userService.assignRoleToUSer(this.user.id, this.selectedRole.id).subscribe(
                                {
                                    next: (data) => {
                                        console.log(data);
                                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
                                    },
                                    error: (e) => alert(e)
                                }
                            );
                        },
                        error: (e) => alert(e)
                    }
                );
            } else {
                // this.accent.id = this.createId();
                // @ts-ignore
                this.userService.saveNewUser(this.user).subscribe(
                    res => {

                        this.user = res;
                        this.users.push(this.user);
                        this.getUsers();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created Successfully' });
                    },
                    err => {
                        this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Failed to add user' });
                    }


                );
            }

            this.users = [...this.users];
            this.userDialog = false;
            this.user = {};
        }
    }

    findIndexById(id: Number): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
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
