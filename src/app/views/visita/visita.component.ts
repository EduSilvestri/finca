import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Visita } from '../../interface/visita.interface';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { VisitaService } from '../../services/visita.service';

@Component({
  selector: 'app-visita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './visita.component.html',
  styleUrl: './visita.component.css'
})
export class VisitaComponent implements OnInit {
  form!: FormGroup;
  minFecha: string = '';
  horasDisponibles: string[] = [];
  nombreControl!: FormControl;
  emailControl!: FormControl;

  visitasFiltradas: Visita[] = [];
  visitasPaginadas: Visita[] = [];
  paginaActual: number = 1;
  visitasPorPagina: number = 5;
  totalPaginas: number = 1;
  paginas: number[] = [];
  comentarioVisible: { [key: number]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private api: ApiService,
    private visitaService: VisitaService
  ) {}

  ngOnInit(): void {
    this.setMinFecha();
    this.generarHorasDisponibles();
    this.initForm();
    this.obtenerMisVisitas();
  }

  initForm(): void {
    const user = this.auth.getUser();

    this.nombreControl = new FormControl({ value: user?.nombre || '', disabled: true }, Validators.required);
    this.emailControl = new FormControl({ value: user?.email || '', disabled: true }, [Validators.required, Validators.email]);

    this.form = this.fb.group({
      tipoAnimal: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      comentario: ['']
    });
  }

  setMinFecha(): void {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 2);
    this.minFecha = hoy.toISOString().split('T')[0];
  }

  generarHorasDisponibles(): void {
    const horas: string[] = [];
    for (let h = 8; h <= 17; h++) {
      const hora = h < 10 ? `0${h}:00` : `${h}:00`;
      horas.push(hora);
    }
    this.horasDisponibles = horas;
  }

  agendarVisita(): void {
    if (this.form.invalid) {
      alert('Completa todos los campos obligatorios.');
      return;
    }

    const payload = {
      nombreVisitante: this.nombreControl.value,
      tipoAnimal: this.form.value.tipoAnimal,
      fecha: this.form.value.fecha + 'T' + this.form.value.hora + ':00',
      telefono: this.form.value.telefono,
      comentario: this.form.value.comentario
    };

    const token = this.auth.getToken();
    this.api.postWithAuth('visitas', payload, token!).subscribe({
      next: () => {
        alert('Visita agendada con éxito.');
        this.form.reset();
        this.obtenerMisVisitas();
      },
      error: (err) => {
        console.error('Error al agendar visita:', err);
        alert('Ocurrió un error al registrar la visita.');
      }
    });
  }

  obtenerMisVisitas(): void {
    const user = this.auth.getUser();
    if (!user?.id) return;
  
    this.visitaService.getVisitas().subscribe({
      next: (res: any) => {
        const todas = res['hydra:member'] || [];
  
    this.visitasFiltradas = todas
      .filter((v: any) => v.usuario?.id === user.id)
      .sort((a: Visita, b: Visita) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  
        this.actualizarPaginacion();
      },
      error: (err: any) => {
        console.error('Error al cargar visitas del usuario:', err);
      }
    });
  }
  

  actualizarPaginacion(): void {
  const inicio = (this.paginaActual - 1) * this.visitasPorPagina;
  const fin = inicio + this.visitasPorPagina;

  this.visitasPaginadas = this.visitasFiltradas.slice(inicio, fin);
  this.totalPaginas = Math.ceil(this.visitasFiltradas.length / this.visitasPorPagina);
  this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
}

cambiarPagina(pagina: number): void {
  if (pagina < 1 || pagina > this.totalPaginas) return;
  this.paginaActual = pagina;
  this.actualizarPaginacion();
}
  

  obtenerTiposDeAnimales(visita: Visita): string {
    return visita.tipoAnimal || '-';
  }

  obtenerFechaFormateada(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const texto = format(fecha, "EEEE d 'de' MMMM, h:mm aaaa", { locale: es });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  toggleComentario(id: number): void {
    this.comentarioVisible[id] = !this.comentarioVisible[id];
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
}
