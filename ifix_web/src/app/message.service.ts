import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {ConfigService} from './config.service';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private subject: Subject<any>;
  private gridSubject = new Subject<any>();
  private colDefSubject = new Subject<any>();
  private cellChangeSubject = new Subject<any>();
  private selectedSubject = new Subject<any>();
  private rowSubject = new Subject<any>();
  private afterDeleteSubject = new Subject<any>();
  private totalDataSubject = new Subject<any>();
  private userAuthSubject = new Subject<any>();
  private clientUserAuth = new Subject<any>();
  private groupingSubject = new Subject<any>();
  private modalSubject = new Subject<any>();
  private assetModalSubject = new Subject<any>();
  private groupChangeSubject = new Subject<any>();
  private addedAssetModalSubject = new Subject<any>();
  private attachedAssetSubject = new Subject<any>();
  private colorSet = new Subject<any>();
  private assignedSubject = new Subject<any>();
  // private URLSet = new Subject<any>();
  // private validationCode = new Subject<any>();
  private createTicketCode = new Subject<any>();
  private modifiedAssetSubject = new Subject<any>();

  constructor(private route: Router, private config: ConfigService, private sanitizer: DomSanitizer) {
  }

  MISSING_OPERATOR = 'Operator is missing';
  TOKEN_LOG_OUT = 'You are going to be logged out as another user logged in to the system';
  UPPER_LOWER_CHECK = 'New Password must contain a mix of Uppercase and Lowercase letters';
  NUMBER_SYMBOL_CHECK = 'New Password must contain at least one Number or Non-alphanumeric symbol (eg.!?&)';
  SPACE_CHECK = 'New Password cannot contain any Spaces';
  SAME_PASSWORD = 'New Password should not be same as Old Password';
  PASSWORD_PATTERN = 'Before creating anew password,please read the rules of a password';
  PASSWORD_CHANGED = 'To make sure your account\'s secure ,we can log you out of any other devices,you ' +
    'can log back in with your New Password';
  NEW_CONFIRM_PASS_ERROR = 'New Password and Confirm Password are not matched';
  WORKFLOW_ERROR = 'Workflow Not Found';
  BLANK_GROUP = 'Please Select Support Group';
  BLANK_SOURCE = 'Please select source value';
  BLANK_ERROR_MESSAGE = 'All the fields are mandatory';
  BLANK_ADDITIONAL = ' of additional fields are mandatory';
  BLANK_SCHEDULE_ERROR_MESSAGE = ' of schedule tab fields are mandatory';
  BLANK_PLAN_ERROR_MESSAGE = ' of plan of action tab fields are mandatory';
  SERVER_ERROR = 'Something went wrong. Please try again later';
  SEQUENCE_ERROR = 'Enter a valid sequence number';
  BLANK_ATTACHMENT = 'You need to attach a file before upload';
  INSERT_SUCCESS = 'Record inserted successfully';
  EDIT_SUCCESS = 'Record updated successfully';
  DELETE_SUCCESS = 'Record deleted successfully';
  PASSWORD_MISMATCH = 'Password and confirm password does not match';
  DELETE_PERMISSION = 'You do not have delete permission';
  EDIT_PERMISSION = 'You do not have edit permission';
  ADD_PERMISSION = 'You do not have add permission';
  VIEW_PERMISSION = 'You do not have view permission';
  CATEGORY_LEVEL_SEQ = 'Sequence number must be greater than 99';
  END_TIME_GREATERTHAN_START_TIME = 'End time must be greater than start time';
  SAME_PROPERTY_TYPE_ERROR = 'From Property type and to Property type can\'t be same';
  EMPTY_CONNECTION = 'Please create a connection with previous state at first.';
  PROCESS_DTL_NOT_SAVE = 'Please complete all the state details before proceeding';
  NO_PROCESS = 'No process selected. Please select the process first';
  BLANK_ASSET = 'Select any asset and then click add asset button';
  CATEGORY_ERROR = 'Enter all category Value';
  PRIORITY_ERROR = 'No priority Mapped';
  STATUS_ERROR = 'No Status Mapped';
  TERM_SUCCESS = 'Successfully Updated';
  TERM_DELETE = 'Successfully Deleted';
  ATTACH_ERROR = 'You Can Attach Only One File';
  WORKFLOW_ACTIVATE = 'Process Activated Successfully';
  SAME_USER = 'Group and user are already selected';
  BLANK_USER = 'Select user before proceeding';
  CHANGE_STATE = 'Change State before proceeding';
  WORKFLOW_END = 'You have reached End of Process. Please change state manually to move ahead';
  NO_CATALOG_CATEGORY = 'No category mapped with catalog';
  DUPLICATE_NODE = 'You can\'t add a node multiple time';
  MINIMUM_USER = 'You have to add at least one user.';
  NO_CREATE_URL = 'Create Ticket url not mapped.';
  CATALOG_ERROR = 'Please select catalog value from dashboard first.Then create ticket';
  PROCESS_CLEAR = 'Process Details is cleared now.';
  NO_TICKET_TYPE = 'No Ticket Type is mapped with this organization.';
  NO_TICKET_FOUND = 'No ticket found with this value';
  NO_STATUS_TICKET_FOUND = 'This ticket can\'t be attached as a child ticket';
  TICKET_FOUND = 'Ticket Details found with this value';
  TICKET_ATTACHED = 'Ticket Attached Successfully';
  PRIORITY_UPDATE = 'Priority Updated Successfully';
  CATEGORY_UPDATE = 'Category Updated Successfully';
  ADDITIONAL_UPDATE = 'Additional Field Updated Successfully';
  PLAN_UPDATE = 'Plan of Action tab Updated Successfully';
  SCHEDULE_UPDATE = 'Schedule tab Updated Successfully';
  REOPEN_MESSAGE = 'Do you want to Re-open Current Ticket ?\n\nNOTE : Please raise new ticket if you are reporting a different issue.';
  FILE_DELETE_ERROR = 'You don\'t have permission to delete this file';
  USER_CHANGE_MESSAGE = 'Ticket forwarded successfully';
  THEME_CHANGE = 'Your theme is changed now';
  SELF_ATTACHED = 'Self attachment is restricted';
  MAIL_SENT = 'Mail Sent successfully';
  BLANK_MAIL_IDS = 'Please enter Mail Ids';
  BLANK_MAIL_BODY = 'Please enter Mail Body';
  ADD_EFFORT_NOTIFICATION_MESSAGE = 'Please update your efforts if not updated already!';
  COMMENT_SUCCESS = 'Comment Added successfully';
  ADD_EFFORT = 'Effort added successfully';
  ATTACH_SUCCESSFULL = 'File attached successfully';
  BLANK_TICKET = 'Please select atleast one ticket before attaching';
  DATA_ALREADY_EXIST = 'Value already added';
  SELF_ATTACHMENT = 'Please assign yourself first';
  BLANK_LOCATION = 'Please enter location value';
  BLANK_MOBILE = 'Please enter mobile number';
  WRONG_PERCENTAGE = 'Percentage should be within 0 to 100';
  SAME_ORGANIZATION = 'From Organization and to organization can\'t be same';
  SAME_TICKET_TYPE_ERROR = 'From Ticket type and to ticket type can\'t be same';
  DOWNLOAD_SUCCESS = 'Download successfully';
  FILTER_SAVED = 'Filter saved successfully';
  FILTER_DELETE = 'Filter deleted successfully';
  ENDDATE_GREATER = 'Enddate must be greater than or equal to start date';
  ASSET_UPDATE = 'Asset updated successfully';
  SELECT_ORG = 'Filter conditions not selected';
  SELECT_FILTER = 'Please select filter before save';
  SELECT_HEADER = 'Please select header before submit';
  ADD_QUERY = 'Please add another query';
  ASSET_COPY = 'You are creating a new CI/Asset similar to the selected one. Please click OK to confirm else click CANCEL button.';
  BLANK_SHORT = 'Short Description can\'t be blank';
  BLANK_LONG = 'Long Description can\'t be blank';
  DUPLICATE_LINK = 'Ticket Already linked.';
  TICKET_LINK = 'Ticket Linked Successfully';
  NO_GROUP = 'No Support Group mapped with this organization';
  MIN_ORG = 'You must select at least one organization';
  MIN_GRP = 'You must select at least one support group';
  SUPPORT_GROUP_UPDATE_SUCCESS = 'Default support group updated successfully';
  ASSET_DELETE = ' You are about to delete/detach the selected CI from ticket. Please click OK to confirm or Cancel';
  ASSET_SUCCESS = 'Selected CI attached to the ticket successfully';
  CATEGORY_SAVE = 'Please change a category value before submitting it.';

  defaultGroupId: any;
  pageSelected = 1;
  pagination = [{'id': 1, 'value': 100}, {'id': 2, 'value': 200}, {'id': 3, 'value': 500}];
  pageSize = this.pagination[0].value;
  workspaces = [
    {id: 1, name: 'My Workspace'},
    {id: 2, name: 'Team Workspace'},
    {id: 3, name: 'Opened By / Requested By'},
  ];
  colors = [{
    name: 'default',
    selectedValue: '#f1f3f4',
    sideNavValue: '',
    fontColorValue: '',
    footerCssValue: '',
    footerItemValue: '',
    dashbordTittleCss: '',
    tableCss: '',
    buttonCss: '',
    darkCss: '',
    profile: '#ffffff',
    pageNameCss: ''
  },
    {
      name: 'Crayola\'s Gold',
      selectedValue: '#E9D8A5',
      sideNavValue: '#9D7750',
      fontColorValue: '#F9F3ED',
      footerCssValue: '#E3CE8E',
      footerItemValue: '#9D7750',
      tableCss: '#F4ECD2',
      buttonCss: '#9D7750',
      darkCss: '#DFCFA1',
      dashbordTittleCss: '#F0E4C0',
      profile: '#E9D8A5',
      pageNameCss: '#9D7750'
    },

    {
      name: 'Pale Goldenrod',
      selectedValue: '#E5F9C1',
      sideNavValue: '#5FAD70',
      fontColorValue: '#F9F3ED',
      footerCssValue: '#daf7a6',
      footerItemValue: '#5FAD70',
      tableCss: '#F2FCE0',
      darkCss: '#CEE0AE',
      buttonCss: '#5FAD70',
      dashbordTittleCss: '#EFFBDA',
      profile: '#E5F9C1',
      pageNameCss: '#5FAD70'
    },
    {
      name: 'Deep Champagne',
      selectedValue: '#FAE4BF',
      sideNavValue: '#9E660B',
      fontColorValue: '#000000',
      footerCssValue: '#F7DAA6',
      footerItemValue: '#000000',
      buttonCss: '#9E660B',
      tableCss: '#F4ECD2',
      darkCss: '#E2D0B2',
      dashbordTittleCss: '#FDF4E4',
      profile: '#FAE4BF',
      pageNameCss: '#000000'
    },
    {
      name: 'Melon',
      selectedValue: '#F9D0C1',
      sideNavValue: '#CC5340',
      fontColorValue: '#F9F3ED',
      footerCssValue: '#F7BCA6',
      footerItemValue: '#CC5340',
      tableCss: '#FCE8E0',
      darkCss: '#E0BBAE',
      buttonCss: '#CC5340',
      dashbordTittleCss: '#FDECE6',
      profile: '#F9D0C1',
      pageNameCss: '#CC5340'
    },
    {
      name: 'Fresh Air',
      selectedValue: '#DBF5FC',
      sideNavValue: '#2775B2',
      fontColorValue: '#F9F3ED',
      footerCssValue: '#A6E7F7',
      footerItemValue: '#2775B2',
      tableCss: '#EDFAFE',
      darkCss: '#C5DDE3',
      buttonCss: '#2775B2',
      dashbordTittleCss: '#EDFAFE',
      profile: '#DBF5FC',
      pageNameCss: '#2775B2'
    }];
  isSocketConnected = false;
  // isJoinedRoom = false;
  loginData: any;
  loginClient: number;
  loginOrgnId: number;
  color: any;
  view = false;
  add = false;
  edit = false;
  del = false;
  clientId: number;
  orgnId: number;
  loginname: string;
  email: string;
  mobile: string;
  branch: string;
  firstname: string;
  lastname: string;
  username: string;
  clientname: string;
  mstorgnname: string;
  vipuser: string;
  group = [];
  dashboardUrl: string;
  logOutUrl: string;
  displayTicketUrl: string;
  externalUrl: string;
  cloneUrl: string;
  genericCreateTicket: string;
  viewUrl: string;
  createUrl: string;
  orgnTypeId: number;
  roleId: number;
  baseFlag: boolean;
  API_ROOT = this.config.API_ROOT;
  API_URL = this.API_ROOT + '/#';
  SECRET_TOKEN = 'secret%stupa@auth.token#@';
  commentMaxLength = 250;
  offset: number;
  limit: number;
  uploadFileName = '';
  uploadedLogoFileName = '';

  sendCreateTicketData(data: any) {
    this.createTicketCode.next(data);
  }

  getCreateTicketData(): Observable<any> {
    return this.createTicketCode.asObservable();
  }

  setGrouping(data: any) {
    this.groupingSubject.next(data);
  }

  getGrouping(): Observable<any> {
    return this.groupingSubject.asObservable();
  }

  setGridWidth(width: number) {
    this.subject.next(width);
  }

  getGridWidth(): Observable<any> {
    this.subject = new Subject<any>();
    return this.subject.asObservable();
  }

  setColumnDefinitions(data: any) {
    this.colDefSubject.next(data);
  }

  setGridData(data: any) {
    this.gridSubject.next(data);
  }

  setClientUserAuth(details: any) {
    this.clientUserAuth.next(details);
  }

  getClientUserAuth(): Observable<any> {
    return this.clientUserAuth.asObservable();
  }

  setColorEvent(data: any) {
    this.colorSet.next(data);
  }

  getColor(): Observable<any> {
    return this.colorSet.asObservable();
  }

  getColumnDefinitions(): Observable<any> {
    this.colDefSubject = new Subject<any>();
    return this.colDefSubject.asObservable();
  }

  getGridData(): Observable<any> {
    this.gridSubject = new Subject<any>();
    return this.gridSubject.asObservable();
  }

  setCellChangeData(data: any) {
    this.cellChangeSubject.next(data);
  }

  setSelectedItemData(data: any) {
    this.selectedSubject.next(data);
  }

  getCellChangeData(): Observable<any> {
    this.cellChangeSubject = new Subject<any>();
    return this.cellChangeSubject.asObservable();
  }

  getSelectedItemData(): Observable<any> {
    this.selectedSubject = new Subject<any>();
    return this.selectedSubject.asObservable();
  }

  setRow(row: any) {
    this.rowSubject.next(row);
  }

  getRow(): Observable<any> {
    this.rowSubject = new Subject<any>();
    return this.rowSubject.asObservable();
  }

  sendAfterDelete(id: any) {
    this.afterDeleteSubject.next(id);
  }

  getAfterDelete(): Observable<any> {
    this.afterDeleteSubject = new Subject<any>();
    return this.afterDeleteSubject.asObservable();
  }

  setTotalData(data: number) {
    this.totalDataSubject.next(data);
  }

  getUserId() {
    return sessionStorage.getItem('id');
  }

  getToken() {
    return sessionStorage.getItem('data');
  }

  setUserAuth(data: any) {
    this.userAuthSubject.next(data);
  }

  getUserAuth(): Observable<any> {
    // this.userAuthSubject = new Subject<any>();
    return this.userAuthSubject.asObservable();
  }

  getTotalData(): Observable<any> {
    this.totalDataSubject = new Subject<any>();
    return this.totalDataSubject.asObservable();
  }

  setModalData(data: any) {
    this.modalSubject.next(data);
  }

  getModalData(): Observable<any> {
    this.modalSubject = new Subject<any>();
    return this.modalSubject.asObservable();
  }

  setCMDBModalData(data: any) {
    this.assetModalSubject.next(data);
  }

  getCMDBModalData(): Observable<any> {
    this.assetModalSubject = new Subject<any>();
    return this.assetModalSubject.asObservable();
  }

  setGroupChangeData(data: any) {
    this.groupChangeSubject.next(data);
  }

  getGroupChangeData(): Observable<any> {
    return this.groupChangeSubject.asObservable();
  }

  setAssetModalData(data: any) {
    this.addedAssetModalSubject.next(data);
  }

  getAssetModalData(): Observable<any> {
    return this.addedAssetModalSubject.asObservable();
  }

  setAttachedAssetData(data: any) {
    this.attachedAssetSubject.next(data);
  }

  getAttachedAssetData(): Observable<any> {
    return this.attachedAssetSubject.asObservable();
  }

  setAssignedData(data: any) {
    this.assignedSubject.next(data);
  }

  getAssignedData(): Observable<any> {
    return this.assignedSubject.asObservable();
  }

  setModifiedAssetData(data: any) {
    this.modifiedAssetSubject.next(data);
  }

  getModifiedAssetData(): Observable<any> {
    return this.modifiedAssetSubject.asObservable();
  }

  logOut() {
    this.clearSession();
    window.location.href = this.logOutUrl;
  }

  sortByKey(array, key) {
    return array.sort(function(a, b) {
      const x = a[key];
      const y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  getArrayIndex(mainArr, indexArr) {
    const selectSeq = [];
    for (let i = 0; i <= indexArr.length - 1; i++) {
      for (let k = 0; k <= mainArr.length - 1; k++) {
        if (indexArr[i] === mainArr[k].id) {
          selectSeq.push(k);
          break;
        }
      }
    }
    return selectSeq;
  }

  isBlankcat(data) {
    let flag = 0;
    if (data.length !== 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === 0 && data[i].val === 0) {
          flag++;
        }
      }
    } else {
      flag++;
    }
    if (flag > 0) {
      return true;
    } else {
      return false;
    }
  }

  isEmpty(data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  isBlankField(data) {
    let isBlank = false;
    const keys = Object.keys(data);
    // console.log(JSON.stringify(keys));
    for (let i = 0; i < keys.length; i++) {
      let stringVal;
      let numberVal;
      if (typeof data[keys[i]] === 'string') {
        stringVal = data[keys[i]].trim();
      }
      if (typeof data[keys[i]] === 'number') {
        numberVal = data[keys[i]];
      }
      if (stringVal === '' || numberVal === 0) {
        isBlank = true;
        break;
      }

    }
    return isBlank;
  }

  getQueryStringValue(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  clearSession() {
    // sessionStorage.removeItem('id');
    // sessionStorage.removeItem('data');
    // sessionStorage.removeItem('grp');
    sessionStorage.clear();
  }

  xorEncode(str, key) {
    let output = '';
    for (let i = 0; i < str.length;) {
      for (let j = 0; (j < key.length && i < str.length); j++, i++) {
        output += String.fromCharCode(str[i].charCodeAt(0) ^ key[j].charCodeAt(0));
      }
    }
    return output;
  }

  addSessionData(id, token) {
    sessionStorage.setItem('id', id);
    this.setToken(token);
  }

  setToken(token) {
    sessionStorage.setItem('data', token);
  }

  changeRouting(path: string, params = {}) {
    // console.log(path, params);
    const originalPath = path;
    if (path !== undefined) {
      if (this.config.type === 'LOCAL' || this.config.type === 'STAGING') {
        if (path.indexOf('http://') > -1) {
          path = path.substring('http://'.length, path.length);
        }
      } else {
        if (path.indexOf('https://') > -1) {
          path = path.substring('https://'.length, path.length);
        }
      }
      const pos = path.indexOf('/');
      const url = path.substring(0, pos);
      const subpath = path.substring(pos, path.length);
      if (url === location.host) {
        console.log('inside: host', params);
        this.route.navigate([subpath], {
          queryParams: params
        });
      } else {
        // console.log('outside:' + originalPath);
        const userid = btoa(this.xorEncode(this.getUserId(), this.SECRET_TOKEN));
        const token = btoa(this.xorEncode(this.getToken(), this.SECRET_TOKEN));
        // console.log(userid);
        window.location.href = originalPath + '?uid=' + userid + '&token=' + token;
      }
    }
  }

  changeInternalRouting(subpath) {
    this.route.navigate([subpath]);
  }

  blankarr(data) {
    let flag = 0;

    for (let i = 1; i < data.length; i++) {
      if (data[i].id === 0 && data[i].val === 0 && Object.keys(data[i]).length !== 0) {
        flag++;
      }
    }
    if (flag > 0) {
      return true;
    } else {
      return false;
    }

  }

  generateMenu(data) {
    console.log(JSON.stringify(data))
    for (let i = 0; i < data.length; i++) {
      if (data[i].path !== '') {
        delete data[i].items;
      } else {
        if (data[i].items !== null) {
          this.generateMenu(data[i].items);
        } else {
          delete data[i].items;
        }
      }
    }
    return data;
  }

  secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
    const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
    const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
    return hDisplay + mDisplay;
  }

  dateToSec(date) {
    if (date !== undefined && date !== '' && date !== null) {
      const d = new Date(date);
      const hour = d.getHours();
      const min = d.getMinutes();
      const sec = d.getSeconds();
      // console.log(hour, min, sec);
      const hour2sec = hour * 3600;
      const min2sec = min * 60;
      return hour2sec + min2sec + sec;
    }
  }

  dateConverter(date, type) {
    if (date !== undefined && date !== '' && date !== null) {
      // console.log(date, typeof date);
      const d = new Date(date);
      // console.log(d);
      const hour = d.getHours();
      const min = d.getMinutes();
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const sec = d.getSeconds();
      let nHour, nMin, nMonth, nDay, nSec;
      if (hour < 10) {
        nHour = '0' + hour;
      } else {
        nHour = hour;
      }
      if (min < 10) {
        nMin = '0' + min;
      } else {
        nMin = min;
      }
      if (sec < 10) {
        nSec = '0' + sec;
      } else {
        nSec = sec;
      }
      if (month < 10) {
        nMonth = '0' + month;
      } else {
        nMonth = month;
      }
      if (day < 10) {
        nDay = '0' + day;
      } else {
        nDay = day;
      }
      if (type === 1) {
        return year + '-' + nMonth + '-' + nDay;
      } else if (type === 3) {
        return nDay + '-' + nMonth + '-' + year;
      } else if (type === 2) {
        return nDay + '-' + nMonth + '-' + year + ' ' + nHour + ':' + nMin;
      } else if (type === 4) {
        return year + '-' + nMonth + '-' + nDay + ' ' + nHour + ':' + nMin + ':' + nSec;
      } else if (type === 5) {
        return year + '-' + nMonth + '-' + nDay + ' ' + nHour + ':' + nMin;
      } else {
        return nHour + ':' + nMin + ':' + nSec;
      }
    } else {
      return '';
    }
  }

  copyArray(aObject) {
    if (!aObject) {
      return aObject;
    }

    let v;
    const bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
      v = aObject[k];
      bObject[k] = (typeof v === 'object') ? this.copyArray(v) : v;
    }

    return bObject;
  }


  saveSupportGroup(data) {
    sessionStorage.setItem('grp', JSON.stringify(data));
  }

  saveOrgs(data) {
    sessionStorage.setItem('orgs', JSON.stringify(data));
  }

  getSupportGroup() {
    return JSON.parse(sessionStorage.getItem('grp'));
  }

  getOrgs() {
    return JSON.parse(sessionStorage.getItem('orgs'));
  }

  saveMenuData(data) {
    sessionStorage.setItem('dd', JSON.stringify(data));
  }

  saveTicketTypeData(data) {
    sessionStorage.setItem('tt', JSON.stringify(data));
  }

  getTicketTypeData() {
    return JSON.parse(sessionStorage.getItem('tt'));
  }

  getMenuData() {
    return JSON.parse(sessionStorage.getItem('dd'));
  }

  saveTile(data) {
    sessionStorage.setItem('tl', data);
  }

  setCat(data) {
    sessionStorage.setItem('ct', JSON.stringify(data));
  }

  setLastCat(data) {
    sessionStorage.setItem('lct', JSON.stringify(data));
  }

  setStatus(data) {
    sessionStorage.setItem('st', JSON.stringify(data));
  }

  setPrio(data) {
    sessionStorage.setItem('pr', JSON.stringify(data));
  }

  setTerm(data) {
    sessionStorage.setItem('tm', JSON.stringify(data));
  }

  setWorkinglabel(data) {
    sessionStorage.setItem('wl', data);
  }

  getCat() {
    return JSON.parse(sessionStorage.getItem('ct'));
  }

  getLastCat() {
    return Number(sessionStorage.getItem('lct'));
  }

  getStatus() {
    return JSON.parse(sessionStorage.getItem('st'));
  }

  getPrio() {
    return JSON.parse(sessionStorage.getItem('pr'));
  }

  getTerm() {
    return JSON.parse(sessionStorage.getItem('tm'));
  }

  getTile() {
    return Number(sessionStorage.getItem('tl'));
  }

  getWorkinglabel() {
    return Number(sessionStorage.getItem('wl'));
  }

  setAssetCount(data) {
    sessionStorage.setItem('as', data);
  }

  setNavigation(data) {
    sessionStorage.setItem('nv', data);
  }

  getAssetCount() {
    return Number(sessionStorage.getItem('as'));
  }

  getNavigation() {
    return sessionStorage.getItem('nv');
  }

  removeNavigation() {
    sessionStorage.removeItem('nv');
  }

  setStoredData(data) {
    sessionStorage.setItem('backToViewTicketSelectedFolder', JSON.stringify(data));
  }

  getStoredData() {
    return JSON.parse(sessionStorage.getItem('backToViewTicketSelectedFolder'));
  }

  removeStoredData() {
    sessionStorage.removeItem('backToViewTicketSelectedFolder');
  }

  removeTile() {
    sessionStorage.removeItem('tl');
  }

  getReadableFileSizeString(fileSizeInBytes) {
    let i = -1;
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  }

  setDownloadData(data) {
    sessionStorage.setItem('downloadData', JSON.stringify(data));
  }

  getDownloadData() {
    return JSON.parse(sessionStorage.getItem('downloadData'));
  }

  setLoginData(data) {
    sessionStorage.setItem('loginData', JSON.stringify(data));
  }

  getLoginData() {
    return JSON.parse(sessionStorage.getItem('loginData'));
  }

  saveWorkflowSupportGroups(data) {
    sessionStorage.setItem('wsg', JSON.stringify(data));
  }

  getWorkflowSupportGroups() {
    return JSON.parse(sessionStorage.getItem('wsg'));
  }

  removeWorkflowGroup() {
    sessionStorage.removeItem('wsg');
  }

  saveWorkspace(data) {
    sessionStorage.setItem('wp', JSON.stringify(data));
  }

  getWorkspace() {
    return JSON.parse(sessionStorage.getItem('wp'));
  }

  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
