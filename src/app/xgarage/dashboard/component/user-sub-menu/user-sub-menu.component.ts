import { SubMenuService } from '../../service/submenu.service';
import { UserMainMenuService } from '../../service/usermainmenu.service';
import { RoleService } from '../../service/role.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { UserSubMenuService } from '../../service/usersubmenu.service';
import { Table} from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api'
import { UserSubMenu } from '../../model/usersubmenu';
import { Role } from 'src/app/xgarage/common/model/role';
import { SubMenu } from '../../model/submenu';
import { UserMainMenuDto } from '../../dto/usermainmenudto';

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

    userMainMenus: UserMainMenuDto[];

    selectedUserMainMenu: UserMainMenuDto;

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
        this.getAllRoles();
        this.getUserSubMenus();
        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'role.roleName', header: 'Role' },
        ];
  
    }

    getAllRoles(){
        this.roleService.getRoles().then(roles => {
            this.roles = roles;
        });
    }

    getUserSubMenus() {
        this.usersubmenuService.getUserSubMenus().then(usersubmenus => {
            this.usersubmenus = usersubmenus;
            this.loading = false;
        });
    }

    fetchUserMainMenus(role: Role) {
        console.log(this.selectedRole.id)
        this.userMainMenuService.getUserMainMenusByRoleId(role.id).then(umm => {
            this.userMainMenus = umm;
        });
    }

    fetchSubMenus(module: UserMainMenuDto) {
        console.log('selected module: ', module);
        this.pages = [];
        this.subMenuService.getSubMenusByModule(module.pageId).then(sm => {
            this.pages = sm;
        });
    }

    openNew() {
        this.usersubmenu = {};
        this.selectedRole = {};
        this.selectedPage = {};
        this.selectedUserMainMenu = {};
        this.submitted = false;
        this.usersubmenuDialog = true;
    }

    deleteSelectedUserSubMenus() {
        this.deleteUserSubMenusDialog = true;
    }

    editUserSubMenu(usersubmenu: UserSubMenu) {
        console.log('usersubmenu: ', usersubmenu);
        this.usersubmenu = { ...usersubmenu };
        this.selectedRole = this.roles.find(role => role.id == usersubmenu.role);
        // this.selectedUserMainMenu = usersubmenu.userMainMenu;
        this.selectedPage = usersubmenu.subMenu;
        console.log('this.selectedPage: ', this.selectedPage);
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
                    if (data.messageCode === 200) {
                        this.usersubmenus = this.usersubmenus.filter(val => val.id !== this.usersubmenu.id);
                        this.messageService.add({
                            severity: 'success', summary: 'Successful',
                            detail: 'Page Permission Deleted'
                        });
                        this.usersubmenu = {};
                    }
                },
                error: (e) => {
                    console.error(e.message);
                    this.messageService.add({
                        severity: 'erorr', summary: 'Erorr',
                        detail: e.message
                    });
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
            if (this.usersubmenu.newAuth || this.usersubmenu.editAuth || this.usersubmenu.deleteAuth || this.usersubmenu.printAuth || this.usersubmenu.approveAuth || this.usersubmenu.cancelAuth || this.usersubmenu.acceptAuth || this.usersubmenu.completeAuth) {
                this.auth = false;
                console.log('selected permission is valid')
                this.auth = true
                this.usersubmenu.role = this.selectedRole.id;
                this.usersubmenu.userMainMenu = {id: this.selectedUserMainMenu.id};
                this.usersubmenu.subMenu = this.selectedPage;
                if (this.usersubmenu.id) {
                    this.usersubmenuService.updateUserSubMenu(this.usersubmenu).subscribe(data => {
                        this.usersubmenu = data;
                        this.usersubmenus[this.findIndexById(this.usersubmenu.id)] = this.usersubmenu;
                        this.messageService.add({
                            severity: 'success', summary: 'Successful',
                            detail: 'Page Permission  Updated'
                        });

                    }, err => {
                        console.error(err.message);
                        this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err.message, life: 3000 });
                    }
                    );
                } else {
                    this.usersubmenuService.saveUserSubMenu(this.usersubmenu).subscribe(data => {
                        this.usersubmenu = data;
                        this.usersubmenus.push(this.usersubmenu);
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Page Permission Created', life: 3000 });
                    }, err => {
                        console.error(err.message);
                        this.messageService.add({ severity: 'erorr', summary: 'Erorr', detail: err.message, life: 3000 });
                    });

                }

                this.usersubmenus = [...this.usersubmenus];
                this.usersubmenuDialog = false;
                this.usersubmenu = {};

            } else {
                this.auth = true;
                console.log('selected permission is not valid')
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

    getRoleNameFromId(id: number) {
        return this.roles.find(r => r.id == id).roleName;
    }

}
