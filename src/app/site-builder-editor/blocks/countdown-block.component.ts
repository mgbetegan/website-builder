// ⏰ COUNTDOWN BLOCK

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Block, Theme } from '../models';

@Component({
  selector: 'app-countdown-block',
  template: `
    <div class="countdown-section">
      <div class="countdown-container">
        <div class="countdown-item">
          <div class="countdown-value" [style.color]="theme.colors.primary">{{ days }}</div>
          <div class="countdown-label" [style.color]="theme.colors.text">
            {{ block.properties.labels?.days || 'Jours' }}
          </div>
        </div>
        <div class="countdown-item">
          <div class="countdown-value" [style.color]="theme.colors.primary">{{ hours }}</div>
          <div class="countdown-label" [style.color]="theme.colors.text">
            {{ block.properties.labels?.hours || 'Heures' }}
          </div>
        </div>
        <div class="countdown-item">
          <div class="countdown-value" [style.color]="theme.colors.primary">{{ minutes }}</div>
          <div class="countdown-label" [style.color]="theme.colors.text">
            {{ block.properties.labels?.minutes || 'Minutes' }}
          </div>
        </div>
        <div class="countdown-item">
          <div class="countdown-value" [style.color]="theme.colors.primary">{{ seconds }}</div>
          <div class="countdown-label" [style.color]="theme.colors.text">
            {{ block.properties.labels?.seconds || 'Secondes' }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .countdown-section {
      padding: 3rem 2rem;
      text-align: center;
    }

    .countdown-container {
      display: flex;
      justify-content: center;
      gap: 3rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .countdown-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .countdown-value {
      font-size: 3.5rem;
      font-weight: 700;
      font-family: var(--font-heading);
      line-height: 1;
    }

    .countdown-label {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .countdown-container {
        gap: 1.5rem;
      }

      .countdown-value {
        font-size: 2.5rem;
      }

      .countdown-label {
        font-size: 0.75rem;
      }
    }
  `]
})
export class CountdownBlockComponent implements OnInit, OnDestroy {
  @Input() block!: Block;
  @Input() theme!: Theme;

  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  private interval: any;

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private startCountdown(): void {
    this.updateCountdown();

    this.interval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown(): void {
    const targetDate = new Date(this.block.properties.date);
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff > 0) {
      this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    } else {
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    }
  }
}
