import { Component, Input, OnInit } from '@angular/core';
import { MasterDataModel } from '../../admin/models/master-data.model';
import { DocumentTypeService } from '../services/doc-type.service';
import { RoleService } from '../services/role-management.service';
import { BannerViewModel } from './models/banner-view.model';

@Component({
  selector: 'jd-banner-master',
  templateUrl: './banner-master.component.html',
  styleUrls: ['./banner-master.component.scss']
})
export class BannerMasterComponent implements OnInit {
  showUploadModal = false;
  closeComp = false;
  @Input() model: BannerViewModel;
  selectedModel: BannerViewModel;
  documents: MasterDataModel[];
  permissionCheck:any;
  constructor(
    private docService: DocumentTypeService,
    private roleService: RoleService
  ) { }

  async ngOnInit(): Promise<void> {
    this.documents = await this.docService.getDocCategory();
    this.permissionCheck = await this.roleService.permissionCheck();
  }

  showUpload(selectedCard:any){ 
    this.selectedModel = selectedCard;
    this.showUploadModal = true;
  }
  onCloseUploadModal(e:any){
    this.showUploadModal = false;
  }
  showBannerPreview(e:any){
    this.closeComp = true;
  }
}
