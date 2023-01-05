import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {io} from 'socket.io-client';
import {ConfigService} from './config.service';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  constructor(private config: ConfigService, private messageService: MessageService) {
    this.socket = io(this.config.socketRoot);
    this.socket.on('connect', () => {
      // if (this.messageService.getUserId() !== null) {
      //   this.socket.emit('userRoomJoin', this.messageService.getUserId());
      // }
      // if (this.messageService.group.length > 0) {
      //   for (let i = 0; i < this.messageService.group.length; i++) {
      //     // groupArray.push(this.messageService.group[i].id);
      //     this.socket.emit('groupRoomJoin', this.messageService.group[i].id);
      //   }
      // }
      console.log('\n Socket Connected :');
      this.messageService.isSocketConnected = true;
    });
    this.socket.on('disconnect', (reason) => {
      console.log('\n Socket DisConnected');
      console.log(reason);
      // alert(reason)
    });
  }

  emit(eventName: string, data: any) {
    console.log('\n eventName  =====    ', eventName);
    console.log('\n data  =====    ', data);
    this.socket.emit(eventName, data);
  }

}
