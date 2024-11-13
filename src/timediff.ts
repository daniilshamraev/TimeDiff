import i18next from 'i18next';

/**
 * Interface representing the result of a time difference calculation.
 * It includes the number of days, hours, minutes, and seconds.
 */
type TimeDiffResult = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

/**
 * Class representing a time difference, with multiple constructors for
 * various initialization formats (two dates, milliseconds, or ISO 8601 duration).
 * It supports language-specific formatting and ISO 8601 representation.
 */
class TimeDiff {
    private milliseconds: number;

    /**
     * Constructs a TimeDiff instance.
     * Supports three types of constructors:
     * 1. Two Date objects to calculate the time difference between them.
     * 2. A number representing milliseconds.
     * 3. An ISO 8601 duration string.
     *
     * @param {Date | number | string} arg1 - The first date, milliseconds, or ISO string.
     * @param {Date} [arg2] - The second date (optional, used only when arg1 is a Date).
     * @throws {Error} Throws an error if arguments are invalid.
     */
    constructor(date1: Date, date2: Date);
    constructor(milliseconds: number);
    constructor(isoString: string);
    constructor(arg1: Date | number | string, arg2?: Date) {
        if (typeof arg1 === 'string') {
            // Initializes from an ISO 8601 string
            this.milliseconds = TimeDiff.fromISO(arg1).milliseconds;
        } else if (typeof arg1 === 'number') {
            if (arg2 !== undefined) {
                throw new Error("Invalid constructor arguments");
            }
            // Initializes with milliseconds
            this.milliseconds = arg1;
        } else if (arg1 instanceof Date && arg2 instanceof Date) {
            // Initializes with two dates
            this.milliseconds = Math.abs(arg2.getTime() - arg1.getTime());
        } else {
            throw new Error("Invalid constructor arguments");
        }

        // Initialize i18next for translations if not initialized
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

    /**
     * Creates a TimeDiff instance from an ISO 8601 duration string.
     * Parses the ISO string format "P[n]DT[n]H[n]M[n]S".
     *
     * @param {string} isoString - ISO 8601 duration string.
     * @returns {TimeDiff} TimeDiff instance representing the duration.
     * @throws {Error} Throws an error if the format is invalid.
     */
    static fromISO(isoString: string): TimeDiff {
        const isoRegex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const match = isoString.match(isoRegex);

        if (!match) {
            throw new Error("Invalid ISO 8601 duration format");
        }

        const days = parseInt(match[1] || '0', 10);
        const hours = parseInt(match[2] || '0', 10);
        const minutes = parseInt(match[3] || '0', 10);
        const seconds = parseInt(match[4] || '0', 10);

        const milliseconds =
            days * 24 * 60 * 60 * 1000 +
            hours * 60 * 60 * 1000 +
            minutes * 60 * 1000 +
            seconds * 1000;

        return new TimeDiff(milliseconds);
    }

    /**
     * Detects the user's language based on the browser's navigator object.
     * Defaults to 'en' (English) if the language cannot be detected.
     *
     * @returns {string} The detected language code ('ru' for Russian, 'en' for English).
     */
    private detectLanguage(): string {
        const language = navigator?.language || '';
        return language.startsWith('ru') ? 'ru' : 'en';
    }

    /**
     * Calculates the time difference in days, hours, minutes, and seconds.
     *
     * @returns {TimeDiffResult} An object containing days, hours, minutes, and seconds.
     */
    private calculateDiff(): TimeDiffResult {
        const days = Math.floor(this.milliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor((this.milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((this.milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((this.milliseconds % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    }

    /**
     * Converts the time difference to an ISO 8601 duration string.
     *
     * @returns {string} The ISO 8601 duration string representation.
     */
    public toISO(): string {
        const { days, hours, minutes, seconds } = this.calculateDiff();
        return `P${days}DT${hours}H${minutes}M${seconds}S`;
    }

    /**
     * Formats the time difference as a human-readable string, with support for localization.
     *
     * @param {string} locale - The language locale ('en' or 'ru').
     * @param {'short' | 'long' | 'iso'} format - The format type:
     *   - 'short': Abbreviated format (e.g., "2d 3h").
     *   - 'long': Full word format (e.g., "2 days, 3 hours").
     *   - 'iso': ISO 8601 duration format.
     * @returns {string} The formatted time difference.
     */
    public humanize(locale: string = '', format: 'short' | 'long' | 'iso' = 'long', baseUnit: 'days' | 'hours' | 'minutes' | 'seconds' = 'seconds'): string {
        if (format === 'iso') {
            return this.toISO();
        }
        const { days, hours, minutes, seconds } = this.calculateDiff();
        i18next.changeLanguage(locale || this.detectLanguage());

        const formatUnit = (unit: number, singularKey: string, pluralKey: string, pluralKey2?: string): string => {
            if (locale === 'ru') {
                const pluralKeyRu = this.getPluralKeyForRu(unit, singularKey, pluralKey, pluralKey2 || pluralKey);
                return i18next.t(pluralKeyRu, { count: unit });
            }
            return i18next.t(unit === 1 ? singularKey : pluralKey, { count: unit });
        };

        // Handle zero duration with the specified base unit
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            switch (baseUnit) {
                case 'days': return formatUnit(0, 'days', 'days_plural', 'days_plural_2');
                case 'hours': return formatUnit(0, 'hours', 'hours_plural', 'hours_plural_2');
                case 'minutes': return formatUnit(0, 'minutes', 'minutes_plural', 'minutes_plural_2');
                case 'seconds':
                default:
                    return formatUnit(0, 'seconds', 'seconds_plural', 'seconds_plural_2');
            }
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



    /**
     * Returns the internal milliseconds value for the time difference.
     *
     * @returns {number} The time difference in milliseconds.
     */
    public valueOf(): number {
        return this.milliseconds;
    }

    /**
     * Adds two TimeDiff instances and returns a new TimeDiff instance with the combined duration.
     *
     * @param {TimeDiff} a - The first TimeDiff instance.
     * @param {TimeDiff} b - The second TimeDiff instance.
     * @returns {TimeDiff} A new TimeDiff instance representing the sum of the two durations.
     */
    public static add(a: TimeDiff, b: TimeDiff): TimeDiff {
        return new TimeDiff(a.milliseconds + b.milliseconds);
    }

    /**
     * Subtracts one TimeDiff instance from another and returns a new TimeDiff instance.
     *
     * @param {TimeDiff} a - The minuend TimeDiff instance.
     * @param {TimeDiff} b - The subtrahend TimeDiff instance.
     * @returns {TimeDiff} A new TimeDiff instance representing the absolute difference in duration.
     */
    public static subtract(a: TimeDiff, b: TimeDiff): TimeDiff {
        return new TimeDiff(Math.abs(a.milliseconds - b.milliseconds));
    }

    /**
     * Determines the appropriate pluralization key for Russian, based on the unit value.
     *
     * @param {number} unit - The unit value (e.g., number of days).
     * @param {string} singularKey - The singular form translation key.
     * @param {string} pluralKey1 - The plural form translation key for 2-4 units.
     * @param {string} pluralKey2 - The plural form translation key for 5+ units.
     * @returns {string} The correct translation key based on the unit's value.
     */
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
}

export default TimeDiff;
