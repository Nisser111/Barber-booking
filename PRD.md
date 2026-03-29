# PRD: Barber Booking App

### TL;DR

Barber Booking App is a focused learning project to master Claude Code by building a simple, local-first appointment system for a barbershop. The product includes two frontends—a customer booking React app (port 3000) and an admin Next.js panel (port 3001)—plus a NestJS API (port 4000) and MySQL storage, orchestrated via Docker Compose. It is designed to let customers book appointments in seconds and barbers/admins manage schedules effortlessly.

---

## Goals

### Business Goals

* Achieve a self-serve booking experience that reduces missed appointments and time spent on phone calls by 80% within local testing environments.
* Deliver an admin view that provides barbers a clear list of daily appointments—aim for a process where >95% of appointments are confirmed in the admin panel.
* Validate and demonstrate full-stack service orchestration as a hands-on Claude Code learning project.
* Ensure all system components work cross-platform (Linux/amd64) out-of-the-box with minimal setup.

### User Goals

* Customers can book a haircut or service quickly, without needing to call.
* Frictionless, <2-minute booking process from browsing to confirmation.
* Admins (barbers/shop owners) have one place to see, confirm, or cancel today’s bookings in real-time.
* Admins easily adjust available time slots without editing code or configs.

### Non-Goals

* Payment processing, invoicing, or online checkout (out of scope for V1).
* Multiple location, multi-barber, or chain management.
* Customer accounts, authentication, user management.

---

## User Stories

**Persona 1: Client (Barbershop Customer)**

* As a client, I want to see a list of services (e.g., haircut, beard trim), so that I can pick what I need.
* As a client, I want to choose a date and see available time slots, so that I can plan my visit easily.
* As a client, I want to enter my name and phone number, so that the barber knows who to expect.
* As a client, I want an instant confirmation screen with my booking summary, so that I’m sure my booking was successful.
* As a client, I want to cancel or reschedule my appointment if plans change.

**Persona 2: Admin (Barber/Shop Owner)**

* As an admin, I want to see all upcoming appointments in a single list, so that I can prepare for the day.
* As an admin, I want to confirm or cancel appointments, so that I can manage last-minute changes.
* As an admin, I want to adjust which time slots are available for booking on any day, so that my schedule stays flexible.

---

## Functional Requirements

* **Booking Flow** (Priority: High)

  * *Service Selection*: User can browse and select haircut or beard-related services.
  * *Date/Time Slot Picker*: User chooses a date; sees/book only from available time slots.
  * *Booking Confirmation*: Immediate screen with booking summary after submission.
  * *Booking Cancellation*: User can cancel (or request cancellation) via confirmation screen.

* **Admin Panel** (Priority: High)

  * *Appointments List View*: View all today’s and upcoming bookings in a sortable list.
  * *Appointment Status Management*: Confirm or cancel bookings with a single click.
  * *Time Slot Availability Management*: Mark certain slots as unavailable (for holidays/breaks, etc).

* **API** (Priority: High)

  * *REST Endpoints*: CRUD endpoints for services, time slots, and bookings.
  * *Booking Creation/Management*: Endpoints for client and admin flows.
  * *Service Discovery*: Endpoints to fetch available services, dates, and free slots.

* **Infrastructure** (Priority: Medium)

  * *Docker Compose Setup*: One yaml to run all services locally—client-frontend, admin-frontend, backend-api, MySQL.
  * *Proxy Routing*: Nginx-based single proxy for local requests.
  * *Multi-stage Dockerfiles*: For local development and production builds; use `--platform=linux/amd64` for proxy, backend, and frontend.
  * *Named Containers, Local Volumes*: Hardcoded container names and mapped volumes for easy inspection and persistence.

---

## User Experience

**Entry Point & First-Time User Experience**

* Customers land on the client-frontend web app (localhost:3000), greeted with a simple, minimal interface—“Book Your Appointment.”
* Admins access the admin-frontend dashboard (localhost:3001); no login required in v1.

**Core Experience**

*Customer (Client-Frontend) Flow*

* **Step 1:** User selects a service from a prominent list (e.g., "Haircut", "Beard Trim", "Combo Package").
  * UI: Simple, tap/clickable buttons; icons for extra clarity.
* **Step 2:** Calendar widget displays; user picks a desired date.
  * Greyed out past dates and unavailable days.
  * Error handling: user cannot select past or holiday dates.
* **Step 3:** Dynamic list of time slots appears for the selected day.
  * Slots are shown as buttons or chips—disabled if already booked.
  * If no slots open, show “No availability for this day.”
* **Step 4:** User inputs name and phone number (basic validation).
  * Fields must be filled to enable "Book Appointment" button.
* **Step 5:** See a confirmation screen (summary of booking, option to cancel or change).
  * Clear feedback on success or failure.
  * Option to return to start to book another.

*Admin (Admin-Frontend) Flow*

* **Step 1:** Dashboard lists today's and upcoming appointments.
  * Main view: list/table, filter by date or status.
* **Step 2:** Admin clicks a booking to open details; can confirm or cancel.
  * Single-click status updates, real-time refresh.
* **Step 3:** Manage time slot availability—calendar view allows disabling or enabling slots for any day.

