import { Component } from '@angular/core';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [ConfirmDialog, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  showConfirmLogout = signal(false);
  isOpen = false;
  blockNavegation: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const router = this.router.url;
      this.blockNavegation =
        router.startsWith('/ahorcado') ||
        router.startsWith('/mayor-menor') ||
        router.startsWith('/preguntados') ||
        router.startsWith('/el-tesoro-escondido');
    });
  }
  // async onLogout(): Promise<void> {
  //   const { success, message } = await this.auth.logout();
  //   if (success) {
  //     this.isOpen = false;
  //   } else {
  //     console.error('Error al cerrar sesión:', message);
  //   }
  // }

  requestLogout(): void {
    this.showConfirmLogout.set(true);
  }

  confirmLogout(): void {
    this.showConfirmLogout.set(false);
    // this.onLogout();
  }

  cancelLogout(): void {
    this.showConfirmLogout.set(false);
  }
}
