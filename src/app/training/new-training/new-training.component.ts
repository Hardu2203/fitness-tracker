import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExerciseModel} from "../exercise.model";
import {TrainingService} from "../training.service";
import {Observable, observable, Subscription} from "rxjs";
import {NgForm} from "@angular/forms";
import {UIService} from "../../shared/ui.service";
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';
import {Store} from "@ngrx/store";

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

    exercises$: Observable<ExerciseModel[]>;
    // private exerciseListSubs = new Subscription;
    isLoading$: Observable<boolean>;

    constructor(private trainingService: TrainingService, private uiService: UIService, private store: Store<fromTraining.State>) {
    }

    ngOnInit(): void {
        this.isLoading$ = this.store.select(fromRoot.getIsLoading)
        // this.exerciseListSubs = this.trainingService.exercisesChanged.subscribe( exercises => {
        //         this.exercises = exercises;
        //     })
        this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
        this.fetchExercises();
    }

    fetchExercises() {
        this.trainingService.fetchAvailableExercises();
    }

    onStartTraining(form: NgForm) {
        this.trainingService.startExercise(form.value.exercise)
    }

    ngOnDestroy(): void {
        // if (this.exerciseListSubs) {
        //     this.exerciseListSubs.unsubscribe();
        // }
    }
}
