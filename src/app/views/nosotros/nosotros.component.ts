import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  imports: [RouterLink],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {
  eventos = [
    {
      anio: '2005',
      titulo: 'Nacimiento de La Ganancia'
    },
    {
      anio: '2010',
      titulo: 'Primera Feria Regional'
    },
    {
      anio: '2015',
      titulo: 'Expansión de instalaciones'
    },
    {
      anio: '2020',
      titulo: 'Reconocimiento Nacional'
    },
    {
      anio: '2025',
      titulo: 'Lanzamiento Web'
    }
  ];

  valores = [
    { nombre: 'Pasión', icono: 'bi-heart-fill', descripcion: 'Amamos lo que hacemos y cuidamos cada detalle.' },
    { nombre: 'Compromiso', icono: 'bi-people-fill', descripcion: 'Trabajamos con dedicación por un futuro mejor.' },
    { nombre: 'Responsabilidad', icono: 'bi-shield-check', descripcion: 'Cuidamos nuestro entorno y nuestros animales.' },
    { nombre: 'Sostenibilidad', icono: 'bi-tree-fill', descripcion: 'Practicamos una ganadería consciente y verde.' }
  ];
  
}
