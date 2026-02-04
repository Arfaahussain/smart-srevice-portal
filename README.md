# Smart Service Portal

A lightweight service request management portal built for universities / enterprises where users can submit issues and admins can track, update, and manage them.

---

## 🚀 Key Features

### Public User Features
- Create service requests without login  
- Categories: IT / Admin / Facilities  
- Priority selection (Low / Medium / High)  
- Track request status

### Admin Features
- Secure admin login (JWT based)  
- View all requests with filters  
- Update status: Open → In Progress → Resolved  
- Detailed request view  
- Delete resolved requests with **password reconfirmation**

### Additional Enhancements
- Dashboard with summary statistics  
- Search by title  
- Priority color badges  
- Confirmation dialogs for destructive actions  
- Responsive UI built with Next.js

---

## 🧑‍💻 Tech Stack

**Frontend**
- Next.js (Pages Router)
- React
- Axios

**Backend**
- Node.js + Express
- JWT Authentication
- Mongoose ORM

**Database**
- MongoDB (local)

---

## 📁 Project Structure

```
backend/                → Express API
  config/               → Database connection
  middleware/           → Auth & admin guards
  models/               → Mongoose schemas
  routes/               → Auth + request routes
  server.js             → API entry point

frontend/               → Next.js app
  pages/                → UI routes
  services/             → Axios client
  styles/               → Global styles
```

---

## ⚙️ Setup Guide

### 1) Clone Repository

```bash
git clone <your-repo-url>
cd smart-service-portal
```

---

### 2) Install Dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd backend
npm install
```

---

### 3) Start MongoDB

Default connection used:

```
mongodb://127.0.0.1:27017/smart_portal
```

Start Mongo service:

```bash
mongod
```

Optional shell check:

```bash
mongosh
use smart_portal
```

---

### 4) Create Admin User (One Time)

```bash
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

### 5) Run Backend

```bash
cd backend
npm start
```

Runs on → **http://localhost:5000**

---

### 6) Run Frontend

```bash
npm run dev
```

Runs on → **http://localhost:3000**

---

## 🌐 Frontend Routes

| Route | Access | Purpose |
|-----|--------|---------|
| `/` | Public | Landing |
| `/create` | Public | Submit request |
| `/login` | Admin | Admin login |
| `/requests` | Admin | Manage requests |
| `/dashboard` | Admin | Statistics |

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/login` – Admin login  
- `POST /api/auth/register` – Test registration

### Requests
- `POST /api/requests` – Create request  
- `GET /api/requests` – List with filters  
- `GET /api/requests/:id` – Details  
- `PUT /api/requests/:id` – Update status  
- `DELETE /api/requests/:id` – Delete resolved  
- `POST /api/requests/delete/:id` – Fallback delete

---

## 🔐 Security Notes

- JWT protected admin routes  
- Delete requires:
  - Status = Resolved  
  - Re-enter admin password  
- Authorization header required:

```
authorization: <token>
```

---

## 🧪 Sample Request Body

```json
{
  "title": "Wifi not working",
  "category": "IT",
  "description": "Internet slow in lab",
  "priority": "Low",
  "requesterName": "Arfaah",
  "requesterEmail": "arfa@gmail.com"
}
```

---

## 🐞 Troubleshooting

**Mongo not connecting**
- Ensure `mongod` is running  
- Check port 27017  
- Verify DB path

**401 Unauthorized**
- Login first  
- Token stored in localStorage  
- Admin role required

**Requests not visible**
- Check network tab  
- Verify `/api/requests` response

---

## 📌 Assessment Highlights

This project demonstrates:

- Full-stack development  
- REST API design  
- Authentication & authorization  
- CRUD + filters  
- Secure delete workflow  
- Clean UI/UX  
- Modular architecture

---

## 📄 Scripts

**Root**

- `npm run dev` – Start Next.js  
- `npm run build` – Build frontend  
- `npm run start` – Start frontend

**Backend**

- `npm start` – Run Express API
