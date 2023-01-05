import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Formatters} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-type-status',
    templateUrl: './type-status.component.html',
    styleUrls: ['./type-status.component.css']
})
export class TypeStatusComponent implements OnInit, OnDestroy {
    displayed = true;
    clientSelected: number;
    dataset: any[];
    totalData: number;
    respObject: any;
    clients = [];
    clientName: string;
    userName: string;
    roleName: string;
    notAdmin = true;
    displayData: any;
    add: boolean;
    del: boolean;
    edit: boolean;
    view: boolean;
    isError = false;
    errorMessage: string;
    pageSize: number;
    private userAuth: Subscription;
    private adminAuth: Subscription;
    private notifier: NotifierService;
    private clientId: number;
    private baseFlag: any;
    offset: number;
    dataLoaded: boolean;
    userId: number;
    isLoading = false;
    organaisation = [];
    orgSelected: number;
    orgName: string;
    orgnId: number;
    loginname: string;
    types = [];
    typeSelected: number;
    hideName: boolean;
    hideProperty: boolean;
    propertyName: string;
    recordVal = [];
    seqNo: number;
    recordName: string;
    recordValSelected: number;
    action: string;
    private typeseqno: number;
    isSLA: boolean;
    clientOrgnId: any;
    constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
                private modalService: NgbModal, notifier: NotifierService) {
        this.notifier = notifier;
        this.messageService.getCellChangeData().subscribe(item => {
            switch (item.type) {
                case 'change':
                    console.log('changed');
                    if (!this.edit) {
                        this.notifier.notify('error', 'You do not have edit permission');
                    } else {

                    }
                    break;
                case 'delete':
                    if (confirm('Are you sure?')) {
                        this.rest.deleteRecordDiff({id: item.id}).subscribe((res) => {
                            this.respObject = res;
                            if (this.respObject.success) {
                                this.messageService.sendAfterDelete(item.id);
                                this.totalData = this.totalData - 1;
                                this.messageService.setTotalData(this.totalData);
                                this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
                            } else {
                                this.notifier.notify('error', this.respObject.errorMessage);
                            }
                        }, (err) => {
                            this.notifier.notify('error', this.respObject.errorMessage);
                        });
                    }
            }
        });
        // this.messageService.getUserAuth().subscribe(details => {
        //     // console.log(JSON.stringify(details));
        //     if (details.length > 0) {
        //         this.add = details[0].addFlag;
        //         this.del = details[0].deleteFlag;
        //         this.view = details[0].viewFlag;
        //         this.edit = details[0].editFlag;
        //     }
        // });
    }

    ngOnInit() {
        this.hideName = true;
        this.userName = '';
        this.dataLoaded = true;
        this.hideProperty = true;
        this.pageSize = this.messageService.pageSize;
        this.displayData = {
            pageName: 'Property Mapping',
            openModalButton: 'Property Mapping',
            breadcrumb: 'Property Mapping',
            folderName: 'All Property',
            tabName: 'Property Mapping'
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
                id: 'client_name', name: 'Client ', field: 'clientname', sortable: true, filterable: true
            }, {
                id: 'orgname', name: 'Organization ', field: 'orgname', sortable: true, filterable: true
            }, {
                id: 'Type', name: 'Type ', field: 'Type', sortable: true, filterable: true
            }, {
                id: 'name', name: 'Name ', field: 'name', sortable: true, filterable: true
            }
        ];
        this.messageService.setColumnDefinitions(columnDefinitions);
        if (this.messageService.clientId) {
            this.clientId = this.messageService.clientId;
            this.baseFlag = this.messageService.baseFlag;
            this.orgnId = this.messageService.orgnId;
            this.edit = this.messageService.edit;
            this.del = this.messageService.del;
            console.log(this.orgnId);
            this.onPageLoad();
        } else {
            this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
                // this.view = auth[0].viewFlag;
                // this.add = auth[0].addFlag;
                this.edit = auth[0].editFlag;
                this.del = auth[0].deleteFlag;
                this.clientId = auth[0].clientid;
                this.baseFlag = auth[0].baseFlag;
                this.orgnId = auth[0].mstorgnhirarchyid;
                // console.log(JSON.stringify(auth));
                // console.log(this.orgnId)
                this.onPageLoad();
            });
        }
    }


    onPageLoad() {
        this.rest.getallclientnames().subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
                this.respObject.details.unshift({id: 0, name: 'Select Client'});
                this.clients = this.respObject.details;
                this.clientSelected = 0;
            } else {
                this.isError = true;
                this.notifier.notify('error', this.respObject.message);
            }
        }, (err) => {
            this.isError = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
        this.rest.getRecordDiffType().subscribe((res) => {
            this.respObject = res;
            this.respObject.details.unshift({id: 0, typename: 'Select Record Type'});
            this.types = this.respObject.details;
            this.typeSelected = 0;
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    }

    changeRouting(path: string) {
        this.messageService.changeRouting(path);
    }

    onClientChange(selectedIndex) {
        this.clientName = this.clients[selectedIndex].name;
        this.clientOrgnId = this.clients[selectedIndex].orgnid;
        this.getOrganization(this.clientSelected, this.clientOrgnId);
    }

    getrecorddiffvalue() {
        // console.log(this.orgnId);
        const data = {
            'clientid': this.clientId,
            'mstorgnhirarchyid': this.orgnId,
            'seqno': Number(this.seqNo)
        };
        if (!this.hideProperty) {
            this.rest.getrecordbydifftype(data).subscribe((res) => {
                this.respObject = res;
                this.recordVal = this.respObject.details;
                this.respObject.details.unshift({id: 0, typename: 'Select Record value'});
                this.recordValSelected = 0;
            }, (err) => {
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
        }
    }

    ontypeChange(selectedIndex) {
        this.recordName = '';
        this.seqNo = this.types[selectedIndex].seqno;
        console.log(this.seqNo)
        this.propertyName = this.types[selectedIndex].typename;
        this.getrecorddiffvalue();
    }

    onRecordChange(selectedIndex) {
        this.recordName = this.recordVal[selectedIndex].typename;
        this.typeseqno = this.recordVal[selectedIndex].seqno;
    }

    addProperty() {
        this.recordName = '';
        this.hideName = false;
        this.hideProperty = true;
    }

    updateProperty() {
        this.recordName = '';
        this.hideProperty = false;
        this.hideName = true;
        this.getrecorddiffvalue();
    }

    openModal(content) {
        this.isError = false;
        this.reset();
        this.modalService.open(content).result.then((result) => {
        }, (reason) => {
        });
    }

    save() {
        // if (this.notAdmin) {
        //   this.clientSelected = this.clientId;
        // }
        const data = {
            clientid: Number(this.clientSelected),
            mstorgnhirarchyid: Number(this.orgSelected),
            name: this.recordName,
            recorddifftypeid: Number(this.typeSelected)
        };
        console.log(this.action)
        if (!this.messageService.isBlankField(data)) {
            if (this.action === '1') {
                data['seqno'] = 0;
            } else {
                data['seqno'] = this.typeseqno;
            }
            data['parentid'] = 0;
            // console.log(JSON.stringify(data));
            this.rest.insertRecordDiff(data).subscribe((res: any) => {
                if (res.success) {
                    const id = res.details;
                    this.messageService.setRow({
                        id: id,
                        clientname: this.clientName,
                        orgname: this.orgName,
                        type: this.propertyName,
                        name: this.recordName,
                    });
                    this.reset();
                    this.totalData = this.totalData + 1;
                    this.messageService.setTotalData(this.totalData);
                    this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
                } else {
                    this.notifier.notify('error', res.message);
                }
            }, (err) => {
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
        } else {
            this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }
    }

    reset() {
        this.isSLA = true;
        this.clientSelected = 0;
        this.hideProperty = true;
        this.organaisation = [];
        this.orgSelected = 0;
        this.recordName = '';
        this.typeSelected = 0;
        this.action = '1';
        this.recordValSelected = 0;
        this.typeseqno = 0;
    }

    onOrgChange(index: any) {
        this.orgName = this.organaisation[index].organizationname;
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
            'offset': offset,
            'limit': limit,
            clientid: this.clientId,
            mstorgnhirarchyid: this.orgnId
        };
        this.rest.getrecorddiffbyorg(data).subscribe((res) => {
            this.respObject = res;
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
        if (this.adminAuth) {
            this.adminAuth.unsubscribe();
        }
    }

    getOrganization(clientId, orgId) {
        const data = {
            clientid: Number(clientId),
            mstorgnhirarchyid: Number(orgId)
        };
        this.rest.getorganizationclientwisenew(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
                this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
                this.organaisation = this.respObject.details;
                this.orgSelected = 0;
            } else {
                this.isError = true;
                this.notifier.notify('error', this.respObject.message);
            }
        }, (err) => {
            this.isError = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    }

}
