import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class ModalDialogService {
  publisher: Subject<Modal> = new Subject<Modal>();
  show(args: Modal) {
    args.modalType = args.modalType || ModalType.warning;
    args.showButtons = args.showButtons || true;
    this.publisher.next(args);
  }
}

export interface Modal {
  title: string;
  message?: string;
  okCallback?: (v?: any) => void;
  cancelCallback?: () => void;
  closeCallback?: () => void;
  showButtons?: boolean;
  okText?: string;
  cancelText?: string;
  modalType?: ModalType;
  largeModal?: boolean;
  isSecondModal?: boolean;
  msgRed?:boolean,
  btnCenter?:boolean,
}

export enum ModalType {
  warning,
  input,
  informative,
  confirmation,
}
