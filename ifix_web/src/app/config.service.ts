import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  /************* LOCAL *************/
  // type = 'LOCAL';
  // apiRoot = 'http://localhost:8082/api';
  // API_ROOT = 'http://localhost:4200';
  // messageRoot = 'http://localhost:8087';
  // faqRoot = 'http://localhost:8080/ifixDMApplication';
  // recordRoot = 'http://localhost:8083/recordapi';
  // MAX_FILE_SIZE = 15 * 1024 * 1024;
  // cateUploadRoot = 'http://20.204.29.18:8084/categoryupload';
  // assetUploadRoot = 'http://20.204.29.18:8085/assetupload';
  // userUploadRoot = 'http://20.204.29.18:8088/userupload';
  // locationRoot = 'http://20.204.74.38:8093/locations';
  // dataRoot = 'http://20.204.74.38:8094/ifixtransport';
  // emailUploadRoot = 'http://20.204.29.18:8090/EmailTicketApi';
  // reportRoot = 'http://20.204.74.38:8094/reports';
  // socketRoot = 'http://localhost:6001';

  /************* STAGING NEW*************/
  // type = 'STAGING';
  //  type = 'LOCAL';
  // apiRoot = 'http://20.204.29.18:8082/api';
  // faqRoot = 'http://20.204.29.18:8080/ifixDMApplication';
  // messageRoot = 'http://20.204.29.18:8087';
  // recordRoot = 'http://20.204.29.18:8083/recordapi';
  // API_ROOT = 'http://20.204.29.18:9000';
  // cateUploadRoot = 'http://20.204.29.18:8084/categories';
  // assetUploadRoot = 'http://20.204.29.18:8085/assets';
  // userUploadRoot = 'http://20.204.29.18:8088/users';
  // emailUploadRoot = 'http://20.204.29.18:8090/EmailTicketApi';
  // locationRoot = 'http://20.204.29.18:8093/locations';
  // dataRoot = 'http://20.204.29.18:8094/ifixtransport';
  // reportRoot = 'http://20.204.29.18:8094/reports';
  // MAX_FILE_SIZE = 15 * 1024 * 1024;
  /************* STAGING *************/
  // type = 'STAGING';
  /*type = 'LOCAL';
  apiRoot = 'http://20.204.74.38:8082/api';
  faqRoot = 'http://20.204.74.38:8080/ifixDMApplication';
  messageRoot = 'http://20.204.74.38:8087';
  recordRoot = 'http://20.204.74.38:8083/recordapi';
  API_ROOT = 'http://20.204.74.38:9000';
  cateUploadRoot = 'http://20.204.74.38:8084/categories';
  emailUploadRoot = 'http://20.204.74.38:8090/EmailTicketApi';
  userUploadRoot = 'http://20.204.74.38:8088/users';
  assetUploadRoot = 'http://20.204.74.38:8085/asset';
  locationRoot = 'http://20.204.74.38:8093/locations';
  dataRoot = 'http://20.204.74.38:8094/ifixtransport';
  reportRoot = 'http://20.204.74.38:8094/reports';
  socketRoot = 'http://20.204.74.38:6001';
  MAX_FILE_SIZE = 15 * 1024 * 1024;*/
  /************************UAT***************************/
  // type = 'LOCAL';
  type = 'UAT';
  apiRoot = 'https://iccmuat.ifixcloud.io/api';
  // apiRoot = 'http://localhost:8082/api';
  API_ROOT = 'https://iccmuat.ifixcloud.io';
  messageRoot = 'https://iccmuat.ifixcloud.io';
  faqRoot = 'https://iccmuat.ifixcloud.io/ifixDMApplication';
  recordRoot = 'https://iccmuat.ifixcloud.io/recordapi';
  cateUploadRoot = 'https://iccmuat.ifixcloud.io/categories';
  assetUploadRoot = 'https://iccmuat.ifixcloud.io/asset';
  userUploadRoot = 'https://iccmuat.ifixcloud.io/users';
  emailUploadRoot = 'https://iccmuat.ifixcloud.io/EmailTicketApi';
  locationRoot = 'https://iccmuat.ifixcloud.io/locations';
  dataRoot = 'https://iccmuat.ifixcloud.io/ifixtransport';
  reportRoot = 'https://iccmuat.ifixcloud.io/reports';
  // reportRoot = 'http://localhost:8098/reports';
  socketRoot = 'https://iccmuat.ifixcloud.io';
  MAX_FILE_SIZE = 15 * 1024 * 1024;
  /************************PROD***************************/
  // type = 'LOCAL';
  // type = 'PROD';
  // apiRoot = 'https://itsmicc.ifixcloud.io/api';
  // API_ROOT = 'https://itsmicc.ifixcloud.io';
  // messageRoot = 'https://itsmicc.ifixcloud.io';
  // faqRoot = 'https://itsmicc.ifixcloud.io/ifixDMApplication';
  // recordRoot = 'https://itsmicc.ifixcloud.io/recordapi';
  // cateUploadRoot = 'https://itsmicc.ifixcloud.io/categories';
  // assetUploadRoot = 'https://itsmicc.ifixcloud.io/asset';
  // userUploadRoot = 'https://itsmicc.ifixcloud.io/users';
  // emailUploadRoot = 'https://itsmicc.ifixcloud.io/EmailTicketApi';
  // locationRoot = 'https://itsmicc.ifixcloud.io/locations';
  // dataRoot = 'https://itsmicc.ifixcloud.io/ifixtransport';
  // reportRoot = 'https://itsmicc.ifixcloud.io/reports';
  // socketRoot = 'https://itsmicc.ifixcloud.io';
  // MAX_FILE_SIZE = 15 * 1024 * 1024;
}
