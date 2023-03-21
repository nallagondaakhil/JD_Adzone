import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoSanitizePipe } from './no-sanitize.pipe';

@NgModule({
  declarations: [NoSanitizePipe],
  imports: [CommonModule],
  exports: [NoSanitizePipe],
})
export class PipesModule {}
