import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs, Filters} from 'angular-slickgrid';

@Component({
    selector: 'app-map-asset',
    templateUrl: './map-asset.component.html',
    styleUrls: ['./map-asset.component.css']
})
export class MapAssetComponent implements OnInit {
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
    @ViewChild('content') private content1;
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
    fromRecordDiffType = '';
    fromRecordDiffId = '';
    toRecordDiffTypeId = '';
    toRecordDiffTypeSeqno = '';
    toRecordDiffId = '';
    levels = [];
    levelSelected = '';
    levelSelected1 = '';
    workinglevel = [];
    workId: number;
    workName: string;
    seq: any;
    recorddifftypename: string;
    recorddiffname: string;
    updateFlag = false;
    checked: boolean = true;
    disabled: boolean = true;
    label: string;


    colValName: string;
    fromPropLevels = [];
    fromlevelid: any;


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
                            this._rest.deleterecordtypemap({id: item.id}).subscribe((res) => {
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

    ngOnInit(): void {

        this.totalPage = 0;
        this.dataLoaded = true;
        this.onCheck();

        this.pageSize = this.messageService.pageSize;
        this.displayData = {
            pageName: 'Maintain Asset Mapping ',
            openModalButton: 'Asset Mapping',
            breadcrumb: '',
            folderName: '',
            tabName: 'Asset Mapping'
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

            // {
            //     id: 'edit',
            //     field: 'id',
            //     excludeFromHeaderMenu: true,
            //     formatter: Formatters.editIcon,
            //     minWidth: 30,
            //     maxWidth: 30,
            //     onCellClick: (e: Event, args: OnEventArgs) => {
            //         this.resetValues();
            //         console.log(JSON.stringify(args.dataContext) + "<<<<<<<<<<<<<<<<<<<<");
            //         this.updateFlag = true;
            //         this.isError = false;
            //         this.formTicketTypeList = [];
            //         this.selectedId = args.dataContext.id;
            //         this.organizationId = args.dataContext.mstorgnhirarchyid;
            //         this.fromRecordDiffType = args.dataContext.difftypeid;
            //         this.fromRecordDiffId = args.dataContext.diffid;
            //         this.toRecordDiffTypeId = args.dataContext.torecorddifftypeid;
            //         this.toRecordDiffId = args.dataContext.torecorddiffid;
            //         this.organizationName = args.dataContext.mstorgnhirarchyname;
            //         this.recorddifftypename = args.dataContext.difftypename;
            //         this.recorddiffname = args.dataContext.diffname;


            //         for (let i = 0; i < this.recordTypeStatus.length; i++) {
            //             if (Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffType)) {
            //                 this.seq = this.recordTypeStatus[i].seqno;
            //                 this.getrecord(this.seq);
            //             }
            //         }
            //         // console.log("oooo"+JSON.stringify(this.recordTypeStatus) + "..............." + this.fromRecordDiffType);
            //         this.modalReference = this.modalService.open(this.content1, {});
            //         this.modalReference.result.then((result) => {
            //         }, (reason) => {

            //         });
            //     }
            // },
            // {
            //   id: 'clientName', name: 'Client', field: 'clientname', sortable: true, filterable: true
            // },
            {
                id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
            },
            {
                id: 'difftypename', name: 'Property Type ', field: 'difftypename', sortable: true, filterable: true
            },
            // {
            //   id: 'recorddifflevelname', name: 'Property Level ', field: 'recorddifferentiationlevelname', sortable: true, filterable: true
            // },
            {
                id: 'diffname', name: 'Property Value ', field: 'diffname', sortable: true, filterable: true
            }
        ];

        this.clientId = this.messageService.clientId;
        this.messageService.setColumnDefinitions(columnDefinitions);
        // this.onPageLoad();
        if (this.messageService.clientId) {
            this.clientId = this.messageService.clientId;
            this.baseFlag = this.messageService.baseFlag;
            this.loginUserOrganizationId = this.messageService.orgnId;
            this.edit = this.messageService.edit;
            this.del = this.messageService.del;

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
                console.log('auth1===' + JSON.stringify(auth));
                this.onPageLoad();
            });
        }
    }

    onPageLoad() {
        // this.getTableData();
        this.getorganizationclientwise();
        this.getRecordDiffType();

    }

    onOrgChange(index: any) {
        console.log("lll" + index + JSON.stringify(this.organizationList));

        this.organizationName = this.organizationList[index - 1].organizationname;
    }


