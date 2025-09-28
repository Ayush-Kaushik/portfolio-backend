# Portfolio Insight Worker

> Access the website here: [https://ayush-kaushik.github.io/](https://ayush-kaushik.github.io/)

A Cloudflare Worker integrated with **Google Gemini AI** that provides quick, TL;DR-style answers to user queries based on the content of a website. This project enables visitors to interact with your website conversationally, extracting key insights without manually browsing pages.

---

## Table of Contents
- [Portfolio Insight Worker](#portfolio-insight-worker)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Setup \& Installation](#setup--installation)
  - [Milestones](#milestones)

---

## Project Overview
The **Portfolio Insight Worker** acts as an intermediary between a website frontend and **Gemini AI**, enabling users to ask questions about your website content. The Worker handles:

- Receiving prompts from the frontend  
- Sending prompts to Gemini AI along with website content for context  
- Returning concise, context-aware responses  

This creates an interactive and AI-powered experience for users to quickly understand information on a website.

---

## Features
- **AI-Powered Q&A:** Gemini AI provides answers based on the website’s content.  
- **Cloudflare Worker Integration:** Lightweight, fast serverless function for processing requests.  
- **Contextual Responses:** AI trained on your website’s content for accurate responses.  
- **Frontend Ready:** Easily connect your website’s UI to send prompts and display responses.  

---

## Architecture
> 🌐 Frontend (Website) → ⚡ Cloudflare Worker (Portfolio Insight Worker) → 🤖 Gemini AI (Context-aware responses) → 🌐 Response back to Frontend

- **Frontend:** Sends user prompts (questions) to the Worker.  
- **Worker:** Receives prompts, attaches website context, calls Gemini AI API, and returns the response.  
- **Gemini AI:** Processes the prompt with context and generates concise answers.  

---

## Setup & Installation
1. **Clone the repository**  
```bash
git clone <repo-url>
cd portfolio-insight-worker
```

2. **Configure Environment Variables**

Add your Gemini AI API key and other necessary settings to .env:
```bash
GEMINI_API_KEY=<your_api_key>
```

3. **Deploy to Cloudflare Worker**
   
```
wrangler publish
```

## Milestones

| Milestone                 | Description                                              | Status        |
| ------------------------- | -------------------------------------------------------- | ------------- |
| Initial Worker Setup      | Create a basic Cloudflare Worker to receive prompts      | ✅ Completed   |
| Gemini AI Integration     | Connect Worker with Gemini AI API                        | ✅ Completed   |
| Website Content Indexing  | Enable AI to use website content for context             | ⚙️ In Progress |
| Frontend Integration      | Connect website UI to send queries and display responses | ⚙️ Planned     |
| Enhanced Context Handling | Optimize Worker for large website content and caching    | ⚙️ Planned     |
| Deployment & Testing      | Full end-to-end testing and deployment                   | ⚙️ Planned     |
