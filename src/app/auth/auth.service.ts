import {AuthDataModel} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "angularfire2/auth"
import {TrainingService} from "../training/training.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UIService} from "../shared/ui.service";

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuth = false;

    constructor(private router: Router,
                private afauth: AngularFireAuth,
                private trainingService: TrainingService,
                private snackBar: MatSnackBar,
                private uiService: UIService) {
    }

    initAuthListener() {
        this.afauth.authState.subscribe(user => {
            if (user) {
                this.authSuccess()
            } else {
                this.trainingService.cancelSubscriptions();
                this.isAuth = false;
                this.authChange.next(false);
                this.router.navigate(['/login'])
            }
        })
    }

    registerUser(authData: AuthDataModel) {
        this.uiService.loadingStateChanged.next(true);
        this.afauth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar(error.message, null, 3000)
            });
    }

    login(authData: AuthDataModel) {
        this.uiService.loadingStateChanged.next(true);
        this.afauth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar(error.message, null, 3000)
            });
    }

    logout() {
        this.afauth.auth.signOut();
    }

    checkAuth() {
        return this.isAuth
    }

    private authSuccess() {
        this.isAuth = true;
        this.authChange.next(true);
        this.router.navigate(['/training'])
    }

}
