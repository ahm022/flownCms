import { GraphqlService } from './../../../services/graphql.service';
import { QueriesService } from 'src/app/services/queries.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { data } from '../../../../../data-config';
import { icons } from '../../../../../data-config';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { GeneralService } from 'src/app/services/general.service';
import { DeleteDialogComponent } from 'src/app/components/shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Apollo, gql } from 'apollo-angular';
import { mapPageToItem } from 'src/app/services/mapping-helper';
import * as _ from 'lodash';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  debounce: any;
  pages = [];
  isloaded = false;
  displayedColumns: string[] = [
    'title',
    'author',
    'slug',
    'category',
    'lastMOdifiedBy',
    'lastMOdified',
    'status',
    'gated',
    'actions',
  ];

  // Icons
  deleteIcon = icons.deleteIcon.toString();
  editIcon = icons.editIcon.toString();

  // Status page options
  statusPageOptions = data.statusPageOptions;
  categories;
  constructor(
    private generalService: GeneralService,
    private dialog: MatDialog,
    private queries: QueriesService,
    private graphqlService: GraphqlService
  ) {}

  ngOnInit(): void {
    this.getPages();
  }

  deletePage(id) {
    this.dialog
      .open(DeleteDialogComponent, {
        width: '600px',
        data: {
          title: 'Delete page',
          description: ' Would you like to delete this page',
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === 'true') {
          this.graphqlService
            .getGraphQL(this.queries.deletePages, { pageId: id })
            .then(() => {
              this.getPages();
            });
        }
      });
  }

  getPages() {
    this.isloaded = true;
    this.graphqlService
      .getGraphQL(this.queries.pageQuery, false)
      .then((results) => {
        console.log('results', results);
        this.pages = _.get(
          results,
          'cmsTemplate2.queries.cmsTemplate2_Posts.items',
          []
        ).map((x: any) => mapPageToItem(x));
      })
      .finally(() => {
        this.isloaded = false;
        console.log(this.pages);
      });
  }

  navigateToAddNewPage() {
    this.generalService.navigateTo('/dashboard/add-new-page');
  }

  selectPageStatus(id, e) {
    this.graphqlService
    .getGraphQL(this.queries.changePageStatusMutation, { pageId: id, pageStatus: e.target.value })
    .then((res) => {
      this.getPages();
    });
  }

  searchPages(e) {
    this.isloaded = true;
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.graphqlService
        .getGraphQL(this.queries.searchPageQuery, {
          name: e.target.value ? e.target.value : null,
        })
        .then((results) => {
          this.pages = _.get(
            results,
            'cmsTemplate2.queries.cmsTemplate2_Posts.items',
            []
          ).map((x: any) => mapPageToItem(x));
        })
        .finally(() => {
          this.isloaded = false;
        });
    }, 1000);
  }

  goToEditPage(id) {
    this.generalService.navigateTo('/dashboard/edit-page/'+id)
  }
  pageDetails(id) {
    this.generalService.navigateTo('/dashboard/page-details/'+id)
  }

}
