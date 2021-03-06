import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { CsvModule } from '@ctrl/ngx-csv';

@Component({
  selector: 'quadruplex-table',
  templateUrl: './quadruplex-table.component.html',
  styleUrls: ['./quadruplex-table.component.css']
})
export class QuadruplexTableComponent implements OnInit {

  selection = new SelectionModel<Quadruplex>(true, []);
  dataSource = new MatTableDataSource<Quadruplex>();
  areButtonsHidden: boolean = true;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;

  displayedColumns = [
    'id', 'pdbId', 'assemblyId', 'molecule',
    'sequence', 'numberOfStrands', 'type', 'onzClass', 'numberOfTetrads', 'select'
  ];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

  ngOnInit() {
    this.http.get<Quadruplex[]>(this.baseUrl + 'api/Quadruplex/GetQuadruplexes').subscribe(result => {
      this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.areButtonsHidden = false;
      },
      error => console.error(error));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Quadruplex): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}

interface Quadruplex {
  id: string;
  pdbId: string;
  assemblyId: number;
  molecule: string;
  sequence: string;
  numberOfStrands: number;
  type: string;
  onzClass: string;
  numberOfTetrads: number;
}
