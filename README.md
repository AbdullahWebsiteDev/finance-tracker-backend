Setup Instructions for MongoDB
Now your application is configured to use MongoDB exclusively. Here's what you need to do:

MongoDB Setup:

Make sure MongoDB is installed and running on your machine
Open MongoDB Compass
Connect to mongodb://localhost:27017
Create a new database called finance_tracker
Create three collections inside this database:
categories
transactions
users
Backend Setup:

Run these commands from your project root:
npm install express cors mongodb body-parser dotenv
node server.cjs
You should see a message: "Server running on port 3001" and "Connected to MongoDB"
Verify Connection:

After the backend is running, go to your app's Settings page
Navigate to the MongoDB tab
Click "Connect to MongoDB" button
You should see a success message
The code has been updated to use mongodb://localhost:27017/finance_tracker as the database URI. No additional
configuration is needed as this is hardcoded in the backend.

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d7d1f85c-658b-4d42-b97d-1ae833d971b1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d7d1f85c-658b-4d42-b97d-1ae833d971b1) and start
prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be
reflected in Lovable.

The only requirement is having Node.js & npm
installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d7d1f85c-658b-4d42-b97d-1ae833d971b1) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using
Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
