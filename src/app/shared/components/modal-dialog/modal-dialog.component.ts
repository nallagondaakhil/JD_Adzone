import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Modal, ModalType } from '../../services/modal-dialog.service';

@Component({
  selector: 'jd-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
})
export class ModalDialogComponent implements OnInit {
  @Input() params: Modal;
  @Input() customTemplate: TemplateRef<any>;
  @Output() closed: EventEmitter<Modal> = new EventEmitter<Modal>();
  @ViewChild('warning', { static: true }) warning: TemplateRef<any>;
  @ViewChild('inputModal', { static: true }) inputModal: TemplateRef<any>;
  @ViewChild('informativeModal', { static: true })
  informativeModal: TemplateRef<any>;
  modalType: TemplateRef<any>;
  modalTypes = ModalType;
  textAreaText: string;

  constructor() {}

  ngOnInit(): void {
    this.updateModal();
  }

  updateModal() {
    switch (this.params.modalType) {
      case ModalType.warning:
      case ModalType.confirmation:
        this.modalType = this.warning;
        break;
      case ModalType.input:
        this.modalType = this.inputModal;
        break;
      case ModalType.informative:
        this.modalType = this.informativeModal;
        this.params.showButtons = false;
        break;
    }
  }

  closeModal() {
    
    if (this.params.closeCallback) {
      // this.params = null;
    this.closed.next(this.params);
      this.params.closeCallback();
    }
    else{
      this.params = null;
    this.closed.next(this.params);
    }
  }

  ok() {
    if (this.params.okCallback) {
      this.textAreaText
        ? this.params.okCallback(this.textAreaText)
        : this.params.okCallback();
    } else this.closeModal();
  }

  cancel() {
    if (this.params.cancelCallback) {
      this.params.cancelCallback();
    } else this.closeModal();
  }
}
