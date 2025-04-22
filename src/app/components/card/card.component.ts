import { Component, Input } from '@angular/core';
import { CardData } from '../../interface/cardData';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  expanded: boolean = false;

  @Input() data!: CardData;
  
  toggleExpand(): void {
    this.expanded = !this.expanded;
  }
}
