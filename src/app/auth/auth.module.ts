import {NgModule} from "@angular/core";
import {SignupComponent} from "./signup/signup.component";
import {LoginComponent} from "./login/login.component";
import {ReactiveFormsModule} from "@angular/forms";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AuthRoutingModule} from "./auth-routing.module";
import {SharedModule} from "../shared/shared.module";


@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent,
    ],
    imports: [
        ReactiveFormsModule,
        AngularFireAuthModule,
        AuthRoutingModule,
        SharedModule
    ],
    exports: []
})
export class AuthModule{}
