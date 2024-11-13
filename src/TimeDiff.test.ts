// TimeDiff.test.ts

import TimeDiff from './timediff';
import i18next from 'i18next';

describe('TimeDiff Class Tests', () => {
    // Mock navigator.language for language detection
    beforeAll(() => {
        // @ts-ignore
        global.navigator = { language: 'en' };
        console.log("Setting up mock for navigator.language to 'en'.");
    });

    afterAll(() => {
        // @ts-ignore
        delete global.navigator;
        console.log("Cleaning up mock for navigator.language.");
    });

    describe('Constructor Tests', () => {
        test('Construct with two Date objects', () => {
            console.log("Testing constructor with two Date objects...");
            const date1 = new Date('2021-01-01T00:00:00Z');
            const date2 = new Date('2021-01-02T01:02:03Z');
            const diff = new TimeDiff(date1, date2);
            expect(diff.valueOf()).toBe(90123000); // Corrected expected value
        });

        test('Construct with milliseconds', () => {
            console.log("Testing constructor with milliseconds...");
            const milliseconds = 3600000; // 1 hour
            const diff = new TimeDiff(milliseconds);
            expect(diff.valueOf()).toBe(milliseconds);
        });

        test('Construct with ISO 8601 duration string', () => {
            console.log("Testing constructor with ISO 8601 duration string...");
            const isoString = 'P1DT2H3M4S';
            const diff = new TimeDiff(isoString);
            expect(diff.toISO()).toBe('P1DT2H3M4S');
        });

        test('Invalid constructor arguments', () => {
            console.log("Testing constructor with invalid arguments...");
            expect(() => new TimeDiff('invalid')).toThrow('Invalid ISO 8601 duration format');
            // @ts-ignore
            expect(() => new TimeDiff(123, 456)).toThrow('Invalid constructor arguments');
        });
    });

    describe('Static fromISO Method Tests', () => {
        test('Valid ISO string parsing', () => {
            console.log("Testing valid ISO string parsing...");
            const isoString = 'P2DT3H4M5S';
            const diff = TimeDiff.fromISO(isoString);
            expect(diff.toISO()).toBe('P2DT3H4M5S');
        });

        test('Invalid ISO string parsing', () => {
            console.log("Testing invalid ISO string parsing...");
            expect(() => TimeDiff.fromISO('Invalid')).toThrow('Invalid ISO 8601 duration format');
        });
    });

    describe('Language Detection Tests', () => {
        test('Detects English language', () => {
            console.log("Testing language detection (English)...");
            // @ts-ignore
            global.navigator.language = 'en-US';
            const diff = new TimeDiff(1000);
            expect(diff['detectLanguage']()).toBe('en');
        });

        test('Detects Russian language', () => {
            console.log("Testing language detection (Russian)...");
            // @ts-ignore
            global.navigator.language = 'ru-RU';
            const diff = new TimeDiff(1000);
            expect(diff['detectLanguage']()).toBe('ru');
        });

        test('Defaults to English when language is undefined', () => {
            console.log("Testing default language detection to English...");
            // @ts-ignore
            global.navigator.language = undefined;
            const diff = new TimeDiff(1000);
            expect(diff['detectLanguage']()).toBe('en');
        });
    });

    describe('toISO Method Tests', () => {
        test('Converts to correct ISO string', () => {
            console.log("Testing toISO method for correct ISO string conversion...");
            const diff = new TimeDiff(90123000); // Corrected milliseconds
            expect(diff.toISO()).toBe('P1DT1H2M3S'); // Expected ISO string
        });

        test('Handles zero duration', () => {
            console.log("Testing toISO method with zero duration...");
            const diff = new TimeDiff(0);
            expect(diff.toISO()).toBe('P0DT0H0M0S');
        });
    });

    describe('humanize Method Tests', () => {
        beforeEach(() => {
            i18next.init({
                lng: 'en',
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
                            seconds_plural: "{{count}} seconds",
                        },
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
                            seconds_plural_2: "{{count}} секунд",
                        },
                    },
                },
            });
        });

        test('Formats duration in English (long format)', () => {
            console.log("Testing humanize method in English (long format)...");
            const diff = new TimeDiff('P1DT2H3M4S');
            expect(diff.humanize('en', 'long')).toBe('1 day, 2 hours, 3 minutes, 4 seconds');
        });

        test('Formats duration in English (short format)', () => {
            console.log("Testing humanize method in English (short format)...");
            const diff = new TimeDiff('P0DT2H0M0S');
            expect(diff.humanize('en', 'short')).toBe('2h');
        });

        test('Formats duration in Russian (long format)', () => {
            console.log("Testing humanize method in Russian (long format)...");
            const diff = new TimeDiff('P1DT2H3M4S');
            expect(diff.humanize('ru', 'long')).toBe('1 день, 2 часа, 3 минуты, 4 секунды');
        });

        test('Formats duration in Russian (short format)', () => {
            console.log("Testing humanize method in Russian (short format)...");
            const diff = new TimeDiff('P0DT2H0M0S');
            expect(diff.humanize('ru', 'short')).toBe('2ч');
        });

        test('Handles zero duration', () => {
            console.log("Testing humanize method with zero duration...");
            const diff = new TimeDiff(0);
            expect(diff.humanize('en', 'long')).toBe('0 seconds');
            expect(diff.humanize('ru', 'long')).toBe('0 секунд');
        });

        test('Formats using default locale', () => {
            console.log("Testing humanize method with default locale (Russian)...");
            // @ts-ignore
            global.navigator.language = 'ru';
            const diff = new TimeDiff('P0DT0H0M1S');
            expect(diff.humanize('', 'long')).toBe('1 секунда');
        });

        test('Formats using ISO format', () => {
            console.log("Testing humanize method with ISO format...");
            const diff = new TimeDiff('P1DT2H3M4S');
            expect(diff.humanize('en', 'iso')).toBe('P1DT2H3M4S');
        });
    });

    describe('valueOf Method Test', () => {
        test('Returns correct milliseconds value', () => {
            console.log("Testing valueOf method for milliseconds value...");
            const diff = new TimeDiff(123456789);
            expect(diff.valueOf()).toBe(123456789);
        });
    });

    describe('Arithmetic Operations Tests', () => {
        test('Adds two TimeDiff instances', () => {
            console.log("Testing addition of two TimeDiff instances...");
            const diff1 = new TimeDiff(60000); // 1 minute
            const diff2 = new TimeDiff(30000); // 30 seconds
            const result = TimeDiff.add(diff1, diff2);
            expect(result.valueOf()).toBe(90000);
        });

        test('Subtracts two TimeDiff instances', () => {
            console.log("Testing subtraction of two TimeDiff instances...");
            const diff1 = new TimeDiff(120000); // 2 minutes
            const diff2 = new TimeDiff(30000); // 30 seconds
            const result = TimeDiff.subtract(diff1, diff2);
            expect(result.valueOf()).toBe(90000);
        });

        test('Subtracts and returns absolute value', () => {
            console.log("Testing absolute value subtraction of two TimeDiff instances...");
            const diff1 = new TimeDiff(30000); // 30 seconds
            const diff2 = new TimeDiff(120000); // 2 minutes
            const result = TimeDiff.subtract(diff1, diff2);
            expect(result.valueOf()).toBe(90000);
        });
    });

    describe('Pluralization Tests for Russian', () => {
        const testCases = [
            { unit: 'days', value: 0, expected: '0 дней' },
            { unit: 'days', value: 1, expected: '1 день' },
            { unit: 'days', value: 2, expected: '2 дня' },
            { unit: 'days', value: 5, expected: '5 дней' },
            { unit: 'hours', value: 0, expected: '0 часов' },
            { unit: 'hours', value: 1, expected: '1 час' },
            { unit: 'minutes', value: 0, expected: '0 минут' },
            { unit: 'minutes', value: 1, expected: '1 минута' },
            { unit: 'seconds', value: 0, expected: '0 секунд' },
            { unit: 'seconds', value: 1, expected: '1 секунда' },
        ];

        testCases.forEach(({ unit, value, expected }) => {
            test(`Correct pluralization for ${value} ${unit}`, () => {
                console.log(`Testing pluralization for ${value} ${unit}...`);
                let milliseconds = 0;
                if (unit === 'days') milliseconds = value * 86400000;
                if (unit === 'hours') milliseconds = value * 3600000;
                if (unit === 'minutes') milliseconds = value * 60000;
                if (unit === 'seconds') milliseconds = value * 1000;

                const diff = new TimeDiff(milliseconds);
                expect(diff.humanize('ru', 'long', unit as 'days' | 'hours' | 'minutes' | 'seconds')).toBe(expected);
            });
        });
    });
});
