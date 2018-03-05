import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { RoomPage } from '../room/room';
import * as firebase from 'firebase';
import { CanvasDraw } from '../../components/canvas-draw/canvas-draw';
import { NativeAudio } from '@ionic-native/native-audio';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild('content') content: Content;
  @ViewChild('canvas') canvas: CanvasDraw;

  data = { type:'', nickname:'', message:'' };
  chats = [];
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;
  roomname:string = "";
  myColor: string;
  audio: NativeAudio;

  constructor(public navCtrl: NavController, public navParams: NavParams, nativeAudio: NativeAudio) {
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = firebase.auth().currentUser.displayName;
    this.roomname = this.navParams.get("roomname") as string;
    
    this.data.type = 'message';
    this.data.nickname = this.nickname;
    this.myColor = this.randomColor();
    this.audio = nativeAudio;

    let joinData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    joinData.set({
      type:'join',
      user:this.nickname,
      message:this.nickname+' has joined this room.',
      sendDate:Date()
    });
    this.data.message = '';
  
    firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
    });
  }

  ionViewWillLeave() {
    let exitData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    exitData.set({
      type:'exit',
      user:this.nickname,
      message:this.nickname+' has exited this room.',
      sendDate:Date()
    });
    this.audio.play('bloop');

    this.offStatus = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.audio.play('roomenter');
  }

  sendPicto() {
    let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    newData.set({
      type: this.data.type,
      user: this.data.nickname,
      message: this.canvas.getCanvasData(),
      sendDate: Date(),
      frameColor: this.myColor
    });
    this.canvas.clearCanvas();
    this.audio.play('send');

  }

  setColor(col) {
    this.canvas.changeColour(col);
  }

  randomColor() {
    var colors = ["blue", "green", "yellow", "pink"];
    return colors[Math.floor(Math.random() * 3) + 0]
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
