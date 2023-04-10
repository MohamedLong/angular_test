import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
    selector: 'app-changepassword',
    templateUrl: './changepassword.component.html',
    providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {

    constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService) { }

    resetPasswordForm: FormGroup = this.fb.group({
        password: ['', Validators.required],
        newPass: ['', Validators.required],
    });

    resetPasswordFormData: any = new FormData();

    ngOnInit(): void {
    }

    onSubmit() {
        //console.log(this.resetPasswordForm.value)
        this.resetPasswordFormData.append('password', this.resetPasswordForm.get('password').value);
        this.resetPasswordFormData.append('newPass', this.resetPasswordForm.get('newPass').value);

        // console.log(this.resetPasswordFormData)
        this.authService.changePassword(this.resetPasswordFormData).subscribe(res => {
            // console.log(res)
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'your password was reset successfully' });
            this.resetPasswordForm.reset('');
        }, err => {
            console.log(err)
            if (err.status == 200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'your password was reset successfully' });
            } else {
                this.messageService.add({ severity: 'error', summary: 'Erorr', detail: 'Failed to change password' });
            }

        })
    }
}
