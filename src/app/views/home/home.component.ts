import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CardComponent, NgStyle, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentIndex = 3;

  cards = [
    {
      title: 'Presencia en la Feria de Brahman',
      description: 'Nos complace anunciar que participaremos en la Feria Ganadera de Brahman en Acarigua este mes de mayo. Estaremos exhibiendo nuestros ejemplares de mayor calidad, incluyendo toros de alto rendimiento y novillas con excelentes líneas genéticas. Ven a conocernos y descubre por qué somos referencia en cría ganadera de calidad.',
      image: 'images/feria.jpg',
      type: 'noticia',
      date: '2025-05-10'
    },
    {
      title: 'Animal Destacado: Don Pancho',
      description: 'Don Pancho es uno de nuestros toros Brahman más reconocidos por su porte imponente y excelente temperamento. Con una genética cuidadosamente seleccionada, ha sido parte de múltiples programas de mejora y ha demostrado ser un reproductor excepcional. Su linaje lo posiciona como un ejemplar clave en la evolución de nuestra hacienda.',
      image: 'images/pancho.jpg',
      type: 'animal',
      date: '2025-04-01'
    },
    {
      title: 'Testimonio de un cliente satisfecho',
      description: '"Estoy muy agradecido con la Hacienda La Ganancia. Adquirí dos novillas y un toro el año pasado, y no solo llegaron en perfectas condiciones, sino que el equipo me ofreció asesoramiento personalizado desde el primer día. Recomiendo totalmente sus servicios a cualquier ganadero que valore la calidad y el trato humano." — Carlos Méndez, Barinas.',
      image: 'images/testimonios.jpg',
      type: 'testimonio',
      date: '2025-03-27'
    }
  ];

  servicios = [
    {
      icono: 'bi bi-truck',
      titulo: 'Transporte Ganadero',
      descripcion: 'Traslado seguro y eficiente de tus animales a nivel regional.'
    },
    {
      icono: 'bi bi-people',
      titulo: 'Asesoría Personalizada',
      descripcion: 'Te orientamos en la selección, crianza y genética de tu ganado.'
    },
    {
      icono: 'bi bi-patch-check',
      titulo: 'Venta de Animales',
      descripcion: 'Toros, novillas y mautes seleccionados, con garantía sanitaria.'
    },
    {
      icono: 'bi bi-map',
      titulo: 'Visitas Guiadas',
      descripcion: 'Recorre nuestras instalaciones y conoce nuestros ejemplares en vivo.'
    }
  ];
  
  beneficios = [
    '+20 años de experiencia ganadera',
   'Genética de alta calidad',
   'Animales sanos y bien alimentados',
   'Trato humano y profesional'
  ];
  

  carrusel: string[] = [
    'carrusel/4.jpg',
    'carrusel/7.jpg',
    'carrusel/3.jpg',
    'carrusel/2.jpg',
    'carrusel/6.jpg',
    'carrusel/5.jpg',
    'carrusel/8.jpg',
  ];

  avanzar() {
    if (this.currentIndex < this.carrusel.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }
  
  retroceder() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.carrusel.length - 1;
    }
  }
}
