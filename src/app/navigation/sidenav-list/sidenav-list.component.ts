import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  authLoginSubscription = new Subscription();
  isAuth: boolean = false;
  @Output() closeSideNav = new EventEmitter();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
      this.authLoginSubscription = this.authService.authChange.subscribe(auth => {
          this.isAuth = auth;
      })
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
