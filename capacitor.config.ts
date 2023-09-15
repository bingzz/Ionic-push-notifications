import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'push.notif.android',
  appName: 'pushNotifications',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
}

export default config
