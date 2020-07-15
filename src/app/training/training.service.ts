import {ExerciseModel} from "./exercise.model";
import {Subject, Subscription} from "rxjs";
import {Injectable, OnDestroy} from "@angular/core";
import {map, take} from "rxjs/operators";
import {AngularFirestore} from "angularfire2/firestore";
import {UIService} from "../shared/ui.service";
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions'
import {Store} from "@ngrx/store";

@Injectable()
export class TrainingService implements OnDestroy {

    currentExerciseSubject = new Subject<ExerciseModel>();
    exercisesChanged = new Subject<ExerciseModel[]>();
    finishedExercisesChanged = new Subject<ExerciseModel[]>();
    fbSubs: Subscription[] = [];
    private currentExercise: ExerciseModel;

    private availableExercises: ExerciseModel[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromTraining.State>) {

    }

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading())
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
                this.store.dispatch(new UI.StopLoading())
                // this.availableExercises = exercises
                // this.exercisesChanged.next([...this.availableExercises])
                this.store.dispatch(new Training.SetAvailableTrainings(exercises));
            }, error => {
                this.store.dispatch(new UI.StopLoading())
                this.uiService.showSnackbar("Fetching exercises failer, please try again later", null, 3000);
                this.exercisesChanged.next(null)
            }));
    }

    startExercise(selectedId: string) {
        // this.currentExercise = this.availableExercises.find(ex => ex.id === selectedId);
        // this.currentExerciseSubject.next({ ...this.currentExercise });
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                date: new Date(),
                state: 'completed'
            });
            this.store.dispatch(new Training.StopTraining());
        });
        // this.currentExercise = null;
        // this.currentExerciseSubject.next(null);
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        });
        // this.currentExercise = null;
        // this.currentExerciseSubject.next(null);
    }

    getCurrentExercise() {
        return {...this.currentExercise};
    }

    fetchPastExercises() {
        this.fbSubs.push(this.db.collection("finishedExercises")
            .valueChanges()
            .subscribe((exercises: ExerciseModel[]) => {
                this.store.dispatch(new Training.SetFinishedTrainings(exercises));
            }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe())
    }

    ngOnDestroy(): void {
        this.currentExerciseSubject.unsubscribe();
    }

    private addDataToDatabase(exercise: ExerciseModel) {
        this.db.collection('finishedExercises').add(exercise);
    }
}
