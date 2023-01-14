import { UnsavedChangesGaurd } from './unsaved.guard';
import {Router, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './demo/view/dashboard.component';
import {DashboardAnalyticsComponent} from './demo/view/dashboardanalytics.component';
import {FormLayoutDemoComponent} from './demo/view/formlayoutdemo.component';
import {InvalidStateDemoComponent} from './demo/view/invalidstatedemo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MediaDemoComponent} from './demo/view/mediademo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';
import {AppMainComponent} from './app.main.component';
import {AppNotfoundComponent} from './pages/app.notfound.component';
import {AppContactusComponent} from './pages/app.contactus.component';
import {AppErrorComponent} from './pages/app.error.component';
import {AppAccessdeniedComponent} from './pages/app.accessdenied.component';
// import {AppLoginComponent} from './pages/.login.component';
import {AppLandingComponent} from './pages/app.landing.component';
import {InputDemoComponent} from './demo/view/inputdemo.component';
import {FloatLabelDemoComponent} from './demo/view/floatlabeldemo.component';
import {ButtonDemoComponent} from './demo/view/buttondemo.component';
import {TableDemoComponent} from './demo/view/tabledemo.component';
import {TabViewModule} from 'primeng/tabview';
import {ListDemoComponent} from './demo/view/listdemo.component';
import {AppTimelineDemoComponent} from './pages/app.timelinedemo.component';
import {TreeDemoComponent} from './demo/view/treedemo.component';
import {DisplayComponent} from './utilities/display.component';
import {ElevationComponent} from './utilities/elevation.component';
import {FlexboxComponent} from './utilities/flexbox.component';
import {GridComponent} from './utilities/grid.component';
import {IconsComponent} from './utilities/icons.component';
import {WidgetsComponent} from './utilities/widgets.component';
import {SpacingComponent} from './utilities/spacing.component';
import {TypographyComponent} from './utilities/typography.component';
import {TextComponent} from './utilities/text.component';
import {AppCalendarComponent} from './pages/app.calendar.component';
import {AppInvoiceComponent} from './pages/app.invoice.component';
import {AppHelpComponent} from './pages/app.help.component';
import {AppWizardComponent} from './pages/app.wizard.component';
import {CurrencyComponent} from './xgarage/common/component/currency/currency.component';
import { LoginComponent } from './auth/containers/login/login.component';
import { RandomGuard } from './auth/guards/random.guard';
import { MetricComponent } from './xgarage/common/component/metric/metric.component';
import { AppCrudComponent } from './pages/app.crud.component';
import { UserSubMenuService } from './xgarage/dashboard/service/usersubmenuservice';
import { SubMenu } from './xgarage/dashboard/model/submenu';
import { AuthGuard } from './auth/guards/auth.guard';
import { UserSubMenu } from './xgarage/dashboard/model/usersubmenu';
import { UserMainMenuComponent } from './xgarage/dashboard/component/user-main-menu/user-main-menu.component';
import { UserSubMenuComponent } from './xgarage/dashboard/component/user-sub-menu/user-sub-menu.component';
import { UsersComponent } from './xgarage/dashboard/component/users/users.component';
import { RolesComponent } from './xgarage/dashboard/component/roles/roles.component';
import { ChangepasswordComponent } from './xgarage/dashboard/component/changepassword/changepassword.component';
import { PermissionsComponent } from './xgarage/dashboard/component/persmissions/permissions.component';

const routes: Routes = [];

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: DashboardComponent, canActivate: [RandomGuard]},
                    {path: 'mainmenu', component: UserMainMenuComponent},
                    {path: 'submenu', component: UserSubMenuComponent},
                    {path: 'change-password', component: ChangepasswordComponent},
                    {path: 'users', component: UsersComponent},
                    {path: 'roles', component: RolesComponent},
                    {path: 'permission', component: PermissionsComponent},
                    // {path: 'favorites/dashboardanalytics', component: DashboardAnalyticsComponent},
                    // {path: 'uikit/formlayout', component: FormLayoutDemoComponent},
                    // {path: 'uikit/floatlabel', component: FloatLabelDemoComponent},
                    // {path: 'uikit/invalidstate', component: InvalidStateDemoComponent},
                    // {path: 'uikit/input', component: InputDemoComponent},
                    // {path: 'uikit/button', component: ButtonDemoComponent},
                    // {path: 'uikit/table', component: TableDemoComponent},
                    // {path: 'uikit/list', component: ListDemoComponent},
                    // {path: 'uikit/tree', component: TreeDemoComponent},
                    // {path: 'uikit/panel', component: PanelsDemoComponent},
                    // {path: 'uikit/overlay', component: OverlaysDemoComponent},
                    // {path: 'uikit/menu', component: MenusDemoComponent},
                    // {path: 'uikit/media', component: MediaDemoComponent},
                    // {path: 'uikit/message', component: MessagesDemoComponent},
                    // {path: 'uikit/misc', component: MiscDemoComponent},
                    // {path: 'uikit/charts', component: ChartsDemoComponent},
                    // {path: 'uikit/file', component: FileDemoComponent},
                    // {path: 'utilities/display', component: DisplayComponent},
                    // {path: 'utilities/elevation', component: ElevationComponent},
                    // {path: 'utilities/flexbox', component: FlexboxComponent},
                    // {path: 'utilities/grid', component: GridComponent},
                    // {path: 'utilities/icons', component: IconsComponent},
                    // {path: 'utilities/widgets', component: WidgetsComponent},
                    // {path: 'utilities/spacing', component: SpacingComponent},
                    // {path: 'utilities/typography', component: TypographyComponent},
                    // {path: 'utilities/text', component: TextComponent},
                    // {path: 'pages/crud', component: InvoiceComponent},
                    // {path: 'pages/purchRevert', component: PurchRevertComponent},
                    // {path: 'pages/purchRevertDetails', component: PurchRevertDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // {path: 'pages/receipt', component: ReceiptComponent},
                    // {path: 'pages/receiptDetails', component: ReceiptDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // {path: 'pages/saleRevert', component: RevertComponent},
                    // {path: 'pages/revertDetails', component: RevertDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // {path: 'pages/bill', component: BillComponent},
                    // {path: 'pages/billDetails', component: BillDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // {path: 'pages/performa', component: PerformaComponent},
                    // {path: 'pages/performaDetails', component: PerformaDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // {path: 'pages/grn', component: GrnComponent},
                    // {path: 'pages/grnDetails', component: GrnDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // // {path: 'pages/invoice', component: AppInvoiceComponent},
                    // {path: 'pages/saleInvoice', component: InvoiceComponent},
                    // {path: 'pages/invoiceDetails', component: InvoiceDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // {path: 'pages/stockOrder', component: StockOrderComponent},
                    // {path: 'pages/stockOrderDetails', component: StockOrderDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // {path: 'pages/purchOrder', component: PurchaseOrderComponent},
                    // {path: 'pages/purchOrderDetails', component: PurchaseOrderDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // {path: 'pages/purchRequest', component: PurchaseRequestComponent},
                    // {path: 'pages/purchRequestDetails', component: PurchaseRequestDetailsComponent, canDeactivate: [UnsavedChangesGaurd]},
                    // {path: 'pages/calendar', component: StockOrderComponent},
                    // {path: 'pages/timeline', component: AppTimelineDemoComponent},
                    // {path: 'pages/help', component: AppHelpComponent},
                    // {path: 'pages/empty', component: EmptyDemoComponent},
                ]
            },
            // {path: 'error', component: AppErrorComponent},
            // {path: 'access', component: AppAccessdeniedComponent},
            // {path: 'notfound', component: AppNotfoundComponent},
            // {path: 'contactus', component: AppContactusComponent},
            // // {path: 'login', component: AppLoginComponent},
            // {path: 'landing', component: AppLandingComponent},
            // {path: 'pages/wizard', component: AppWizardComponent},
            {path: 'login', component: LoginComponent, canActivate: [AuthGuard]}, //, canActivate: [AuthGuard]
            {path: '**', redirectTo: ''},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
  private routes = [];
  private subs: SubMenu[];
  constructor(private router: Router, private usersubmenuservice: UserSubMenuService) {
    // this.submenuservice.getSubMenusByRoleId(1).then(subs => {
    //   this.subs = subs;
    //   // this.routes = subs.map(sub => {component:sub.uiComponent; path:sub.routerLink.substring(1,sub.routerLink.length)})

    // })
    this.usersubmenuservice.getUserSubMenusByRoleId(1).then(subs => {
      this.router.config.map(parent => {
        if(parent.children && parent.children.length>0){
          parent.children.map(r => {
            const filtered = subs.filter(sub => r.path === sub.subMenu.routerLink);
            if(filtered && filtered.length>0){
              r.data = {newAuth: filtered[0].newAuth, printAuth: filtered[0].printAuth, editAuth: filtered[0].editAuth, deleteAuth: filtered[0].deleteAuth}
            }else{
              r.data = {newAuth: false, printAuth: false, editAuth: false, deleteAuth: false}
            }
            return ;
          });
        }
        return parent;
      })
      this.router.resetConfig(this.router.config);
    });

  }
}
