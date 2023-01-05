import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-schedule-notification',
  templateUrl: './schedule-notification.component.html',
  styleUrls: ['./schedule-notification.component.css']
})
export class ScheduleNotificationComponent implements OnInit {

  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  clientSelected: number;
  displayData: any;
  add = false;
  del = false;
  edit = false;
  view = false;
  isError = false;
  errorMessage: string;
  // private notifier: NotifierService;
  private baseFlag: any;
  collectionSize: number;
  pageSize: number;
  private userAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  organization = [];
  orgSelected=0;
  orgSelected1: number;
  orgName: string;
  clientId: number;
  orgId: number;
  recordType: string;
  recordTypeIds = [];
  recordTypeNames = [];
  recordTypeName: string;
  recordTypeIdSelected: number;
  recordTypeNameSelected: number;
  clientSelectedName: string;
  orgSelectedName: string;
  recordtermvalue: string;
  organizationName: string;
  selectedId: number;
  recordTypeIdSelected1: number;
  selectedRecordTypeId: number;
  recordTypeNameSelected1: number;
  selectedRecordTypeName: number;
  updateFlag = 0;
  orgnId: number;
  isMandatory: boolean;
  isMandatory1: boolean;
  @ViewChild('content') private content;
  @ViewChild('varHelp') private varHelp;
  private modalReference: NgbModalRef;
  isEdit: boolean;
  colordata: any;
  clients=[]
  clientName:string;
  recordTypeStatus=[];
  fromRecordDiffTypeId :any;
  fromRecordDiffTypename:any
  fromlevelid: any;
  fromRecordDiffId: any;;
  allPropertyValues = [];
  fromPropLevels=[];
  fromRecordDiffName: string;
  categoryLevelId:any;
  categoryLevelList=[];
  propertyLevel:any;
  channelList = [
    {'id': 0, 'name': 'Select Channel'},
    {'id': 1, 'name': 'Email'},
    // {'id': 2, 'name': 'SMS'}
  ];
  channeldiffname:any;
  channeldiffid:any;
  isTitle:boolean
  inputSubject:any;
  contentValue: any;
  enteredAdditionalRecipient:any;
  textField = false;
  istextarea: boolean;
  isemailarea: boolean;
  grpSelectedCC = [];
  groupsId = [];
  variablesList = [];
  eventtypeid=0;
  EventTypes = [];
  eventtypename: any;
  grpName:any;
  fromRecordDiffTypeId1 :any;
  groups= [];
  triggerCondition:any;
  priorityId:any;
  allPriorityValues = [];
  fromPriorityName: any;
  userList =[];
  userSelected:any;
  userName:any;
  usersId :any;
  ScheduleTime:any;
  usersarryName: any;;

  constructor(private rest: RestApiService, private messageService: MessageService,
    private route: Router, private modalService: NgbModal,private notifier: NotifierService) {
      this.messageService.getCellChangeData().subscribe(item => {
        // console.log(item);
        // this.notifier = notifier;
        switch (item.type) {
          case 'delete':
            // console.log('deleted');
            if (!this.del) {
              this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
            } else {
              if (confirm('Are you sure?')) {
                this.rest.deletemstschedulednotification({id: item.id}).subscribe((res) => {
                  this.respObject = res;
                  // console.log(JSON.stringify(this.respObject));
                  if (this.respObject.success) {
                    this.messageService.sendAfterDelete(item.id);
                    this.totalData = this.totalData - 1;
                    this.messageService.setTotalData(this.totalData);
                    this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
                  } else {
                    this.notifier.notify('error', this.respObject.message);
                  }
                }, (err) => {
                  this.notifier.notify('error', this.messageService.SERVER_ERROR);
                });
              }
            }

            break;
        }
      });
     }

