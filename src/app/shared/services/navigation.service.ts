import { Injectable, EventEmitter } from '@angular/core'
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router'
import { Control } from 'fabric/fabric-impl'

@Injectable()
export class NavigationService {
  private history: string[] = []
  updateMenu = new EventEmitter<string>();
  pageUrl: string;
  constructor(private router: Router, private location: Location) { }

  public startSaveHistory():void{
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // console.log(event.urlAfterRedirects);
          // console.log(localStorage.getItem("userMenu"));
          this.pageUrl = event.urlAfterRedirects;
          this.updateMenu.emit(this.pageUrl);
          this.history.push(event.urlAfterRedirects)
        }
      })
  }

  public getHistory(): string[] {
    return this.history;
  }

  public goBack(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back()
    } else {
      this.router.navigateByUrl("/")
    }
  }

  public getPreviousUrl(): string {
    if (this.history.length > 0) {
        return this.history[this.history.length - 2];
    }

    return '';
  }
}