import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-stop-training',
  template: `<h1 mat-dialog-title>Are you sure?</h1>
                <mat-dialog-content>
                    <p>You already got {{passedData.progress}}% done</p>
                </mat-dialog-content>
                <mat-dialog-actions>
                    <button mat-button [mat-dialog-close]="true">Yes</button>
                    <button mat-button [mat-dialog-close]="false">No</button>
                </mat-dialog-actions>`
})
export class StopTrainingComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {
    }

    ngOnInit(): void {
    }

}