import { Router, ActivatedRoute } from '@angular/router';
import { MainMenuService } from '../../service/mainmenu.service';
import { RoleService } from '../../service/role.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { UserMainMenuService } from '../../service/usermainmenu.service';
import { Table} from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api'
import { Role } from 'src/app/xgarage/common/model/role';
import { UserMainMenu } from '../../model/usermainmenu';
import { MainMenu } from '../../model/mainmenu';
import { UserRootMenuService } from '../../service/userrootmenuservice';
import { UserRootMenuDto } from '../../dto/userrootmenudto';

@Component({
    selector: 'app-user-main-menu',
    templateUrl: './user-main-menu.component.html',
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
export class UserMainMenuComponent implements OnInit{

    usermainmenus: UserMainMenu[];

    usermainmenu: UserMainMenu;

    roles: Role[];

    selectedRole: Role;

    modules: MainMenu[] = [];

    selectedModule: MainMenu;

    selectedUserMainMenus: UserMainMenu[] = [];

    userRootMenus: UserRootMenuDto[] = [];

    selectedRootModule: UserRootMenuDto;

    usermainmenuDialog: boolean;

    deleteUserMainMenuDialog: boolean = false;

    deleteUserMainMenusDialog: boolean = false;

    submitted: boolean;

    cols: any[];

    rowsPerPageOptions = [5, 10, 20];

    loading: boolean = true;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    newAuth: boolean;

    editAuth: boolean;

    deleteAuth: boolean;

    constructor(private route: ActivatedRoute, private userRootMenuService: UserRootMenuService, private mainMenuService: MainMenuService, private roleService: RoleService, private usermainmenuService: UserMainMenuService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef) { }


    ngOnInit() {
       this.getAllRoles();
       this.getAllMainMenus();
       this.fetchUserMainMenus();
        if(localStorage.getItem('subs')) {
            let subs = JSON.parse(localStorage.getItem('subs'));
            const filtered = subs.filter(sub => this.route.routeConfig.path === sub.subMenu.routerLink);
            if (filtered && filtered.length > 0) {
                this.route.routeConfig.data = { newAuth: filtered[0].newAuth, editAuth: filtered[0].editAuth, deleteAuth: filtered[0].deleteAuth}
            } else {
                this.route.routeConfig.data = { newAuth: false, editAuth: false, deleteAuth: false}
            }
            this.editAuth = this.route.routeConfig.data && this.route.routeConfig.data.editAuth ? this.route.routeConfig.data.editAuth : false;
            this.newAuth = this.route.routeConfig.data && this.route.routeConfig.data.newAuth ? this.route.routeConfig.data.newAuth : false;
            this.deleteAuth = this.route.routeConfig.data && this.route.routeConfig.data.deleteAuth ? this.route.routeConfig.data.deleteAuth : false;

            this.loading = false;

            this.cols = [
                { field: 'id', header: 'Id' },
                { field: 'role.roleName', header: 'Role' },
                { field: 'usermainmenu.mainMenu.pageName', header: 'Module Name' }
            ];
        }
    }

    getAllRoles() {
        this.roleService.getRoles().then(roles => {
            this.roles = roles;
            // console.log(roles)
        });
    }

    fetchUserMainMenus() {
        this.usermainmenuService.getUserMainMenus().then(umm => {
            this.usermainmenus = umm;
            console.log(this.modules);
        });
    }

    fetchUserRootMenusByRole(role: Role) {
        this.userRootMenuService.getUserRootMenusByRoleId(role.id).then(umm => {
            this.userRootMenus = umm;
        });
    }

    filterModules(selectedRootModule: UserRootMenuDto){
        this.modules.filter(m => m.rootMenu.id = selectedRootModule.moduleId);
    }

    getRoleNameFromId(id: number) {
        return this.roles.find(r => r.id == id).roleName;
    }

    getAllMainMenus() {
        this.mainMenuService.getAllMenues().then(umm => {
            this.modules = umm;
        });
    }

    openNew() {
        this.usermainmenu = {};
        this.selectedRole = {};
        this.selectedRootModule = {};
        this.selectedModule = {};
        this.submitted = false;
        this.usermainmenuDialog = true;
    }

    deleteSelectedUserMainMenus() {
        this.deleteUserMainMenusDialog = true;
    }

    editUserMainMenu(usermainmenu: UserMainMenu) {
        // console.log(usermainmenu)
        this.usermainmenu = { ...usermainmenu };
        console.log('this.usermainmenu: ', this.usermainmenu);
        this.selectedRole = this.roles.find(role => role.id == usermainmenu.role);
        if(this.userRootMenus.length == 0) {
            this.userRootMenuService.getUserRootMenusByRoleId(this.selectedRole.id).then(umm => {
                this.userRootMenus = umm;
                  this.selectedRootModule = this.userRootMenus[0];
            });
        }else{
            this.selectedRootModule = this.userRootMenus[0];
        }
        this.selectedModule = this.modules.find(module => module.id == usermainmenu.mainMenu.id);
        this.usermainmenuDialog = true;
    }

    deleteUserMainMenu(usermainmenu: UserMainMenu) {
        this.deleteUserMainMenuDialog = true;
        this.usermainmenu = { ...usermainmenu };
    }

    confirmDeleteSelected() {
        this.deleteUserMainMenusDialog = false;
        this.usermainmenus = this.usermainmenus.filter(val => !this.selectedUserMainMenus.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserMainMenus Deleted', life: 3000 });
        this.selectedUserMainMenus = null;
    }

    confirmDelete() {
        this.deleteUserMainMenuDialog = false;
        this.usermainmenuService.deleteUserMainMenu(this.usermainmenu.id).subscribe(
            {
                next: (data) => {
                    if (data.messageCode === 200) {
                        this.usermainmenus = this.usermainmenus.filter(val => val.id !== this.usermainmenu.id);

                        this.messageService.add({
                            severity: 'success', summary: 'Successful',
                            detail: 'UserMainMenu Deleted'
                        });

                        this.usermainmenu = {};
                    }
                },
                error: (e) => {
                    console.error(e.message);
                    this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Erorr Deleteing UserMainMenu', life: 3000 });
                }
            }
        );
    }

    hideDialog() {
        this.usermainmenuDialog = false;
        this.submitted = false;
    }

    saveUserMainMenu() {
        this.submitted = true;
        // console.log(this.selectedModule, this.selectedRole)
        if (this.selectedRole && this.selectedModule && this.selectedRootModule) {
            this.submitted = false;
            this.usermainmenu.role = this.selectedRole.id;
            this.usermainmenu.mainMenu = this.selectedModule;
            this.usermainmenu.userRootMenu = {id: this.selectedRootModule.moduleId};

            if (this.usermainmenu.id) {
                this.usermainmenuService.updateUserMainMenu(this.usermainmenu).subscribe(
                    {
                        next: (data) => {
                            this.usermainmenu = data;
                            this.usermainmenus[this.findIndexById(this.usermainmenu.id, this.usermainmenus)] = this.usermainmenu;
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Permission Updated', life: 3000 });
                        },
                        error: (e) => {
                            console.error(e.message);
                            alert(e.message);
                        }
                    }
                );
            } else{
                this.usermainmenuService.saveUserMainMenu(this.usermainmenu).subscribe(
                    {
                        next: (data) => {
                            this.usermainmenu = data;
                            console.log(data);
                            this.usermainmenus.push(this.usermainmenu);
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Module Permission Created', life: 3000 });
                        },
                        error: (e) => {
                            console.error(e.message);
                            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: e.message, life: 3000 });
                        }
                    }
                );
            }
            this.usermainmenus = [...this.usermainmenus];
            this.usermainmenuDialog = false;
            this.usermainmenu = {};
        }
    }

    findIndexById(id: Number, myList: any[]): number {
        let index = -1;
        for (let i = 0; i < myList.length; i++) {
            if (myList[i].id === id) {
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
