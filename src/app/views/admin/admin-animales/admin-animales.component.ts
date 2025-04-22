import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

declare var bootstrap: any;


@Component({
  selector: 'app-admin-animales',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-animales.component.html',
  styleUrl: './admin-animales.component.css'
})
export class AdminAnimalesComponent implements OnInit {
  
  animales: any = [];
  
  form!: FormGroup;
  selectedFile!: File | null;
  animalEditandoId: number | null = null;
  tipoActual = signal<string | null>(null);
  animalesFiltrados: any[] = [];
  tipoFiltro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarAnimales();
    this.form.get('tipo')?.valueChanges.subscribe((tipo) => {
      this.tipoActual.set(tipo);
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [''],
      tipo: ['', Validators.required],
      nombre: [''],
      raza: ['', Validators.required],
      edad: ['', Validators.required],
      peso: ['', Validators.required],
      color: [''],
      padre: [''],
      madre: [''],
      procedencia: [''],
      descripcion: ['', Validators.required],
      litrosPromedio: [''],
      lote: [''],
      precio: [''],
      precioLote: [''],
      prenada: ['']
    });
  }

  cargarAnimales(): void {
    const token = this.auth.getToken();
    if (token) {
      this.api.getAnimales(token).subscribe({
        next: (data) => {
          console.log('Respuesta backend animales:', data);
          this.animales = data['hydra:member'] || [];
          this.filtrarPorTipo(this.tipoFiltro);
        },
        error: (err) => {
          console.error('Error al obtener animales', err);
        }
      });
    }
  }

  filtrarPorTipo(tipo: string | null): void {
    this.tipoFiltro = tipo;
    this.paginaActual = 1
    if (tipo) {
      this.animalesFiltrados = this.animales.filter((a: any) => a.tipo.toLowerCase() === tipo.toLowerCase());
    } else {
      this.animalesFiltrados = [...this.animales];
    }
  }

  onTipoChange(): void {
    const tipo = this.form.get('tipo')?.value;
    console.log('TIPO SELECCIONADO:', tipo); 
    this.tipoActual.set(tipo);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file ?? null;
  }

  create(): void {
    if (this.form.invalid) {
      alert('Completa los campos obligatorios.');
      return;
    }
  
    const formData = new FormData();
  
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });
  
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }
  
    const token = this.auth.getToken();
    const id = this.animalEditandoId;
  
    const endpoint = id ? `animals/${id}/actualizar` : 'animals';
    const method = id ? this.api.postWithAuth : this.api.postWithAuth;

  
    method.call(this.api, endpoint, formData, token!).subscribe({
      next: () => {
        alert(id ? 'Animal actualizado.' : 'Animal registrado con éxito.');
        this.resetModal();
        this.cargarAnimales();
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al registrar el animal.');
      }
    });
  }
  

  resetModal(): void {
    this.form.reset();                
    this.selectedFile = null;        
    this.tipoActual.set(null);    
    this.animalEditandoId = null;  
  }

  editarAnimal(animal: any): void {
    // Llena el formulario con los valores del animal
    this.form.patchValue({
      id: animal.id,
      tipo: animal.tipo,
      nombre: animal.nombre,
      raza: animal.raza,
      edad: animal.edad,
      peso: animal.peso,
      color: animal.color,
      padre: animal.padre,
      madre: animal.madre,
      procedencia: animal.procedencia,
      descripcion: animal.descripcion,
      litrosPromedio: animal.litrosPromedio,
      lote: animal.lote,
      precio: animal.precio,
      precioLote: animal.precioLote,
      prenada: animal.prenada
    });
  
    // Guarda el ID del animal que se está editando
    this.animalEditandoId = this.extraerId(animal['@id']);
    this.tipoActual.set(animal.tipo);
  
    // Abre el modal
    const modal = new bootstrap.Modal(document.getElementById('modalAnimal')!);
    modal.show();
  }

  extraerId(apiId: string): number {
    const partes = apiId.split('/');
    return parseInt(partes[partes.length - 1], 10);
  }
  
  
  eliminarAnimal(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este animal?')) return;
  
    const token = this.auth.getToken();
    this.api.deleteWithAuth(`animals/${id}`, token!).subscribe({
      next: () => {
        alert('Animal eliminado correctamente.');
        this.cargarAnimales();
      },
      error: (err) => {
        console.error('Error al eliminar animal:', err);
        alert('Hubo un error al eliminar el animal.');
      }
    });
  }

  descripcionVisible: { [key: number]: boolean } = {};

  toggleDescripcion(id: number): void {
    this.descripcionVisible[id] = !this.descripcionVisible[id];
  }

  pageSize = 15;
paginaActual = 1;

get totalPaginas(): number {
  return Math.ceil(this.animalesFiltrados.length / this.pageSize);
}

get animalesPaginados() {
  const inicio = (this.paginaActual - 1) * this.pageSize;
  const fin = inicio + this.pageSize;
  return this.animalesFiltrados.slice(inicio, fin);
}

cambiarPagina(pagina: number) {
  if (pagina >= 1 && pagina <= this.totalPaginas) {
    this.paginaActual = pagina;
  }
}

get paginas(): number[] {
  return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
}

}