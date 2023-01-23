import { StatusConstants } from './../../model/statusconstatnts';
import { AuthService } from './../../../../auth/services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { ClaimService } from '../../service/claimservice';
import { Tenant } from 'src/app/xgarage/common/model/tenant';
import { Status } from 'src/app/xgarage/common/model/status';
import { StatusService } from 'src/app/xgarage/common/service/status.service';
import { TenantService } from 'src/app/xgarage/common/service/tenant.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html', 
  styleUrls: ['../../../../demo/view/tabledemo.scss'],

  providers: [MessageService, ConfirmationService, DatePipe]
})
export class ClaimComponent extends GenericComponent implements OnInit {

  constructor(public route: ActivatedRoute, private authService: AuthService, private tenantService: TenantService, 
    private statusService:StatusService, private router: Router, private claimService: ClaimService,
    public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
    super(route, datePipe, breadcrumbService);
}

selectedTenant: Tenant;
tenants: Tenant[];
selectedStatus: Status;
statuses: Status[];
valid: boolean = false;

  ngOnInit(): void {
    this.getAll();
    this.getAllTenants();
    super.callInsideOnInit();
  }

  getAllTenants() {
    this.tenantService.getAll().subscribe({
      next: (data) => {
        this.tenants = data;
      },
      error: (e) => alert(e)
    })
  }

  getAll() {
    let user = this.authService.getStoredUser();
    if(JSON.parse(user).tenant !== null){
      let tenant = JSON.parse(user).tenant.id;
      this.claimService.getByTenant(tenant).subscribe({
        next: (masters) => {
          this.masterDtos = masters;
          this.loading = false;
          // this.masterDtos = this.masterDtos.map(val => val.cancellable = (val.status == StatusConstants.OPEN_STATUS)); 
        },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
      }); 
    }
    else{
      this.claimService.getAll().subscribe({
        next: (masters) => {
          this.masterDtos = masters;
          this.loading = false;
          this.masterDtos.forEach(val => val.cancellable = (val.status != null && val.status == StatusConstants.OPEN_STATUS)); 
        },
        error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
      }); 
    }
 }

 edit(claimDto: any){
  this.claimService.getById(claimDto.id).subscribe(
    {
      next: (data) => {
          this.master = data;
          this.selectedTenant = this.tenants.find(val => val.id == this.master.tenant);
          this.master.claimDate = this.datePipe.transform(this.master.claimDate, 'yyyy-MM-dd');
          this.editMaster(this.master);
      },
      error: (e) => alert(e)
    }
  )
 }

 new(): void {
  this.openNew();
  var currentDate = new Date();
  this.master.claimDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  this.master.status = StatusConstants.OPEN_STATUS;
  }

  save() {
    this.submitted = true;
    if (this.master.claimNo && this.master.claimDate && this.selectedTenant) {
      this.master.tenant = this.selectedTenant.id;
        if (this.master.id) {
            this.claimService.update(this.master).subscribe({
                next: (data) => {
                    console.log(data)
                        this.master = data;
                        this.getAll();
                        this.messageService.add({ severity: 'success', summary: 'Successful', 
                        detail: 'Claim Updated'});
                },
                error: (e) => alert(e)
            });
        } else {
            this.claimService.add(this.master).subscribe({
              next: (data) => {
                this.master = data;
                this.getAll();
                this.messageService.add({ severity: 'success', summary: 'Successful', 
                detail: 'Claim created successfully' });
              },
              error: (e) => alert(e)
            });
          }
      this.masterDialog = false;
      this.master = {};
    }
}

confirmDelete() {
    this.claimService.cancel(this.master.id).subscribe(res => {
      if(res.messageCode == 200){
        this.messageService.add({ severity: 'success', summary: 'Claim cancelled successfully' });
        this.deleteSingleDialog = false;
        this.getAll();
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Could Not Cancel Claim', life: 3000 });     
      }
    }, err => {
        this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err.Message, life: 3000 });
    })
}

}
