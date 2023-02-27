import { SubMenuService } from '../../service/submenu.service';
import { UserMainMenuService } from '../../service/usermainmenu.service';
import { RoleService } from '../../service/role.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { UserSubMenuService } from '../../service/usersubmenu.service';
import { Table, TableModule } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api'
import { UserSubMenu } from '../../model/usersubmenu';
import { Role } from 'src/app/xgarage/common/model/role';
import { SubMenu } from '../../model/submenu';
import { UserMainMenu } from '../../model/usermainmenu';

@Component({
    selector: 'app-user-sub-menu',
    templateUrl: './user-sub-menu.component.html',
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
export class UserSubMenuComponent implements OnInit {

    usersubmenus: UserSubMenu[];

    usersubmenu: UserSubMenu;

    roles: Role[];

    selectedRole: Role;

    pages: SubMenu[];

    selectedPage: SubMenu;

    userMainMenus: UserMainMenu[];

    selectedUserMainMenu: UserMainMenu;

    usersubmenuDialog: boolean;

    deleteUserSubMenuDialog: boolean = false;

    deleteUserSubMenusDialog: boolean = false;

    submitted: boolean;

    cols: any[];

    rowsPerPageOptions = [5, 10, 20];

    loading: boolean = true;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    disableNewButton: boolean = false;

    disableEditButton: boolean = false;

    disableDeleteButton: boolean = false;

    auth: boolean = true;

    constructor(private subMenuService: SubMenuService, private userMainMenuService: UserMainMenuService, private roleService: RoleService, private usersubmenuService: UserSubMenuService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef) { }


    ngOnInit() {
        this.roleService.getRoles().then(roles => {
            this.roles = roles;
        });
        this.usersubmenuService.getUserSubMenus().then(usersubmenus => {
            this.usersubmenus = usersubmenus;
            this.loading = false;

            this.cols = [
                { field: 'id', header: 'Id' },
                { field: 'role.roleName', header: 'Role' },
            ];
        });
    }

    fetchUserMainMenus() {
        this.userMainMenuService.getUserMainMenusByRoleId(this.selectedRole.id).then(umm => {
            this.userMainMenus = umm;
        });
    }

    fetchSubMenus() {

        this.subMenuService.getSubMenusByRoleId(this.selectedUserMainMenu.mainMenu.id).then(sm => {
            this.pages = sm;
        });
    }

    openNew() {
        this.usersubmenu = {};
        this.submitted = false;
        this.usersubmenuDialog = true;
    }

    deleteSelectedUserSubMenus() {
        this.deleteUserSubMenusDialog = true;
    }

    editUserSubMenu(usersubmenu: UserSubMenu) {
        this.usersubmenu = { ...usersubmenu };
        this.usersubmenuDialog = true;
    }

    deleteUserSubMenu(usersubmenu: UserSubMenu) {
        this.deleteUserSubMenuDialog = true;
        this.usersubmenu = { ...usersubmenu };
    }

    // confirmDeleteSelected() {
    //   this.deleteUserSubMenusDialog = false;
    //   this.usersubmenus = this.usersubmenus.filter(val => !this.selectedUserSubMenus.includes(val));
    //   this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserSubMenus Deleted', life: 3000 });
    //   this.selectedUserSubMenus = null;
    // }

    confirmDelete() {
        this.deleteUserSubMenuDialog = false;
        this.usersubmenuService.deleteUserSubMenu(this.usersubmenu.id).subscribe(
            {
                next: (data) => {
                    if (data.message === 'Success') {
                        this.usersubmenus = this.usersubmenus.filter(val => val.id !== this.usersubmenu.id);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserSubMenu Deleted', life: 3000 });
                        this.usersubmenu = {};
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
        this.usersubmenuDialog = false;
        this.submitted = false;
    }

    saveUserSubMenu() {
        this.submitted = true;

        if (this.selectedRole && this.selectedUserMainMenu && this.selectedPage) {
            console.log('selected role is valid')
            if (this.usersubmenu.newAuth || this.usersubmenu.editAuth || this.usersubmenu.deleteAuth || this.usersubmenu.printAuth || this.usersubmenu.confirmAuth || this.usersubmenu.cancelConfirmAuth) {
                this.auth = false;
                console.log('selected auth is valid')
                this.auth = true
                this.usersubmenu.role = this.selectedRole;
                this.usersubmenu.userMainMenu = this.selectedUserMainMenu;
                this.usersubmenu.subMenu = this.selectedPage;

                let reqBody = {
                    role: {id: this.usersubmenu.role.id},
                    userMainMenu: {id: this.usersubmenu.userMainMenu.id},
                    subMenu: {id: this.usersubmenu.subMenu.id},
                    newAuth: this.usersubmenu.newAuth? 1 : null,
                    deleteAuth: this.usersubmenu.deleteAuth? 1 : null,
                    printAuth: this.usersubmenu.printAuth? 1 : null,
                    confirmAuth: this.usersubmenu.confirmAuth? 1 : null,
                    cancelConfirmAuth: this.usersubmenu.cancelConfirmAuth? 1 : null,
                    editAuth: this.usersubmenu.editAuth? 1 : null,
                }

                if (this.usersubmenu.id) {
                    // @ts-ignore
                    this.usersubmenuService.updateUserSubMenu(reqBody).subscribe(
                        {
                            next: (data) => {
                                this.usersubmenu = data;
                                this.usersubmenus[this.findIndexById(this.usersubmenu.id)] = this.usersubmenu;
                                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserSubMenu Updated', life: 3000 });
                            },
                            error: (e) => {
                                console.error(e.message);
                                alert(e.message);
                            }
                        }
                    );
                } else {
                    // this.usersubmenu.id = this.createId();
                    // @ts-ignore
                    this.usersubmenuService.saveUserSubMenu(reqBody).subscribe(
                        {
                            next: (data) => {
                                this.usersubmenu = data;
                                this.usersubmenus.push(this.usersubmenu);
                                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserSubMenu Created', life: 3000 });
                            },
                            error: (e) => {
                                console.error(e.message);
                                this.messageService.add({ severity: 'erorr', summary: 'Erorr', detail: e.message, life: 3000 });
                            }
                        }
                    );
                }

                this.usersubmenus = [...this.usersubmenus];
                this.usersubmenuDialog = false;
                this.usersubmenu = {};

            } else {
                this.auth = true;
                console.log('selected auth is not valid')
            }

        }

    }

    findIndexById(id: Number): number {
        let index = -1;
        for (let i = 0; i < this.usersubmenus.length; i++) {
            if (this.usersubmenus[i].id === id) {
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
