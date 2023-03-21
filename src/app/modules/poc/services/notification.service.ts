import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PushMessageService } from "src/app/core/services/push-message.service";
import { environment } from "src/environments/environment";

@Injectable()
export class NotificationService {
    apiUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient, private pushService: PushMessageService) {}

    addSubscription(sub: any) {
        return this.http.post(`${this.apiUrl}/notification/subscribe`, sub).toPromise();
    }

    sendNotification(data: any) {
        const body = { notification: data, to: this.pushService.generatedToken };
        let header = new HttpHeaders();
        header = header.append('Authorization', ('key=' + environment.firebaseServerKey));
        return this.http.post(`https://fcm.googleapis.com/fcm/send`, body, {headers: header}).toPromise();
    }
}
