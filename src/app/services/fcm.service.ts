import { Injectable } from '@angular/core'
import { StorageService } from './storage.service'
import { Capacitor } from '@capacitor/core'
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications'
import { BehaviorSubject } from 'rxjs'

export const FCMTOKEN = 'pushNotificationToken'

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private _redirect = new BehaviorSubject<any>(null)

  constructor (private storage: StorageService) { }

  get redirect() {
    return this._redirect.asObservable()
  }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush()
      this.getDeliveredNotifications()
    }
  }

  private async registerPush() {
    try {
      await this.addListeners()
      let permStatus = await PushNotifications.checkPermissions()

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions()
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions')
      }

      await PushNotifications.register()

    } catch (err) {
      console.error(err)
    }
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications()
    console.log('Delivered notifications', notificationList)
  }

  addListeners() {
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Token:', token)

      const fcmToken = token.value
      let exist = 1

      const savedToken = JSON.parse((await this.storage.getStorage(FCMTOKEN)).value)

      if (savedToken) {
        if (savedToken === fcmToken) {
          exist = 0
        } else {
          exist = 2
        }
      }

      if (exist === 1) {
        // save token
        this.storage.setStorage(FCMTOKEN, JSON.stringify(fcmToken))
      } else if (exist === 2) {
        // update token
        const token = {
          expiredToken: savedToken,
          refreshedToken: fcmToken
        }

        this.storage.setStorage(FCMTOKEN, fcmToken)
      }
    })

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error: ', error as string)
    })

    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      console.log('Push received:', JSON.stringify(notification))

      const data = notification.data

      if (data.redirect) {
        this._redirect.next(data.redirect)
      }
    })

    PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
      const data = notification.notification.data

      console.log('Action performed:', JSON.stringify(notification.notification))
      console.log('Push Data:', data)

      if (data.redirect) {
        this._redirect.next(data.redirect)
      }
    })
  }

  async removeFcmToken() {
    try {
      const savedToken = JSON.parse((await this.storage.getStorage(FCMTOKEN)).value)
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