    openModal(content) {

        this.checked = true;
        this.disabled = true;
        this.updateFlag = false;
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
        console.log(data);
        this._rest.getclietwiseasset(data).subscribe((res) => {
            this.respObject = res;
            console.log('>>>>>>>>>>> ', JSON.stringify(res));
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
        this.fromRecordDiffType = '';
        this.fromRecordDiffId = '';
        this.toRecordDiffTypeId = '';
        this.toRecordDiffId = '';
        this.fromPropLevels = [];
        this.fromlevelid = '';
        this.checked = true;
    }

    save() {
        let fixedVal;
        for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (this.recordTypeStatus[i].seqno === 5) {
                fixedVal = this.recordTypeStatus[i].id;
            }
        }

        const data = {
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.organizationId),
            fromrecorddiffid: Number(this.fromRecordDiffId),
            torecorddifftypeid: fixedVal
        };
        if (this.fromPropLevels.length === 0) {
            data['fromrecorddifftypeid'] = Number(this.fromRecordDiffType);
        } else {
            data['fromrecorddifftypeid'] = Number(this.fromlevelid);
        }
        console.log(data, "???????????????");
        if (!this.messageService.isBlankField(data)) {
            data['torecorddiffid'] = 0;

            this._rest.addrecordtypemap(data).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                    const id = this.respObject.details;
                    this.messageService.setRow({
                        id: id,
                        mstorgnhirarchyid: this.organizationId,
                        diffid: this.fromRecordDiffId,
                        difftypeid: Number(this.fromRecordDiffType),
                        mstorgnhirarchyname: this.organizationName,
                        difftypename: this.recorddifftypename,
                        diffname: this.recorddiffname
                    });
                    this.totalData = this.totalData + 1;
                    this.messageService.setTotalData(this.totalData);
                    this.isError = false;
                    this.resetValues();
                    // this.getTableData();
                    this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
                } else {
                    this.notifier.notify('error', this.respObject.message);
                }
            }, (err) => {
                // this.isError = true;
                // this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
        } else {
            this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }
    }

    update() {
        let fixedVal;
        for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (this.recordTypeStatus[i].seqno === 5) {
                fixedVal = this.recordTypeStatus[i].id;
            }
        }

        const data = {
            id: this.selectedId,
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.organizationId),
            fromrecorddiffid: Number(this.fromRecordDiffId),
            torecorddifftypeid: fixedVal
        };
        if (this.fromPropLevels.length === 0) {
            data['fromrecorddifftypeid'] = Number(this.fromRecordDiffType);
        } else {
            data['fromrecorddifftypeid'] = Number(this.fromlevelid);
        }
        // console.log(data, "???????????????");
        if (!this.messageService.isBlankField(data)) {
            data['torecorddiffid'] = 0;
            this._rest.updaterecordtypemap(data).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {

                    this.isError = false;
                    this.messageService.sendAfterDelete(this.selectedId);
                    this.dataLoaded = true;
                    this.messageService.setRow({
                        id: this.selectedId,
                        mstorgnhirarchyid: this.organizationId,
                        diffid: this.fromRecordDiffId,
                        difftypeid: Number(this.fromRecordDiffType),
                        mstorgnhirarchyname: this.organizationName,
                        difftypename: this.recorddifftypename,
                        diffname: this.recorddiffname
                    });
                    this.modalReference.close();
                    this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
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

    getrecordbydifftype(index) {
        this.recorddifftypename = this.recordTypeStatus[index - 1].typename;
        if (index !== 0) {
            this.fromPropLevels = [];
            this.formTicketTypeList = [];
            this.fromRecordDiffId = '';
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
                    this.isError = true;
                    this.notifier.notify('error', res.message);
                }
            }, (err) => {
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
        }
    }

    onLevelChange(selectedIndex: any) {
        console.log("00000000000000000000")
        let seq;
        seq = this.fromPropLevels[selectedIndex - 1].seqno;
        this.getrecord(seq);
    }


    getrecord(seqNumber) {

        const data = {
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.organizationId),
            seqno: Number(seqNumber)
        };
        this._rest.getrecordbydifftype(data).subscribe((res: any) => {
            if (res.success) {
                this.formTicketTypeList = res.details;
                console.log(".............." + JSON.stringify(this.formTicketTypeList));

            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            console.log(err);
        });
    }


    onPropertyChange(index: any) {
        this.recorddiffname = this.formTicketTypeList[index - 1].typename;

    }


    getorganizationclientwise() {
        this._rest.getorganizationclientwisenew({
            clientid: Number(this.clientId),
            mstorgnhirarchyid: Number(this.loginUserOrganizationId)
        }).subscribe((res: any) => {
            if (res.success) {
                this.organizationList = res.details;
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            console.log(err);
        });
    }

    onCheck() {
        this.label = 'Map Asset';
    }
}
