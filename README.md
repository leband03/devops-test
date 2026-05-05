# DevOps Test: Docker + Fluent Bit + Loki + Grafana


## 1. Быстрый запуск

Из корня проекта выполнить:

```bash
docker compose up --build -d
```

Проверить, что контейнеры запущены:

```bash
docker compose ps
```

Ожидаемые сервисы:

```text
devops-test-app
devops-test-fluent-bit
devops-test-loki
devops-test-grafana
```

---

## 2. Проверка приложения

Приложение доступно по адресу:

```text
http://localhost:3000
```

---

## 3. Открыть логи в Grafana

1. Открыть браузер.
2. Перейти по адресу:

```text
http://localhost:3001
```

3. Войти в Grafana:

```text
login: admin
password: admin
```

4. В левом меню открыть:

```text
Explore
```

5. В верхней части выбрать datasource:

```text
Loki
```

6. Переключить режим запроса с `Builder` на `Code`.

7. Вставить запрос:

```logql
{app="devops-test"} | json
```

8. Нажать:

```text
Run query
```

После этого должны появиться JSON-логи приложения.

Чтобы смотреть логи как в терминале:

Включить режим:

```text
Live
```

После этого новые логи будут появляться в Grafana в реальном времени.

---

## 4. Основные LogQL-запросы

### Все логи приложения

```logql
{app="devops-test"} | json
```

### Красивый вывод основных полей

```logql
{app="devops-test"} | json | line_format "level={{.level}} time={{.time}} pid={{.pid}} hostname={{.hostname}} service={{.service}} env={{.env}} version={{.version}} msg={{.msg}}"
```

### Короткий читаемый вывод

```logql
{app="devops-test"} | json | line_format "[level={{.level}}] {{.msg}}"
```

### Только ошибки

```logql
{app="devops-test"} | json | level >= 50
```

### Только info-логи

```logql
{app="devops-test"} | json | level = 30
```

