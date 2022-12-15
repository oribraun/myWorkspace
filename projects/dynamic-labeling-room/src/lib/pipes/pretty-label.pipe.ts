import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'prettyLabel'
})
export class PrettyLabelPipe implements PipeTransform {

    transform(value: string, ...args: unknown[]): unknown {
        return this.prettyLabel(value);
    }

    prettyLabel(label): string {
        if (!label) {
            return;
        }
        const str =  label.replace(/_/g, ' ').replace(/-/g, ' ');
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

}
