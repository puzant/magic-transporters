# Magic Transporters API

A RESTful API for managing **Magic Movers** and **Magic Items** in a transportation system.  
Built with **TypeScript**, **Express.js**, **Mongoose**, and **MongoDB**.

## Features

- Add Magic Movers and Magic Items
- Load a Mover with items (weight limit validation + state transition to "loading")
- Start a mission (state → "on-mission" + increment quests completed)
- End a mission (unload items + state → "resting")
- Activity logging (every load/start/end action recorded in `MissionLog`)
- Leaderboard: Top 10 Movers by quests completed
- Proper error handling with custom `AppError`
- Clean architecture: Controllers (thin), Services (business logic), Models, Utils
- Async error handling wrapper
- Type-safe throughout

## Tech Stack
- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- http-status-codes
- dotenv

## Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

## Installation
npm install 

## Run the project 
npm run dev

- Server runs on http://localhost:3000
- API base path: /api

## Project Structure
```
├── controllers/     # Thin HTTP handlers
├── services/        # Business logic + DB operations
├── models/          # Mongoose schemas & interfaces
├── routes/          # Route definitions
├── utils/           # AppError, ApiResponse, asyncHandler
├── middleware/      # Error handler
└── app.ts           # Express app setup + DB connection
```
