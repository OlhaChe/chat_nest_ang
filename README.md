# Messenger Web Application

This project is a web-based messenger application that allows users to communicate in a one-on-one format. The app supports user registration, login, and the ability to send, edit, delete, and attach multiple files to messages.

---

## Tech Stack

### Frontend
- **Framework**: Angular
- **Language**: TypeScript
- **Styling**: TailwindCSS

### Backend
- **Framework**: NestJS
- **Language**: JavaScript/TypeScript

### Database
- **Options**: MySQL

### Containerization
- **Docker**: The application is fully containerized for seamless deployment.

---

## Features

1. **User Authentication**
    - Login and Registration functionality.
   
2. **One-on-One Messaging**
    - Send and receive messages in real-time.
    - Attach multiple files to messages.

3. **Message Management**
    - Edit and delete sent messages.

4. **Responsive Design**
    - Styled using **TailwindCSS** for a modern and responsive UI.

5. **Dockerized Environment**
    - The entire app runs in Docker containers for consistent development and deployment.

---

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [MySQL](https://www.mysql.com/)

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-repository/messenger-app.git
```
### 2. Build and Run the Application
Use Docker to build and start the application:

```bash
docker-compose up --build
```
---

## Usage

Access the Application

Frontend: ``` http://localhost:4200```

Backend API: ``` http://localhost:3000 ```