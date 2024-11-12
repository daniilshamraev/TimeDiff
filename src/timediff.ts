import i18next from 'i18next';

type TimeDiffResult = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

/**
 * Класс для вычисления разницы между двумя датами и выполнения операций с ней.
 * Поддерживает локализацию через i18next и форматирование вывода.
 */
class TimeDiff {
    private milliseconds: number;

    /**
     * Конструктор класса TimeDiff.
     * @param date1 - Первая дата.
     * @param date2 - Вторая дата.
     * Разница между датами будет вычислена в миллисекундах.
     */
    constructor(date1: Date, date2: Date) {
        this.milliseconds = Math.abs(date2.getTime() - date1.getTime());

        // Инициализация i18n, если она не была произведена в контексте приложения
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

    /**
     * Определяет язык системы или браузера.
     * @returns Язык в виде строки (например, 'en' или 'ru').
     */
    private detectLanguage(): string {
        return navigator?.language || 'en';
    }

    /**
     * Вычисляет разницу в днях, часах, минутах и секундах.
     * @returns Объект типа TimeDiffResult с вычисленными значениями.
     */
    private calculateDiff(): TimeDiffResult {
        const days = Math.floor(this.milliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor((this.milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((this.milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((this.milliseconds % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    }

    /**
     * Преобразует объект TimeDiff в число для поддержки операторов сравнения, сложения и вычитания.
     * @returns Числовое значение в миллисекундах.
     */
    public valueOf(): number {
        return this.milliseconds;
    }

    /**
     * Сложение двух объектов TimeDiff.
     * @param a - Первый объект TimeDiff.
     * @param b - Второй объект TimeDiff.
     * @returns Новый объект TimeDiff с результатом сложения.
     */
    public static add(a: TimeDiff, b: TimeDiff): TimeDiff {
        return new TimeDiff(new Date(0), new Date(a.milliseconds + b.milliseconds));
    }

    /**
     * Вычитание одного объекта TimeDiff из другого.
     * @param a - Первый объект TimeDiff.
     * @param b - Второй объект TimeDiff.
     * @returns Новый объект TimeDiff с результатом вычитания.
     */
    public static subtract(a: TimeDiff, b: TimeDiff): TimeDiff {
        return new TimeDiff(new Date(0), new Date(Math.abs(a.milliseconds - b.milliseconds)));
    }

    /**
     * Метод для сложения текущего объекта TimeDiff с другим объектом TimeDiff.
     * @param other - Объект TimeDiff, который будет добавлен.
     * @returns Новый объект TimeDiff с результатом сложения.
     */
    public plus(other: TimeDiff): TimeDiff {
        return TimeDiff.add(this, other);
    }

    /**
     * Метод для вычитания другого объекта TimeDiff из текущего.
     * @param other - Объект TimeDiff, который будет вычтен.
     * @returns Новый объект TimeDiff с результатом вычитания.
     */
    public minus(other: TimeDiff): TimeDiff {
        return TimeDiff.subtract(this, other);
    }

    /**
     * Преобразует разницу в формате человекочитаемой строки.
     * @param locale - Язык для вывода результата (например, 'en' или 'ru').
     * @param format - Формат вывода ('short' или 'long').
     * @returns Строка с форматированной разницей.
     */
    public humanize(locale: string = '', format: 'short' | 'long' = 'long'): string {
        const { days, hours, minutes, seconds } = this.calculateDiff();
        i18next.changeLanguage(locale || this.detectLanguage());

        // Функция для получения правильного склонения времени
        const formatUnit = (unit: number, singularKey: string, pluralKey: string): string => {
            return i18next.t(unit === 1 ? singularKey : pluralKey, { count: unit });
        };

        // Форматирование дней, часов, минут и секунд в зависимости от выбранного формата
        let daysStr = formatUnit(days, 'days', 'days_plural');
        let hoursStr = formatUnit(hours, 'hours', 'hours_plural');
        let minutesStr = formatUnit(minutes, 'minutes', 'minutes_plural');
        let secondsStr = formatUnit(seconds, 'seconds', 'seconds_plural');

        if (format === 'short') {
            daysStr = days > 0 ? `${days}d` : '';
            hoursStr = hours > 0 ? `${hours}h` : '';
            minutesStr = minutes > 0 ? `${minutes}m` : '';
            secondsStr = seconds > 0 ? `${seconds}s` : '';
        }

        return [daysStr, hoursStr, minutesStr, secondsStr].filter(Boolean).join(format === 'short' ? ' ' : ', ');
    }
}

export default TimeDiff;
