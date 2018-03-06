import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { SigninPage } from '../pages/signin/signin';
import { WelcomePage } from '../pages/welcome/welcome';
import { NativeAudio } from '@ionic-native/native-audio';
import { RoomPage } from '../pages/room/room';
const config = {
  apiKey: "AIzaSyBPJxQ22P0FiaXRnPwpNX5AfAqST-719aQ",
  authDomain: "pixelchat-f39f4.firebaseapp.com",
  databaseURL: "https://pixelchat-f39f4.firebaseio.com",
  projectId: "pixelchat-f39f4",
  storageBucket: "pixelchat-f39f4.appspot.com",
  messagingSenderId: "191397333655"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = WelcomePage;

  constructor(platform: Platform, nativeAudio: NativeAudio, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      nativeAudio.preloadComplex('bgm', 'assets/sounds/miiplaza.mp3', 1,1,0).then(() => {
        nativeAudio.loop('bgm');
      })
      nativeAudio.preloadSimple('roomenter', 'assets/sounds/enterroom.mp3');
      nativeAudio.preloadSimple('send', 'assets/sounds/sendmessage.mp3');
      nativeAudio.preloadSimple('got', 'assets/sounds/gotmessage.mp3');
      nativeAudio.preloadSimple('bloop', 'assets/sounds/bloop.mp3');
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.rootPage = RoomPage;
        } else {
          this.rootPage = WelcomePage;
        }
      });
    });
    firebase.initializeApp(config);
  }
}

