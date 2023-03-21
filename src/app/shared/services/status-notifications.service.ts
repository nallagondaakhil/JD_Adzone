import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationModel } from '../models/notification.model';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/modules/admin/models/paged-data.model';

@Injectable()
export class StatusNotificationsService {
    apiUrl = environment.apiBaseUrl;

    constructor(private httpClient: HttpClient) { }

    getNotifications() {
        const url = `${this.apiUrl}/api/v1/notificationController/notifications`;
        return this.httpClient.get<ApiResponse<NotificationModel[]>>(url).toPromise();
    }

    fileDownloadUrl(name: string) {
        return `${this.apiUrl}/api/v1/downloadController/downloads/${name}`;
    }
}
