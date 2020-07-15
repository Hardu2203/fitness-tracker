import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UIService} from "../../shared/ui.service";
import {Observable, Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromRoot from "../../app.reducer"
import {map} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;
  private loadingSubs = new Subscription();

  constructor(private authService: AuthService, private uiService: UIService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
      this.isLoading$ = this.store.select(fromRoot.getIsLoading);
      // this.loadingSubs = this.uiService.loadingStateChanged.subscribe( state => this.isLoading = state )
      this.loginForm = new FormGroup({
        email: new FormControl('', {
            validators: [Validators.required, Validators.email]
        }),
        password: new FormControl('', {
            validators: [Validators.required]
        })
      })
  }

  onSubmit() {
      this.authService.login({
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
      });
  }

  // ngOnDestroy() {
  //     this.loadingSubs.unsubscribe();
  // }

}
