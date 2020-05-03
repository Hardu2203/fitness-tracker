import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {StopTrainingComponent} from "./stop-training.component";
import {TrainingService} from "../training.service";

@Component({
    selector: 'app-current-training',
    templateUrl: './current-training.component.html',
    styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
    progress = 0;
    timer: number;

    constructor(private dialog: MatDialog, private trainingService: TrainingService) {
    }

    ngOnInit(): void {
        this.startTimer();
    }

    startTimer() {
        const step = this.trainingService.getCurrentExercise().duration;
        this.timer = setInterval(() => {
            if (this.progress >= 100) {
                clearInterval(this.timer)
            }
        }, step)
    }

    onStop() {
        clearInterval(this.timer);
        const dialogRef = this.dialog.open(StopTrainingComponent, {
            data: {
                progress: this.progress
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            } else this.startTimer();
        })
    }
}
