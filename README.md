# TimeDiff

**TimeDiff** — это библиотека для расчета разницы между двумя датами с выводом результата в человекочитаемом формате. Она поддерживает локализацию через i18n и автоматически выбирает язык по умолчанию, если он доступен.

## Установка

Для начала установите библиотеку через npm:

```bash
npm install timediff
```

## Импорт и использование

### Основные функции

```typescript
import TimeDiff from 'timediff';

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

## Описание класса

### Конструктор

```typescript
constructor(date1: Date, date2: Date)
```

- **date1** (`Date`): Первая дата, которая будет использована для вычисления.
- **date2** (`Date`): Вторая дата для вычисления разницы.

### Методы

#### `humanize(locale?: string): string`

Метод возвращает разницу между датами в виде человекочитаемой строки.

- **locale** (`string`, необязательный): Язык, на котором нужно вывести результат. Поддерживаются `'en'` (по умолчанию) и `'ru'`. Если параметр не указан, язык будет определен автоматически из контекста.

Пример:

```typescript
console.log(timeDiff.humanize('ru')); // "2 дня, 3 часа, 30 минут"
console.log(timeDiff.humanize('en')); // "2 days, 3 hours, 30 minutes"
```

### Внутренние методы

#### `calculateDiff(): TimeDiffResult`

Метод вычисляет разницу между двумя датами и возвращает объект с полями `days`, `hours`, `minutes`, и `seconds`. Этот метод используется для внутренних расчетов.

```typescript
private calculateDiff(): TimeDiffResult
```

### Автоматическое определение языка

Библиотека автоматически определяет язык, используя настройки системы или браузера. Для этого используется метод `detectLanguage`. Этот метод можно переопределить путем передачи параметра `locale` в метод `humanize`.

## Настройка i18n

Библиотека использует `i18next` для локализации. Если i18n уже инициализирован в вашем приложении, библиотека автоматически его подхватит. Если инициализация не была выполнена, библиотека создаст собственные ресурсы для английского и русского языков.

## Настройка в других приложениях

Для использования TimeDiff в приложении с i18n убедитесь, что i18n инициализирован в проекте. Вы можете добавить любые дополнительные языки, обновив инициализацию i18n до вызова `TimeDiff`.

## Поддерживаемые языки

На данный момент библиотека поддерживает:
- **en** — английский
- **ru** — русский

Вы можете добавлять дополнительные переводы, расширяя инициализацию i18n перед созданием экземпляра TimeDiff.

---

### Пример расширения локалей

Для добавления новых переводов используйте следующий шаблон:

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