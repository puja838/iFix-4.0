import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {ConfigService} from '../config.service';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

declare function createNode(name, x, y, image, type, id): void;

declare function getXml(): void;

declare function clearGraph(): void;

declare function initialize(): void;

declare function deleteNode_2(data): void;

declare function mapXmldata(xml): void;

declare function deleteLastCell(): void;

declare function parseXmlJSON(): void;

declare function confirmRemoveConnector(graph, selectedCell): void;

declare function connectionNotValid(graph): void;

@Component({
  selector: 'app-workflow-builder',
  templateUrl: './workflow-builder.component.html',
  styleUrls: ['./workflow-builder.component.css']
})
export class WorkflowBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  activity: any;
  tabIndex = 0;
  customHandler: any;
  customHandler1: any;
  deleteCustomHandler: any;
  onConnectorHandler: any;
  onRemoveConnectorHandler: any;
  workflowsData = [{
    workflowId: 1,
    workflowName: 'Change Request-Emergency'
  }];
  @ViewChild('processDefineModal') processDefineModal;
  workflowId = '';
  addedNode = [];
  workflowJson = [];
  ticketType = '';
  categoryName = '';
  organaisation = [];
  orgSelected: number;
  clientId: number;
  private baseFlag: any;
  orgnId: number;
  adminAuth: Subscription;
  respObject: any;
  processes = [];
  processId = [];
  stateList = [];
  selectedStateId = '';
  supportGroupList = [];
  supportGroupId = 0;
  userList = [];
  userId: number;
  searchUser: FormControl = new FormControl();
  isLoading = false;
  loginname = '';
  recordTypeStatus = [];
  fromRecordDiffType = '';
  fromPropLevels = [];
  recorddifftypename = [];
  formTicketTypeList = [];
  fromRecordDiffId = '';
  fromlevelid = '';
  isError = false;
  errorMessage = '';
  recorddiffname = '';
  onDeleteNodeRequestHandler: any;
  onRemoveConnectorClickHandler: any;
  selectedCellInfo: any;
  groupType: any;
  isCreator: boolean;
  userType: any;
  isSelfAssign: boolean;
  stateDetailsSave = [];
  graph: any;
  stateWiseUserList = [];
  supportGroupName = '';
  activities = [];
  isSender: boolean;
  isSenderGroup: boolean;
  typeSelected: number;
  types = [{id: 0, name: 'Select type'}, {id: 1, name: 'Process'}, {id: 6, name: 'Template'}];
  isManager: boolean;
  processName: any;
  processesId = 0;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService, private config: ConfigService) {
  }

  ngOnInit(): void {
    this.typeSelected = 0;
    this.customHandler = this.customEventHandler.bind(this);
    document.addEventListener('customClick', this.customHandler);

    this.customHandler1 = this.customEventHandler1.bind(this);
    document.addEventListener('createNode', this.customHandler1);

    this.deleteCustomHandler = this.deleteCustomEventHandler.bind(this);
    document.addEventListener('deleteNode', this.deleteCustomHandler);

    this.onConnectorHandler = this.onConnectNode.bind(this);
    document.addEventListener('onConnectNode', this.onConnectorHandler);

    this.onRemoveConnectorClickHandler = this.onRemoveConnectorClick.bind(this);
    document.addEventListener('onRemoveConnectorClick', this.onRemoveConnectorClickHandler);
    this.onRemoveConnectorHandler = this.onRemoveConnector.bind(this);
    document.addEventListener('onRemoveConnector', this.onRemoveConnectorHandler);
    this.onDeleteNodeRequestHandler = this.onDeleteNodeRequest.bind(this);
    document.addEventListener('deleteNodeRequest', this.onDeleteNodeRequestHandler);



    // setTimeout(() => {
    //   initialize();
    //   createNode('Start', 2, 20);
    //   // createNode('End', 800, 400);
    // }, 1000);
    /*
    * For get client and organization id of login user
    */
    console.log('init', this.messageService.clientId);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      // this.client = this.messageService.clientname;
      // if (this.baseFlag) {
      //   this.edit = true;
      //   this.del = true;
      // } else {
      //   this.edit = this.messageService.edit;
      //   this.del = this.messageService.del;
      // }
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(details => {
        if (details.length > 0) {
          this.clientId = details[0].clientid;
          this.baseFlag = details[0].baseFlag;
          // this.client = details[0].clientname;
          this.orgnId = details[0].mstorgnhirarchyid;
          // if (this.baseFlag) {
          //   this.edit = true;
          //   this.del = true;
          // } else {
          //   this.del = details[0].deleteFlag;
          //   this.edit = details[0].editFlag;
          // }
          this.onPageLoad();
        }
      });
    }
  }

  onDeleteNodeRequest(data) {
    // console.log(JSON.stringify(this.workflowJson));
    this.selectedCellInfo = data.detail.cell;
    if (window.confirm('Do you really want to delete it?')) {
      let inState = [];
      let outState = [];
      let position = -1;
      for (const [index, obj] of this.workflowJson.entries()) {
        if (obj.node === data.detail.id) {
          inState = JSON.parse(JSON.stringify(obj.inState));
          outState = JSON.parse(JSON.stringify(obj.outState));
          position = index;
          break;
        }
      }
      if (inState.length === 0 && outState.length === 0) {
        deleteNode_2(this.selectedCellInfo);
        this.workflowJson.splice(position, 1);
      } else {
        const reqData = {
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
          processid: Number(this.processId),
          transitionids: inState.concat(outState)
        };
        // console.log('after delete ', reqData);
        this.deleteState(reqData).then((success) => {
          // this.rest.deletetransitionstate(reqData).subscribe((res: any) => {
          if (success) {
            deleteNode_2(this.selectedCellInfo);
            this.workflowJson.splice(position, 1);
            this.clearInOutState(inState, outState);
            this.clearSourceTarget(data.detail.id);
            this.addedNode.splice(this.addedNode.indexOf(data.detail.id), 1);
            this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
            this.executeWorkflow(1);
            console.log(JSON.stringify(this.workflowJson));
          } else {

          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    }
  }

  deleteState(data) {
    const promise = new Promise((resolve, reject) => {
      if (Number(this.typeSelected) === 1) {
        this.rest.deletetransitionstate(data).subscribe((res: any) => {
          if (res.success) {
            resolve(true);
          } else {
            resolve(false);
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          reject();
        });
      } else if (Number(this.typeSelected) === 6) {
        this.rest.deletetemplatetransitionstate(data).subscribe((res: any) => {
          if (res.success) {
            resolve(true);
          } else {
            resolve(false);
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          reject();
        });
      }
    });
    return promise;
  }

  clearInOutState(inState, outState) {
    for (const state of inState) {
      for (const wData of this.workflowJson) {
        if (wData.outState.indexOf(state) > -1) {
          wData.outState.splice(wData.outState.indexOf(state), 1);
        }
      }
    }
    for (const state of outState) {
      for (const wData of this.workflowJson) {
        if (wData.inState.indexOf(state) > -1) {
          wData.inState.splice(wData.inState.indexOf(state), 1);
        }
      }
    }
  }

  clearSourceTarget(node) {
    for (const wData of this.workflowJson) {
      if (wData.source.indexOf(node) > -1) {
        wData.source.splice(wData.source.indexOf(node), 1);
      }
      if (wData.targets.indexOf(node) > -1) {
        wData.targets.splice(wData.targets.indexOf(node), 1);
      }
    }
  }

  findCommonElements3(array1, array2) {
    const common = [];
    for (var i = 0; i < array1.length; i++) {
      for (var j = 0; j < array2.length; j++) {
        if (array1[i] === array2[j]) {
          common.push(array1[i]);
        }
      }
    }
    return common;
  }

  onRemoveConnectorClick(data) {
    console.log(data.detail);
    let sourceOutState = [];
    let targetInState = [];
    this.selectedCellInfo = data.detail.selectedCell;
    this.graph = data.detail.graph;
    for (const obj of this.workflowJson) {
      if (obj.node === data.detail.source) {
        sourceOutState = obj.outState;
      }
      if (obj.node === data.detail.target) {
        targetInState = obj.inState;
      }
    }
    const commonState = this.findCommonElements3(sourceOutState, targetInState);
    // console.log('sourceOutState >>>> ', sourceOutState);
    // console.log('targetInState >>>> ', targetInState);
    // console.log('common >>>> ', this.findCommonElements3(sourceOutState, targetInState));
    if (window.confirm('Do you really want to delete it?')) {
      const reqData = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        processid: Number(this.processId),
        transitionids: commonState
      };
      // console.log('after delete ', reqData);
      this.deleteState(reqData).then((success) => {
        // this.rest.deletetransitionstate(reqData).subscribe((res: any) => {
        if (success) {
          confirmRemoveConnector(this.graph, this.selectedCellInfo);
          for (const obj of this.workflowJson) {
            if (obj.node === data.detail.source) {
              if (obj.targets.indexOf(data.detail.target) > -1) {
                obj.targets.splice(obj.targets.indexOf(data.detail.target), 1);
              }
              for (const state of commonState) {
                if (obj.outState.indexOf(state) > -1) {
                  obj.outState.splice(obj.outState.indexOf(state), 1);
                }
              }
            }
            if (obj.node === data.detail.target) {
              if (obj.source.indexOf(data.detail.source) > -1) {
                obj.source.splice(obj.source.indexOf(data.detail.source), 1);
              }
              for (const state of commonState) {
                if (obj.inState.indexOf(state) > -1) {
                  obj.inState.splice(obj.inState.indexOf(state), 1);
                }
              }
            }
          }
          this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
          this.executeWorkflow(1);
          // console.log('workflow json >>>>>>>>>> ', this.workflowJson);
        } else {
          // this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  ngAfterViewInit() {
  }

  initializeStateList() {
    setTimeout(() => {
      const toggler = document.getElementsByClassName('caret');
      for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener('click', function() {
          this.parentElement.querySelector('.nested').classList.toggle('active');
          this.classList.toggle('caret-down');
        });
      }
      initialize();
      this.workflowJson = [];
      this.addedNode = [];
      this.getprocessdetails();
      createNode('Start', 2, 20, null, null, -1);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
    this.destroyEvent();
  }

  destroyEvent() {
    document.removeEventListener('customClick', this.customHandler);
    document.removeEventListener('createNode', this.customHandler1);
    document.removeEventListener('deleteNode', this.deleteCustomHandler);
    document.removeEventListener('onConnectNode', this.onConnectorHandler);
    document.removeEventListener('onRemoveConnector', this.onRemoveConnectorHandler);
    document.removeEventListener('onRemoveConnectorClick', this.onRemoveConnectorClickHandler);
  }

  onPageLoad() {
    // console.log('>>>>>>>>>>>>>>>');
    this.getOrganizationList();
    this.activities = [];
  }

  getOrganizationList() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        this.orgSelected = 0;
      }
    }, (err) => {

    });
  }

  onPropertyChange(index: any) {
    this.recorddiffname = this.formTicketTypeList[index - 1].typename;
  }

  onOrgChange(position) {
    console.log('ORG', this.orgSelected);
    clearGraph();
    this.getUtility();
  }

  getUtility() {
    if (this.typeSelected > 0) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        type: Number(this.typeSelected)
      };
      this.rest.getworklowutilitylist(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          // this.respObject.details.unshift({id: 0, name: 'Select Process'});
          this.processes = this.respObject.details;
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  onProcessChange(position) {
    this.processName = position.name;
  }

  getprocessdetails() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      processid: Number(this.processId)
    };
    if (Number(this.typeSelected) === 1) {
      this.rest.getprocessdetails(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            mapXmldata(res.details[0].details);
            this.workflowJson = JSON.parse(res.details[0].detailsjson);
            for (const obj of this.workflowJson) {
              this.addedNode.push(obj.node);
            }
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else if (Number(this.typeSelected) === 6) {
      this.rest.getprocesstemplatedetails(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            mapXmldata(res.details[0].details);
            this.workflowJson = JSON.parse(res.details[0].detailsjson);
            for (const obj of this.workflowJson) {
              this.addedNode.push(obj.node);
            }
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  customEventHandler(data) {
    // console.log('>>>>>>>>>>> ', data.detail);
    this.openCustomModal(data.detail);
  }

  customEventHandler1(data) {
    // console.log(data.detail.elemId)
    // console.log(this.addedNode)
    // console.log(typeof data.detail.elemId.replace('state_', ''));
    // console.log(this.addedNode.includes(Number(data.detail.elemId.replace('state_', ''))));
    if (!this.addedNode.includes(data.detail.elemId)) {
      this.addedNode.push(data.detail.elemId);
      this.workflowJson.push({
        source: [],
        node: data.detail.elemId,
        targets: [],
        isSave: false,
        inState: [],
        outState: []
      });
    } else {
      setTimeout(() => {
        deleteLastCell();
      }, 100);
      this.notifier.notify('error', this.messageService.DUPLICATE_NODE);
    }
  }

  deleteCustomEventHandler(data) {
    console.log('deleteCustomEventHandler');
    // console.log(data.detail);

  }

  onConnectNode(data) {
// console.log('>>>>>>>>>>>>>>> ', data.detail.graph);
    this.graph = data.detail.graph;
    let instateData = [];
    let previnstateData = [];
    const currentState = data.detail.target.id;
    const previousState = data.detail.source.id;
    // console.log('>>>>>>>> ', data.detail);
    for (const obj of this.workflowJson) {
      // console.log(obj.node + ' === ' + currentState);
      if (obj.node === currentState) {
        // console.log('get in');
        obj.source.push(previousState + '');
        instateData = JSON.parse(JSON.stringify(obj.inState));
      }
      if (obj.node === previousState) {
        previnstateData = JSON.parse(JSON.stringify(obj.inState));
      }
    }
    // console.log('>>>>>>>>>>>>>> ', this.workflowJson);
    const reqData = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      processid: Number(this.processId),
      currentstateid: Number(currentState.split('_')[0]),
      previousstateid: Number(previousState.toString().split('_')[0]),
      transitionids: instateData,
      pretransitionids: previnstateData
    };
    // console.log('on connect >>> ', reqData);
    if (Number(this.typeSelected) === 1) {
      this.rest.createtransition(reqData).subscribe((res: any) => {
        if (res.success) {
          // console.log('response >>>>>>>>>> ', res);
          const transactionId = res.details;
          for (const obj of this.workflowJson) {
            if (obj.node === currentState) {
              obj.inState.push(transactionId);
            }
            if (obj.node === previousState) {
              obj.outState.push(transactionId);
            }
          }
          // console.log(this.workflowJson);
          this.executeWorkflow(1);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.rest.createprocesstemplatetransition(reqData).subscribe((res: any) => {
        if (res.success) {
          // console.log('response >>>>>>>>>> ', res);
          const transactionId = res.details;
          for (const obj of this.workflowJson) {
            if (obj.node === currentState) {
              obj.inState.push(transactionId);
            }
            if (obj.node === previousState) {
              obj.outState.push(transactionId);
            }
          }
          // console.log(this.workflowJson);
          this.executeWorkflow(1);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  onRemoveConnector(data) {
    // console.log('>>>>>>>>>>>>>>> ', data.detail);
    console.log('>>>>>>>>>>>>> ', this.workflowJson);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  openCustomModal(data) {
    this.selectedStateId = data.id;
    // console.log('this.selectedStateId >> ', this.selectedStateId);
    let flag = 0;
    for (const obj of this.workflowJson) {
      if (obj.node === this.selectedStateId) {
        if (obj.source.length === 0) {
          flag = 1;
          break;
        }
      }
    }
    if (flag === 1) {
      this.notifier.notify('error', this.messageService.EMPTY_CONNECTION);
    } else {
      this.groupType = '1';
      this.isCreator = true;
      this.supportGroupId = 0;
      this.userId = 0;
      this.isSelfAssign = false;
      this.isSender = false;
      this.isSenderGroup = false;
      this.isManager = false;
      this.loginname = '';
      this.supportGroupName = '';
      this.stateWiseUserList = [];
      // for (let i = 0; i < this.activities.length; i++) {
      //   this.activities[i].checked = false;
      // }
      this.modalService.open(this.processDefineModal, {centered: true, size: 'lg'});
      this.getSupportGroupData();
      this.getUserListBySupportGroup();
      this.gettransitionstatedetails();
    }
  }

  addUserList() {
    if (Number(this.supportGroupId) !== 0 && this.supportGroupName !== '') {
      this.stateWiseUserList.push({
        mstgroupid: Number(this.supportGroupId),
        mstuserid: Number(this.userId),
        loginname: this.loginname,
        groupname: this.supportGroupName
      });
      this.supportGroupId = 0;
      this.userId = 0;
      this.loginname = '';
      this.supportGroupName = '';
    }
  }

  removeUserList(i) {
    if (this.stateWiseUserList.length > 1) {
      if (this.stateWiseUserList[i].mstgroupid === 0 && this.stateWiseUserList[i].mstuserid === 0) {
        this.isSelfAssign = false;
      } else if (this.stateWiseUserList[i].mstgroupid === 0 && this.stateWiseUserList[i].mstuserid === -2) {
        this.isSender = false;
      } else if (this.stateWiseUserList[i].mstgroupid === 0 && this.stateWiseUserList[i].mstuserid === -3) {
        this.isSenderGroup = false;
      } else if (this.stateWiseUserList[i].mstgroupid === 0 && this.stateWiseUserList[i].mstuserid === -4) {
        this.isManager = false;
      }
      this.stateWiseUserList.splice(i, 1);
    } else {
      this.notifier.notify('error', this.messageService.MINIMUM_USER);
    }
  }


  gettransitionstatedetails() {
    let trnId = [];
    for (const obj of this.workflowJson) {
      if (obj.node === this.selectedStateId) {
        trnId = obj.inState;
      }
    }
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      // currentstateid: Number(this.selectedStateId)
      transitionids: trnId
    };
    this.getTranstionDetails(data).then((res: any) => {
      // this.rest.gettransitionstatedetails(data).subscribe((res: any) => {
      if (res.success) {
        const groups = res.details.groups;
        /*const activityids = res.details.activityids;
        if (activityids !== null) {
          for (let i = 0; i < this.activities.length; i++) {
            for (let j = 0; j < activityids.length; j++) {
              if (this.activities[i].id === activityids[j]) {
                this.activities[i].checked = true;
                break;
              }
            }
          }
        }*/
        if (groups.length > 0) {
          this.stateWiseUserList = [];

          for (const obj of groups) {
            if (obj.mstgroupid === 0 && obj.mstuserid === 0) {
              this.stateWiseUserList.push({
                mstgroupid: obj.mstgroupid,
                mstuserid: obj.mstuserid,
                loginname: 'Self Assign',
                groupname: 'Self Assign'
              });
              this.isSelfAssign = true;
            } else if (obj.mstgroupid === 0 && obj.mstuserid === -2) {
              this.stateWiseUserList.push({
                mstgroupid: obj.mstgroupid,
                mstuserid: obj.mstuserid,
                loginname: 'Back to sender (User)',
                groupname: 'Back to sender (User)'
              });
              this.isSender = true;
            } else if (obj.mstgroupid === 0 && obj.mstuserid === -3) {
              this.stateWiseUserList.push({
                mstgroupid: obj.mstgroupid,
                mstuserid: obj.mstuserid,
                loginname: 'Back to sender (Group)',
                groupname: 'Back to sender (Group)'
              });
              this.isSenderGroup = true;
            } else if (obj.mstgroupid === 0 && obj.mstuserid === -4) {
              this.stateWiseUserList.push({
                mstgroupid: obj.mstgroupid,
                mstuserid: obj.mstuserid,
                loginname: 'Send to Manager',
                groupname: 'Send to Manager'
              });
              this.isManager = true;
            } else {
              this.stateWiseUserList.push({
                mstgroupid: obj.mstgroupid,
                mstuserid: obj.mstuserid,
                loginname: obj.loginname,
                groupname: obj.groupname
              });
            }
          }
          if (groups[0].mstgroupid === 0 && groups[0].mstuserid === -1) {
            this.groupType = '1';
            this.isCreator = true;
          } /*else if (res.details[0].mstgroupid === 0 && res.details[0].mstuserid === 0) {
            this.groupType = '3';
            this.isCreator = true;
          }*/ else {
            this.groupType = '2';
            this.isCreator = false;
          }
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getTranstionDetails(data) {
    const promise = new Promise((resolve, reject) => {
      if (Number(this.typeSelected) === 1) {
        this.rest.gettransitionstatedetails(data).subscribe((res: any) => {
          resolve(res);
        }, (err) => {
          reject();
        });
      } else if (Number(this.typeSelected) === 6) {
        this.rest.gettemplatetransitionstatedetails(data).subscribe((res: any) => {
          resolve(res);
        }, (err) => {
          reject();
        });
      }
    });
    return promise;
  }

  getSupportGroupData() {
    // this.rest.getgroupbyorgid({
    this.rest.getprocessgroupbyorgid({
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected)
    }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.supportGroupList = this.respObject.details;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getActivity() {
    this.rest.getactivitywithtype({
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      processid: Number(this.processId)
    }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.activities = this.respObject.details;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getUserListBySupportGroup() {
    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
          groupid: Number(this.supportGroupId)
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchuserbygroupid(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.userList = this.respObject.details;
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.userId = 0;
          this.userList = [];
        }
      });
  }

  getUserDetails() {
    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].loginname === this.loginname) {
        this.userId = this.userList[i].id;
      }
    }
  }

  saveStateDefination() {
    // console.log('322 >> ', JSON.stringify(this.workflowJson));
    let flag = 0;
    let position = 0;
    let trnId = [];
    for (const [i, obj] of this.workflowJson.entries()) {
      if (obj.node === this.selectedStateId) {
        if (obj.source.length === 0) {
          flag = 1;
          break;
        } else {
          position = i;
          trnId = obj.inState;
          break;
        }
      }
    }
    if (flag === 0) {
      // const activity = [];
      // for (let i = 0; i < this.selectedActivities.length; i++) {
      //   activity.push(this.selectedActivities[i].id);
      // }
      // console.log(this.selectedActivities)
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        processid: Number(this.processId),
        recorddifftypeid: Number(this.fromRecordDiffType),
        recorddiffid: Number(this.fromRecordDiffId),
        transitionids: trnId,
        // activities: activity
      };
      let hasGroup = true;
      const userList = [];
      if (Number(this.groupType) === 1) {
        data['users'] = [{
          mstgroupid: 0,
          mstuserid: -1
        }];
      } else {
        if (this.stateWiseUserList.length === 0) {
          hasGroup = false;
        } else {
          for (const obj of this.stateWiseUserList) {
            userList.push({
              mstgroupid: Number(obj.mstgroupid),
              mstuserid: obj.mstuserid
            });
          }
          data['users'] = userList;
        }
      }
      // console.log('state save data >> ', JSON.stringify(data));
      if (hasGroup) {
        console.log('state save data >> ', JSON.stringify(data));
        this.upsertStateDetails(data).then((success) => {
          // this.rest.upserttransitiondetails(data).subscribe((res: any) => {
          if (success) {
            this.workflowJson[position].isSave = true;
            this.modalService.dismissAll();
            this.executeWorkflow(1);
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            // this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.messageService.BLANK_GROUP);
      }
    }
  }

  upsertStateDetails(data) {
    const promise = new Promise((resolve, reject) => {
      if (Number(this.typeSelected) === 1) {
        this.rest.upserttransitiondetails(data).subscribe((res: any) => {
          if (res.success) {
            resolve(true);
          } else {
            resolve(false);
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          reject();
        });
      } else if (Number(this.typeSelected) === 6) {
        this.rest.upserttemplatetransitiondetails(data).subscribe((res: any) => {
          if (res.success) {
            resolve(true);
          } else {
            resolve(false);
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          reject();
        });
      }
    });
    return promise;
  }

  executeWorkflow(f = 0) {
    // console.log('on save ', this.workflowJson);
    if (this.processId.length === 0) {
      this.notifier.notify('error', this.messageService.NO_PROCESS);
      return false;
    }
    // this.workflowJson.pop();
    if (f === 0) {
      let flag = 0;
      for (const obj of this.workflowJson) {
        if (obj.isSave === false) {
          flag = 1;
        }
        if (obj.inState.length === 0) {
          flag = 2;
        }
      }
      if (flag === 1) {
        this.notifier.notify('error', this.messageService.PROCESS_DTL_NOT_SAVE);
        return false;
      }
      if (flag === 2) {
        this.notifier.notify('error', this.messageService.EMPTY_CONNECTION);
        return false;
      }
    }
    const totalXML = getXml();
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      processid: Number(this.processId),
      details: totalXML,
      detailsjson: JSON.stringify(this.workflowJson),
      iscomplete: f === 0 ? 1 : 0
    };
    // console.log('state save data >> ', data);
    if (Number(this.typeSelected) === 1) {
      this.rest.insertprocess(data).subscribe((res: any) => {
        if (res.success) {
          if (f === 0) {
            this.notifier.notify('success', this.messageService.WORKFLOW_ACTIVATE);
          }
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else if (Number(this.typeSelected) === 6) {
      this.rest.insertprocesstemplate(data).subscribe((res: any) => {
        if (res.success) {
          if (f === 0) {
            this.notifier.notify('success', this.messageService.WORKFLOW_ACTIVATE);
          }
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  getJson() {
    console.log(parseXmlJSON());
  }

  onRadioButtonChange(selectedValue) {
    if (Number(selectedValue) === 2) {
      this.isCreator = false;
    } else {
      this.isCreator = true;
    }
  }


  onGroupChange(selectedIndex: any) {
    this.supportGroupName = this.supportGroupList[selectedIndex - 1].supportgroupname;
    // const gid = this.supportGroupList[selectedIndex].id;
    // // if(gid===this.supportGroupId){
    // //   this.
    // // }
    // this.userId = 0;
    // this.loginname = '';
  }

  onAssignChange() {
    if (this.isSelfAssign) {
      if (this.isSender) {
        this.isSender = false;
        this.stateWiseUserList.shift();
      } else if (this.isSenderGroup) {
        this.isSenderGroup = false;
        this.stateWiseUserList.shift();
      } else if (this.isManager) {
        this.isManager = false;
        this.stateWiseUserList.shift();
      }
      this.stateWiseUserList.unshift({
        mstgroupid: 0,
        mstuserid: 0,
        loginname: 'Self Assign',
        groupname: 'Self Assign'
      });

    } else {
      this.stateWiseUserList.shift();
    }
  }

  onSenderChange() {
    if (this.isSender) {
      if (this.isSelfAssign) {
        this.isSelfAssign = false;
        this.stateWiseUserList.shift();
      } else if (this.isSenderGroup) {
        this.isSenderGroup = false;
        this.stateWiseUserList.shift();
      } else if (this.isManager) {
        this.isManager = false;
        this.stateWiseUserList.shift();
      }
      this.stateWiseUserList.unshift({
        mstgroupid: 0,
        mstuserid: -2,
        loginname: 'Back to sender (User)',
        groupname: 'Back to sender (User)'
      });
    } else {
      this.stateWiseUserList.shift();
    }
  }

  get selectedActivities() {
    return this.activities
      .filter(opt => opt.checked)
      .map(opt => opt);
  }

  submit() {
    if (this.processId.length !== 0 && Number(this.orgSelected) !== 0) {
      clearGraph();
      this.activities = [];
      this.getActivity();
      this.stateList = [];
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        processid: Number(this.processId)
      };
      console.log(data)
      if (Number(this.typeSelected) === 1) {
        this.rest.getstatebyprocess(data).subscribe((res: any) => {
          if (res.success) {
            this.fromRecordDiffType = res.details.recorddifftypeid;
            this.fromRecordDiffId = res.details.recorddiffid;
            this.stateList = res.details.states;
            this.initializeStateList();

          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else if (Number(this.typeSelected) === 6) {
        this.rest.getstatebyprocesstemplate(data).subscribe((res: any) => {
          if (res.success) {
            // this.fromRecordDiffType = res.details.recorddifftypeid;
            // this.fromRecordDiffId = res.details.recorddiffid;
            this.stateList = res.details.states;
            this.initializeStateList();

          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    }
  }

  clearProcess() {

    const data = {
      processid: Number(this.processId)
    };
    if (Number(this.typeSelected) === 1) {
      this.rest.deleteprocessdetails(data).subscribe((res: any) => {
        if (res.success) {
          clearGraph();
          this.submit();
          this.notifier.notify('success', this.messageService.PROCESS_CLEAR);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else if (Number(this.typeSelected) === 6) {
      this.rest.deleteprocesstemplatedetails(data).subscribe((res: any) => {
        if (res.success) {
          clearGraph();
          this.submit();
          this.notifier.notify('success', this.messageService.PROCESS_CLEAR);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  onSenderGroupChange() {
    if (this.isSenderGroup) {
      if (this.isSelfAssign) {
        this.isSelfAssign = false;
        this.stateWiseUserList.shift();
      } else if (this.isSender) {
        this.isSender = false;
        this.stateWiseUserList.shift();
      } else if (this.isManager) {
        this.isManager = false;
        this.stateWiseUserList.shift();
      }
      this.stateWiseUserList.unshift({
        mstgroupid: 0,
        mstuserid: -3,
        loginname: 'Back to sender (Group)',
        groupname: 'Back to sender (Group)'
      });
    } else {
      this.stateWiseUserList.shift();
    }
  }

  ontypechange() {
    this.getUtility();
  }

  onManagerChange() {
    if (this.isManager) {
      if (this.isSelfAssign) {
        this.isSelfAssign = false;
        this.stateWiseUserList.shift();
      } else if (this.isSender) {
        this.isSender = false;
        this.stateWiseUserList.shift();
      } else if (this.isSenderGroup) {
        this.isSenderGroup = false;
        this.stateWiseUserList.shift();
      }
      this.stateWiseUserList.unshift({
        mstgroupid: 0,
        mstuserid: -4,
        loginname: 'Send to Manager',
        groupname: 'Send to Manager'
      });
    } else {
      this.stateWiseUserList.shift();
    }
  }
}
