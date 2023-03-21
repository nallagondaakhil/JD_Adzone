import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translate.service';

@Pipe({
    name: 'translate',
})
export class TranslatePipe implements PipeTransform {

    constructor(private service: TranslationService) { }

    transform(value: string): any {
        if (!value) { return; }
        return this.service.translate(value);
    }
}
