import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../../service/user.service';

@Component({
    selector: 'app-changepassword',
    templateUrl: './changepassword.component.html',
    providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {

    constructor(private fb: FormBuilder, private userService : UserService, private messageService: MessageService) { }

    resetPasswordForm: FormGroup = this.fb.group({
        oldPass: ['', Validators.required],
        newPass: ['', Validators.required],
    });

    ngOnInit(): void {
    }

    onSubmit() {
        console.log('oldPass: ', this.resetPasswordForm.controls.oldPass.value);
        console.log('newPass: ', this.resetPasswordForm.controls.newPass.value);
        let resetPasswordFormData =  {
            oldPass: this.resetPasswordForm.controls.oldPass.value,
            newPass: this.resetPasswordForm.controls.newPass.value
        }
        
        console.log(resetPasswordFormData);
        this.userService.changePassword(resetPasswordFormData).subscribe(res => {
            if(res.messageCode == 200) {
            // console.log(res)
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Your password was reset successfully' });
                this.resetPasswordForm.reset('');
            }else{
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Failed to change password' });
            }
        }, err => {
            this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Failed to change password' });
        })
    }
}
