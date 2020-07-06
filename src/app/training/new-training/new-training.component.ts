import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExerciseModel} from "../exercise.model";
import {TrainingService} from "../training.service";
import {Subscription} from "rxjs";
import {NgForm} from "@angular/forms";
import {UIService} from "../../shared/ui.service";

@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

    exercises: ExerciseModel[];
    private exerciseListSubs = new Subscription;
    private loadingSubs = new Subscription();
    isLoading = false;

    constructor(private trainingService: TrainingService, private uiService: UIService) {
    }

    ngOnInit(): void {
        this.loadingSubs = this.uiService.loadingStateChanged.subscribe(state => this.isLoading = state)
        this.exerciseListSubs = this.trainingService.exercisesChanged.subscribe( exercises => {
                this.exercises = exercises;
            })
        this.fetchExercises();
    }

    fetchExercises() {
        this.trainingService.fetchAvailableExercises();
    }

    onStartTraining(form: NgForm) {
        this.trainingService.startExercise(form.value.exercise)
    }

    ngOnDestroy(): void {
        if (this.exerciseListSubs) {
            this.exerciseListSubs.unsubscribe();
        }

        if (this.loadingSubs) {
            this.loadingSubs.unsubscribe();
        }
    }
}
