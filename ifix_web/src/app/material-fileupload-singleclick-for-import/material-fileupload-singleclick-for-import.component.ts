import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, last, map, tap} from 'rxjs/internal/operators';
import {of, Subscription} from 'rxjs/index';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-material-fileupload-singleclick-for-import',
  templateUrl: './material-fileupload-singleclick-for-import.component.html',
  styleUrls: ['./material-fileupload-singleclick-for-import.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(300, style({opacity: 0}))
      ])
    ])
  ]
})
export class MaterialFileuploadSingleclickForImportComponent implements OnInit {
  /** Visible the attach and upload button*/
  @Input() isVisible = true;
  /** Link text */
  @Input() text = 'Upload';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'myFile';
  /** Target URL for file uploading. */
  @Input() target;
  /** Extra data  sending with file */
  @Input() formData = {};
  /** File extension that accepted, same as 'accept' of <input type="file" />.
   By the default, it's set to 'image/*'. */
  @Input() accept = '*/*';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() complete = new EventEmitter<string>();
  @Output() uploadError = new EventEmitter<string>();
  @Input() isMultiple = true;
  /** maximum file size **/
  //@Input() MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 mb
  @Output() dataLoaded = new EventEmitter<any>();
  @Input() maxFile = 7;
  @Output() onFileAttach = new EventEmitter<string>();
  @Output() onFileRemove = new EventEmitter<string>();
  files: Array<FileUploadModel> = [];

  INVALID_EXT = ['.js', '.exe', '.jar', '.bat', '.deb', '.asp', '.php', '.py', '.dll', '.vbs'];

  constructor(private _http: HttpClient, private messageService: MessageService) {
  }
  ngOnInit(): void {
  }

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      // console.log('-length>'+fileUpload.files.length)
      if (fileUpload.files.length <= this.maxFile) {
        for (let index = 0; index < fileUpload.files.length; index++) {
          const file = fileUpload.files[index];
          // console.log(file);
          const pos = file.name.lastIndexOf('.');
          const ext = file.name.substring(pos, file.name.length);
          // console.log('ext===' + ext + '===' + this.INVALID_EXT.indexOf(ext));
          if (this.INVALID_EXT.indexOf(ext) > -1) {
            this.uploadError.emit(ext + ' type file is not allowed to upload');
          } 
          // else if (file.size > this.MAX_FILE_SIZE) {
          //   this.uploadError.emit('Maximum file size '+this.messageService.getReadableFileSizeString(this.MAX_FILE_SIZE)+' exceeded');
          // } 
          else {
            if (this.files.length < this.maxFile) {
              this.files.push({
                data: file, state: 'in',
                inProgress: false, progress: 0, canRetry: false, canCancel: true
              });
              // this.onFileAttach.emit();
            } else {
              // alert('More than ' + this.maxFile + ' files is not permitted');
              this.uploadError.emit('More than ' + this.maxFile + ' files is not permitted');
            }

          }
        }
        this.uploadFiles();
      } else {
        // alert('More than ' + this.maxFile + ' files is not permitted');
        this.uploadError.emit('More than ' + this.maxFile + ' files is not permitted');
      }
    };
    fileUpload.click();
  }

  onClickFileUpload() {
    this.uploadFiles();
  }

  cancelFile(file: FileUploadModel) {
    // file.sub.unsubscribe();
    this.removeFileFromArray(file);
    this.onFileRemove.emit();
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel) {
    this.dataLoaded.emit({'loader': false});
    file.canCancel = false;
    const fd = new FormData();
    fd.append(this.param, file.data);
    Object.keys(this.formData).forEach((key) => {
      fd.append(key, this.formData[key]);
    });
    fd.append('user_id', sessionStorage.getItem('id'));
    const req = new HttpRequest('POST', this.target, fd, {
      reportProgress: true,
      headers: new HttpHeaders({'Authorization': sessionStorage.getItem('data')})
    });

    file.inProgress = true;
    file.sub = this._http.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      tap(message => {
      }),
      last(),
      catchError((error: HttpErrorResponse) => {
        this.dataLoaded.emit({'loader': true});
        file.inProgress = false;
        file.canRetry = true;
        return of(`${file.data.name} upload failed.`);
      })
    ).subscribe(
      (event: any) => {
        this.dataLoaded.emit({'loader': true});
        if (typeof (event) === 'object') {
          this.removeFileFromArray(file);
          this.complete.emit(event.body);
        }
      }
    );
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';
    if (this.files.length > 0) {
      this.files.forEach(file => {
        this.uploadFile(file);
      });
    } else {
      // alert(this.messageService.BLANK_ATTACHMENT);
    }
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
