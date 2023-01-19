import { Router, ActivatedRoute } from '@angular/router';
import { MainMenuService } from '../../service/mainmenuservice.service';
import { RoleService } from '../../service/roleservice.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { UserMainMenuService } from '../../service/usermainmenuservice.service';
import { Table, TableModule } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api'
import { Role } from 'src/app/xgarage/common/model/role';
import { UserMainMenu } from '../../model/usermainmenu';
import { MainMenu } from '../../model/mainmenu';

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
export class UserMainMenuComponent implements OnInit {

  usermainmenus: UserMainMenu[];

  usermainmenu: UserMainMenu;

  roles: Role[];

  selectedRole: Role;

  modules: MainMenu[];

  selectedModule: MainMenu;

  selectedUserMainMenus: UserMainMenu[];

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

  printAuth: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private mainMenuService: MainMenuService, private roleService: RoleService, private usermainmenuService: UserMainMenuService, private messageService: MessageService, private confirmService: ConfirmationService, private cd: ChangeDetectorRef) { }


  ngOnInit() {
    this.roleService.getRoles().then(roles => {
      this.roles = roles;
    });

    this.mainMenuService.getAllMenues().then(umm => {
      this.modules = umm;
    });

    this.usermainmenuService.getUserMainMenus().then(usermainmenus => {
      this.editAuth = this.route.routeConfig.data.editAuth;
      this.newAuth = this.route.routeConfig.data.newAuth;
      this.printAuth = this.route.routeConfig.data.printAuth;
      this.deleteAuth = this.route.routeConfig.data.deleteAuth;
      this.usermainmenus = usermainmenus;

      this.loading = false;

      this.cols = [
        { field: 'id', header: 'Id' },
        { field: 'role.roleName', header: 'Role' },
      ];
    });
  }

  fetchMainMenus(){
    this.mainMenuService.getAllMenues().then(umm => {
      this.modules = umm;
      console.log(this.modules);
    });
  }

  openNew() {
    this.usermainmenu = {};
    this.submitted = false;
    this.usermainmenuDialog = true;
  }

  deleteSelectedUserMainMenus() {
    this.deleteUserMainMenusDialog = true;
  }

  editUserMainMenu(usermainmenu: UserMainMenu) {
    console.log(usermainmenu.role.roleName+" "+usermainmenu.mainMenu.pageName);
    this.usermainmenu = { ...usermainmenu };
    this.selectedRole = usermainmenu.role;
    this.selectedModule = usermainmenu.mainMenu;
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
          if (data.message === 'Success') {
            this.usermainmenus = this.usermainmenus.filter(val => val.id !== this.usermainmenu.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserMainMenu Deleted', life: 3000 });
            this.usermainmenu = {};
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
    this.usermainmenuDialog = false;
    this.submitted = false;
  }

  saveUserMainMenu() {
    this.submitted = true;
    if(this.selectedModule){
      this.usermainmenu.mainMenu = this.selectedModule;
    }
    if (this.submitted) {
      if(this.selectedRole){
        this.usermainmenu.role = this.selectedRole;
      }
      if (this.usermainmenu.id) {
        // @ts-ignore
        this.usermainmenuService.updateUserMainMenu(this.usermainmenu).subscribe(
          {
            next: (data) => {
              this.usermainmenu = data;
              this.usermainmenus[this.findIndexById(this.usermainmenu.id)] = this.usermainmenu;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserMainMenu Updated', life: 3000 });
            },
            error: (e) => {
              console.error(e.message);
              alert(e.message);
            }
          }
        );
      } else {
        // this.usermainmenu.id = this.createId();
        // @ts-ignore
        this.usermainmenuService.saveUserMainMenu(this.usermainmenu).subscribe(
          {
            next: (data) => {
              this.usermainmenu = data;
              console.log(data);
              this.usermainmenus.push(this.usermainmenu);
              this.usermainmenus[this.findIndexById(this.usermainmenu.id)] = this.usermainmenu;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'UserMainMenu Created', life: 3000 });
            },
            error: (e) => {
              console.error(e.message);
              alert(e.message);
            }
          }
        );
      }
      this.usermainmenus = [...this.usermainmenus];
      this.usermainmenuDialog = false;
      this.usermainmenu = {};
    }
  }

  findIndexById(id: Number): number {
    let index = -1;
    for (let i = 0; i < this.usermainmenus.length; i++) {
      if (this.usermainmenus[i].id === id) {
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
