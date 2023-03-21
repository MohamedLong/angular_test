import {Router, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
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
import { NewJobComponent } from './xgarage/core/component/job/newjob/newjob.component';
import { CarComponent } from './xgarage/core/component/car/car.component';
import { NewCarComponent } from './xgarage/core/component/car/new-car/new-car.component';
import { PartComponent } from './xgarage/core/component/part/part.component';
import { NewPartComponent } from './xgarage/core/component/part/new-part/new-part.component';
import { JobDetailsComponent } from './xgarage/core/component/job/jobdetails.component';
import { NewRequestComponent } from './xgarage/core/component/request/new-request/new-request.component';
import { RequestDetailsComponent } from './xgarage/core/component/request/requestdetails.component';
import { BrandComponent } from './xgarage/common/component/brand/brand.component';
import { CategoryComponent } from './xgarage/common/component/category/category.component';
import { SubCategoryComponent } from './xgarage/common/component/sub-category/sub-category.component';
import { CarModelComponent } from './xgarage/common/component/car-model/car-model.component';
import { BidDetailsComponent } from './xgarage/core/component/bid/bid-details/bid-details.component';
import { SupplierDashbaordComponent } from './xgarage/dashboard/component/supplier-dashbaord/supplier-dashbaord.component';
import { SupplierprofileComponent } from './xgarage/common/component/supplierprofile/supplierprofile.component';
import { OrderComponent } from './xgarage/core/component/order/order.component';
import { OrderDetailsComponent } from './xgarage/core/component/order/orderdetails.component';

const routes: Routes = [];

@NgModule({
    imports: [
        RouterModule.forRoot([
    {
        path: '', component: AppMainComponent,
        children: [
            { path: '', component: SupplierDashbaordComponent, canActivate: [RandomGuard] },
            { path: 'mainmenu', component: UserMainMenuComponent },
            { path: 'submenu', component: UserSubMenuComponent },
            { path: 'change-password', component: ResetPasswordComponent },
            { path: 'suppliers', component: SuppliersComponent },
            { path: 'users', component: UsersComponent },
            { path: 'roles', component: RolesComponent },
            { path: 'permission', component: PermissionsComponent },
            { path: 'tenanttype', component: TenantTypeComponent },
            { path: 'tenant', component: TenantComponent },
            { path: 'claims', component: ClaimComponent },
            { path: 'brands', component: BrandComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'subcategory', component: SubCategoryComponent },
            { path: 'carmodel', component: CarModelComponent },
            { path: 'jobs', component: JobComponent },
            { path: 'jobs/new-job', component: NewJobComponent },
            { path: 'requests', component: RequestComponent },
            { path: 'request-details', component: RequestDetailsComponent },
            { path: 'requests/new-request', component: NewRequestComponent },
            { path: 'cars', component: CarComponent },
            { path: 'cars/new-car', component: NewCarComponent },
            { path: 'parts', component: PartComponent },
            { path: 'parts/new-part', component: NewPartComponent },
            { path: 'job-details', component: JobDetailsComponent, canActivate: [AuthGuard] },
            { path: 'bids', component: BidDetailsComponent },
            { path: 'supplier-profile', component: SupplierprofileComponent },
            { path: 'permission', component: PermissionsComponent },
            { path: 'user-main-menu', component: UserMainMenuComponent },
            { path: 'user-sub-menu', component: UserSubMenuComponent },
            { path: 'orders', component: OrderComponent },
            { path: 'order-details', component: OrderDetailsComponent, canActivate: [AuthGuard] },
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: '**', redirectTo: '' },
], { scrollPositionRestoration: 'enabled', initialNavigation: 'enabledBlocking' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router, private authService: AuthService) {
    if(this.authService.isLoggedIn()) {
        this.authService.getAuthorizedMenu();
    }
  }
}