  ngOnInit(): void {
    this.colordata = this.messageService.colors;
    this.channeldiffid = 0;
    this.eventtypeid = 0;
    this.dataLoaded = true;
    this.isTitle = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Schedule Notification',
      openModalButton: 'Add Schedule Notification',
      breadcrumb: 'Schedule Notification',
      folderName: 'Schedule Notification',
      tabName: 'Schedule Notification',
    };

    const columnDefinitions = [
      {
        id: 'delete',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
      },
      {
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.isError = false;
          this.organization = [];
          this.EventTypes = [];
          this.recordTypeStatus = [];
          this.reset();
          console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientId = args.dataContext.clientid;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.fromRecordDiffTypeId  = args.dataContext.recorddifftypeid;
          this.fromRecordDiffId = args.dataContext.recorddiffid;
          this.channeldiffid = args.dataContext.channeltype;
          this.inputSubject = args.dataContext.emailsub;
          this.contentValue = args.dataContext.emailbody;
          this.eventtypeid = args.dataContext.scheduledeventid;
          const userId = args.dataContext.sendtousersid;
          const userName = args.dataContext.sendtousersnames;
          const usersArryId = userId.split(',');
          for(let i=0;i<usersArryId.length;i++){
            if(usersArryId[i]===""){
              this.userSelected = []
            }
            else{
              this.userSelected.push(Number(usersArryId[i]))
            }
          }
          const groupId = args.dataContext.sendtogroupsid;
          const groupName = args.dataContext.sendtogroupnames;
          const grpArryId = groupId.split(',');
          const grpArryName = groupName.split(',');

          for(let i=0;i<grpArryId.length;i++){
            if(grpArryId[i]===""){
              this.grpSelectedCC = []
            }
            else{
              this.grpSelectedCC.push(Number(grpArryId[i]))
            }
          }
          //console.log("**",this.grpSelectedCC)
          this.enteredAdditionalRecipient = args.dataContext.additionalrecipint;
          this.triggerCondition = args.dataContext.triggerconditiondays;
          this.ScheduleTime = new Date(args.dataContext.scheduledtime);
          this.priorityId = args.dataContext.priorityseqno;
          this.getOrganization();
          this.getRecordDiffType('u');
          this.getnotificationevents();
          this.getPriorityValue();
          this.getUser();
          this.getGroupData();
          this.isEdit=true;
          this.modalReference = this.modalService.open(this.content, {size: 'lg'});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
      id: 'orgname', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'recorddifftypename', name: 'Property Type', field: 'recorddifftypename', sortable: true, filterable: true
      },
      {
        id: 'recorddiffname', name: 'Property Value', field: 'recorddiffname', sortable: true, filterable: true
      },
      {
        id: 'emailsub', name: 'Email Subject', field: 'emailsub', sortable: true, filterable: true
      },
      {
        id: 'emailbody', name: 'Email Body', field: 'emailbody', sortable: true, filterable: true
      },
      {
        id: 'scheduledeventname', name: 'Event Type', field: 'scheduledeventname', sortable: true, filterable: true
      },
      {
        id: 'sendtousersnames', name: 'User Name', field: 'sendtousersnames', sortable: true, filterable: true
      },
      {
        id: 'sendtogroupnames', name: 'Additional Group Receipients', field: 'sendtogroupnames', sortable: true, filterable: true
      },
      {
        id: 'additionalrecipint', name: 'Additional Recipients Email', field: 'additionalrecipint', sortable: true, filterable: true
      },
      {
        id: 'triggerconditiondays', name: 'Trigger Condition', field: 'triggerconditiondays', sortable: true, filterable: true
      },
      {
        id: 'scheduledtime', name: 'Schedule Time', field: 'scheduledtime', sortable: true, filterable: true
      },
      {
        id: 'priorityseqname', name: 'Priority', field: 'priorityseqname', sortable: true, filterable: true
      },
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgnId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
      this.edit =this.messageService.edit;
      this.del =this.messageService.del;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
          this.edit = auth[0].editFlag;
          this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.orgnId = auth[0].mstorgnhirarchyid;
        this.baseFlag = auth[0].baseFlag;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
  }

