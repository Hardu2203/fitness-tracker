import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "./training.service";
import {Observable, Subscription} from "rxjs";
import {ExerciseModel} from "./exercise.model";
import * as fromTraining from "./training.reducer"
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining$: Observable<boolean>;
  // currentTrainingSubs = new Subscription();
  currentExercise$: Observable<ExerciseModel>;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
      // this.currentTrainingSubs = this.trainingService.currentExerciseSubject.subscribe(exercise => {
      //     if (exercise) {
      //         this.currentExercise = exercise;
      //         this.ongoingTraining = true;
      //     } else {
      //         this.currentExercise = null;
      //         this.ongoingTraining = false;
      //     }
      // })
      this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);
      // this.currentExercise$ = this.store.select(fromTraining.getActiveTraining);
  }

  ngOnDestroy(): void {
      // if (this.currentTrainingSubs) {
      //     this.currentTrainingSubs.unsubscribe();
      // }
  }

}
