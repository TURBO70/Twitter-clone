## Description
<p>This project is a Twitter clone application built with Express.js, utilizing PostgreSQL for data storage, Redis for real-time features, and Docker for containerization. It mimics core Twitter functionalities including tweet management, user interactions, and notifications through a RESTful API.</p>

## Table of Contents
- [API Documentation](https://documenter.getpostman.com/view/32787914/2sA3s1pCA4)
- [Key Technologies](#key-technologies)
- [Features](#features)
  - [User Authentication](#user-authentication)
  - [Social Interactions](#social-interactions)
  - [Tweet Management](#tweet-management)
  - [Notifications](#notifications)
- [Project Structure](#project-structure)
- [Installation with Docker](#Installation-Steps)
- [Contributing](#contributing)

## Key Technologies
- **Backend Framework**: Express.js
- **Database**: PostgreSQL
- **Caching & Real-time**: Redis
- **Containerization**: Docker
- **File Storage**: Cloudinary
- **API Documentation**: Postman

## Features

### User Authentication
- Secure JWT-based authentication system
- Email/password registration and login
- Password recovery and reset functionality
- Profile management with avatar uploads

### Social Interactions
- Follow/Unfollow system
- User search functionality
- Random user suggestions

### Tweet Management
- Tweet creation with media uploads
- Newsfeed and timeline systems
- Like/Unlike functionality
- Reply threads and conversation tracking

### Notifications
- Real-time notifications using Redis
- Notification history and management
- Mark-as-read functionality

## Project Structure
```powershell
twitter-clone/
├── config/
│   ├── cloudinary.js
│   ├── db.config.js
│   ├── multer.js
│   └── redisCache.js
│
├── controllers/
│   ├── authController.Controllers.js
│   ├── notifications.Controllers.js
│   └── tweet.Controllers.js
│
├── events/
│   └── index.js
│
├── middlewares/
│   ├── auth.js
│   ├── errorMiddleware.js
│   └── validatorMiddleware.js
│
├── routes/
│   ├── auth.routes.js
│   ├── notifications.routes.js
│   └── tweet.routes.js
│
├── utils/
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── tweetValidator.validators.js
│   ├── customError.js
│   ├── db.init.js
│   └── sendEmail.js
│
├── env/
├── docker/
│   └── Dockerfile
│
├── .gitignore
├── app.js
├── docker-compose.yml
├── package-lock.json
└── package.json
```
## 🛠️ Installation Steps

<p>1. Clone the repository:</p>

```bash
git clone https://github.com/TURBO70/Twitter-clone.git
```

<p>2. Navigate to the project directory:</p>

```bash
cd Twitter-clone
```

<p>3. Set up environment variables:</p>

```bash
cp .env.example .env
```
Edit the `.env` file with your credentials (PostgreSQL, Redis, and Cloudinary details).

<p>4. Start the application using Docker Compose:</p>

```bash
docker-compose up --build
```

This command will:
- Start PostgreSQL database container
- Initialize Redis server container
- Build and run the Express.js application
- Automatically set up database schemas
- Enable hot-reload for development



## Key features of this installation method:
- No separate database installation required
- All dependencies containerized
- Automatic schema migrations
- Redis caching pre-configured
- Isolated development environment
## Contributing
<p>Contributions are welcome! Please submit issues or pull requests to improve the project. For major changes or feature requests, open an issue first to discuss the changes you'd like to make.</p>
