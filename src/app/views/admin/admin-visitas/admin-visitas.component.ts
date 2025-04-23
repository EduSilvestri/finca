import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { VisitaService } from '../../../services/visita.service';
import { Visita } from '../../../interface/visita.interface';
import { CommonModule, NgClass } from '@angular/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ApiService } from '../../../services/api.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-visitas',
  imports: [CommonModule, ReactiveFormsModule, NgClass],
  templateUrl: './admin-visitas.component.html',
  styleUrl: './admin-visitas.component.css'
})
export class AdminVisitasComponent implements OnInit {
  visitas: Visita[] = [];
  visitasFiltradas: Visita[] = [];
  visitasPaginadas: Visita[] = [];
  comentarioVisible: { [key: number]: boolean } = {};
  form!: FormGroup;
  visitaEditandoId: number | null = null;
  private modalVisitaInstance: any;

  paginaActual: number = 1;
  visitasPorPagina: number = 15;
  totalPaginas: number = 1;
  paginas: number[] = [];
  horasDisponibles: string[] = [];

  estadoSeleccionado: string = 'todos';
  estados: string[] = ['todos', 'pendiente', 'confirmada', 'cancelada'];

  constructor(
    private fb: FormBuilder,
    private visitaService: VisitaService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.generarHorasDisponibles();
    this.initForm();
    this.cargarVisitas();
  }

  generarHorasDisponibles(): void {
    const horas: string[] = [];
    for (let h = 8; h <= 17; h++) {
      horas.push(h < 10 ? `0${h}:00` : `${h}:00`);
    }
    this.horasDisponibles = horas;
  }

  initForm(): void {
    this.form = this.fb.group({
      nombreVisitante: [{ value: '', disabled: true }],
      telefono: [''],
      tipoAnimal: [''],
      fecha: [''],
      hora: [''],
      comentario: ['']
    });
  }

  obtenerTiposDeAnimales(visita: Visita): string {
    return visita.tipoAnimal ?? '-';
  }

  obtenerFechaFormateada(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const texto = format(fecha, "EEEE d 'de' MMMM, h:mm aaaa", { locale: es });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  obtenerClaseEstado(estado: string | null | undefined): string {
    switch ((estado || '').toLowerCase()) {
      case 'confirmada':
        return 'badge-estado badge-confirmada';
      case 'cancelada':
        return 'badge-estado badge-cancelada';
      case 'pendiente':
      default:
        return 'badge-estado badge-pendiente';
    }
  }

  cargarVisitas(): void {
    this.visitaService.getVisitas().subscribe({
      next: (data: any) => {
        this.visitas = data['hydra:member'];
        this.filtrarPorEstado();
      },
      error: (error) => {
        console.error('Error al cargar visitas:', error);
      }
    });
  }

  filtrarPorEstado(): void {
    const estado = this.estadoSeleccionado.toLowerCase().trim();
  
    if (estado === 'todos') {
      this.visitasFiltradas = [...this.visitas];
    } else {
      this.visitasFiltradas = this.visitas.filter((v) => {
        const estadoVisita = (v.estado || 'pendiente').toLowerCase().trim();
        return estadoVisita === estado;
      });
    }
  
    // Ordenar por fecha: primero las más cercanas
    this.visitasFiltradas.sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return fechaA - fechaB;
    });
  
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }
  
  
  
  

  cambiarFiltro(estado: string): void {
    this.estadoSeleccionado = estado;
    this.filtrarPorEstado();
  }

  guardarVisita(): void {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const data: any = {
      telefono: raw.telefono,
      fecha: `${raw.fecha}T${raw.hora}`,
      comentario: raw.comentario,
      nombreVisitante: raw.nombreVisitante,
      tipoAnimal: raw.tipoAnimal
    };

    const observable = this.visitaEditandoId
      ? this.visitaService.actualizarVisita(this.visitaEditandoId, data)
      : this.visitaService.crearVisita(data);

    observable.subscribe(() => {
      this.cargarVisitas();
      this.resetModal();
      this.modalVisitaInstance?.hide();
    });
  }

  editarVisita(visita: Visita): void {
    this.visitaEditandoId = visita.id ?? null;
    const fecha = new Date(visita.fecha);
    const fechaStr = fecha.toISOString().split('T')[0];
    const horaStr = fecha.toTimeString().substring(0, 5);

    this.form.patchValue({
      nombreVisitante: visita.nombreVisitante || 'Sin nombre',
      telefono: visita.telefono,
      tipoAnimal: visita.tipoAnimal ?? '',
      fecha: fechaStr,
      hora: horaStr,
      comentario: visita.comentario || ''
    });

    this.modalVisitaInstance = new bootstrap.Modal(document.getElementById('modalVisita')!);
    this.modalVisitaInstance.show();
  }

  eliminarVisita(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta visita?')) return;

    this.visitaService.eliminarVisita(id).subscribe(() => {
      this.cargarVisitas();
    }, error => {
      console.error('Error al eliminar visita:', error);
    });
  }

  toggleComentario(id: number): void {
    this.comentarioVisible[id] = !this.comentarioVisible[id];
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.visitasPorPagina;
    const fin = inicio + this.visitasPorPagina;
    this.visitasPaginadas = this.visitasFiltradas.slice(inicio, fin);
    this.totalPaginas = Math.ceil(this.visitasFiltradas.length / this.visitasPorPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarEstado(id: number | undefined, nuevoEstado: string): void {
    if (!id) return;

    const token = localStorage.getItem('token') || '';
    const visita = this.visitas.find(v => v.id === id);
    if (!visita) return;

    this.api.patchWithAuth(`visitas/${id}`, { estado: nuevoEstado }, token).subscribe({
      next: () => this.cargarVisitas(),
      error: err => {
        console.error('Error al actualizar estado:', err);
        alert('Hubo un error al actualizar el estado.');
      }
    });
  }

  onEstadoChange(event: Event, visitaId: number | undefined) {
    if (!visitaId) return;
    const nuevoEstado = (event.target as HTMLSelectElement).value;
    this.cambiarEstado(visitaId, nuevoEstado);
  }

  abrirModalCrear(): void {
    this.visitaEditandoId = null;
    this.modalVisitaInstance = new bootstrap.Modal(document.getElementById('modalVisita')!);
    this.modalVisitaInstance.show();
  }
  

  resetModal(): void {
    this.form.reset();
    this.visitaEditandoId = null;
  }
}

