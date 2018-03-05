import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AddRoomPage } from '../add-room/add-room';
import { ChatPage } from '../chat/chat';
import * as firebase from 'firebase';
import { WelcomePage } from '../welcome/welcome';

/**
 * Generated class for the RoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {
  rooms = [];
  ref = firebase.database().ref('chatrooms/');
  user: firebase.UserInfo;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      } else {
        this.navCtrl.setRoot(WelcomePage);
      }
    });
    this.ref.on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
    });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.navCtrl.setRoot(WelcomePage);
    }).catch(err => {
      console.log(err);
    });
  }

  confirmLogout() {
    let alert = this.alertCtrl.create({
      title: 'Logout?',
      message: "You're about to log out of pixelchat. Are you sure?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return;
          }
        },
        {
          text: 'Log out',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    alert.present();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
  }

  addRoom() {
    this.navCtrl.push(AddRoomPage);
  }

  joinRoom(key, name) {
    this.navCtrl.push(ChatPage, {
      key:key,
      roomname: name
    });
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
