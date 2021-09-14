import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent  {
  images = [
    {path: 'assets/slider/tattobanner01.jpg'},
    {path: 'assets/slider/tattobanner02.jpg'},
    {path: 'assets/slider/tattobanner03.jpg'}
  ];

}
