import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.setMinFecha();
    this.generarHorasDisponibles();

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
      nombre: this.nombreControl.value,
      email: this.emailControl.value,
      animales: [
        { tipo: this.form.value.tipoAnimal }
      ],
      fecha: this.form.value.fecha + 'T' + this.form.value.hora + ':00',
      telefono: this.form.value.telefono,
      comentario: this.form.value.comentario
    };

    const token = this.auth.getToken();
    this.api.postWithAuth('visitas', payload, token!).subscribe({
      next: () => {
        alert('Visita agendada con éxito.');
        this.form.reset();
      },
      error: (err) => {
        console.error('Error al agendar visita:', err);
        alert('Ocurrió un error al registrar la visita.');
      }
    });
  }
}
