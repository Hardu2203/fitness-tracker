import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Observable, Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromRoot from '../../app.reducer'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  authServiceSubscription: Subscription;
  isAuth$: Observable<boolean>;
  @Output() sidenavToggles = new EventEmitter();

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
      this.isAuth$ = this.store.select(fromRoot.getIsAuth)
  }

  onToggleSideNav() {
    this.sidenavToggles.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
