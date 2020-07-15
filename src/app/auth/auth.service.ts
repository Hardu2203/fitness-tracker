import {AuthDataModel} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "angularfire2/auth"
import {TrainingService} from "../training/training.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UIService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {

    constructor(private router: Router,
                private afauth: AngularFireAuth,
                private trainingService: TrainingService,
                private snackBar: MatSnackBar,
                private uiService: UIService,
                private store: Store<fromRoot.State>) {
    }

    initAuthListener() {
        this.afauth.authState.subscribe(user => {
            if (user) {
                this.authSuccess()
            } else {
                this.trainingService.cancelSubscriptions();
                this.store.dispatch(new Auth.SetUnauthenticated())
                this.router.navigate(['/login'])
            }
        })
    }

    registerUser(authData: AuthDataModel) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.afauth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
            })
            .catch(error => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackbar(error.message, null, 3000)
            });
    }

    login(authData: AuthDataModel) {
        this.store.dispatch(new UI.StartLoading());
        this.afauth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.store.dispatch(new UI.StopLoading());
            })
            .catch(error => {
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackbar(error.message, null, 3000)
            });
    }

    logout() {
        this.afauth.auth.signOut();
    }

    private authSuccess() {
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
    }
}
