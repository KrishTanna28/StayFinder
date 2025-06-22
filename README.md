# StayFinder

StayFinder is a full-stack web application for booking and hosting stays, inspired by Airbnb. Users can browse, search, and filter listings, make bookings with date selection, and securely pay using Stripe. Hosts can create, edit, and manage their property listings.

---

## Features

- **User Authentication:** Register, login, and secure session management.
- **Host Dashboard:** Create, edit, and delete property listings.
- **Listing Management:** Upload images, set prices, and mark locations on a map.
- **Search & Filter:** Search by city, title, or description; filter by price range or sort by price.
- **Booking System:** Select check-in and check-out dates, view total price.
- **Stripe Payments:** Secure online payments for bookings.

---

## Tech Stack

- **Frontend:** React, React Router, Axios, Stripe.js, Leaflet (for maps)
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Payments:** Stripe

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/KrishTanna28/StayFinder.git
cd StayFinder
```

### 2. Install dependencies

#### Backend

```sh
cd stayfinder-backend
npm install
```

#### Frontend

```sh
cd ../stayfinder-frontend
npm install
```

---

### 3. Environment Variables

#### Backend (`stayfinder-backend/.env`)

Create a `.env` file with the following content:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
YOUR_STRIPE_SECRET_KEY=your_stripe_secret_key
```

**Replace the values with your actual credentials. Never commit your real secrets to GitHub.**

#### Frontend (`stayfinder-frontend/.env`)

If you use Stripe’s publishable key in the frontend, create:

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

### 4. Running the App

#### Backend

```sh
cd stayfinder-backend
npm start
```

#### Frontend

```sh
cd ../stayfinder-frontend
npm start
```

- The frontend will typically run on [http://localhost:3000](http://localhost:3000)
- The backend will run on [http://localhost:5000](http://localhost:5000)

---

## Usage

- **Browse Listings:** View all available stays on the homepage.
- **Search & Filter:** Use the search bar and price filter in the navbar.
- **Book a Stay:** Select dates and reserve. If not logged in, you’ll be prompted to log in.
- **Payment:** Complete your booking with Stripe’s secure payment form.
- **Host a Stay:** Click "Become a Host" to add or manage your listings.
- **Edit/Delete:** Hosts can edit or delete their own listings.

---

## Folder Structure

```
stayfinder-backend/
  controllers/
  models/
  routes/
  .env
  server.js
stayfinder-frontend/
  src/
    components/
    pages/
    contexts/
  .env
  package.json
```

---

## Security

- **.env files are in .gitignore** and should never be committed.
- **JWT** is used for authentication.
- **Stripe** is used for secure payments.

---

## License

MIT

---

## Credits

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
- [Leaflet](https://leafletjs.com/) (for maps)

---

**Feel free to contribute or open
