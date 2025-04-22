import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-animales',
  imports: [RouterLink],
  templateUrl: './animales.component.html',
  styleUrls: ['./animales.component.css']
})
export class AnimalesComponent implements OnInit, AfterViewInit {
  toros: any[] = [];
  vacas: any[] = [];
  novillas: any[] = [];
  mautes: any[] = [];
  
  currentPosition: any = {
    toros: 0,
    vacas: 0,
    novillas: 0,
    mautes: 0
  };
  
  slideWidth: number = 0;
  visibleSlides: number = 3;

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.auth.getToken();

    if (token) {
      this.api.getAnimales(token).subscribe({
        next: (data) => {
          const animales = data['hydra:member'] || [];
          this.toros = animales.filter((a: any) => a.tipo === 'Toro');
          this.vacas = animales.filter((a: any) => a.tipo === 'Vaca');
          this.novillas = animales.filter((a: any) => a.tipo === 'Novilla');
          this.mautes = animales.filter((a: any) => a.tipo === 'Maute');
          
          // Calcular el ancho del slide después de obtener los datos
          setTimeout(() => this.calculateSlideWidth(), 0);
        },
        error: (err) => {
          console.error('Error al cargar animales:', err);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
  
    const targets = document.querySelectorAll('.fade-in');
    targets.forEach(el => observer.observe(el));
    
    this.calculateSlideWidth();
    window.addEventListener('resize', () => this.calculateSlideWidth());
  }

  calculateSlideWidth() {
    const container = document.querySelector('.carousel-container');
    if (container) {
      const containerWidth = container.clientWidth;
      this.slideWidth = containerWidth / this.visibleSlides;
    }
  }

  nextSlide(section: string) {
    const items = this[section as keyof AnimalesComponent] as any[];
    const maxPosition = (items.length - this.visibleSlides) * this.slideWidth;
    
    if (this.currentPosition[section] >= maxPosition) {
      this.currentPosition[section] = 0; // Vuelve al inicio
    } else {
      this.currentPosition[section] += this.slideWidth;
    }
  }

  prevSlide(section: string) {
    const items = this[section as keyof AnimalesComponent] as any[];
    const maxPosition = (items.length - this.visibleSlides) * this.slideWidth;
    
    if (this.currentPosition[section] <= 0) {
      this.currentPosition[section] = maxPosition; // Va al final
    } else {
      this.currentPosition[section] -= this.slideWidth;
    }
  }
}