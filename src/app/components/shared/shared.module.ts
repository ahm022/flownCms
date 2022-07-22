
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header/page-header.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { BtnComponent } from './btn/btn.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { InputValidationErrorComponent } from './input-validation-error/input-validation-error.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { RouterModule } from '@angular/router';
import { SearchInputComponent } from './search-input/search-input.component';
import { SelectMultipleValueComponent } from './select-multiple-value/select-multiple-value.component';
import { SelectedLabelComponent } from './selected-label/selected-label.component';
import { LoaderComponent } from './loader/loader.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import {HttpClientModule} from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import { BackDropComponent } from './back-drop/back-drop.component';
import { SkeletonComponent } from './skeleton/skeleton.component';



@NgModule({
  declarations: [
    PageHeaderComponent,
    DeleteDialogComponent,
    BtnComponent,

    CustomInputComponent,
    InputValidationErrorComponent,
    CustomSelectComponent,
    SearchInputComponent,
    SelectMultipleValueComponent,
    SelectedLabelComponent,
    LoaderComponent,
    EmptyStateComponent,
    BackDropComponent,
    SkeletonComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    FroalaEditorModule,
    FroalaViewModule,
    HttpClientModule,
    ApolloModule,
    RouterModule
  ],
  exports: [
    PageHeaderComponent,
    DeleteDialogComponent,
    BtnComponent,
    CustomInputComponent,
    InputValidationErrorComponent,
    CustomSelectComponent,
    SearchInputComponent,
    SelectMultipleValueComponent,
    SelectedLabelComponent,
    LoaderComponent,
    EmptyStateComponent,
    BackDropComponent,
    SkeletonComponent,
    EmptyStateComponent,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    FroalaEditorModule,
    FroalaViewModule,
    RouterModule
  ]
})
export class SharedModule { }
