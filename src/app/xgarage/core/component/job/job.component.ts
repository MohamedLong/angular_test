import { StatusConstants } from '../../model/statusconstatnts';
import { AuthService } from '../../../../auth/services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { GenericComponent } from 'src/app/xgarage/common/generic/genericcomponent';
import { ClaimService } from '../../service/claimservice';
import { Status } from 'src/app/xgarage/common/model/status';
import { StatusService } from 'src/app/xgarage/common/service/status.service';
import { JobService } from '../../service/job.service';
import { Job } from '../../model/job';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['../../../../demo/view/tabledemo.scss'],

  providers: [MessageService, ConfirmationService, DatePipe]
})
export class JobComponent extends GenericComponent implements OnInit {

  constructor(public route: ActivatedRoute, private authService: AuthService, private claimService: ClaimService,
    private statusService: StatusService, private router: Router, private jobService: JobService,
    public messageService: MessageService, public datePipe: DatePipe, breadcrumbService: AppBreadcrumbService) {
    super(route, datePipe, breadcrumbService);
}

jobs: Job[];
selectedStatus: Status;
statuses: Status[];

valid: boolean = false;

  ngOnInit(): void {
    super.callInsideOnInit();
    this.getAllForUser();
  }



  getAllForUser() {
    let user = this.authService.getStoredUser();
    if(JSON.parse(user).tenant.id !== null){
      this.jobService.getForUser().subscribe({
      next: (masters) => {
          this.masterDtos = masters;
          this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
  });
    }else{
      this.jobService.getAll().subscribe({
        next: (masters) => {
          this.masterDtos = masters;
          this.loading = false;
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
    if (this.master.claimNo && this.master.claimDate) {
        if (this.master.id) {
            this.claimService.update(this.master).subscribe(
                {
                    next: (data) => {
                        console.log(data)
                        this.master = data;
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Claim Updated'});
                    },
                    error: (e) => alert(e)
                }
            );
        } else {

            this.claimService.add(this.master).subscribe(
                {
                    next: (data) => {
                        this.master = data;
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Claim created successfully' });
                    },
                    error: (e) => alert(e)
                }
            );
        }
        this.masterDialog = false;
        this.master = {};

    }
}


confirmDelete() {
    this.claimService.delete(this.master.id).subscribe(res => {
        console.log(res)

        this.messageService.add({ severity: 'success', summary: 'Job deleted successfully' });
        this.deleteSingleDialog = false;
    }, err => {
        this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err, life: 3000 });
    })
}

}
