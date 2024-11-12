# TimeDiff

**TimeDiff** — это библиотека для расчета разницы между двумя датами с выводом результата в человекочитаемом формате. Поддерживается локализация через i18n, и автоматически определяется язык по умолчанию.

## Установка

Для установки библиотеки используйте npm:

```bash
npm install @on_plc/timediff
```

## Импорт и использование

### Основные функции

```typescript
import TimeDiff from '@on_plc/timediff';

const date1 = new Date('2024-11-12T09:00:00');
const date2 = new Date('2024-11-14T12:30:00');

const timeDiff = new TimeDiff(date1, date2);

// Получение человекочитаемой строки с автоматическим определением языка
console.log(timeDiff.humanize()); 

// Указание языка (например, русский)
console.log(timeDiff.humanize('ru')); 

// Указание языка (например, английский)
console.log(timeDiff.humanize('en')); 
```

### Сложение и вычитание

Библиотека поддерживает операции сложения и вычитания с использованием методов `plus` и `minus`, а также статических методов `add` и `subtract`.

```typescript
const timeDiff1 = new TimeDiff(date1, date2);
const date3 = new Date('2024-11-15T15:00:00');
const timeDiff2 = new TimeDiff(date2, date3);

// Сложение через метод `plus`
const addedDiff = timeDiff1.plus(timeDiff2);
console.log(addedDiff.humanize('en'));

// Вычитание через метод `minus`
const subtractedDiff = timeDiff2.minus(timeDiff1);
console.log(subtractedDiff.humanize('en'));
```

## Описание класса

### Конструктор

```typescript
constructor(date1: Date, date2: Date)
```

- **date1** (`Date`): Первая дата.
- **date2** (`Date`): Вторая дата.

### Методы

#### `humanize(locale?: string, format?: 'short' | 'long'): string`

Возвращает разницу между датами в виде человекочитаемой строки.

- **locale** (`string`, необязательный): Язык для вывода результата. Поддерживаются `'en'` и `'ru'`.
- **format** (`'short' | 'long'`, необязательный): Формат вывода. `short` возвращает краткий формат (например, `2d 3h`), `long` возвращает полную форму (например, `2 days, 3 hours`).

Пример:

```typescript
console.log(timeDiff.humanize('ru', 'short')); // "2д 3ч"
console.log(timeDiff.humanize('en', 'long')); // "2 days, 3 hours"
```

#### `plus(other: TimeDiff): TimeDiff`

Метод для сложения текущего объекта `TimeDiff` с другим объектом `TimeDiff`.

- **other** (`TimeDiff`): Объект для добавления.
- **Возвращает**: Новый объект `TimeDiff` с результатом сложения.

#### `minus(other: TimeDiff): TimeDiff`

Метод для вычитания другого объекта `TimeDiff` из текущего.

- **other** (`TimeDiff`): Объект для вычитания.
- **Возвращает**: Новый объект `TimeDiff` с результатом вычитания.

#### `add(a: TimeDiff, b: TimeDiff): TimeDiff` (статический метод)

Выполняет сложение двух объектов `TimeDiff`.

- **a** (`TimeDiff`): Первый объект.
- **b** (`TimeDiff`): Второй объект.
- **Возвращает**: Новый объект `TimeDiff` с результатом сложения.

#### `subtract(a: TimeDiff, b: TimeDiff): TimeDiff` (статический метод)

Выполняет вычитание одного объекта `TimeDiff` из другого.

- **a** (`TimeDiff`): Первый объект.
- **b** (`TimeDiff`): Второй объект.
- **Возвращает**: Новый объект `TimeDiff` с результатом вычитания.

### Внутренние методы

#### `calculateDiff(): TimeDiffResult`

Вычисляет разницу между двумя датами и возвращает объект с полями `days`, `hours`, `minutes`, и `seconds`. Используется для внутренних расчетов.

#### `detectLanguage(): string`

Определяет язык системы или браузера, возвращая строку языка (например, `'en'` или `'ru'`).

## Настройка i18n

Библиотека использует `i18next` для локализации. Если i18n уже инициализирован, библиотека его подхватит. В противном случае будут использованы встроенные ресурсы для английского и русского языков.

## Настройка в других приложениях

Для использования **TimeDiff** в приложении с i18n, убедитесь, что инициализация i18n выполнена перед созданием экземпляра **TimeDiff**. Добавляйте языки, расширяя инициализацию i18n перед вызовом `TimeDiff`.

## Поддерживаемые языки

Поддерживаются:
- **en** — английский
- **ru** — русский

### Пример расширения локалей

Для добавления новых переводов:

```typescript
import i18next from 'i18next';

i18next.init({
  resources: {
    es: {
      translation: {
        days: "{{count}} día",
        days_plural: "{{count}} días",
        hours: "{{count}} hora",
        hours_plural: "{{count}} horas",
        minutes: "{{count}} minuto",
        minutes_plural: "{{count}} minutos",
        seconds: "{{count}} segundo",
        seconds_plural: "{{count}} segundos"
      }
    }
  }
});

const date1 = new Date();
const date2 = new Date(date1.getTime() + 3600000); // +1 час

const timeDiff = new TimeDiff(date1, date2);
console.log(timeDiff.humanize('es')); // "1 hora"
```