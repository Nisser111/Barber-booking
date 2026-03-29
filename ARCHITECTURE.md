
# Specyfikacja Projektu: Barber Booking

**Rola:** Act as IT Architect, DevOps and Developer.

**Zadanie:** Stwórz szkielet aplikacji na podstawie poniższej architektury usług mikroserwisowych.

**Nazwa aplikacji:** Barber Booking

---

### Wymagania Docker
* Do uruchomienia lokalnie wykorzystaj `docker-compose`.
* Nie twórz `docker-compose` dla produkcji.
* Zadbaj o konfigurację lokalnych wolumenów.
* Pliki `Dockerfile` mają być przygotowane zarówno do lokalnego developmentu, jak i produkcyjnego deploymentu (użyj Multi Stage Builds).
* Zastosuj kompatybilność obrazów Docker `--platform=linux/amd64` dla Proxy, Backend i Frontend.
* Nie umieszczaj serwera proxy (Nginx ani Apache) w żadnej usłudze poza PROXY.
* Ma istnieć tylko jeden serwer.
* Ustal stałe nazwy kontenerów.

### Wymagania aplikacji
* Wykorzystaj znane skrypty do generowania szkieletów aplikacji.
* Nie twórz żadnych funkcjonalności – otrzymasz je w następnym kroku.

### Rules
* Zacznij od szkieletu aplikacji, następnie utwórz konfigurację Dockera.
* **Najpierw opracuj plan – napisz, co, jak i dlaczego chcesz zrobić.**
* Utrzymuj jak najprostszą strukturę katalogów, nie twórz katalogu pośredniego.
* Wykorzystuj komendę `pwd`, aby upewnić się, czy wykonujesz operacje w odpowiednim katalogu.
* Stwórz dokumentację w pliku `readme.md`

---

### Architektura usług

**Client Frontend**
* **Język:** TypeScript
* **Framework:** React, React Router, Redux
* **Port:** 3000
* **UI:** Shadcn/ui + Tailwind CSS
* **Serwer Proxy:** NIE
* **Dir:** `client-frontend/`

**Admin Frontend**
* **Język:** TypeScript
* **Framework:** Next.js
* **Port:** 3001
* **UI:** Shadcn/ui + Tailwind CSS
* **Serwer Proxy:** NIE
* **Dir:** `admin-frontend/`

**Backend API**
* **Język:** TypeScript
* **Framework:** NestJS
* **Port:** 4000
* **Dir:** `backend-api/`

**Baza danych**
* **Silnik:** MySQL
* **Port:** 3306
* **Dir:** `mysql/`
