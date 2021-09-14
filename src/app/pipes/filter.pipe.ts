import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterName'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const result = [];
    for (const data of value){
      if (data.name.toLowerCase().indexOf(arg) > -1){
        result.push(data);
      }
    }
    return result;
  }

}
