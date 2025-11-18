import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [NgClass],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {
  @Input() sizeClass: string = 'h-8 w-8';
  @Input() colorClass: string = 'border-blue-500';
}
