# Startup Tycoon AI - Vercel Deployment

This project is a React application built with Vite, optimized for deployment on [Vercel](https://vercel.com).

## Deployment Steps

1.  **Push to GitHub/GitLab/Bitbucket**: Ensure your code is in a repository.
2.  **Import to Vercel**: Connect your repository to Vercel.
3.  **Framework Preset**: Vercel will automatically detect **Vite**.
4.  **Environment Variables**:
    -   The application is designed for users to provide their own API keys in the UI.
    -   No server-side environment variables are required for the basic simulation.
5.  **Build and Deploy**: Click "Deploy".

## Project Structure

-   `src/`: React source code.
-   `index.html`: Entry point.
-   `vercel.json`: Configuration for SPA routing.
-   `vite.config.ts`: Vite configuration.

## Features

-   **AI-Powered Simulation**: Uses Google Gemini (via user-provided API keys).
-   **Multi-language Support**: English and Vietnamese.
-   **Responsive Design**: Mobile-friendly interface.
