import i18next from 'i18next';

type TimeDiffResult = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

class TimeDiff {
    private milliseconds: number;

    constructor(date1: Date, date2: Date) {
        this.milliseconds = Math.abs(date2.getTime() - date1.getTime());

        if (!i18next.isInitialized) {
            i18next.init({
                lng: this.detectLanguage(),
                pluralSeparator: '_',
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
        return navigator?.language.startsWith('ru') ? 'ru' : 'en';
    }

    private calculateDiff(): TimeDiffResult {
        const days = Math.floor(this.milliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor((this.milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((this.milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((this.milliseconds % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    }

    public valueOf(): number {
        return this.milliseconds;
    }

    public static add(a: TimeDiff, b: TimeDiff): TimeDiff {
        return new TimeDiff(new Date(0), new Date(a.milliseconds + b.milliseconds));
    }

    public static subtract(a: TimeDiff, b: TimeDiff): TimeDiff {
        return new TimeDiff(new Date(0), new Date(Math.abs(a.milliseconds - b.milliseconds)));
    }

    private getPluralKeyForRu(unit: number, singularKey: string, pluralKey1: string, pluralKey2: string): string {
        const lastDigit = unit % 10;
        const lastTwoDigits = unit % 100;
        if (lastDigit === 1 && lastTwoDigits !== 11) {
            return singularKey;
        } else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
            return pluralKey1;
        } else {
            return pluralKey2;
        }
    }

    public humanize(locale: string = '', format: 'short' | 'long' = 'long'): string {
        const { days, hours, minutes, seconds } = this.calculateDiff();
        i18next.changeLanguage(locale || this.detectLanguage());

        const formatUnit = (unit: number, singularKey: string, pluralKey: string, pluralKey2?: string): string => {
            if (locale === 'ru') {
                const pluralKeyRu = this.getPluralKeyForRu(unit, singularKey, pluralKey, pluralKey2 || pluralKey);
                return i18next.t(pluralKeyRu, { count: unit });
            }
            return i18next.t(unit === 1 ? singularKey : pluralKey, { count: unit });
        };

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            return i18next.t('seconds_plural', { count: 0 });
        }

        const daysStr = days > 0 ? formatUnit(days, 'days', 'days_plural', 'days_plural_2') : '';
        const hoursStr = hours > 0 ? formatUnit(hours, 'hours', 'hours_plural', 'hours_plural_2') : '';
        const minutesStr = minutes > 0 ? formatUnit(minutes, 'minutes', 'minutes_plural', 'minutes_plural_2') : '';
        const secondsStr = seconds > 0 ? formatUnit(seconds, 'seconds', 'seconds_plural', 'seconds_plural_2') : '';

        if (format === 'short') {
            return [
                days && `${days}${locale === 'ru' ? 'д' : 'd'}`,
                hours && `${hours}${locale === 'ru' ? 'ч' : 'h'}`,
                minutes && `${minutes}${locale === 'ru' ? 'м' : 'm'}`,
                seconds && `${seconds}${locale === 'ru' ? 'с' : 's'}`
            ].filter(Boolean).join(' ');
        }

        return [daysStr, hoursStr, minutesStr, secondsStr].filter(Boolean).join(', ');
    }
}

export default TimeDiff;
