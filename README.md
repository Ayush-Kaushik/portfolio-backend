# Portfolio Backend

> Access the website here: [https://ayush-kaushik.github.io/](https://ayush-kaushik.github.io/)

This repository contains the backend services for my personal portfolio, implemented using two different serverless platforms: Cloudflare Workers and Netlify Functions. The backend is designed to handle contact form submissions and other potential API needs for the portfolio frontend.

## Structure

- **Cloudflare/**
  - `contact-worker/`: Contains a Cloudflare Worker for handling contact form submissions.
    - `src/index.ts`: Main entry point for the worker logic.
    - `wrangler.toml`: Configuration for deploying the worker using Wrangler.
    - `package.json`, `tsconfig.json`, `vitest.config.mts`: Project setup, TypeScript, and testing configuration.
    - `test/`: Contains tests for the worker.

- **Netlify/**
  - `netlify/functions/contact/contact.mts`: Netlify Function for handling contact form submissions.
  - `package.json`: Project dependencies and scripts for Netlify functions.

## Features

- **Contact Form Handling**: Both Cloudflare Worker and Netlify Function implementations process contact form submissions, making the backend platform-agnostic and deployable on multiple serverless providers.
- **TypeScript**: The codebase is written in TypeScript for type safety and maintainability.
- **Testing**: Includes test setup (using Vitest for Cloudflare Worker) to ensure worker is robust.

## Usage

- Deploy the Cloudflare Worker using Wrangler as configured in `Cloudflare/contact-worker/wrangler.toml`.
- Deploy the Netlify Function by placing it in the `netlify/functions/contact/` directory and configuring Netlify as needed.

## Getting Started

1. Clone the repository.
2. Install dependencies in each subproject (`npm install`).
3. Follow the deployment instructions for your chosen platform (Cloudflare or Netlify).