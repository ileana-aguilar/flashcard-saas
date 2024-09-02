# Quizin

**Quizin** is an AI-powered flashcard generation platform that helps users create, save, and manage study materials efficiently. The application leverages OpenAI API to generate customized flashcards based on user-inputted subjects. Users can subscribe to different plans for additional features and storage, with secure authentication and payments powered by Clerk and Stripe APIs respectively. All user data is securely stored in Firebase.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Subscription Plans](#subscription-plans)


## Features

- **AI-Powered Flashcard Generation:** Generate customized flashcards using OpenAI API based on any subject or topic.
- **User Authentication:** Secure user authentication and management using Clerk API.
- **Subscription Plans:** Offer two subscription plans (Basic and Pro) for users to choose from, with payments handled by Stripe.
- **Save and Manage Flashcards:** Users can save flashcard sets to their library for future use.
- **Firebase Integration:** All user data, including flashcards and subscription details, are stored securely in Firebase.

## Technologies Used

- **Frontend:** React, Material UI
- **Backend:** Firebase, Node.js
- **APIs:** 
  - OpenAI API for flashcard generation
  - Clerk API for user authentication
  - Stripe API for subscription payment processing
- **Hosting:** Vercel
- **Analytics:** Google Analytics

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- Firebase account and project set up
- Clerk API account and keys
- Stripe account and secret key
- OpenAI API key

### Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/quizin.git
    cd quizin
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**

   Create a `.env.local` file in the root directory and add your API keys and Firebase configuration:

    ```bash
    NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
    CLERK_API_KEY=your_clerk_api_key
    STRIPE_SECRET_KEY=your_stripe_secret_key
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    OPENAI_API_KEY=your_openai_api_key
    ```

4. **Start the Development Server:**

    ```bash
    npm run dev
    ```

## Usage

1. **Sign Up / Log In:**
   - Users must sign up or log in via the Clerk API to use Quizin.

2. **Generate Flashcards:**
   - Input a subject or topic, and Quizin will generate a set of flashcards using the OpenAI API.

3. **Save Flashcards:**
   - Save generated flashcards to your personal library for future use.

4. **Subscription:**
   - Users can subscribe to the Basic or Pro plan via Stripe to unlock additional features and storage.

## Subscription Plans

- **Quizin Basic:** $5/month
  - Access to basic flashcard features
  - Limited storage

- **Quizin Pro:** $10/month
  - Unlimited flashcards and storage
  - Priority support

