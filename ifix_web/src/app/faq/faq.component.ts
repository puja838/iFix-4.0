import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  displayed = true;
  moduleName: string;
  description: string;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  displayData: any;
  isError = false;
  errorMessage: string;
  pageSize: number;
  clientId: number;
  offset: number;
  dataLoaded: boolean;
  isLoading = false;
  moduleSelected: any;
  modules: any;
  des: string;
  totalPage: number;
  selectedId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  organizationId = '';
  organizationName = '';
  ticketTypeName = '';
  ticketType = '';
  formTicketTypeList = [];
  toTicketTypeList = [];
  organizationList = [];
  loginUserOrganizationId: number;
  seqNo = 1;
  recordDifTypeId: number;
  recordTypeStatus = [];
  fromRecordDiffTypeId = '';
  fromRecordDiffType = '';
  fromRecordDiffId = '';
  toRecordDiffTypeId = '';
  toRecordDiffTypeSeqno = '';
  toRecordDiffId = '';
  levels = [];
  levelSelected = [];
  levelSelected1 = 0;
  workinglevel = [];
  workId:number;
  workName:string;
  seq:any;
  recorddifftypename:string;
  recorddiffname:string;
  levelName:string;
  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  attachMsg: string;
  fileName=[];
  attachment = [];
  formData: any;
  sgOrganizationId:any;
  documentPath=[];
  documentName=[];
  orginalDocumentName=[];
  fromPropLevels =[];
  fromlevelid:any;
  grpArray = [];
  fileEdit: boolean
  grpName:any;
  groupsId = [];

  constructor(private _rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'change':
          // console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {
            if (confirm('Are you sure?')) {

            }
          }
          break;
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              console.log(JSON.stringify(item));
              this._rest.deletedocuments({id: item.id}).subscribe((res) => {
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
    this.messageService.getSelectedItemData().subscribe(selectedTitles => {
      if (selectedTitles.length > 0) {
        this.show = true;
        this.selected = selectedTitles.length;
      } else {
        this.show = false;
      }
    });
  }

  ngOnInit() {
    this.fileUploadUrl = this._rest.apiRoot + '/fileupload';
    this.totalPage = 0;
    this.dataLoaded = true;
    this.errorMessage = '';

    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain FAQ',
      openModalButton: 'FAQ Document',
      breadcrumb: '',
      folderName: '',
      tabName: 'FAQ Document'
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
          console.log(JSON.stringify(args.dataContext));
          this.isError = false;
          this.fileEdit = true
          this.formTicketTypeList = [];
          this.levelSelected1 = 0;
          this.resetValues()
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.sgOrganizationId = args.dataContext.mstorgnhirarchyid;

          this.fromRecordDiffType = args.dataContext.recorddifftypeid;
          this.fromRecordDiffId = args.dataContext.recorddiffid;
          this.levelName = args.dataContext.supportgroupname;
          this.levelSelected1 = Number(args.dataContext.supportgroupid);
          //console.log(this.levelSelected1)
          this.getLevelData("u");
          this.organizationName = args.dataContext.mstorgnhirarchyname;
          this.recorddifftypename = args.dataContext.recorddifftypename;
          this.recorddiffname = args.dataContext.recorddiffname;

          this.documentName =args.dataContext.documentname;
          this.documentPath = args.dataContext.documentpath;
          this.orginalDocumentName = args.dataContext.orginaldocumentname;
          this.fileName = this.orginalDocumentName;
          this.formData = {
            'clientid': this.clientId,
            'mstorgnhirarchyid':this.organizationId,
            // 'type': 'type'
            // 'user_id': this.messageService.getUserId()
          };
          for(let i = 0;i<this.recordTypeStatus.length ;i++){
            if(Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffType)){
                 this.seq = this.recordTypeStatus[i].seqno;
                 this.getrecord(this.seq);
            }
          }
          //console.log("oooo"+JSON.stringify(this.recordTypeStatus) + "..............." + this.fromRecordDiffType);
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      // {
      //   id: 'clientName', name: 'Client', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'recorddifftypename', name: 'Property Type ', field: 'recorddifferentiationtypename', sortable: true, filterable: true
      },
      {
        id: 'recorddiffname', name: 'Property Name ', field: 'recorddifferentiationname', sortable: true, filterable: true
      },
      // {
      //   id: 'recordlevelname', name: 'Record Level ', field: 'supportgroupname', sortable: true, filterable: true
      // },
      {
        id: 'Supportgroupname', name: 'Group Level', field: 'supportgroupname', sortable: true, filterable: true
      },
      {
        id: 'orginaldocumentname', name: 'Document Name', field: 'orginaldocumentname', sortable: true, filterable: true
      },
    ];

    this.clientId = this.messageService.clientId;
    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.loginUserOrganizationId = this.messageService.orgnId;
      this.edit =this.messageService.edit;
      this.del =this.messageService.del;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
          this.edit = auth[0].editFlag;
          this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.loginUserOrganizationId = auth[0].mstorgnhirarchyid;
        //console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // this.formData = {
    //   'clientId': this.clientId,
    //   'mstorgnhirarchyid':this.loginUserOrganizationId,
    //   'type': 'type'
    //   // 'user_id': this.messageService.getUserId()
    // };
    // this.getTableData();
    this.getorganizationclientwise();
    this.getRecordDiffType();

  }

  onOrgChange(index:any){
    //console.log("lll"+index + JSON.stringify(this.organizationList));

    this.organizationName = this.organizationList[index - 1].organizationname;
    this.formData = {
      'clientid': this.clientId,
      'mstorgnhirarchyid':this.organizationId,
      // 'type': 'type'
      // 'user_id': this.messageService.getUserId()
    };

  }

  ongrpChange(index: any) {
    this.grpName = index.supportgroupname;
    //this.groupsId.push(index.id);
    //console.log(this.levelSelected);
  }


  getLevelData(type){
    this._rest.getgroupbyorgid({clientid: this.clientId, mstorgnhirarchyid: Number(this.sgOrganizationId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.levels = this.respObject.details;
        this.selectAll(this.levels)
        if(type === 'i'){
          //this.levelSelected = [];

        }else{
           this.levelSelected.push(this.levelSelected1);
        }

      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onFileComplete(data: any) {
    //console.log('file data==========' + JSON.stringify(data));
    // this.logoName = data.changedName;
      if (data.success) {
        this.fileEdit = false
        //this.isMultiple = false
        this.attachment.push({originalName: data.fileName, fileName: data.changedName});
        if (this.attachment.length > 1) {
          this.attachMsg = this.attachment.length + ' files uploaded successfully';
        } else {
          this.attachMsg = this.attachment.length + ' file uploaded successfully';
        }
        this.documentName = data.details.filename;
        this.documentPath = data.details.path;
        this.orginalDocumentName = data.details.originalfile;

      }
  }

  onFileError(msg: string) {
    this.notifier.notify('error', msg);
  }
  // onLevelChange(index:any){
  //   this.levelName = this.levels[index-1].supportgroupname;
  // }
  openModal(content) {
      this.errorMessage = '';
      this.isError = false;
      this.resetValues();
      // this.notifier.notify('success', 'Module added successfully');
      this.modalService.open(content, {size: 'sm'}).result.then((result) => {
      }, (reason) => {

      });
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
      clientid: this.clientId,
      mstorgnhirarchyid: this.loginUserOrganizationId,
      offset: offset,
      limit: limit
    };
    //console.log(data);
    this._rest.getdocuments(data).subscribe((res) => {
      this.respObject = res;
      //console.log('>>>>>>>>>>> ', JSON.stringify(res));
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

  getRecordDiffType() {
    this._rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
      }
    });
  }

  resetValues() {
    this.organizationId = '';
    this.fromRecordDiffTypeId = '';
    this.fromRecordDiffId = '';
    this.toRecordDiffTypeId = '';
    this.toRecordDiffId = '';
    this.levelSelected = [] ;
    this.workName = '';
    this.fromRecordDiffType = '';
    this.levels = [];
    this.sgOrganizationId ='';
    this.attachMsg = '';
    this.fromPropLevels = [];
    this.fromlevelid = '';
    this.documentName = [];
    this.documentPath = [];
    this.orginalDocumentName = [];
    this.attachment =[];
    this.fileName = [];
    this.groupsId = [];
    this.grpName = '';
  }



  onSgOrgChange(index:any){
    this.getLevelData('i');

  }
  save() {
    // this.documentName = 'aaa';
    // this.documentPath ='aaaaaa';
    // this.orginalDocumentName = 'aaaa';

    if(this.levelSelected.length===0 || this.documentName.length === 0 ||this.documentPath.length === 0 || this.orginalDocumentName.length === 0){
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      //console.log(this.levelSelected,this.documentName,this.documentPath,this.orginalDocumentName);
    }
    else{
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      // recorddifftypeid:Number(this.fromRecordDiffType),
      recorddiffid:Number(this.fromRecordDiffId),
      groupid:this.levelSelected,
      documentname:this.documentName,
      documentpath:this.documentPath,
      orginaldocumentname:this.orginalDocumentName

    };


    if(this.fromlevelid !== ''){
      data['recorddifftypeid'] = Number(this.fromlevelid);
     }else{
       data['recorddifftypeid'] = Number(this.fromRecordDiffType);
     }

    //console.log(",,,,,,,,,,"+JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {

      this._rest.adddocuments(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.getTableData();
          this.resetValues();
          // this.getTableData();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
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
  }

  update() {

    // this.documentName = 'bb';
    // this.documentPath ='bb';
    // this.orginalDocumentName = 'bbbbb';
    if(this.levelSelected.length===0 || this.documentName.length === 0 ||this.documentPath.length === 0 || this.orginalDocumentName.length === 0){
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      //console.log(this.levelSelected,this.documentName,this.documentPath,this.orginalDocumentName);
    }

    // for(let i=0;i<this.levelSelected.length;i++){
    //   this.grpArray.push(this.levelSelected[i])
    // }
    else{
    this.levelSelected.push(this.levelSelected1)  
    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      recorddifftypeid:Number(this.fromRecordDiffType),
      recorddiffid:Number(this.fromRecordDiffId),
      groupid: this.levelSelected,
      documentname:this.documentName,
      documentpath:this.documentPath,
      orginaldocumentname:this.orginalDocumentName

    };
    // return false;



    //console.log('>>>>>>>>>>>>> ', JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this._rest.updatedocuments(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {

          this.isError = false;
          // this.messageService.sendAfterDelete(this.selectedId);
          // this.dataLoaded = true;
          // this.messageService.setRow({
          //   id: this.selectedId,
          //   mstorgnhirarchyname: this.organizationName,
          //   recorddifftypename:this.recorddifftypename,
          //   recorddiffname:this.recorddiffname,
          //   recordlevelname:this.workName,
          //   Supportgroupname:this.levelName

          // });

          this.getTableData();

          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
        } else {
          this.notifier.notify('error', this.respObject.message);
          //console.log("Error M",this.respObject.message)
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
        //console.log("Error M2",this.messageService.SERVER_ERROR)
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);

    }
  }
  }

  getrecordbydifftype(index) {
    this.recorddifftypename = this.recordTypeStatus[index - 1].typename;
    if (index !== 0) {
      this.fromPropLevels = [];
      this.formTicketTypeList = [];
      this.fromRecordDiffId ='' ;
      const seqNumber = this.recordTypeStatus[index - 1].seqno;

      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber),
      };
      this._rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {


              this.fromPropLevels = res.details;
              // this.fromlevelid = 0;

          } else {

              this.fromPropLevels = [];
              this.fromlevelid = '';
            this.getrecord(Number(seqNumber));
          }
        } else {
          //this.isError = true;
          //this.errorMessage = res.message;
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });

      // if (flag === 'from') {
      //   this.fromRecordDiffTypeId = this.recordTypeStatus[index - 1].id;
      //   seqNumber = this.fromRecordDiffTypeSeqno;
      // } else {
      //   this.toRecordDiffTypeId = this.recordTypeStatus[index - 1].id;
      //   seqNumber = this.toRecordDiffTypeSeqno;
      // }
      // this.getrecord(seqNumber);
      // const data = {
      //   clientid: this.clientId,
      //   mstorgnhirarchyid: Number(this.organizationId),
      //   seqno: Number(seqNumber)
      // };
      // this._rest.getrecordbydifftype(data).subscribe((res: any) => {
      //   if (res.success) {
      //       this.formTicketTypeList = res.details;

      //   } else {
      //     this.notifier.notify('error', res.message);
      //   }
      // }, (err) => {
      //   console.log(err);
      // });
    }
  }


  onLevelChange(selectedIndex: any) {
    let seq;
    seq = this.fromPropLevels[selectedIndex -1].seqno;
    this.getrecord(seq);
  }



  getrecord(seqNumber){
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber)
    };
    this._rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
          this.formTicketTypeList = res.details;
          //console.log(".............."+JSON.stringify(this.formTicketTypeList));

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      //console.log(err);
    });
  }



  onPropertyChange(index:any){
    this.recorddiffname = this.formTicketTypeList[index -1].typename;
    const data = {"clientid":Number(this.clientId),
            "mstorgnhirarchyid":Number(this.organizationId),
            "recorddifftypeid":Number(this.fromRecordDiffType),
            "recorddiffid":Number(this.fromRecordDiffId)}
    this._rest.getworkinglevel(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.workinglevel = this.respObject.details.values;
        if(this.workinglevel.length > 0){
          this.workId = this.workinglevel[0].mstworkdifferentiationid;
          this.workName = this.workinglevel[0].levelname ;
        }else{
          this.workId = 0;
          this.workName = '' ;
        }


      } else {
        this.notifier.notify('error', this.respObject.message);

      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getorganizationclientwise() {
    const data = {
      clientid: Number(this.clientId) ,
      mstorgnhirarchyid: Number(this.loginUserOrganizationId)
    };
    this._rest.getorganizationclientwisenew(data).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      //console.log(err);
    });
  }

  selectAll(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };
    allSelect(items);
  }
}
