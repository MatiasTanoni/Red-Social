import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [NgClass],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  @Input() title: string = '¡Atención!';
  @Input() message: string = 'Este es un mensaje de alerta.';
  @Input() type: 'success' | 'error' = 'success'; 
}
