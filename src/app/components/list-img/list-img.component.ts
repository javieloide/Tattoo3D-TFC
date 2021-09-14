import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-list-img',
  templateUrl: './list-img.component.html',
  styleUrls: ['./list-img.component.css']
})
export class ListImgComponent implements OnInit {
  @Input() list: string[];
  @Output() selectedImg = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  select(img): void{
    this.selectedImg.emit(img);
  }
}
