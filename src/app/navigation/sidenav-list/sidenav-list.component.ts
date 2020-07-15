import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Observable, Subscription} from "rxjs";
import * as fromRoot from '../../app.reducer'
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  authLoginSubscription = new Subscription();
  isAuth$: Observable<boolean>;
  @Output() closeSideNav = new EventEmitter();

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
      this.isAuth$ = this.store.select(fromRoot.getIsAuth)
  }

  onClose() {
      this.closeSideNav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  ngOnDestroy(): void {
      this.authLoginSubscription.unsubscribe();
  }

}
