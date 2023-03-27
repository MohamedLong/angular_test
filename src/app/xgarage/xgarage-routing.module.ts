import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RandomGuard } from '../auth/guards/random.guard';
import { BrandComponent } from './common/component/brand/brand.component';
import { CarModelComponent } from './common/component/car-model/car-model.component';
import { CategoryComponent } from './common/component/category/category.component';
import { SubCategoryComponent } from './common/component/sub-category/sub-category.component';
import { SupplierprofileComponent } from './common/component/supplierprofile/supplierprofile.component';
import { TenantComponent } from './common/component/tenant/tenantcomponent';
import { TenantTypeComponent } from './common/component/tenanttype/tenanttype.component';
import { BidDetailsComponent } from './core/component/bid/bid-details/bid-details.component';
import { CarComponent } from './core/component/car/car.component';
import { NewCarComponent } from './core/component/car/new-car/new-car.component';
import { ClaimComponent } from './core/component/claim/claim.component';
import { JobDetailsComponent } from './core/component/job/job-details/jobdetails.component';
import { JobComponent } from './core/component/job/job.component';
import { NewJobComponent } from './core/component/job/newjob/newjob.component';
import { OrderDetailsComponent } from './core/component/order/order-details/orderdetails.component';
import { OrderComponent } from './core/component/order/order.component';
import { NewPartComponent } from './core/component/part/new-part/new-part.component';
import { PartComponent } from './core/component/part/part.component';
import { NewRequestComponent } from './core/component/request/new-request/new-request.component';
import { RequestDetailsComponent } from './core/component/request/request-details/requestdetails.component';
import { RequestComponent } from './core/component/request/request.component';
import { SuppliersComponent } from './core/component/supplier/suppliers.component';
import { ResetPasswordComponent } from './dashboard/component/changepassword/changepassword.component';
import { PermissionsComponent } from './dashboard/component/persmissions/permissions.component';
import { RolesComponent } from './dashboard/component/roles/roles.component';
import { SupplierDashbaordComponent } from './dashboard/component/supplier-dashbaord/supplier-dashbaord.component';
import { UserMainMenuComponent } from './dashboard/component/user-main-menu/user-main-menu.component';
import { UserSubMenuComponent } from './dashboard/component/user-sub-menu/user-sub-menu.component';
import { UsersComponent } from './dashboard/component/users/users.component';
import { XgarageComponent } from './xgarage.component';

const routes: Routes = [
    {
        path: '',
        component: XgarageComponent,
        canActivate: [RandomGuard],
        children: [
            { path: '', component: SupplierDashbaordComponent },
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

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class XgarageRoutingModule { }
