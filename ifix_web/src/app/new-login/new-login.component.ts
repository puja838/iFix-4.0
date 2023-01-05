import {Component, OnInit,ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {MessageService} from '../message.service';


@Component({
  selector: 'app-new-login',
  templateUrl: './new-login.component.html',
  styleUrls: ['./new-login.component.css']
})
export class NewLoginComponent implements OnInit {
  image:any
  TOtp:'';
  loginName:'';
  clientId=0;
  orgnId= 0;
  respObject:any;
  loginCode:''
  private modalRef: NgbModalRef;
  @ViewChild('content') private content;
  confrimMssg="";
  logouturl:any;
  upload:any;
  datadownload:any;
  constructor(private route: Router, private _rest: RestApiService,private modalService: NgbModal, private notifier: NotifierService, private messageService: MessageService) { }

  ngOnInit(): void {
    if(this.messageService.getDownloadData()=== null){
      this.clientId = this.messageService.loginClient;
      this.orgnId = this.messageService.loginOrgnId;
      this.upload = this.messageService.uploadFileName
      this.datadownload = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgnId,
      'filename': this.upload,
      };
      console.log(this.clientId,this.orgnId,this.upload);
    }else{
      this.datadownload= this.messageService.getDownloadData()
      this.datadownload
    }
    this.downloadFile(this.datadownload);
  }

  downloadFile(data) {
    this._rest.filedownload(data).subscribe((blob: any) => {
      const objectUrl = URL.createObjectURL(blob);
      let dispalyImage  = document.getElementById('displayImage') as HTMLImageElement ;
      dispalyImage.src = objectUrl;
      //this.messageService.setURL(objectUrl) 
    });
  }

  verify(){
    if(this.messageService.getLoginData()=== null){
      this.loginName = this.messageService.loginData.loginname;
      this.loginCode = this.messageService.loginData.code;
    }
    else{
      const loginData = this.messageService.getLoginData();
      this.loginName = loginData.loginname;
      this.loginCode = loginData.code;
    }
    const data= {
      clientid: this.datadownload.clientid,
      mstorgnhirarchyid: this.datadownload.mstorgnhirarchyid,
      loginname: this.loginName,
      code: this.loginCode,
      totp: this.TOtp
    }
    console.log(JSON.stringify(data));

    if (!this.messageService.isBlankField(data)) {
      this._rest.verifytotp(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.logouturl =  this.respObject.details[0].url;
          this.confrimMssg = this.respObject.message;
          this.modalRef = this.modalService.open(this.content, {size: 'lg'});
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  redirect(){
    this.modalRef.close();
    this.messageService.logOutUrl = this.logouturl;
    this.messageService.logOut();
  }
}
