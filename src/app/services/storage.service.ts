import { Injectable } from '@angular/core'
import { Preferences } from '@capacitor/preferences'

export const appToken = 'appToken'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor () { }

  setStorage(key: string, value: any) {
    Preferences.set({ key: key, value: value })
  }

  getStorage(key: string): any {
    return Preferences.get({ key: key })
  }

  removeStorage(key: string) {
    Preferences.remove({ key: key })
  }

  clearStorage() {
    Preferences.clear()
  }

}
