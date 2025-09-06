
# Checksum Calculator Extension Installation Guide

This document provides step-by-step instructions for installing and setting up the Checksum Calculator extension with a PostgreSQL backend.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- Chrome or Firefox browser

## Step 1: Install Dependencies

First, install all the necessary dependencies by running:

```bash
npm install
# or
yarn install

# You'll also need these for the backend server
npm install express pg cors body-parser fs-extra
# or
yarn add express pg cors body-parser fs-extra
```

## Step 2: Configure PostgreSQL Database

1. Make sure PostgreSQL is installed and running on your system.

2. Create a new database for the extension:

```sql
CREATE DATABASE checksums_db;
```

3. Update the database connection details in `server/server.js`:

```javascript
const pool = new Pool({
  user: 'your_postgres_username',
  host: 'localhost',
  database: 'checksums_db',
  password: 'your_postgres_password',
  port: 5432,
});
```

## Step 3: Build the Extension

Run the build script to create the extension files:

```bash
node build-extension.js
```

This will create a `dist/extension` folder containing all the necessary files for the browser extension.

## Step 4: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer Mode" by toggling the switch in the top right corner
3. Click "Load unpacked" and select the `dist/extension` folder
4. The extension should now be installed and visible in your extensions list

## Step 5: Start the Backend Server

In a separate terminal, start the PostgreSQL backend server:

```bash
node server/server.js
```

The server will run on `http://localhost:3000` by default.

## Step 6: Using the Extension

1. Click on the extension icon in your browser toolbar
2. Toggle the "Use PostgreSQL Backend" switch to connect to your PostgreSQL database
3. Use the extension to calculate checksums, which will now be stored in your PostgreSQL database

## Troubleshooting

- If you encounter CORS errors, make sure the backend server is running and the CORS configuration is correct
- Check the browser console for any JavaScript errors
- Verify your PostgreSQL connection details if database operations fail
- Make sure the correct permissions are set in the `manifest.json` file

## Development

For development purposes, you can run the React app in development mode:

```bash
npm start
# or
yarn start
```

This will start a development server at `http://localhost:8080`.
