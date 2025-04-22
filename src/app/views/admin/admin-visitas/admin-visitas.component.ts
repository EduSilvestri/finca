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
  visitasPaginadas: Visita[] = [];
  comentarioVisible: { [key: number]: boolean } = {};
  form!: FormGroup;
  visitaEditandoId: number | null = null;

  paginaActual: number = 1;
  visitasPorPagina: number = 15;
  totalPaginas: number = 1;
  paginas: number[] = [];

  constructor(
    private fb: FormBuilder,
    private visitaService: VisitaService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarVisitas();
  }

  initForm(): void {
    this.form = this.fb.group({
      nombreVisitante: [{ value: '', disabled: true }],
      telefono: [''],
      tipoAnimal: [''],
      fecha: [''],
      comentario: ['']
    });
  }

  obtenerTiposDeAnimales(visita: Visita): string {
    if (!visita.animales || visita.animales.length === 0) return '-';
    return visita.animales
      .map(a => a.tipo)
      .filter(Boolean)
      .join(', ');
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
    this.visitaService.getVisitas().subscribe((data: any) => {
      console.log('Visitas recibidas:', data);
      this.visitas = data['hydra:member'];
      this.actualizarPaginacion();
    }, (error) => {
      console.error('Error al cargar visitas:', error);
    });
  }
  

  guardarVisita(): void {
    if (this.form.invalid) return;
  
    const raw = this.form.getRawValue();
  
    const data: any = {
      telefono: raw.telefono,
      fecha: raw.fecha,
      comentario: raw.comentario
    };
  
    // Solo incluir animales si es una nueva visita
    if (!this.visitaEditandoId) {
      data.animales = [{ tipo: raw.tipoAnimal }];
    }
  
    if (this.visitaEditandoId) {
      this.visitaService.actualizarVisita(this.visitaEditandoId, data).subscribe(() => {
        this.cargarVisitas();
        this.resetModal();
      });
    } else {
      this.visitaService.crearVisita(data).subscribe(() => {
        this.cargarVisitas();
        this.resetModal();
      });
    }
  }
  
  
  
  

  editarVisita(visita: Visita): void {
    this.visitaEditandoId = visita.id ?? null;

    const fechaFormateada = visita.fecha
  ? new Date(visita.fecha).toISOString().substring(0, 16) // formato 'yyyy-MM-ddTHH:mm'
  : '';

    this.form.patchValue({
      nombreVisitante: visita.usuario?.nombre || 'Sin nombre',
      telefono: visita.telefono,
      tipoAnimal: visita.tipoAnimal || (visita.animales?.[0]?.tipo ?? ''),
      fecha: fechaFormateada,
      comentario: visita.comentario || ''
    });
  
    // Abre el modal con Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('modalVisita')!);
    modal.show();
  }
  

  eliminarVisita(id: number): void {
    console.log('Intentando eliminar visita ID:', id);
    if (!confirm('¿Estás seguro de eliminar esta visita?')) return;
  
    this.visitaService.eliminarVisita(id).subscribe(() => {
      console.log('Visita eliminada');
      this.cargarVisitas();
    }, (error) => {
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

  cambiarEstado(id: number | undefined, nuevoEstado: string): void {
    if (!id) return;
  
    const token = localStorage.getItem('token') || '';
  
    const visita = this.visitas.find(v => v.id === id);
    if (!visita) return;
  
    // Clonar la visita y actualizar solo el estado
    const visitaActualizada = { ...visita, estado: nuevoEstado };

    this.api.patchWithAuth(`visitas/${id}`, { estado: nuevoEstado }, token).subscribe({
      next: () => {
        console.log('Estado actualizado');
        this.cargarVisitas(); // o actualizar solo esa visita localmente si prefieres
      },
      error: err => {
        console.error('Error al actualizar estado:', err);
        alert('Hubo un error al actualizar el estado.');
      }
    });
  }

  onEstadoChange(event: Event, visitaId: number | undefined) {
    if (!visitaId) return;
  
    const selectElement = event.target as HTMLSelectElement;
    const nuevoEstado = selectElement.value;
  
    this.cambiarEstado(visitaId, nuevoEstado);
  }
  

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.visitasPorPagina;
    const fin = inicio + this.visitasPorPagina;
    this.visitasPaginadas = this.visitas.slice(inicio, fin);
    this.totalPaginas = Math.ceil(this.visitas.length / this.visitasPorPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  resetModal(): void {
    this.form.reset();
    this.visitaEditandoId = null;
  }
}
