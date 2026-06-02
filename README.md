# TripEasy - Client Application

Welcome to the **TripEasy Frontend Client**, a modern, responsive, and visually stunning web application for browsing travel destinations, customize holiday packages, making travel bookings, and paying securely.

Built with **React**, **Material UI (MUI)**, and **Vite / React Scripts**, this client interacts seamlessly with the backend API to deliver a premium user experience.

---

## 🚀 Features

- **Dynamic Destination Explorer**: Browse categories, search destinations, and view rich trip details.
- **Custom Package Builder**: Interactive forms to request custom packages tailored to specific needs.
- **Seamless Booking System**: Instant package booking with real-time price calculation and form validation.
- **Secure Payment Checkout**: Integrated with Cashfree Payment Gateway to complete payments securely.
- **Interactive Notifications**: Beautiful and responsive toast alerts for all user interactions.
- **Contact Support**: Simple contact form linked directly with the backend support system.

---

## 🛠️ Tech Stack & Libraries

- **Framework**: [React](https://reactjs.org/) (v18+)
- **Styling & UI**: [Material UI (MUI)](https://mui.com/) & Emotion
- **Routing**: [React Router DOM](https://reactrouter.com/) (v6)
- **API Client**: [Axios](https://axios-http.com/)
- **Contact & Email**: [@emailjs/browser](https://www.emailjs.com/)
- **Alerts & Toasts**: [React Toastify](https://github.com/fkhadra/react-toastify)
- **SEO & Metadata**: [React Helmet](https://github.com/nfl/react-helmet)
- **Date Utilities**: [date-fns](https://date-fns.org/)

---

## 📁 Project Structure

```text
client/
├── public/              # Static public assets (icons, images, logos)
├── src/
│   ├── assets/          # Project images, illustrations, and styling assets
│   ├── components/      # Reusable UI components (Navbar, Footer, Cards, etc.)
│   ├── pages/           # Screen views (Home, Destination, Booking, Checkout, etc.)
│   ├── services/        # API service configurations & Axios interceptors
│   ├── utils/           # Helper functions
│   ├── App.js           # Core App component with Routing
│   └── index.js         # Entry point
├── .env                 # Local environment configuration
├── package.json         # Scripts and dependencies
└── vercel.json          # Vercel deployment configuration
```

---

## ⚙️ Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Clone & Navigate to Client Directory
```bash
cd client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root of the `client/` directory and configure the backend API URL:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🏃 Running the Application

### Development Server
Run the app in development mode with hot-reloading:
```bash
npm run dev
# or
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Production Build
Builds the app for production to the `build` folder:
```bash
npm run build
```

---

## 🌐 Deployment (Vercel)

This frontend client is configured for deployment on Vercel using the provided [vercel.json](file:///c:/Users/ajha2/Desktop/tripeasy/client/vercel.json).

To deploy:
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the `client/` directory and follow the prompts.
3. Configure the `REACT_APP_API_URL` environment variable in the Vercel Dashboard.
