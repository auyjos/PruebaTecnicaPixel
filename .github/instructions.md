# Technical Test Instructions

## 1. Backend (Node.js + TypeScript + Express)

1. **Create a REST API** to manage calendar events.  
2. **Event model** must include:
   - `id`
   - `title`
   - `description`
   - `date`
   - `category`
3. **Endpoints**:
   - `GET /events`
   - `POST /events`
   - `PUT /events/:id`
   - `DELETE /events/:id`
4. **Authentication**: integrate Firebase Auth for all endpoints.  
5. **Validation & Error Handling**: apply request payload validation and return appropriate HTTP error codes/messages.

---

## 2. Frontend (Next.js + TypeScript)

1. **Create a Next.js app** where users can:
   1. **Log in** via Firebase Auth  
   2. **View** list of events (`GET /events`)  
   3. **Create** a new event using a form (submits `POST /events`)  
   4. **Edit** and **delete** existing events (`PUT`/`DELETE /events/:id`)  
2. **Styling** (optional): use Material UI components.  
3. **API Consumption**: use `fetch` or `axios` to call backend endpoints.  
4. **State Management**: implement global state with either Context API + custom hooks .  
5. **Persistence**: store events in Firebase Firestore.  
6. **Custom Hooks & Context**: encapsulate form logic, auth state and data fetching.  
7. **Search & Pagination**: allow filtering by date/title and paginate the event list.