  openModal(content) {
    this.getOrganization();
    this.reset();
    this.isEdit = false;
    this.modalService.open(content,{size: 'lg'}).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.orgSelected = 0;
    this.fromRecordDiffTypeId = '';
    this.fromlevelid = '';
    this.fromRecordDiffId = '';
    this.recordTypeStatus=[];
    this.fromPropLevels=[];
    this.allPropertyValues=[];
    this.isTitle = true;
    this.channeldiffid = 0;
    this.variablesList = [];
    this.eventtypeid= 0 ;
    this.userSelected = [];
    this.grpSelectedCC = [];
    this.triggerCondition = '';
    this.ScheduleTime = '';
    this.priorityId = '';
    this.EventTypes = [];
    this.allPriorityValues = [];
    this.userList = [];
    this.groups = [];
    this.inputSubject = '';
    this.contentValue = '';
    this.enteredAdditionalRecipient = '';
  }

    onOrgChange(index) {
      this.orgName = this.organization[index].organizationname;
      this.grpSelectedCC = [];
      this.getRecordDiffType('i');
      this.getallnotificationvariables();
      this.getnotificationevents();
      this.getGroupData();
      this.getPriorityValue();
      this.getUser();
    }

    openVariablesHelpPopUp(){
      this.modalReference = this.modalService.open(this.varHelp, {size: 'md'});
    }

