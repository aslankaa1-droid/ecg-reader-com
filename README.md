# ECG Reader — премиум-лендинг

**Путь:** `E:\Проекты Аслана\ИС КС-экг\_landing_kardiospec\`
**Дата сборки:** 2026-06-03
**Назначение:** ЭТАП A.4 + A.5 BUILD PLAN — статический сайт `ecg-reader.com` готов к деплою на GitHub Pages

---

## Что внутри

```
_landing_kardiospec/
├─ index.html                  · Главная (premium, 16 секций, 4 языка, 3 темы)
├─ privacy.html                · Privacy Policy (152-ФЗ + GDPR + HIPAA)
├─ terms.html                  · Terms of Service (CDS / SaMD 2б)
├─ disclosure.html             · Раскрытие информации
├─ pd-consent.html             · Шаблон согласия на ПДн
├─ assets/
│  ├─ styles.css               · Дизайн-система (3 темы, токены, компоненты)
│  ├─ legal.css                · Стили legal-страниц
│  ├─ app.js                   · i18n + theme + reveal + menu
│  └─ i18n.js                  · Словарь RU / EN / ZH / AR
├─ svg/
│  └─ favicon.svg              · Логотип «ЭКГ-сигнал»
└─ docs/
   ├─ ECG-Reader_Pitch_Deck.html
   ├─ ECG-Reader_OnePager.html
   ├─ whitepaper.html
   └─ clinical-evidence.html
```

---

## Премиум-дизайн

- **Типографика:** Cormorant Garamond (display) + Inter (body) + JetBrains Mono (метрики) + Cairo (AR)
- **3 темы:** Dark (default), Light, Sepia — переключатель в верхней панели
- **4 языка:** RU (master), EN, ZH, AR (с RTL)
- **Анимации:** scroll-reveal, ECG-trace stroke animation, плавные кривые `cubic-bezier(0.4, 0, 0.2, 1)`
- **Responsive:** breakpoints 1080 / 640 — mobile-first внутренние правила
- **152-ФЗ:** нет форм, нет аналитики, нет cookie. Sticky-бар с дисклеймером.
- **A11y:** semantic HTML, ARIA labels, `prefers-reduced-motion` поддержка

---

## Контент-источники

Тексты вытащены из существующих 67 документов проекта:

| Секция | Источник |
|---|---|
| Hero / Problem / Solution / Why Now | `17_Бизнес_и_коммерциализация/03_Series_A/Pitch_Deck_HTML/ECG-Reader_Pitch_Deck.html` (слайды 1–5) |
| Product / Technology | Pitch Deck слайды 6–7 + `12_ЭКГ_ХАБ_концепция/ECG_HUB_Concept.md` + `Консенсус_движок/` |
| Clinical Validation | Pitch Deck слайд 8 + `06_Валидация_и_качество/` |
| Business / Pricing | Pitch Deck слайд 9 + `17_../01_Финмодель/` |
| Team | Pitch Deck слайд 12 + `23_Founder_Leadership/Founder_Leadership_Package.md` |
| Roadmap | Pitch Deck слайд 13 + `30_Product_Roadmap/` |
| Ask | Pitch Deck слайд 14 + `17_../03_Series_A/Business_Plan_Series_A.md` |
| Privacy Policy | `27_Legal/Privacy_Policy/Privacy_Policy_and_ToS.md` |

---

## Тестирование локально

```powershell
# Открыть главную в браузере
Start-Process "E:\Проекты Аслана\ИС КС-экг\_landing_kardiospec\index.html"

# Или поднять локальный сервер (для корректной работы относительных путей)
python -m http.server 8080 --directory "E:\Проекты Аслана\ИС КС-экг\_landing_kardiospec"
# затем открыть http://localhost:8080/
```

**Что проверить:**
- Переключение тем (Dark / Light / Sepia) — иконка солнца справа сверху
- Переключение языков (RU / EN / ZH / AR) — иконка глобуса справа сверху
- RTL для AR — текст и layout должны зеркалиться
- ECG-анимация в hero — линия отрисовывается за 3,2 сек
- Smooth scroll по якорным ссылкам в nav
- Sticky 152-ФЗ бар — кнопка «Понятно» прячет его (сохраняется в localStorage)
- Mobile (DevTools mobile mode) — мобильный nav прячет ссылки, остаются переключатели

---

## Следующие шаги (ЭТАП A продолжение)

### Действия Аслана (требуется личный логин)
1. **A.1** Регистрация доменов на reg.ru:
   - `ecg-reader.com` (основной)
   - `kardiospec.com` (международный)
   - `kardiospec.health` (premium TLD, опционально)
2. **A.3** Yandex 360 для бизнеса — 8 ящиков (aslan@, sales@, support@, vigilance@, dpo@, developers@, press@, investors@)

### Мои действия после доменов
3. **A.2** DNS на reg.ru: A-записи GitHub Pages + CNAME для `www`
4. **GitHub Pages**: создать репо `aslankaa1-droid/ecg-reader-com`, push содержимого
5. **SSL** Let's Encrypt через GitHub Pages auto
6. **A.7** Yandex Webmaster + Google Search Console
7. **A.5** Docs hub `docs.ecg-reader.com` (MkDocs Material)

---

## Деплой на GitHub Pages — план

```bash
# В корне _landing_kardiospec/
git init
git add .
git commit -m "Initial premium landing"
gh repo create aslankaa1-droid/ecg-reader-com --public --source=. --remote=origin --push

# Включить GH Pages из main branch root
gh api repos/aslankaa1-droid/ecg-reader-com/pages \
  -F "source[branch]=main" -F "source[path]=/"

# Привязать кастомный домен после регистрации
gh api -X PUT repos/aslankaa1-droid/ecg-reader-com/pages \
  -F "cname=ecg-reader.com"

# Включить HTTPS enforce
gh api -X PUT repos/aslankaa1-droid/ecg-reader-com/pages \
  -F "https_enforced=true"

# Добавить .nojekyll
touch .nojekyll && git add .nojekyll && git commit -m "Disable Jekyll"
```

---

## Открытые TODO

- [x] OG-image (1200×630 PNG) — `og-image.png`, рендер из `svg/og-source.html` через headless Chrome
- [x] OG + Twitter Card мета-теги в `<head>` index.html + canonical + locale alternates
- [x] sitemap.xml для SEO
- [x] robots.txt
- [x] .nojekyll (отключение Jekyll на GH Pages)
- [ ] Добавить остальные 11 языков из плана (ES, FR, DE, IT, PT, JA, KO, UR, HI, BN, TR)
- [ ] Цифры traction (50+ клиник, $2M ARR и т.д.) после Series A — сейчас как «целевые Q3 2028»
- [ ] Видео-демо в hero (опционально)
- [ ] Status page `status.ecg-reader.com` (ЭТАП A.6)

## Перегенерация OG-image

```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=6000 \
  --screenshot="og-image.png" "svg/og-source.html"
```

---

**Owner:** ИИ-агент проекта КС-ЭКГ (parent-сессия)
**Reference:** `_00_Master_Index/BUILD_PLAN_Real_Working_Project.md`
