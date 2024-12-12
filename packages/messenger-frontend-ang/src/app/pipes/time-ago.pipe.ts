import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    const now = new Date();
    const localTime = new Date(value);
    const seconds = Math.floor((now.getTime() - localTime.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}min`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}d`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks}w`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months}m`;
    }

    const years = Math.floor(days / 365);
    return `${years}y`;
  }
}
