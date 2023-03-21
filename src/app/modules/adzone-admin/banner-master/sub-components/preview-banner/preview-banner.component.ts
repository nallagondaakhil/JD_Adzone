import { Component, Input, OnInit } from '@angular/core';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { BannerService } from '../../../services/banner.service';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { BannerModelMapper } from '../../models/banner-view.model';

@Component({
  selector: 'jd-preview-banner',
  templateUrl: './preview-banner.component.html',
  styleUrls: ['./preview-banner.component.scss']
})
export class PreviewBannerComponent implements OnInit {
  @Input() category_Id: any;

  constructor(private alertService: AlertsService,
    private service: BannerService,) { }

  uploadedBanners = true;
  showBannerPage = false;
  loading = false;
  bannerList: any;
  bannersData: any;
  listImageSelect: any;
  showFlag: boolean = false;
  listModel: any

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.bannerList = await this.service.getBannerImages(null, this.category_Id)
    this.bannersData = this.bannerList.data;
    if (this.bannerList && this.bannerList.data) {
      this.listModel = await Promise.all(this.bannersData.map((x: any) => BannerModelMapper.mapToViewModel(x, null)));
      console.log(this.listModel)
      this.loading = false;
    }
    else if (this.bannerList.data == null) {
      this.loading = false;
    }
  }

  showLightbox(data: any) {
    this.listImageSelect = [this.listModel.find(x => x.bannerId == data.bannerId)];
    console.log(this.listImageSelect)
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
  }

  submitImgs() {
    this.uploadedBanners = false;
    this.showBannerPage = true;
  }

}