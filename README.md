# 📡 Content Broadcasting System (Backend)

A production-ready backend system for broadcasting educational content with **role-based access control, approval workflow, scheduling, and rotation logic**.

📌 Tested using Thunder Client / Postman

---

## 🚀 Tech Stack

* **Node.js + Express.js (ES Modules)**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **Multer (local upload)**
* **Cloudinary (cloud storage)**
* **bcryptjs (password hashing)**

---

## 📌 Features

### 👨‍🏫 Teacher

* Upload content (image + subject + schedule)
* View uploaded content

### 👨‍💼 Principal

* View all pending content
* Approve or reject content
* Provide rejection reason

### 👨‍🎓 Public (Students)

* Fetch **live content**
* Only approved + scheduled content is shown

---

## 🔐 Authentication & Authorization

* JWT-based authentication
* Role-based access control (RBAC)
* Roles:

  * `teacher`
  * `principal`

---

## 📁 Project Structure

```
backend/
 ├── src/
 │   ├── config/
 │   ├── controllers/
 │   ├── routes/
 │   ├── models/
 │   ├── middlewares/
 │   ├── services/
 │   ├── utils/
 │   └── app.js
 ├── public/
 ├── server.js
 ├── package.json
 └── .env.example
```

---

## ⚙️ Installation & Setup

```bash
git clone <your-repo-link>
cd backend

npm install
npm run dev
```

---

## 🌍 Environment Variables

Create a `.env` file in `backend/`:

```
PORT=8000
MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📤 File Upload System

* Files are uploaded using **Multer**
* Temporarily stored in `/public`
* Uploaded to **Cloudinary**
* Local file is deleted after upload

### Allowed formats:

* `.jpg`
* `.jpeg`
* `.png`
* `.gif`

---

## 📡 API Endpoints

### 🔐 Auth

#### Register

```
POST /api/auth/register
```

#### Login

```
POST /api/auth/login
```

---

### 👨‍🏫 Teacher

#### Upload Content

```
POST /api/content
```

#### Get My Content

```
GET /api/content/my
```

---

### 👨‍💼 Principal

#### Get Pending Content

```
GET /api/content/pending
```

#### Approve Content

```
PATCH /api/content/:id/approve
```

#### Reject Content

```
PATCH /api/content/:id/reject
```

---

### 🌍 Public

#### Get Live Content

```
GET /api/content/live/:teacherId
```

---

## 🧪 API Testing Guide (Thunder Client / Postman)

### Base URL

```
http://localhost:8000
```

---

### 🔐 Register User

**POST** `/api/auth/register`

```json
{
  "name": "Teacher One",
  "email": "teacher1@gmail.com",
  "password": "123456",
  "role": "teacher"
}
```

---

### 🔐 Login

**POST** `/api/auth/login`

```json
{
  "email": "teacher1@gmail.com",
  "password": "123456"
}
```

👉 Copy token from response

---

### 🔑 Authorization Header

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 📤 Upload Content

**POST** `/api/content`

Headers:

```
Authorization: Bearer TOKEN
```

Body → Form Data:

| Key               | Type | Value                |
| ----------------- | ---- | -------------------- |
| title             | text | Algebra Basics       |
| subject           | text | Maths                |
| start_time        | text | 2026-04-28T10:00:00Z |
| end_time          | text | 2026-04-28T18:00:00Z |
| rotation_duration | text | 10                   |
| file              | file | upload image         |

---

### 📄 Get My Content

**GET** `/api/content/my`

---

### 👨‍💼 Get Pending Content

**GET** `/api/content/pending`

---

### ✅ Approve Content

**PATCH** `/api/content/:id/approve`

---

### ❌ Reject Content

**PATCH** `/api/content/:id/reject`

```json
{
  "reason": "Invalid content"
}
```

---

### 🌍 Get Live Content

**GET** `/api/content/live/:teacherId`

👉 No authentication required

---

## 🔁 Rotation Logic (Core Feature)

The system dynamically rotates content based on time.

### Steps:

1. Fetch approved content
2. Filter:

```
start_time <= current_time <= end_time
```

3. Sort by rotation_order
4. Apply circular rotation:

```
index = Math.floor(currentTime / rotation_duration) % totalContent
```

5. Return one active content per subject

---

## ⚠️ Edge Case Handling

* No content → returns `[]`
* Not approved → ignored
* Outside time window → ignored
* Invalid teacherId → returns `[]`
* Missing schedule → skipped

---

## 🧱 Middleware

* isAuth → JWT verification
* authorizeRoles → role-based access
* multer → file upload
* errorHandler → centralized error handling

---

## 🔒 Security Practices

* Password hashing using bcrypt
* Environment variables for secrets
* `.env` excluded via `.gitignore`
* Input validation and error handling

---

## 🎯 Design Decisions

* Used Cloudinary for scalable media storage
* Implemented modular architecture
* Applied rotation algorithm for efficient content delivery
* Followed MVC + Service Layer pattern

---

## 👨‍💻 Author

**Akhilesh Verma**

---

## ⭐ Conclusion

This project demonstrates:

* Backend architecture design
* File handling & cloud integration
* Role-based systems
* Time-based scheduling logic

---
