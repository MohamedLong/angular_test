import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';

@Component({
    selector: 'app-claim-details',
    templateUrl: './claim-details.component.html',
})
export class ClaimDetailsComponent implements OnInit {

    constructor(private breadcrumbService: AppBreadcrumbService, private formBuilder: FormBuilder) { }
    parts: any[] = [
        { id: 1, name: 'Dr Bumper+Sendor++Rein+Assy' },
        { id: 2, name: 'Dr Bumper+Sendor++Rein+Assy' },
        { id: 3, name: 'Dr Bumper+Sendor++Rein+Assy' },
        { id: 4, name: 'Dr Bumper+Sendor++Rein+Assy' },
        { id: 5, name: 'Dr Bumper+Sendor++Rein+Assy' },
        { id: 6, name: 'Dr Bumper+Sendor++Rein+Assy' },
        { id: 7, name: 'Dr Bumper+Sendor++Rein+Assy' }
    ];
    selectedParts = [];
    actions: string[] = ['No Action', 'Replace', 'Repair'];
    updateJobForm: FormGroup = this.formBuilder.group({
        inspectionBy: [''],
        surveyedBy: [''],
        repaierCost: [''],
        garde: [''],
        bidClosingDate: [''],
        assignType: [''],
        privacy: [''],
        note: [''],
    });

    ngOnInit(): void {
        this.breadcrumbService.setItems([{ 'label': 'Claims', routerLink: ['claims'] }, { 'label': 'Claim Details', routerLink: ['claim-details'] }]);
        let claim = JSON.parse(localStorage.getItem('claim'));
        // console.log(claim)
    }

    onAction(event, part) {
        //console.log(event, part);
        if (event !== 'No Action') {
            part.partTypes = event;
            var partIndex = this.selectedParts.indexOf(part);

            if (partIndex !== -1) {
                this.selectedParts[partIndex] = part;
            } else {
                this.selectedParts.push(part)
            }

        } else {
            if (this.selectedParts.includes(part)) {
                this.selectedParts = this.selectedParts.filter(selectedPart => {
                    return selectedPart.id !== part.id
                })
            }
        }

        // console.log(this.selectedParts)
    }

    sendRequest() {
        //update job with new values
        console.log(this.updateJobForm.value)

        //send request list
    }

}
