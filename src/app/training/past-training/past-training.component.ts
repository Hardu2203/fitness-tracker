import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ExerciseModel} from "../exercise.model";
import {TrainingService} from "../training.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {

  pastExercisesSubs = new Subscription();
  displayedColumns = ['date','name','duration', 'calories' ,'state'];
  dataSource = new MatTableDataSource<ExerciseModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
      this.pastExercisesSubs = this.trainingService.finishedExercisesChanged.subscribe( exercises => {
          this.dataSource.data = exercises;
          console.log(exercises)
      });
      this.trainingService.fetchPastExercises();
  }

  ngAfterViewInit(): void {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  }

  doFilter(event: any) {
      this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  ngOnDestroy() {
      if (this.pastExercisesSubs) {
          this.pastExercisesSubs.unsubscribe();
      }
  }

}
