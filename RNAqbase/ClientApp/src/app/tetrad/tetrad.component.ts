import { Component, OnInit, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisualizationComponent } from '../visualization/visualization.component';
import { Visualization3DComponent } from '../visualization3-d/visualization3-d.component';


@Component({
  selector: 'app-tetrad',
  templateUrl: './tetrad.component.html',
  styleUrls: ['./tetrad.component.css']
})
export class TetradComponent implements OnInit {

  data: Tetrad;
  csvData: Tetrad[];
  tetradId: number;
  sub;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      console.log(params);
      this.tetradId = +params.get('tetradId');

      this.http.get<Tetrad>(this.baseUrl + 'api/Tetrad/GetTetradById?id=' + this.tetradId).subscribe(result => {
        this.data = result;

        this.http.get<number[]>(this.baseUrl + 'api/Tetrad/GetOtherTetradsInTheSamePdb?tetradId=' + this.data.id + '&pdbId=' + this.data.pdbId).subscribe(result => {
          if (result) {
            this.data.tetradsInTheSamePdb = result;
          }
          else this.data.tetradsInTheSamePdb = [];

          if (this.data.quadruplexId != '-') {
            this.http.get<number[]>(this.baseUrl + 'api/Tetrad/GetOtherTetradsInTheSameQuadruplex?tetradId=' + this.data.id + '&quadruplexId=' + this.data.quadruplexId).subscribe(result => {
              if (result) {
                this.data.tetradsInTheSameQuadruplex = result;
              }
              else this.data.tetradsInTheSameQuadruplex = [];

              this.csvData = [this.data];
            }, error => console.error(error));
          }
          else {
            this.csvData = [this.data];
            this.data.tetradsInTheSameQuadruplex = [];
          }
        }, error => console.error(error));
      }, error => console.error(error));

    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showStructure() {
    let dialogRef = this.dialog.open(Visualization3DComponent, { data: { pdbId: this.data.pdbId } })
  }
  showDialog() {
    let dialogRef = this.dialog.open(VisualizationComponent)
  }
}

interface Tetrad {
  id: number;
  quadruplexId: string;
  pdbId: string;
  assemblyId: number;
  molecule: string;
  sequence: string;
  onzClass: string;
  planarity: string;
  structure3D: string;
  tetradsInTheSameQuadruplex: number[];
  tetradsInTheSamePdb: number[];
  experiment: string;
}
