import {ExerciseModel} from "./exercise.model";
import {Subject, Subscription} from "rxjs";
import {Injectable, OnDestroy} from "@angular/core";
import {map} from "rxjs/operators";
import {AngularFirestore} from "angularfire2/firestore";
import {UIService} from "../shared/ui.service";

@Injectable()
export class TrainingService implements OnDestroy{

    currentExerciseSubject = new Subject<ExerciseModel>();
    exercisesChanged = new Subject<ExerciseModel[]>();
    finishedExercisesChanged = new Subject<ExerciseModel[]>();
    fbSubs: Subscription[] = [];
    private currentExercise: ExerciseModel;

    private availableExercises: ExerciseModel[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService) {

    }

    fetchAvailableExercises() {
        this.uiService.loadingStateChanged.next(true)
        this.fbSubs.push(this.db.collection('availableExercises').snapshotChanges()
            .pipe(map(docArray => {
                    return docArray.map(doc => {
                        return {
                            id: doc.payload.doc.id,
                            name: doc.payload.doc.data()["name"],
                            duration: doc.payload.doc.data()["duration"],
                            calories: doc.payload.doc.data()["calories"]
                        };
                    });
                }
            )).subscribe((exercises: ExerciseModel[]) => {
                this.uiService.loadingStateChanged.next(false)
                this.availableExercises = exercises
                this.exercisesChanged.next([...this.availableExercises])
            }, error => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar("Fetching exercises failer, please try again later", null, 3000);
                this.exercisesChanged.next(null)
            }));
    }

    private addDataToDatabase(exercise: ExerciseModel) {
        this.db.collection('finishedExercises').add(exercise);
    }

    startExercise(selectedId: string) {
        // this.db.doc("availableExercises/" + selectedId).update({lastSetected: new Date()})
        this.currentExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.currentExerciseSubject.next({ ...this.currentExercise });
    }

    completeExercise() {
        this.addDataToDatabase({
                ...this.currentExercise,
                date: new Date(),
                state: 'completed'
            });
        this.currentExercise = null;
        this.currentExerciseSubject.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.currentExercise,
            duration: this.currentExercise.duration * (progress / 100),
            calories: this.currentExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.currentExercise = null;
        this.currentExerciseSubject.next(null);
    }

    getCurrentExercise() {
        return { ...this.currentExercise};
    }

    fetchPastExercises() {
        this.fbSubs.push(this.db.collection("finishedExercises")
            .valueChanges()
            .subscribe( (exercises : ExerciseModel[]) => {
                this.finishedExercisesChanged.next(exercises);
            }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe())
    }

    ngOnDestroy(): void {
        this.currentExerciseSubject.unsubscribe();
    }
}
