import {ExerciseModel} from "./exercise.model";
import {Subject} from "rxjs";
import {OnDestroy} from "@angular/core";

export class TrainingService implements OnDestroy{

    currentExerciseSubject = new Subject<ExerciseModel>();
    private exercises: ExerciseModel[] = [];
    private currentExercise: ExerciseModel;

    availableExercises: ExerciseModel[] = [
        { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
        { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    ];

    constructor() {

    }

    getAvailableExercises(): ExerciseModel[] {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string) {
        this.currentExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.currentExerciseSubject.next({ ...this.currentExercise });
    }

    completeExercise() {
        this.exercises.push({
                ...this.currentExercise,
                date: new Date(),
                state: 'completed'
            });
        this.currentExercise = null;
        this.currentExerciseSubject.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({
            ...this.currentExercise,
            duration: this.currentExercise.duration * (progress / 100),
            calories: this.currentExercise.duration * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.currentExercise = null;
        this.currentExerciseSubject.next(null);
    }

    getCurrentExercise() {
        return { ...this.currentExercise};
    }

    ngOnDestroy(): void {
        this.currentExerciseSubject.unsubscribe();
    }
}
