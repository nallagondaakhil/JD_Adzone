export interface NotificationModel {
    status: 'COMPLETED' | 'FAILED';
    createdDt: string;
    notifType: string;
    fileNm: string;
    fileLink: string;
}
