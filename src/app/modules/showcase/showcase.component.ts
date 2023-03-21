import { BreadCrumbModel } from './../../shared/components/breadcrumbs/model/breadcrumb.model';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import {
  DataLoadParams,
  DataTableModel,
} from 'src/app/shared/components/data-table/models/data-table-model';
import { NavbarMenuItem } from 'src/app/shared/components/navbar-top/models/navbar-menu-item.model';
import { DropdownMenuItem } from 'src/app/shared/models/dropdown.model';
import {
  AlertsService,
  AlertType,
} from 'src/app/shared/services/alerts.service';
import {
  ModalDialogService,
  ModalType,
} from 'src/app/shared/services/modal-dialog.service';
import { MockDataService } from './mock-data.service';

@Component({
  selector: 'jd-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss'],
})
export class ShowcaseComponent implements OnInit {
  navMenuItems: NavbarMenuItem[];
  breadCrumbItem: BreadCrumbModel[];
  dropdownMenuItems: DropdownMenuItem[];
  selectlistSource: {}[];
  dtOptions: DataTableModel;

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  constructor(
    private router: Router,
    private modal: ModalDialogService,
    private alert: AlertsService,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    this.setNavMenuItems();
    this.setDropdownMenu();
    this.setSelectList();
    this.setupBreadCrumb();
  }
  setupBreadCrumb() {
    this.breadCrumbItem = [
      { title: 'File', link: '/poc/file' },
      { title: 'Notification', link: '/poc/notification' },
      { title: 'Showcase' },
    ];
    this.initDataTable();
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

  setDropdownMenu(): void {
    this.dropdownMenuItems = [
      { name: 'menu1', label: 'File Upload', link: '/poc/file-upload' },
      { name: 'menu1', label: 'Notification', link: '/poc/notification' },
    ];
  }

  setSelectList() {
    this.selectlistSource = [
      { country: 'India', value: 'IN' },
      { country: 'United States', value: 'US' },
    ];
  }

  openModal() {
    this.modal.show({
      title: 'Test',
      message:
        'The information provided herein is an estimate of Total Owning and Operating costs and is only to be used as a reference to assist in planning for potential equipment maintenance and repair costs. These estimates are not a predictor of future maintenance and repair costs or machine performance. John Deere makes no express or implied warranty including implied warranties of fitness for a particular purpose, or guarantees of any kind regarding the equipment maintenance and repair costs or component life you may experience. Machine costs are dependent upon many factors, including but not limited to: engine load factor, maintenance practices, operator training, operator proficiency, machine operation, machine configuration and application, timeliness of repairs, and oil sampling practices. Financial or tax numbers are estimates only and a tax advisor should be consulted for guidance.',
      modalType: ModalType.warning,
      okText: 'OK',
      cancelText: 'Cancel',
      showButtons: true,
      okCallback: (v) => console.log(v),
    });
  }

  showAlert() {
    this.alert.show('this is a description test', AlertType.Warning);
  }

  initDataTable() {
    this.dtOptions = {
      options: {
        processing: true,
        serverSide: true,
        columns: [
          {
            data: 'id',
            title: 'ID',
          },
          {
            data: 'first_name',
            title: 'First Name',
          },
          {
            data: 'last_name',
            title: 'Last Name',
          },
          {
            data: 'email',
            title: 'Email',
          },
          {
            title: 'Action',
            orderable: false,
            render: (data: any, type: any, full: any) => {
              return '<button class="btn btn-primary">View</button>';
            },
            className: 'text-center',
            onClick: (data: any, ev: any) => {
              console.log(data, ev, this);
            },
            clickableElementClas: 'btn-primary'
          },
        ],
        responsive: false,
      },
      onRawClick: (rawData: any) => {
        console.log(this);
        alert('clicked' + rawData.id);
      },
      loadData: (params: DataLoadParams, settings) => {
        return this.mockDataService
          .getAllData(params.page, params.size)
          .then((res) => {
            return {
              totalRecords: res.totalRecords,
              // recordsFiltered: res.totalRecords,
              data: res.data,
            };
          });
      },
    };
  }
}
