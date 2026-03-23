# 🔗 URL Shortener (Backend Only)

A backend-only URL Shortener API built with **Node.js**, **Express**, **MongoDB**, and **nanoid**.
Generates short links and handles fast redirection from a short URL → the original URL.

---

## 🎯 Why I Built This

Wanted to focus on backend engineering and system design instead of UI — building the core logic behind services like Bitly: routing, database mapping, and scalable API structure.

---

## ✨ Features

- Shorten any URL instantly — no login required
- Redirects short URL → original URL seamlessly
- **User system** — register/login to track all your shortened URLs in one place
- Guest shortening supported — works without an account too

---

## 📚 What I Learned

- How URL redirection systems work in real applications
- Designing a clean REST API with a modular backend structure
- Handling dynamic routes efficiently in Express
- Using MongoDB to store and retrieve short → original URL mappings
- Implementing unique short ID generation with nanoid
- Adding user authentication and associating records per user

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB |
| Short ID | nanoid |
| Auth | JWT |

---

## 📁 Project Structure
```
src/
├── models/        # URL and User schemas
├── controllers/   # Shorten, redirect, user logic
├── routes/        # API route definitions
├── middlewares/   # Auth middleware
└── index.js       # Entry point
```

---

## 🚀 Getting Started
```bash
git clone https://github.com/shahnawaz-hussaink/URL-Shortener
cd URL-Shortener
npm install
```

Create a `.env` file:
```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
```bash
npm start
```

---

## 📬 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/user/register` | No | Register a new user |
| POST | `/user/login` | No | Login and get token |
| GET | `/user/logout` | Yes | Logout user |
| PATCH | `/user/refresh-token` | Yes | Regenerate access token |
| PATCH | `/user/change-password` | Yes | Change user password |
| GET | `/user/get-user` | Yes | Get logged-in user details |
| GET | `/user/get-all-urls` | Yes | Get all URLs by logged-in user |
| POST | `/user/short-url` | Optional | Shorten a URL |
| GET | `/user/get-short-url/:shortURL` | No | Redirect to original URL |
| GET | `/user/get-url-clicks/:shortURL` | No | Get click count for a short URL |

---