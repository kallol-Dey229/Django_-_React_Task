<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->




# Patient Frontend (Task 3)

A simple React (Vite) app with Tailwind CSS that connects to the Django REST API from Task 1.

## Features

- Add a new patient
- Patient list table with pagination (5 per page)
- **Update** button on each row (fills the form, then saves changes)
- **Delete** button on each row (asks for confirmation)

## Tech Stack

- React (Vite, JavaScript / JSX)
- Tailwind CSS
- Axios (API calls)

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (npm is included). Check with `node -v` and `npm -v`.
- The Django backend from Task 1 running on `http://127.0.0.1:8000`
- **Windows note:** the project path must not contain `&` (for example `Django_&_React_Task`). It breaks `npm run dev`. Use a name like `Django_React_Task`.

---

## Part 1: Backend setup (one time)

The React app runs on `http://localhost:5173` and Django runs on `http://127.0.0.1:8000`. Django must allow the React address (CORS).

1. Activate the Django virtual environment and install the package:

   ```bash
   python -m pip install django-cors-headers
   python -m pip freeze > requirements.txt
   ```

2. Edit `config/settings.py`:

   ```python
   INSTALLED_APPS = [
       # ... existing apps ...
       'corsheaders',
   ]

   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',   # must be first in the list
       'django.middleware.security.SecurityMiddleware',
       # ... rest stays the same ...
   ]

   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
       "http://127.0.0.1:5173",
   ]
   ```

3. Start the backend:

   ```bash
   python manage.py runserver
   ```

   Check that `http://127.0.0.1:8000/api/patients/` opens in the browser.

---

## Part 2: Run this frontend (if the project is already cloned)

Open a **new** terminal (keep Django running in the first one).

```bash
cd react-task
npm install
npm run dev
```

Open the address shown in the terminal, usually `http://localhost:5173`.

`npm install` reads `package.json` and installs everything (React, Axios, Tailwind), so nothing else is needed.

---

## Part 3: How the project was created (from scratch)

Follow this only if you are building the project again from zero.

### 1. Create the Vite + React project

```bash
npm create vite@latest react-task
```

Choose:

| Question | Answer |
|---|---|
| Select a framework | React |
| Select a variant | JavaScript |
| Install with npm and start now? | Yes (or No, then run `npm install`) |

Then:

```bash
cd react-task
```

### 2. Install Axios and Tailwind CSS

```bash
npm install axios
npm install tailwindcss @tailwindcss/vite
```

### 3. Add the Tailwind plugin in `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 4. Import Tailwind in `src/index.css`

Replace everything in `src/index.css` with this one line:

```css
@import "tailwindcss";
```

Make sure `src/main.jsx` imports it:

```js
import './index.css'
```

### 5. Add the app files

- `src/api.js`: all API calls with Axios
- `src/App.jsx`: patient form, patient table, update, delete, pagination

Delete `src/App.css` and the `src/assets` folder because they are not used.

### 6. Run

```bash
npm run dev
```

---

## How the frontend connects to the backend

All API calls are in `src/api.js`. The base URL is:

```
http://127.0.0.1:8000/api
```

If the backend runs on a different address, change `baseURL` in that file.

| Action | Request |
|---|---|
| Load list (page 1) | GET `/patients/?page=1` |
| Add patient | POST `/patients/` |
| Update patient | PATCH `/patients/<id>/` |
| Delete patient | DELETE `/patients/<id>/` |

Pagination: Django returns 5 patients per page (`PAGE_SIZE = 5` in `settings.py`). The same number is set as `PAGE_SIZE` at the top of `src/App.jsx`. If you change one, change the other.

## How to use the app

1. **Add:** fill the form at the top and click **Add patient**. The new row appears in the table.
2. **Update:** click **Update** on a row. The form fills with that patient's data. Change what you need and click **Save changes**. Leave the password empty to keep the old one.
3. **Delete:** click **Delete** on a row and confirm.
4. **Pagination:** use **Previous** and **Next** below the table.

## Project structure

```
react-task/
├── src/
│   ├── api.js         # Axios API calls
│   ├── App.jsx        # form + table + pagination (Tailwind classes)
│   ├── index.css      # only: @import "tailwindcss";
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `Failed to resolve import "axios"` | Run `npm install axios` inside the `react-task` folder |
| Page has no styling | Check `src/index.css` has `@import "tailwindcss";`, `main.jsx` imports it, and `vite.config.js` has the `tailwindcss()` plugin. Restart `npm run dev` |
| "Could not reach the server" message | Start the Django server and check `baseURL` in `src/api.js` |
| CORS error in the browser console | Complete Part 1 and restart Django |
| `npm run dev` fails with a strange path error (Windows) | Rename any parent folder that contains `&`, delete `node_modules`, then run `npm install` again |
| `npm` is not recognized | Install Node.js and reopen the terminal |