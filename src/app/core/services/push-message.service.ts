import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { SwPush } from '@angular/service-worker';

@Injectable()
export class PushMessageService {
    generatedToken: string;

    constructor(private swPush: SwPush) {}
    // constructor(private angularFireMessaging: AngularFireMessaging, private swPush: SwPush) {}

    initialize() {
        navigator.serviceWorker.ready.then(x => {
            console.log('starting initialize push notification..');
            this.subscribeToNotification();
        });
    }

    subscribeToNotification() {
        if (!this.swPush.isEnabled) {
            console.log('Service worker not enabled');
            return;
        }
        this.swPush.notificationClicks.subscribe(({ action, notification }) => {
            if (notification.data && notification.data.url) {
                console.log(`notification clicked: ${notification.data.url}`, action);
                window.open(notification.data.url);
            }
        });
        // this.swPush.messages.subscribe((message) => console.log('Receive push message', message));
        // this.angularFireMessaging.requestToken.subscribe((token) => {
        //     console.log('Generated device token: ', token);
        //     this.generatedToken = token;
        //     // todo send the device token to backend
        // }, (err) => {
        //     console.error('Unable to get permission to notify.', err);
        // });
        // this.angularFireMessaging.messages.subscribe((payload) => {
        //     console.log('new message received. ', payload);
        // });
    }
}
