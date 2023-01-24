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
import { Claim } from '../../model/claim';
import { JobDto } from '../../dto/jobdto';

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

jobs: JobDto[];
job: JobDto;
selectedStatus: Status;
statuses: Status[];
valid: boolean = false;

  ngOnInit(): void {
    super.callInsideOnInit();
    this.getAllForUser();

  }

  getAllForUser() {
    let user = this.authService.getStoredUser();
    if(JSON.parse(user).tenant !== null){
      this.jobService.getForUser().subscribe({
      next: (masters) => {
          this.masterDtos = masters;
          this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
  });
    }else{
      console.log();
      this.jobService.getAll().subscribe({
        next: (masters) => {
          this.masters = masters;
          this.loading = false;
      },
      error: (e) => this.messageService.add({ severity: 'error', summary: 'Server Error', detail: e.error, life: 3000 })
  });
    }
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
  this.jobService.delete(this.master.id).subscribe(res => {
    if(res.messageCode == 200){
      this.messageService.add({ severity: 'success', summary: 'Job cancelled successfully' });
      this.deleteSingleDialog = false;
      this.getAllForUser();
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Could Not Cancel Job', life: 3000 });     
    }
  }, err => {
      this.messageService.add({ severity: 'error', summary: 'Erorr', detail: err.Message, life: 3000 });
  })
}


getStatusName(statusId: number) {
  switch (statusId) {
    case StatusConstants.OPEN_STATUS:
      return 'Open';
    case StatusConstants.INPROGRESS_STATUS:
      return 'In Progress';
    case StatusConstants.ONHOLD_STATUS:
      return 'On Hold';
    case StatusConstants.COMPLETED_STATUS:
      return 'Completed';
    case StatusConstants.REJECTED_STATUS:
      return 'Rejected';
    case StatusConstants.APPROVED_STATUS:
      return 'Approved';
    case StatusConstants.CANCELED_STATUS:
      return 'Canceled';
    case StatusConstants.REVISION_STATUS:
      return 'Revision';
    case StatusConstants.LOST_STATUS:
      return 'Lost';
    case StatusConstants.REVISED_STATUS:
      return 'Revised';
    default:
      return 'Unknown';
  }
}


}
