import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularGridInstance, Column, GridOption, Grouping, SortDirectionNumber, Sorters} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-common-slickgrid',
  templateUrl: './common-slickgrid.component.html',
  styleUrls: ['./common-slickgrid.component.css']
})
export class CommonSlickgridComponent implements OnInit, OnDestroy {

  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  angularGrid: AngularGridInstance;
  totalData: number;
  selectedTitles: any[];
  gridObj: any;
  gridWidth: number;
  isDisplay: boolean;
  private groupingService: Subscription;
  private dataviewObj: any;

  constructor(private messageService: MessageService) {
    this.messageService.getColumnDefinitions().subscribe(rawData => {
      // console.log('getColumnDefinitions ===' + JSON.stringify(rawData));
      this.columnDefinitions = rawData;
    });
    this.messageService.getGridData().subscribe(gridData => {
      // console.log('getGridData:+' + JSON.stringify(gridData));
      this.dataset = gridData;
    });
    this.messageService.getRow().subscribe(row => {
      this.angularGrid.gridService.addItem(row);
    });
    this.messageService.getGridWidth().subscribe(width => {
      this.gridWidth = width;
    });
    this.messageService.getAfterDelete().subscribe(id => {
      // this.angularGrid.gridService.deleteDataGridItemById(id);
      this.angularGrid.gridService.deleteItemById(id);
    });
    this.groupingService = this.messageService.getGrouping().subscribe(field => {
      this.grouping(field)
    });

  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid && angularGrid.slickGrid || {};
    this.dataviewObj = angularGrid.dataView;
    // this.gridObj.setCellCssStyles("", "red");
  }

  ngOnInit() {
    this.isDisplay = false;
    setTimeout(() => {
      this.isDisplay = true;

    }, 0);
    this.gridOptions = {
      enableAutoResize: true,       // true by default
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableCheckboxSelector: true,
      enableRowSelection: true,
      enableAddRow: true
    };
  }

  grouping(value) {
    this.dataviewObj.setGrouping({
      getter: value.field,
      formatter: (g) => `${value.name}: ${g.value} <span style="color:green">(${g.count} items)</span>`,
      comparer: (a, b) => Sorters.numeric(a.value, b.value, SortDirectionNumber.asc),
      aggregateCollapsed: false,
    } as Grouping);

    // you need to manually add the sort icon(s) in UI
    // this.angularGrid.slickGrid.setSortColumns([{columnId: 'duration', sortAsc: true}]);
    this.gridObj.invalidate(); // invalidate all rows and re-render
  }

  onCellChanged(e, args) {
    // console.log(JSON.stringify(args));
    args.item.type = 'change';
    this.messageService.setCellChangeData(args.item);
  }

  handleSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows)) {
      this.selectedTitles = args.rows.map(idx => {
        const item = this.gridObj.getDataItem(idx);
        return item || '';
      });
      this.messageService.setSelectedItemData(this.selectedTitles);
      // console.log(JSON.stringify(this.selectedTitles));
    }
  }

  onCellClicked(e, args) {
    const metadata = this.angularGrid.gridService.getColumnFromEventArguments(args);
    // console.log(metadata);

    if (metadata.columnDef.id === 'delete') {
      // console.log(JSON.stringify(metadata.columnDef));
      // console.log(JSON.stringify(metadata.dataContext));
      metadata.dataContext.type = 'delete';
      this.messageService.setCellChangeData(metadata.dataContext);
    } else if (metadata.columnDef.id === 'edit') {
      metadata.dataContext.type = 'change1';
      this.messageService.setCellChangeData(metadata.dataContext);
    } else {
      // metadata.dataContext.type = 'change';
      this.messageService.setCellChangeData(metadata.dataContext);
    }
  }

  ngOnDestroy(): void {
    if (this.groupingService) {
      this.groupingService.unsubscribe()
    }
  }
}
