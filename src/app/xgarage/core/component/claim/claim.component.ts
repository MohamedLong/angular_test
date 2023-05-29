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

    constructor(public route: ActivatedRoute, private router: Router, private authService: AuthService, private tenantService: TenantService,
        private claimService: ClaimService,
        public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService,
        private statusService: StatusService) {
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
    status: string[] = ["All", "Open", "Waiting for Survey", "Confirmed"];
    selectedState = 'All';
    fillteredMaster: any = [];

    //get from backend permissions??
    user: string = 'insurance';

    ngOnInit(): void {
        this.onGetClaimsByTenant(this.pageNo);
        this.getAllTenants();
        super.callInsideOnInit();

        if (localStorage.getItem('claimId')) {
            localStorage.removeItem('claimId');
        }

        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }]);

        this.getAllStatuses();
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
        // let user = this.authService.getStoredUser();
        // if (JSON.parse(user).tenant !== null) {
        //     let tenant = JSON.parse(user).tenant.id;
        //     this.claimService.getByTenant(tenant).subscribe({
        //         next: (masters) => {
        //             this.masterDtos = masters;
        //             this.cols = [
        //                 { field: 'id', header: 'ID' },
        //                 { field: 'claimNo', header: 'Claim Number' },
        //                 { field: 'claimDate', header: 'Claim Date' },
        //                 { field: 'tenantName', header: 'Tenant Name' },
        //                 { field: 'createdUser', header: 'Created By' },
        //                 { field: 'statusDate', header: 'Status Date' },
        //                 { field: 'status', header: 'Status' }
        //             ];
        //             this.loading = false;
        //         },
        //         error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message, life: 3000 })
        //     });
        // }
        // else {
        //     this.claimService.getAll().subscribe({
        //         next: (masters) => {
        //             this.masterDtos = masters;
        //             this.loading = false;
        //             this.masterDtos.forEach(val => val.cancellable = (val.status != null && val.status == StatusConstants.OPEN_STATUS));
        //         },
        //         error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error.message, life: 3000 })
        //     });
        // }

        this.claimService.getClaimsByTenant(page).subscribe(res => {
            console.log(res, page)
            this.masterDtos = res.reverse();
            this.fillteredMaster = this.masterDtos;
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

    getAllStatuses() {
        this.statusService.getAll().subscribe(res => {
            this.statusService.statuses = res;
            // console.log(this.statusService.statuses)
        }, err => {
            console.log(err)
        })
    }

    filterByStatus(state: any) {
        console.log('state: ', state);
        this.selectedState = state;
        if (state == 'All') {
            this.fillteredMaster = this.masterDtos;
        } else {
            this.fillteredMaster = this.masterDtos.filter(master => master.status == state);
        }
    }

}
