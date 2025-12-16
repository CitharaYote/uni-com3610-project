# Automating the Recruitment Process

## Introduction

This was a project undertaken as my third-year dissertation at the University of Sheffield. The aim of the project was to improve upon the outdated recruitment software currently used by the University of Sheffield, which relies heavily on manual processes and lacks compatibility with modern systems.

## Setup and Installation

### Prerequisites

- Node.js
- NPM or Yarn
- MongoDB Atlas cluster

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/CitharaYote/uni-com3610-project.git
   ```

2. Navigate to the turborepo directory:

   ```bash
    cd uni-com3610-project/turborepo
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

4. Set up environment variables:

   - Rename `.env.example` to `.env` in both `turborepo/apps/backend` and `turborepo/apps/web`.
   - Update the environment variables with your MongoDB Atlas credentials and generate a pair of secure JWT secret keys in `turborepo/apps/backend/.env`.
   - All other options can be left as default for local development.

5. Start the development server:
   ```bash
    npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   - This will start both the backend and frontend applications concurrently through Turborepo.
   - The frontend will be accessible by default at `http://localhost:5173` and the backend at `http://localhost:3000`.

### Usage Information

- Admin accounts need be created through the MongoDB database directly.
- The job creation form can be autofilled with dummy data by clicking the info text at the top of the form.
