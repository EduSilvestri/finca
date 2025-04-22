import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { effect } from '@angular/core';
declare var bootstrap: any;


@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated = false;
  isAdmin = false;
  isUser = false;

  constructor(private authService: AuthService) {
    // Usamos `effect` para reaccionar a cambios en el signal
    effect(() => {
      const user = this.authService.user();

      this.isAuthenticated = !!user;

      if (user) {
        this.isAdmin = user.roles?.includes('ROLE_ADMIN');
        this.isUser = user.roles?.includes('ROLE_USER');
      } else {
        this.isAdmin = false;
        this.isUser = false;
      }
    });
  }

  closeMenu(): void {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse?.classList.contains('show')) {
      // Usa Bootstrap collapse JS para ocultarlo
      const collapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
      collapse.hide();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
