import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {data} from "../../../../../data-config"
import {icons} from "../../../../../data-config"
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { GeneralService } from 'src/app/services/general.service';
import { DeleteDialogComponent } from 'src/app/components/shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  ELEMENT_DATA: any = data.pageTableData
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['title', 'author', 'slug', 'category', 'lastMOdifiedBy', 'lastMOdified', 'status', 'gated', 'actions'];
  isLoaded = true;

  // Icons
  deleteIcon = icons.deleteIcon.toString()
  editIcon = icons.editIcon.toString()

  // Status page options 
  statusPageOptions = data.statusPageOptions
  
  constructor(private generalService: GeneralService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    this.generalService.filteringTable(sortState)
  }

  deletePage(id) {
    this.dialog.open(
      DeleteDialogComponent,
      {
        width: '600px',
        data: { title: "Delete page", description: " Would you like to delete this page" }
      }).afterClosed().subscribe((res) => {
        if (res === "true") {
          let EDIT_ELEMENT_DATA = this.ELEMENT_DATA.filter(el => { return el.id != id })
          this.ELEMENT_DATA = EDIT_ELEMENT_DATA
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
        }
      })
  }
  
  savePage() {
  }
  navigateToAddNewPage() {
    this.generalService.navigateTo('/dashboard/add-new-page')
  }
  selectPageStatus(e) {
    alert('status was changed to ' + e)
  }
  searchPage(e) {
    console.log(e.target.value);
  }

}
