# 🍽️ Fine Dine Menu — Frontend

A clean, modern, and minimal UI React application for managing menu items, categories, authentication, and cart interactions. Built with **Vite**, **React 19**, **TailwindCSS**, and smooth animations via **Framer Motion** and **GSAP**.

---

## 📌 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Demo User](#demo-user)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)
- [UI/UX](#uiux)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Introduction

**Fine Dine Menu** is a streamlined and minimalistic frontend application designed for restaurant menu management. It supports authentication, dynamic menu updates, category management, cart interactions, and profile settings—all wrapped in a smooth and elegant UI.

---

## 🔗 Frontend Live URL

➡️ **Frontend Application:** https://fine-dine-menu.netlify.app

---

## ✨ Features

### 🔐 Authentication

- Login / Logout
- Protected admin routes

### 🍽️ Menu Management

- Add menu items
- Add new categories
- Edit menu items
- Delete menu items

### 📝 User Profile

- Update profile details

### 🛒 Cart System

- Add items to cart
- Remove items from cart

### 🎨 Extras

- Smooth animations (Framer Motion + GSAP)
- Icons (Heroicons, Lucide, React Icons)
- Minimal design with TailwindCSS

---

## 👤 Demo User

Use the following demo account to explore the app:

**Email: test@gmail.com**
**Password: User123@**

---

## 🛠️ Tech Stack

**Frontend**

- React 19
- React Router DOM
- Vite
- TailwindCSS
- Zustand (state management)
- Axios
- React Hook Form
- Yup (validation)
- SweetAlert2
- Framer Motion & GSAP

**Developer Tools**

- ESLint
- PostCSS + Autoprefixer
- TypeScript React types

---

## 📁 Folder Structure


```markdown
src/
├── assets/ # Images, icons, fonts, static files
├── components/ # Reusable UI components
├── hooks/ # Custom React hooks
├── pages/ # Application pages/screens
├── store/ # Zustand state management
├── utils/ # Helper functions
├── routes/ # Routing configuration
├── App.jsx # Root application component
└── main.jsx # Application entry point
```


## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/ahbab-zaman/finedine-frontend
cd fine-dine-menu-f
npm install
npm run dev
```

 ##  🔧 Environment Variables

**Create a .env file:**

- VITE_API_URL=https://finedine-backend-1.onrender.com


## 🚀 Usage

 - After starting the app:

 - Log in using your credentials or the demo user

 - Navigate to Menu to add/edit/delete menu items

 - Manage categories easily from Category section

 - Update personal information in Profile

 - Add and remove items from Cart

 - Fast, responsive, and intuitive UI.

## 🎨 UI/UX

 - Modern minimal interface

 - TailwindCSS for styling

 - Responsive design

 - Smooth transitions

 - Accessible and clean UI

 - Thoughtful animations