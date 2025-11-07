import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-message',
  imports: [],
  templateUrl: './success-message.html',
  styleUrl: './success-message.css',
})
export class SuccessMessage {
  @Input() title: string = '¡Respuesta correcta!';
  @Input() message: string = 'Muy bien, acertaste.';
}
