import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from '../auth/guards/auth.guard';
// import { RandomGuard } from '../auth/guards/random.guard';
import { LoginComponent } from '../auth/containers/login/login.component';
import { SignupComponent } from '../auth/containers/signup/signup.component';

const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
