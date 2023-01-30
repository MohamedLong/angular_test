import {Router, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './demo/view/dashboard.component';
import {AppMainComponent} from './app.main.component';
import { LoginComponent } from './auth/containers/login/login.component';
import { RandomGuard } from './auth/guards/random.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { UserMainMenuComponent } from './xgarage/dashboard/component/user-main-menu/user-main-menu.component';
import { UserSubMenuComponent } from './xgarage/dashboard/component/user-sub-menu/user-sub-menu.component';
import { UsersComponent } from './xgarage/dashboard/component/users/users.component';
import { RolesComponent } from './xgarage/dashboard/component/roles/roles.component';
import { PermissionsComponent } from './xgarage/dashboard/component/persmissions/permissions.component';
import { TenantComponent } from './xgarage/common/component/tenant/tenantcomponent';
import { ResetPasswordComponent } from './xgarage/dashboard/component/changepassword/changepassword.component';
import { SignupComponent } from './auth/containers/signup/signup.component';
import { SuppliersComponent } from './xgarage/core/component/supplier/suppliers.component';
import { ClaimComponent } from './xgarage/core/component/claim/claim.component';
import { RequestComponent } from './xgarage/core/component/request/request.component';
import { JobComponent } from './xgarage/core/component/job/job.component';
import { AuthService } from './auth/services/auth.service';
import { TenantTypeComponent } from './xgarage/common/component/tenanttype/tenanttype.component';
//import { RequestComponent } from './xgarage/core/component/request/request.component';
//import { RequestComponent } from './xgarage/core/component/request/request.component';
import { NewJobComponent } from './xgarage/core/component/job/newjob/newjob.component';
import { CarComponent } from './xgarage/core/component/car/car.component';
import { NewCarComponent } from './xgarage/core/component/car/new-car/new-car.component';
import { PartComponent } from './xgarage/core/component/part/part.component';
import { NewPartComponent } from './xgarage/core/component/part/new-part/new-part.component';
import { JobDetailsComponent } from './xgarage/core/component/job/jobdetails.component';
import { NewRequestComponent } from './xgarage/core/component/request/new-request/new-request.component';

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
                    {path: 'change-password', component: ResetPasswordComponent},
                    {path: 'suppliers', component: SuppliersComponent},
                    {path: 'users', component: UsersComponent},
                    {path: 'roles', component: RolesComponent},
                    {path: 'permission', component: PermissionsComponent},
                    {path: 'tenanttype', component: TenantTypeComponent},
                    {path: 'tenant', component: TenantComponent},
                    {path: 'claims', component: ClaimComponent},
                    {path: 'jobs', component: JobComponent},
                    {path: 'jobs/new-job', component: NewJobComponent},
                    {path: 'request', component: RequestComponent},
                    {path: 'request/new-request', component: NewRequestComponent},
                    {path: 'cars', component: CarComponent},
                    {path: 'cars/new-car', component: NewCarComponent},
                    {path: 'parts', component: PartComponent},
                    {path: 'parts/new-part', component: NewPartComponent},
                    {path: 'job-details', component: JobDetailsComponent}
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
            {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
            {path: 'signup', component: SignupComponent},
            {path: '**', redirectTo: ''},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router, private authService: AuthService) {
    if(this.authService.isLoggedIn()) {
        this.authService.getAuthorizedMenu();
    }else{
        this.router.resetConfig(this.router.config);
    }
  }
}
