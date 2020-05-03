import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ExerciseModel} from "../exercise.model";
import {TrainingService} from "../training.service";
import {Subscription} from "rxjs";
import {Form, FormGroup, NgForm} from "@angular/forms";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: ExerciseModel[] = [];
  exerciseListSubs = new Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
      // this.exerciseListSubs = this.trainingService.exercisesSubject.subscribe( exercises => {
      //     this.exercises = exercises;
      // })
      this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
      this.trainingService.startExercise(form.value.exercise )
  }

  ngOnDestroy(): void {
      this.exerciseListSubs.unsubscribe();
  }
}
