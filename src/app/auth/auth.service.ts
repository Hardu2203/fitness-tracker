import {UserModel} from "./user.model";
import {AuthDataModel} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Route, Router} from "@angular/router";

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private user: UserModel;

    constructor(private router: Router) {
    }

    registerUser(authData: AuthDataModel){
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        };
        this.authSuccess()
    }

    login(authData: AuthDataModel) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        };
        this.authSuccess()
    }

    logout() {
        this.user = null;
        this.authChange.next(false);
        this.router.navigate(['/login'])
    }

    getUser() {
        return { ...this.user};
    }

    isAuth() {
        return this.user != null;
    }

    private authSuccess() {
        this.authChange.next(true);
        this.router.navigate(['/training'])
    }

}
