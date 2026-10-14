# CarePoint — Hospital Management System

A responsive React hospital dashboard with patient, doctor and appointment management.

## Features

- Dashboard with summary cards and recent activity
- Patient CRUD: create, view, edit and delete
- Doctor directory and appointment management
- Search with debouncing and department/status filters
- React Router navigation
- Context API for global loading state and notifications
- Axios instance with request and response interceptors
- Loading spinner and responsive layout
- Local browser storage by default, so the deployed Netlify app works without a backend
- Optional JSON Server API for local development

## Requirements

Node.js 18 or later.

## Run the project

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Run with JSON Server

In a second terminal:

```bash
npm run server
```

Copy `.env.example` to `.env` and keep:

```env
VITE_API_URL=http://localhost:3001
```

Restart Vite after changing `.env`. JSON Server data is stored in `db.json`. When `VITE_API_URL` is not set, the app uses localStorage in the browser.

## Deploy to Netlify

1. Push this project to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and select the repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Leave `VITE_API_URL` unset for the easiest working deployment.

Netlify hosts the frontend only. It cannot run the JSON Server process from this project as a persistent backend. With `VITE_API_URL` unset, records are saved in the browser's localStorage on that device/browser. For shared records across users, deploy a backend/API separately and set `VITE_API_URL` to its URL.

## Folder structure

```text
hospital-management-system/
├── public/
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── PageTitle.jsx
│   │   ├── SearchFilter.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   └── StatusBadge.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── data/
│   │   └── initialData.js
│   ├── pages/
│   │   ├── Appointments.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Doctors.jsx
│   │   ├── NotFound.jsx
│   │   └── Patients.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── hospitalService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── db.json
├── netlify.toml
└── package.json
```
