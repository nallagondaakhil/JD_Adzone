import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EndUserService } from '../../../services/end-user.service';

@Component({
  selector: 'jd-pdf-full-view',
  templateUrl: './pdf-full-view.component.html',
  styleUrls: ['./pdf-full-view.component.scss']
})
export class PdfFullViewComponent implements OnInit {
  @Input() documentId;
  @Input() documentFileId;
  loading = false;
  pdfSrc = '';
  constructor(private service: EndUserService, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.documentId = this.route.snapshot.paramMap.get('documentId');
    this.documentFileId = this.route.snapshot.paramMap.get('documentFileId');

  }
  async ngAfterViewInit() {
    this.loading = true;
    const res: any = await this.service.getPdfBase64(this.documentId, this.documentFileId);
    if (res.data.content[0].base64)
      this.pdfSrc = this.service.printPdf(res.data.content[0].base64)
    console.log(this.pdfSrc);
    this.loading = false;
    document.getElementById('test').setAttribute("src", this.pdfSrc);
  }


}
