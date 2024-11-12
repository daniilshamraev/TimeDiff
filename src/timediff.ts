import i18next from 'i18next';

type TimeDiffResult = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

class TimeDiff {
    private date1: Date;
    private date2: Date;

    constructor(date1: Date, date2: Date) {
        this.date1 = date1;
        this.date2 = date2;

        // Инициализация i18n, если не была произведена в контексте приложения
        if (!i18next.isInitialized) {
            i18next.init({
                lng: this.detectLanguage(),
                resources: {
                    en: {
                        translation: {
                            days: "{{count}} day",
                            days_plural: "{{count}} days",
                            hours: "{{count}} hour",
                            hours_plural: "{{count}} hours",
                            minutes: "{{count}} minute",
                            minutes_plural: "{{count}} minutes",
                            seconds: "{{count}} second",
                            seconds_plural: "{{count}} seconds"
                        }
                    },
                    ru: {
                        translation: {
                            days: "{{count}} день",
                            days_plural: "{{count}} дня",
                            days_plural_2: "{{count}} дней",
                            hours: "{{count}} час",
                            hours_plural: "{{count}} часа",
                            hours_plural_2: "{{count}} часов",
                            minutes: "{{count}} минута",
                            minutes_plural: "{{count}} минуты",
                            minutes_plural_2: "{{count}} минут",
                            seconds: "{{count}} секунда",
                            seconds_plural: "{{count}} секунды",
                            seconds_plural_2: "{{count}} секунд"
                        }
                    }
                }
            });
        }
    }

    private detectLanguage(): string {
        // Пытаемся определить язык системы или браузера, если доступно
        return navigator?.language || 'en'; // fallback на 'en', если `navigator` не доступен
    }

    private calculateDiff(): TimeDiffResult {
        const diffInMs = Math.abs(this.date2.getTime() - this.date1.getTime());
        const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    }

    public humanize(locale: string = ''): string {
        const { days, hours, minutes, seconds } = this.calculateDiff();
        i18next.changeLanguage(locale || this.detectLanguage());

        const daysStr = days > 0 ? i18next.t(days === 1 ? 'days' : 'days_plural', { count: days }) : '';
        const hoursStr = hours > 0 ? i18next.t(hours === 1 ? 'hours' : 'hours_plural', { count: hours }) : '';
        const minutesStr = minutes > 0 ? i18next.t(minutes === 1 ? 'minutes' : 'minutes_plural', { count: minutes }) : '';
        const secondsStr = seconds > 0 ? i18next.t(seconds === 1 ? 'seconds' : 'seconds_plural', { count: seconds }) : '';

        return [daysStr, hoursStr, minutesStr, secondsStr].filter(Boolean).join(', ');
    }
}

export default TimeDiff;
