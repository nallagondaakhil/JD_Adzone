import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { TranslationService } from 'src/app/core/translate/translate.service';
import { NavbarMenuItem } from 'src/app/shared/components/navbar-top/models/navbar-menu-item.model';
import { DropdownMenuItem } from 'src/app/shared/models/dropdown.model';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../../services/notification.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
const publicKey = environment.notificationKey;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title = 'app1';
  deferredPrompt: any;
  showButton = false;
  navMenuItems: NavbarMenuItem[];

  constructor(private router: Router,
              private update: SwUpdate) {
  }

  ngOnInit(): void {
    this.setNavMenuItems();
    // navigator.serviceWorker.ready.then(x => {
    //   this.subscribeToNotification();
    // });

  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any): void {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }

  addToHomeScreen(): void {
    // hide our user interface that shows our A2HS button
    this.showButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
    });
  }

  setNavMenuItems(): void {
    this.navMenuItems = [
      {
        label: '',
        name: 'home',
        menuType: 'icon',
        onClick: (menu) => {
          this.router.navigate(['/poc/home']);
        },
        svgIcon:
          '<svg focusable="false" aria-hidden="true" class="nav-home-icon" fill="#aaa" height="24" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>',
      },
      {
        label: 'Notification',
        name: 'notification',
        menuType: 'link',
        onClick: (menu) => {
          this.router.navigate(['/poc/notification']);
        },
      },
      {
        label: 'File Upload',
        name: 'file-upload',
        menuType: 'dropdown',
        children: [
          {
            label: 'Single',
            name: 'single',
            menuType: 'link',
            onClick: (menu) => {
              this.router.navigate(['/poc/file-upload']);
            },
          },
          {
            label: 'Multiple',
            name: 'multiple',
            menuType: 'link',
            onClick: (menu) => {
              this.router.navigate(['/poc/file-upload']);
            },
          },
        ],
        onClick: (menu) => {},
      },
      {
        label: 'Component Showcase',
        name: 'showcase',
        menuType: 'link',
        onClick: (menu) => {
          this.router.navigate(['/showcase']);
        },
      },
    ];
  }

}
