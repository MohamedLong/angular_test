import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Table, TableModule } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Role } from 'src/app/xgarage/common/model/role';
import { User } from 'src/app/xgarage/common/model/user';
import { TenantService } from 'src/app/xgarage/common/service/tenant.service';
import { Tenant } from 'src/app/xgarage/common/model/tenant';
import { UserDto } from 'src/app/xgarage/common/dto/userdto';
import { DialogService } from 'primeng/dynamicdialog';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
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
export class UsersComponent implements OnInit {

    users: UserDto[];

    user: User;
    userDto: UserDto;

    roles: Role[];

    selectedUser: UserDto;

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

    constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private messageService: MessageService, private roleService: RoleService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef, private tenantService: TenantService) {
        this.extractPermissions();
     }


    extractPermissions() {
        this.editAuth = this.route.routeConfig.data && this.route.routeConfig.data.editAuth ? this.route.routeConfig.data.editAuth : false;
        this.newAuth = this.route.routeConfig.data && this.route.routeConfig.data.newAuth ? this.route.routeConfig.data.newAuth : false;
        this.printAuth = this.route.routeConfig.data && this.route.routeConfig.data.printAuth ? this.route.routeConfig.data.printAuth : false;
        this.deleteAuth = this.route.routeConfig.data && this.route.routeConfig.data.deleteAuth ? this.route.routeConfig.data.deleteAuth : false;
    }


    ngOnInit() {
        this.getUsers();
        this.getTenants();
        this.getRoles();
    }

    getTenants() {
        this.tenantService.getAll().subscribe((res: Tenant[]) => {
            this.tenants = res;
        })
    }

    getRoles() {
        this.roleService.getRoles().then(res  => {
            this.roles = res;
        })
    }

    getUsers() {
        this.userService.getUsers().then(users => {
            this.users = users;
            this.loading = false;

            this.cols = [
                { field: 'id', header: 'Id' },
                { field: 'createdDate', header: 'Created Date' },
                { field: 'email', header: 'Email' },
                { field: 'enabled', header: 'Enabled' },
                { field: 'firstName', header: 'First Name' },
                { field: 'tenant', header: 'Tenant Name' },
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
        this.userDto = {};
        this.selectedUser = {};
        this.selectedTenant = {};
        this.submitted = false;
        this.selectedRoleHidden = true;
        this.userDialog = true;
    }

    editUser(user: UserDto) {
        this.userDto = {};
        this.userService.getUserById(user.id).subscribe(
            {
                next: (data) => {
                    this.user = data;
                    this.selectedTenant = this.user.tenant;
                    this.selectedRoleHidden = false;
                    this.selectedRole = this.user.roles[0];
                    this.userDialog = true;
                },
                error: (err) => {
                    console.log('error: ' + err);
                    this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err });
                }
            }
        );
    }

    deleteUser(user: User) {
        this.deleteUserDialog = true;
        this.user = { ...user };
    }

    confirmDelete() {
        this.deleteUserDialog = false;
        this.userService.deleteUser(this.user.id).subscribe(
            {
                next: (data) => {
                    if (data.message === 'Success') {
                        this.users = this.users.filter(val => val.id !== this.user.id);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000});
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

    changeStatus(id: number, event) {
        if (id != null) {
            this.userService.changeEnableStatus(id, event.checked).subscribe(
                {
                    next: (data) => {
                        this.messageService.add({ severity: 'info', summary: 'Successful', detail: 'User Status Changed', life: 3000});
                    }
                }
            )
        }
    }

    saveUser() {
        this.submitted = true;
        if (this.user.email && this.user.userId && this.user.firstName) {
            this.user.tenant = this.selectedTenant;
            if (this.user.id) {
                // @ts-ignore
                this.userService.updateUser(this.user).subscribe(
                    {
                        next: (data) => {
                            this.user = data;
                            this.updateCurrentUserDtoList();
                            this.userService.changeUserRole(this.user.id, this.selectedRole.roleName).subscribe(
                                {
                                    next: () => {
                                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
                                    }
                                }
                            );
                        },
                        error: (e) => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 });
                        }
                    }
                );
            } else {
                // this.accent.id = this.createId();
                // @ts-ignore
                this.user.provider = "local";
                this.userService.saveNewUser(this.user).subscribe(
                    res => {
                        this.user = res;
                        // this.users.push(this.user);
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

    private updateCurrentUserDtoList() {
        this.userDto.id = this.user.id;
        this.userDto.username = this.user.userId;
        this.userDto.firstName = this.user.firstName;
        this.userDto.lastName = this.user.lastName;
        this.userDto.phone = this.user.phone;
        this.userDto.email = this.user.email;
        this.userDto.token = this.user.token;
        this.userDto.enabled = this.user.enabled;
        this.userDto.createDate = this.user.createdDate;
        this.userDto.tenant = this.user.tenant.name;
        this.users[this.findIndexById(this.user.id)] = this.userDto;
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
