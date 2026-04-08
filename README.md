# 🎓 Digital Classroom Engagement Scoring Platform
### *An AI-ready holistic monitoring system for modern academic environments.*

[![Live App (Frontend)](https://img.shields.io/badge/Live-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://digital-classroom-engagement-scorin.vercel.app)
[![API (Backend)](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://digital-classroom-engagement-scoring.onrender.com)
[![Software Architecture](https://img.shields.io/badge/Architecture-Spring%20Boot%20%2B%20React-blue?style=for-the-badge)](/)

The **Digital Classroom Engagement Scoring Platform** is a professional-grade synchronization tool designed to bridge the gap between instructional faculty and student performance monitoring. It provides real-time analytics on attendance, classroom participation, assignments, and weekly academic protocols using a weighted engagement-score algorithm.

---

## 🚀 Core Features & Dashboard Capabilities

### **1. 🏷️ Administrator Command Center**
*   **Centralized Faculty Management**: Seamlessly add, edit, or remove teachers and student profiles.
*   **System Insights**: Real-time monitoring of total platform users, active faculty, and institutional growth indicators.
*   **ID Synchronization**: Automated indexing system ensuring consistent user tracking across the ecosystem (#1, #2, etc.).

### **2. 🎒 Teacher Instructional Suite**
*   **Engagement Scoring Layer**: Real-time entry of attendance and participation metrics with an integrated "Core Update" mechanism.
*   **Assessment Lab**: Create custom weekly academic protocols (Multiple Choice, True/False) and deploy them to the student population instantly.
*   **At-Risk Intervention Panel**: Automatic detection of students falling below performance thresholds for rapid faculty intervention.
*   **Leaderboard Analytics**: Monitoring of classroom excellence and peer-competition progress.

### **3. 📈 Student Performance Hub**
*   **Weekly Assessment Registry**: A centralized catalog of all assigned protocols. Categorized by status (`READY`, `COMPLETED`).
*   **Self-Correction Reflection**: Weekly metacognitive self-assessment module that automatically refreshes based on the teacher's active week.
*   **Trend Sparklines**: Visual tracking of engagement scores over time to monitor individual student growth.

---

## ⚖️ Holistic Scoring Algorithm
The platform calculates a **100% accurate Engagement Index** for every student using a state-of-the-art weighted formula:
*   **Weekly Assessments (30%)**: Critical benchmark performance.
*   **Institutional Attendance (30%)**: Persistence and physical presence.
*   **Classroom Participation (20%)**: Active lesson interaction.
*   **Assignment Fidelity (20%)**: Task completion and submission quality.

---

## 🛠️ Technology Stack
*   **Backend Intelligence**: Java 25 + Spring Boot (Security, JPA, REST).
*   **Frontend UX/UI**: React.js 18 + Vite (High-performance build engine).
*   **Styling Architecture**: Tailwind CSS (Native aesthetics, Rich Dynamic Gradients).
*   **Security Protocol**: JWT (JSON Web Tokens) for stateless, encrypted authentication.
*   **Persistence Layer**: H2 In-Memory Database / PostgreSQL (Scalable production).

---

## 📦 Local Installation & Setup

### **Frontend Assembly**
```bash
cd classroom-platform
npm install
npm run dev
```

### **Backend Engine**
```bash
cd classroom-platform/backend
mvn spring-boot:run
```

---

## 🗝️ Initial Access Credentials (Demo Users)
| Role | Identity (Email) | Target Access (Password) |
| :--- | :--- | :--- |
| **Admin** | `natz@gmail.com` | `natz@21` |
| **Teacher** | `rithi@gmail.com` | `rithi@21` |
| **Student** | `akash@gmail.com` | `akash@21` |

---

> [!TIP]
> **Production Ready**: This repository is optimized for deployment on Vercel (Frontend) and Render (Backend). Ensure your `.env` variables point to the live API instance for seamless production synchronization.
