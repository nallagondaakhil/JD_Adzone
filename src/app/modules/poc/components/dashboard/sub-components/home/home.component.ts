import { Component, HostBinding, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/core/translate/translate.service';
import { AppService } from 'src/app/modules/poc/services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  result: any[] = [];
  apiUrl = 'https://jdapi-dev.heptagon.tech/files';
  preferredLang: string;

  @HostBinding('class') class = 'w-100';

  constructor(private service: AppService, private translateService: TranslationService) { }

  ngOnInit(): void {
    this.preferredLang = this.translateService.currentLang;
  }

  async callAPI() {
    // this.result = JSON.stringify(await this.service.getData());
    this.result = await this.service.getData();
  }

  testCall() {
    this.service.testCall(this.apiUrl).then(() => {
      alert('Success..');
    }).catch(er => alert('Failed...' + JSON.stringify(er)));
  }

  onLanguageChange(lang: string) {
    this.preferredLang = lang;
    this.translateService.use(lang);
    document.location.reload();
  }
}
