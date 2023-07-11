import { StatusConstants } from './../../model/statusconstatnts';
import { AuthService } from './../../../../auth/services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { ClaimService } from '../../service/claim.service';
import { Tenant } from 'src/app/xgarage/common/model/tenant';
import { Status } from 'src/app/xgarage/common/model/status';
import { TenantService } from 'src/app/xgarage/common/service/tenant.service';
import { StatusService } from 'src/app/xgarage/common/service/status.service';

@Component({
    selector: 'app-claim',
    templateUrl: './claim.component.html',
    styleUrls: ['../../../../demo/view/tabledemo.scss'],

    providers: [MessageService, ConfirmationService, DatePipe]
})
export class ClaimComponent extends GenericComponent implements OnInit {

    constructor(public route: ActivatedRoute, private router: Router, private authService: AuthService, private tenantService: TenantService, private claimService: ClaimService,
        public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService,) {
        super(route, datePipe, breadcrumbService);
    }

    selectedTenant: Tenant;
    tenants: Tenant[];
    selectedStatus: Status;
    statuses: Status[];
    active: boolean = true;
    today: string = new Date().toISOString().slice(0, 10);
    pageNo: number = 0;
    id = JSON.parse(this.authService.getStoredUser()).id;
    status: string[] = ["All"];
    selectedState = 'All';
    fillteredMaster: any = [];

    //get from backend permissions??
    user: number = JSON.parse(this.authService.getStoredUser()).roles[0].id;

    ngOnInit(): void {
        this.resetRouterLink();

        this.onGetClaimsByTenant(this.pageNo);
        this.getAllTenants();
        super.callInsideOnInit();

        if (localStorage.getItem('claimId')) {
            localStorage.removeItem('claimId');
        }

        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }]);
    }

    getAllTenants() {
        this.tenantService.getAll().subscribe({
            next: (data) => {
                this.tenants = data;
            },
            error: (e) => alert(e)
        })
    }

    onGetClaimsByTenant(page?: number) {
        this.claimService.getClaimsByTenant(page).subscribe(res => {
            //console.log(res, page)
            this.masterDtos = res.reverse();

            if(!this.viewAuth) {
                this.fillteredMaster = this.masterDtos;
            } else {
                this.masterDtos = this.masterDtos.filter(dto => {
                    return dto.status !== 'Open' && dto.status !== 'Waiting for Approval' && dto.status !== 'Waiting for Survey' && dto.status !== 'Canceled';
                });

                this.fillteredMaster = this.masterDtos;
            }

            this.setStatusNames(this.masterDtos);
            this.loading = false;
        }, err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message, life: 3000 }))

    }

    edit(claimDto: any) {
        this.claimService.getById(claimDto.id).subscribe(
            {
                next: (data) => {
                    this.master = data;
                    this.selectedTenant = this.tenants.find(val => val.id == this.master.tenant);
                    this.master.claimDate = this.datePipe.transform(this.master.claimDate, 'yyyy-MM-dd');
                    this.editMaster(this.master);
                    this.active = false;
                },
                error: (e) => alert(e)
            }
        )
    }

    new(): void {
        //check id the role is user or an insurnce here
        this.openNew();
        var currentDate = new Date();
        this.master.claimDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
        this.master.status = { id: StatusConstants.OPEN_STATUS };
        let user = this.authService.getStoredUser();
        this.selectedTenant = JSON.parse(user).tenant;
        this.active = false;
    }

    save() {
        this.submitted = true;
        if (this.master.claimNo && this.master.claimDate && this.selectedTenant) {
            this.master.tenant = this.selectedTenant.id;
            if (this.master.id) {
                this.claimService.update(this.master).subscribe({
                    next: (data) => {
                        this.master = data;
                        this.onGetClaimsByTenant();
                        this.messageService.add({
                            severity: 'success', summary: 'Successful',
                            detail: 'Claim Updated'
                        });
                    },
                    error: (e) => {
                        this.messageService.add({
                            severity: 'error', summary: 'Error',
                            detail: e.error.message
                        })
                    }
                });
            } else {
                this.claimService.add(this.master).subscribe({
                    next: (data) => {
                        this.master = data;
                        this.onGetClaimsByTenant();
                        this.messageService.add({
                            severity: 'success', summary: 'Successful',
                            detail: 'Claim created successfully'
                        });
                    },
                    error: (e) => {
                        this.messageService.add({
                            severity: 'error', summary: 'Error',
                            detail: e.error.message
                        })
                    }
                });
            }
            this.masterDialog = false;
            this.master = {};
        }
    }

    confirmDelete() {
        let cancelStatus: Status = {
            id: StatusConstants.CANCELED_STATUS
        }
        this.claimService.changeStatus(this.master.id, cancelStatus).subscribe(res => {
            console.log(res)
            if (res) {
                this.messageService.add({ severity: 'success', summary: 'Claim cancelled successfully' });
                this.onGetClaimsByTenant();
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Could Not Cancel Claim', life: 3000 });
            }

            this.deleteSingleDialog = false;
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err.error.message, life: 3000 });
            this.deleteSingleDialog = false;
        })
    }

    goToClaimDetails(id: number) {
        localStorage.setItem('claimId', JSON.stringify(id));
        this.updateRouterLink();
        this.router.navigate(['claim-details']);
    }

    loadClaims(e) {
        if (this.masterDtos.length == 100) {
            if ((this.masterDtos.length - e.first) <= 10) {
                this.pageNo++;
                this.onGetClaimsByTenant(this.pageNo);
            }
        }
    }

    filterByStatus(state: any) {
        this.selectedState = state;
        if (state == 'All') {
            this.fillteredMaster = this.masterDtos;
        } else {
            this.fillteredMaster = this.masterDtos.filter(master => master.status == state);
        }
    }

    setStatusNames(arr) {
        let names = [];

        arr.forEach(element => {
            names.push(element.status);
        });

        if (names.length > 0) {
            names.forEach((name, index) => {
                if (!this.status.includes(name)) {
                    this.status.push(name);
                }
            });
        }
    }

    updateRouterLink() {
        let subs = JSON.parse(localStorage.getItem('subs'));

        let page = subs.find(sub => {
            return sub.subMenu.routerLink == 'claims';
        });

        if(page) {
            console.log('updating router>')
            page.subMenu.routerLink = 'claim-details';
        }

        localStorage.setItem('subs', JSON.stringify(subs));
    }

    resetRouterLink() {
        console.log('resetting router>')
        let subs = JSON.parse(localStorage.getItem('subs'));

        let page = subs.find(sub => {
            return sub.subMenu.routerLink == 'claim-details';
        });

        if(page) {
            page.subMenu.routerLink = 'claims';
        }

        localStorage.setItem('subs', JSON.stringify(subs));
    }

}
