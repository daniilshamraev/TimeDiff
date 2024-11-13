import TimeDiff from './timediff';

describe('TimeDiff', () => {
    const date1 = new Date(2023, 0, 1, 0, 0, 0);
    const date2 = new Date(2023, 0, 2, 12, 30, 15);
    let timeDiff: TimeDiff;

    beforeEach(() => {
        timeDiff = new TimeDiff(date1, date2);
    });

    it('should calculate milliseconds difference correctly', () => {
        const expectedMilliseconds = Math.abs(date2.getTime() - date1.getTime());
        const actualMilliseconds = timeDiff.valueOf();
        expect(Math.abs(actualMilliseconds - expectedMilliseconds)).toBeLessThan(5000);
    });

    it('should calculate correct days, hours, minutes, and seconds', () => {
        const result = timeDiff['calculateDiff']();
        expect(result).toEqual({
            days: 1,
            hours: 12,
            minutes: 30,
            seconds: 15,
        });
    });

    it('should correctly format time difference in long format (English)', () => {
        const result = timeDiff.humanize('en', 'long');
        expect(result).toBe('1 day, 12 hours, 30 minutes, 15 seconds');
    });

    it('should correctly format time difference in short format (English)', () => {
        const result = timeDiff.humanize('en', 'short');
        expect(result).toBe('1d 12h 30m 15s');
    });

    it('should correctly format time difference in long format (Russian)', () => {
        const result = timeDiff.humanize('ru', 'long');
        expect(result).toBe('1 день, 12 часов, 30 минут, 15 секунд');
    });

    it('should correctly format time difference in short format (Russian)', () => {
        const result = timeDiff.humanize('ru', 'short');
        expect(result).toBe('1д 12ч 30м 15с');
    });

    it('should detect language correctly if not specified', () => {
        const language = timeDiff['detectLanguage']();
        expect(['en', 'ru']).toContain(language);
    });

    it('should handle zero days, hours, minutes, and seconds', () => {
        const zeroDiff = new TimeDiff(new Date(2023, 0, 1, 0, 0, 0), new Date(2023, 0, 1, 0, 0, 0));
        const result = zeroDiff.humanize('en', 'long');
        expect(result).toBe('0 seconds');
    });

    it('should handle pluralization correctly for Russian (2 days)', () => {
        const diff = new TimeDiff(new Date(2023, 0, 1), new Date(2023, 0, 3));
        const result = diff.humanize('ru', 'long');
        expect(result).toBe('2 дня');
    });

    it('should handle pluralization correctly for Russian (5 days)', () => {
        const diff = new TimeDiff(new Date(2023, 0, 1), new Date(2023, 0, 6));
        const result = diff.humanize('ru', 'long');
        expect(result).toBe('5 дней');
    });
});