    getallnotificationvariables(){
      const Data = {
        "clientid": Number(this.clientId),
        "mstorgnhirarchyid":Number(this.orgSelected)
      };
      this.rest.getallnotificationvariables(Data).subscribe((res: any) => {
        if (res.success) {
          this.variablesList = res.details;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    closeModal2(){
      this.modalReference.close();
    }

    getnotificationevents() {
      const Data = {};
      this.rest.getnotificationevents(Data).subscribe((res: any) => {
        if (res.success) {
          //res.details.unshift({id: 0, eventname: 'Select Event Type'});
          this.EventTypes = res.details;
          //this.eventtypeid = 0;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    onEventChange(index: any){
       this.eventtypename = this.EventTypes[index].eventname;
    }

    onGrpDeSelect(index) {
      //console.log(this.grpSelectedCC);
    }

    onGroupChange2(index){
      this.grpName = index.supportgroupname;
      //this.onGrpChange2(this.groupsId);
    }

    getGroupData(){
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected)
      }
      this.rest.getgroupbyorgid(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.groups = this.respObject.details;
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, function (err) {

      });
    }

    onUserChange(index){
      this.userName = index.clienname;
      //console.log(this.userSelected);
    }


    getUser(){
      const data={
        clientid:Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected)
      }
      this.rest.getclientandorgwiseclientuser(data).subscribe((res: any) => {
        this.respObject = res;
        //this.respObject.details.values.unshift({id: 0, name: 'Select User'});
        if (this.respObject.success) {
          this.userList = this.respObject.details;
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    onChannelChange(Index: any) {
      this.channeldiffname = this.channelList[Index].name;
      this.inputSubject = "";
      this.contentValue = "";
      this.enteredAdditionalRecipient = "";
      this.triggerCondition = ""
      // if(Index === 0) {

      //   //this.reserveArr2 = [];
      //   this.grpSelectedCC = [];
      //   this.groupsId = [];
      // } else {
      //   this.textField = true;
      //     this.isTitle = false;
      //     this.istextarea = false;
      //     this.isemailarea = true;
      // }
    }

    getOrganization(){
      const data = {
        clientid: Number(this.clientId) ,
        mstorgnhirarchyid: Number(this.orgnId)
      };
      this.rest.getorganizationclientwisenew(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
          this.organization = this.respObject.details;
            //this.orgSelected = 0;
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    getRecordDiffType(type) {
      this.rest.getRecordDiffType().subscribe((res: any) => {
        if (res.success) {
          this.recordTypeStatus = res.details;
          if(type==='i'){
            this.fromRecordDiffTypeId = '';
          }
          else{
            for (let i = 0; i < this.recordTypeStatus.length; i++) {
              if (Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffTypeId)) {
                this.fromRecordDiffTypeId1 = this.recordTypeStatus[i].seqno;
                this.getPropertyValue(Number(this.fromRecordDiffTypeId1), type);
              }
            }
          }
        }
      });
    }

    getrecordbydifftype(index) {
      //console.log(index);
      if (index !== 0) {
        const seqNumber = this.recordTypeStatus[index-1].seqno;
        this.fromRecordDiffTypename = this.recordTypeStatus[index-1].typename
        //console.log(">>>>>",seqNumber,this.fromRecordDiffTypename)
        this.recordbydifftype(seqNumber);
        this.fromlevelid = 0;
        this.fromRecordDiffId = '';
        this.allPropertyValues = [];
      }
    }

    recordbydifftype(seqNumber) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        seqno: Number(seqNumber),
      };
      this.rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            res.details.unshift({id: 0, typename: 'Select Property Level', seqno: 0});
            this.fromPropLevels = res.details;
          } else {
            this.fromPropLevels = [];
            this.getPropertyValue(Number(seqNumber),'i');
          }
        } else {
          this.notifier.notify('error', res.message);

        }
      }, (err) => {
        console.log(err);
      });
    }

    onTicketTypeChange(index) {
      if (index !== 0) {
        this.fromRecordDiffName = this.allPropertyValues[index].typename;
      }
      this.getcategorylevel('i');
    }

    onPriorityTypeChange(index){
      if (index !== 0) {
        this.fromPriorityName = this.allPriorityValues[index].typename;
      }
    }

    getPriorityValue() {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        seqno: 4
      };
      this.rest.getrecordbydifftype(data).subscribe((res: any) => {
        if (res.success) {
          this.allPriorityValues = res.details;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    onLevelChange(index) {
      let seq;
      seq = this.fromPropLevels[index - 1].seqno;
      this.getPropertyValue(seq,'i');
      this.fromRecordDiffId = '';
    }

    getPropertyValue(seq,type) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        seqno: Number(seq)
      };
      this.rest.getrecordbydifftype(data).subscribe((res: any) => {
        if (res.success) {
          this.allPropertyValues = res.details;
          if(type=='i'){
            this.fromRecordDiffId = ''
          }
          else{

          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    getcategorylevel(type) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        // fromrecorddifftypeid:Number(this.fromRecordDiffTypeId),
        fromrecorddiffid:Number(this.fromRecordDiffId)
      };
      if (this.fromPropLevels.length > 0) {
        data['fromrecorddifftypeid'] = Number(this.fromlevelid);
      }else{
        data['fromrecorddifftypeid'] = Number(this.fromRecordDiffTypeId);
      }
      this.rest.getlabelbydiffid(data).subscribe((res: any) => {
        if (res.success) {
          res.details.unshift({id: 0, typename: 'Select Property Level'});
          this.categoryLevelList = res.details;
          if (type === 'i') {
            this.categoryLevelId = 0;
          } else {
            this.categoryLevelId = this.propertyLevel;
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
      });
    }



    save() {
      if(this.grpSelectedCC.length=== 0 || this.userSelected.length === 0){
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);

      }
      else {
        //console.log(this.ScheduleTime);
        const data = {
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
          recorddifftypeid: Number(this.fromRecordDiffTypeId),
          recorddiffid: Number(this.fromRecordDiffId),
          channeltype: Number(this.channeldiffid),
          emailsub: this.inputSubject,
          emailbody: this.contentValue,
          scheduledeventid: Number(this.eventtypeid),
          senduseridsarray: this.userSelected,
          triggerconditiondays: Number(this.triggerCondition),
          priorityseqno: Number(this.priorityId)
        };
        console.log('data===========' + JSON.stringify(data));
        if (!this.messageService.isBlankField(data)) {
          data['additionalrecipint'] = this.enteredAdditionalRecipient,
          data['sendgroupidsarray'] = this.grpSelectedCC,
          data['scheduledtime']= this.messageService.dateConverter(this.ScheduleTime, 5);
          this.rest.addmstschedulednotification(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              const id = this.respObject.details;
                // this.messageService.setRow({
                //   id: id,
                //   clientid: Number(this.clientSelected),
                //   clientname: this.clientSelectedName,
                //   mstorgnhirarchyname: this.orgName,
                //   termname: this.termName,
                //   termtypename: this.termTypeName,
                //   termvalue: this.termValue,
                //   termtypeid: this.termTypeSelected,

                // });


              this.totalData = this.totalData + 1;
              this.messageService.setTotalData(this.totalData);
              this.isError = false;
              this.reset();
              this.getTableData();
              this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
            } else {
              // this.isError = true;
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            // this.isError = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          // this.isError = true;
          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }
      }
    }

    update() {
      if(this.grpSelectedCC.length=== 0 || this.userSelected.length === 0){
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
      else {
        const data = {
          id: Number(this.selectedId),
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
          recorddifftypeid: Number(this.fromRecordDiffTypeId),
          recorddiffid: Number(this.fromRecordDiffId),
          channeltype: Number(this.channeldiffid),
          emailsub: this.inputSubject,
          emailbody: this.contentValue,
          scheduledeventid: Number(this.eventtypeid),
          senduseridsarray: this.userSelected,
          triggerconditiondays: Number(this.triggerCondition),
          priorityseqno: Number(this.priorityId)
        };
        console.log(JSON.stringify(data))
        if (!this.messageService.isBlankField(data)) {
          data['additionalrecipint'] = this.enteredAdditionalRecipient,
          data['sendgroupidsarray'] = this.grpSelectedCC,
          data['scheduledtime']= this.messageService.dateConverter(this.ScheduleTime, 5);
          this.rest.updatemstschedulednotification(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              this.isError = false;
              this.modalReference.close();
              this.messageService.sendAfterDelete(this.selectedId);
              this.dataLoaded = true;
              // this.messageService.setRow({
              //     id: this.selectedId,
              //     clientid: Number(this.clientId),
              //     mstorgnhirarchyid: Number(this.orgSelected),
              //     mstorgnhirarchyname: this.orgName,
              //     groupid :Number(this.grpSelected),
              //     groupname: this.grpName,
              //     roleid: Number(this.roleSelected),
              //     rolename: this.roleName
              // });
              this.getTableData();
              this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
            } else {
              this.isError = true;
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isError = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        }else {
          this.isError = true;
          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }
      }
    }



    getTableData() {
      this.getData({
        offset: this.messageService.offset, 
        limit: this.messageService.limit
      });
    }

    getData(paginationObj) {
      const offset = paginationObj.offset;
      const limit = paginationObj.limit;
      this.dataLoaded = false;
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgnId),
        offset: offset,
        limit: limit
      };
      this.rest.getmstschedulednotification(data).subscribe((res) => {
        this.respObject = res;
        //console.log(JSON.stringify(res));
        this.executeResponse(this.respObject, offset);
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    executeResponse(respObject, offset) {
      if (respObject.success) {
        this.dataLoaded = true;
        if (offset === 0) {
          this.totalData = respObject.details.total;
        }
        const data = respObject.details.values;
        this.messageService.setTotalData(this.totalData);
        this.messageService.setGridData(data);
      } else {
        this.notifier.notify('error', respObject.message);
      }
    }

    onPageSizeChange(value: any) {
      this.pageSize = value;
      this.getData({
        offset: this.messageService.offset, 
        limit: this.messageService.limit
      });
    }

    ngOnDestroy(): void {
      if (this.userAuth) {
        this.userAuth.unsubscribe();
      }
    }


}
