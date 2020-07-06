import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "./training.service";
import {Subscription} from "rxjs";
import {ExerciseModel} from "./exercise.model";

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  currentTrainingSubs = new Subscription();
  currentExercise: ExerciseModel;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
      this.currentTrainingSubs = this.trainingService.currentExerciseSubject.subscribe(exercise => {
          if (exercise) {
              this.currentExercise = exercise;
              this.ongoingTraining = true;
          } else {
              this.currentExercise = null;
              this.ongoingTraining = false;
          }
      })
  }

  ngOnDestroy(): void {
      if (this.currentTrainingSubs) {
          this.currentTrainingSubs.unsubscribe();
      }
  }

}
