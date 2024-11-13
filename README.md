# TimeDiff

`TimeDiff` — это TypeScript-библиотека для расчета разницы между двумя датами с поддержкой локализации и правильного форматирования на нескольких языках (включая русскую и английскую локали).

## Установка

Установите пакет с помощью npm:

```bash
npm install @on_plc/timediff
```

## Использование

### Импортирование библиотеки

```typescript
import TimeDiff from '@on_plc/timediff';
```

### Примеры использования

#### Создание объекта TimeDiff

```typescript
const date1 = new Date(2023, 0, 1, 0, 0, 0); // 1 января 2023 года
const date2 = new Date(2023, 0, 2, 12, 30, 15); // 2 января 2023 года

const timeDiff = new TimeDiff(date1, date2);
```

#### Получение разницы в миллисекундах

```typescript
console.log(timeDiff.valueOf()); // Разница в миллисекундах
```

#### Форматирование разницы в человекочитаемом формате

- **Полный формат (long)** — с учетом множественного числа.
- **Короткий формат (short)** — с сокращенными единицами времени.

```typescript
// Английский язык, полный формат
console.log(timeDiff.humanize('en', 'long')); 
// Output: "1 day, 12 hours, 30 minutes, 15 seconds"

// Английский язык, короткий формат
console.log(timeDiff.humanize('en', 'short')); 
// Output: "1d 12h 30m 15s"

// Русский язык, полный формат
console.log(timeDiff.humanize('ru', 'long')); 
// Output: "1 день, 12 часов, 30 минут, 15 секунд"

// Русский язык, короткий формат
console.log(timeDiff.humanize('ru', 'short')); 
// Output: "1д 12ч 30м 15с"
```

#### Сложение и вычитание объектов TimeDiff

```typescript
const date3 = new Date(2023, 0, 3);
const diff1 = new TimeDiff(date1, date2);
const diff2 = new TimeDiff(date2, date3);

const sum = TimeDiff.add(diff1, diff2);
const difference = TimeDiff.subtract(diff1, diff2);

console.log(sum.humanize('en', 'long')); // Форматирование суммы
console.log(difference.humanize('ru', 'short')); // Форматирование разности
```

### Дополнительные возможности

- **Автоматическое определение языка**: если язык не указан, `TimeDiff` попытается определить язык автоматически.
- **Множественные формы для русского языка**: корректное отображение единиц времени на русском языке с учетом склонений (`день`, `дня`, `дней` и т.д.).

## API

### `new TimeDiff(date1: Date, date2: Date)`

Создает объект `TimeDiff`, рассчитывая разницу между двумя датами.

### `humanize(locale?: string, format?: 'short' | 'long'): string`

Форматирует разницу во времени в человекочитаемый формат.

- `locale`: Код языка (например, 'en' или 'ru'). Если не указан, язык определяется автоматически.
- `format`: `'short'` для сокращенного формата или `'long'` для полного формата. По умолчанию — `'long'`.

### `valueOf(): number`

Возвращает разницу во времени в миллисекундах.

### `TimeDiff.add(a: TimeDiff, b: TimeDiff): TimeDiff`

Складывает две разницы `TimeDiff` и возвращает новую разницу.

### `TimeDiff.subtract(a: TimeDiff, b: TimeDiff): TimeDiff`

Вычитает одну разницу `TimeDiff` из другой и возвращает результат.

## Участие в разработке

Будем рады вашим предложениям и отзывам! Пожалуйста, создавайте Issues и Pull Requests, чтобы помочь улучшить этот пакет.

## Лицензия

MIT License