import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authServiceSubscription: Subscription;
  isAuth: boolean;
  @Output() sidenavToggles = new EventEmitter();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
      this.authServiceSubscription = this.authService.authChange.subscribe(authStatus => {
          this.isAuth = authStatus;
      })
  }

  onToggleSideNav() {
    this.sidenavToggles.emit();
  }

  ngOnDestroy(): void {
    this.authServiceSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
