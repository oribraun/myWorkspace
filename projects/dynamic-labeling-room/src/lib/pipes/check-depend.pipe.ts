import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'checkDepend'
})
export class CheckDependPipe implements PipeTransform {

    transform(fields: any, item: any, ...args: unknown[]): unknown {
        return null;
    }

    checkDepend(fields, item): boolean {
        if (!item.depend) {
            return false;
        }
        const map = fields.map((o) => o.label);
        const index = map.indexOf(item.depend);
        if (!fields[index]) {
            return false;
        }
        let condition = fields[index].value;
        if (item.dependOnValue) {
            condition = fields[index].value === item.dependOnValue;
        }
        if (index > -1 && condition) {
            return false;
        } else {
            return true;
        }
    }

}
