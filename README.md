# BrightSmile Dental Care — Clinic Appointment Website

A fictional dental clinic website built as a **self-directed portfolio piece**.
BrightSmile Dental Care is an invented business: there is no real clinic,
no real dentists, no real patients, and no real appointments. All copy,
prices, people and contact details are fictional demo content.

## What it is

A polished, responsive, multi-page clinic website where visitors can browse
treatments and prices, meet the (fictional) dentists, and book an appointment
through a form backed by a small PHP endpoint.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Home / hero, why-us cards, about the practice, popular treatments, CTA |
| `services.html` | Treatment cards + full price table, each linking into the booking form |
| `doctors.html` | Six fictional dentist profiles with specialities and book links |
| `booking.html` | Appointment form: treatment, doctor, date, time slot, name, phone, notes |

Shared navigation and footer appear on every page. Treatment/doctor links
deep-link into the booking form via query string
(e.g. `booking.html?treatment=Teeth%20Whitening&doctor=dr-chen`).

## Stack

- **HTML5 + CSS3** (custom `assets/css/style.css`)
- **JavaScript** (vanilla, `assets/js/main.js` for scroll reveals + nav behaviour,
  `assets/js/booking.js` for the booking form)
- **Bootstrap 5.3** via CDN (layout, components, responsive grid)
- **PHP 8+** — `appointment.php` (booking backend, see below)
- **Images:** placeholder photography from `picsum.photos` (seeded URLs),
  so no local image assets are needed

## Backend

`appointment.php` is the only server-side file. It:

1. Accepts `POST` requests from the booking form (sent with `fetch()`).
2. Validates every field — treatment and doctor against allow-lists, date
   must be `YYYY-MM-DD` and today or later, time against the offered slots,
   name 2–80 chars, phone against a basic pattern, notes ≤ 500 chars.
3. Appends the appointment (with a generated reference like `BS-A1B2C3`) to
   `data/appointments.json` under a file lock.
4. Returns JSON: `{ success, reference, name, treatment, date, time }`.

### Hosting — important

> **This PHP backend runs on a PHP host, not on GitHub Pages.**
> GitHub Pages is static-only: it never executes `.php` files. To use the
> real backend, host the project on any PHP host (shared hosting, a VPS with
> Apache/Nginx + PHP, XAMPP, etc.) and make sure `data/` is writable by PHP.

### What works where

| Environment | Behaviour |
| --- | --- |
| PHP host | Full booking flow — form validates, saves to `data/appointments.json`, returns a confirmation reference. |
| Static hosting / `file://` (e.g. GitHub Pages) | All pages, navigation, animations and form validation work. Submitting the form shows a clearly labelled **"Demo mode — no backend connected"** state that previews the request — it never pretends a booking was saved. |

## Run locally

```bash
# Static preview (pages + demo-mode form)
cd clinic-appointments
python3 -m http.server 8000
# open http://localhost:8000

# With the real PHP backend
php -S localhost:8000
# open http://localhost:8000/booking.html and submit the form —
# the booking is saved to data/appointments.json
```

## Design notes

- Teal/mint palette, Poppins + Inter typography, generous spacing.
- Scroll-reveal animations (IntersectionObserver), hover lift on cards,
  animated hero image, underline nav hover states.
- Fully responsive: mobile / tablet / desktop via Bootstrap grid + custom
  breakpoints.

## Status

Self-directed portfolio project by Khushi Khatri. **Not client work.**