**Advanced Features & Edge Cases**

* If client attempts booking in a taken slot, show alert: “Slot just booked, please pick another.”
* Admin trying to cancel a booking already cancelled triggers no action/error.
* If MySQL or backend is unavailable, frontends show friendly error messages (“Service temporarily unavailable”).
* Option for admin to clear all booked slots for a full shop closure day.

**UI/UX Highlights**

* Both frontends use Shadcn/ui and Tailwind—ensuring a modern, consistent, and minimal look.
* Mobile-first design for client app; responsive layouts for admin.
* Accessibility: proper contrasts, clear focus states, and keyboard navigation.
* Polish language as primary label set (optionally extend to English for learning).

---

## Narrative

Marek has run his barbershop in Warsaw for years—but lately, the constant phone calls to book or shift appointments are wearing him down. He often starts his day with scraps of paper filled with scribbled names and times, risking double-bookings and missed customers.  

With Barber Booking, Marek gives his clients a new way. They simply visit his online scheduler, choose a service and time in seconds, and instantly receive confirmation—effortless for both sides. Marek, instead of juggling messages, opens his admin dashboard each morning to find his full day’s calendar perfectly listed, slots color-coded and easy to manage.  

The result: less confusion, no lost appointments, and more time spent actually cutting hair—not answering the phone. It’s peace of mind for Marek, and a smooth, reliable booking experience for every client.

---

## Success Metrics

### User-Centric Metrics

* **Booking Completion Rate:** Target >80% of users who start booking complete the process.
* **Time to Book:** Median time to submit a booking should be under 2 minutes.
* **Booking Cancellation Rate:** Measure frequency to identify confusion or last-minute no-shows.

### Business Metrics

* **Appointments Created:** Track average number of appointments scheduled per day.
* **Reduction in “Ghost Slots”:** Quantify the decrease in unfilled or double-booked slots after adoption.

### Technical Metrics

* **API Response Time:** 95% of REST endpoints <300ms local response time.
* **Local Uptime:** Goal of 100% uptime in controlled (docker-compose) environment.
* **Successful Booking Consistency:** Zero lost/corrupted bookings in local test flow.

### Tracking Plan

* Track the following key events within frontends and API:
  * `service_selected`
  * `date_selected`
  * `slot_selected`
  * `booking_confirmed`
  * `booking_cancelled`
  * `admin_appointment_viewed`
  * `admin_status_changed`

---

## Technical Considerations

### Technical Needs

* **APIs:** RESTful endpoints (CRUD) for services, time slots, bookings.
* **Frontends:**
  * React + Redux + React Router (client app), Shadcn/ui + Tailwind CSS.
  * Next.js (admin app), Shadcn/ui + Tailwind CSS.
* **Back-end:** NestJS server exposes the API, interacts directly with MySQL.
* **Data Models:** MySQL tables for users (minimal), services, time_slots, and bookings.

### Integration Points

* No external partners or third-party integrations in v1.
* Both client and admin UIs communicate with backend API only.
* Nginx proxy as local entry point—handles all routing, no internal proxies in app containers.

### Data Storage & Privacy

* **Flow:** Both frontends send booking/management data to API, which writes to MySQL.
* **Storage:** Local Docker volume for persistent data.
* **Privacy:** Store only name and phone number—no sensitive PII. No authentication/user account needed in v1.

### Scalability & Performance

* Only local, single-developer use in v1 (docker-compose on laptop/desktop).
* All code and containers should work cross-platform (Linux/amd64).
* Performance: ensure quick startup and minimal memory for dev use.

### Potential Challenges

* Handling simultaneous slot bookings (potential race condition—need API-side slot locking).
* Keeping Docker Compose config as minimal, readable, and portable as possible.
* Ensuring all containers use fixed names and expected ports.

---

## Milestones & Sequencing

### Project Estimate

* **Small:** 1–2 weeks (solo developer).

### Team Size & Composition

* **Extra-small Team:** 1 person (developer using Claude Code for code generation, writing, and orchestration).

### Suggested Phases

**Phase 1 – App Skeleton (2–3 days)**

* Key Deliverables: Scaffold `client-frontend`, `admin-frontend`, and `backend-api` directories using standard CLI/init commands. Included: empty React app, Next.js app, and NestJS server.
* Dependencies: None, except pre-installed CLI tools.

**Phase 2 – Docker Setup (1–2 days)**

* Key Deliverables: Write multi-stage Dockerfiles for each service (dev/prod), create `docker-compose.yml` with all 4 services and Nginx proxy. Local volumes and static container names set up and documented.
* Dependencies: Code scaffold from Phase 1.

**Phase 3 – Core Booking Feature (3–4 days)**

* Key Deliverables:
  * Implement service list, date/slot selection, booking form, and confirmation in client-frontend.
  * Appointments list, status management, and slot availability screens in admin-frontend.
  * Complete REST API functionality and MySQL schema.
* Dependencies: All infrastructure from Phase 2.

**Phase 4 – Polish & Readme (1 day)**

* Key Deliverables: Write comprehensive `readme.md` covering setup, architecture, basic docs, and local run instructions.
* Dependencies: Completion of all app and infra components.

---