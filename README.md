## Description
<p>This project is a Twitter clone application built with Express.js. It mimics the core functionalities of Twitter, allowing users to interact with tweets, follow other users, and manage their social connections. The application offers a comprehensive set of RESTful APIs for user management, tweet handling, and notifications.</p>

## Table of Contents

- [Description](#description)
- [Features](#features)
  - [User Authentication](#user-authentication)
  - [Social Interactions](#social-interactions)
  - [Tweet Management](#tweet-management)
  - [Notifications](#notifications)
- [Project Structure](#project-structure)
- [Installation Steps](#installation-steps)
- [Contributing](#contributing)

<h2>Features</h2>

<h3> User Authentication</h3>

* Signup: Register new users with email and password.
* Login: Authenticate users and provide access tokens.
* Password Management: Includes password recovery and reset functionality.
* Profile Management: Edit user information and view user profiles.

<h3>Social Interactions</h3>

* Follow/Unfollow: Users can follow or unfollow other users.
* Search: Find users by username or other criteria.
* Random User: Retrieve profiles of random users.

<h3>Tweet Management</h3>

* Post Tweet: Create new tweets.
* Retrieve Tweets: Access tweets from the user's timeline or newsfeed.
* Like/Unlike Tweets: Interact with tweets by liking or unliking them.
* Reply to Tweets: Respond to tweets from other users.
* Get Replies: View replies to specific tweets.
* User Replies and Likes: Retrieve tweets liked by the user and replies they have made.

<h3>Notifications</h3>

* Retrieve Notifications: Get a list of notifications related to user activity.
* Mark as Read: Update notifications to indicate they have been read.

## Project structure
 ```powershell
src/
├── config/
│   ├── cloudinary.js
│   ├── db.config.js
│   └── multer.js
│
├── controllers/
│   ├── authController.controllers.js
│   ├── notifications.controllers.js
│   └── tweet.controllers.js
│
├── events/
│   └── index.js
│
├── middlewares/
│   ├── auth.js
│   ├── errorMiddleware.js
│   └── validatorMiddleware.js
│
├── models/
│   ├── notifications.models.js
│   ├── tweet.models.js
│   └── user.models.js
│
├── routes/
│   ├── auth.routes.js
│   ├── notifications.routes.js
│   └── tweet.routes.js
│
├── utils/
│   ├── customError.js
│   ├── sendEmail.js
│   └── validators/
│       ├── authValidator.js
│       └── tweetValidator.validators.js
│
├── .gitignore
├── app.js
├── package-lock.json
└── package.json
```

## 🛠️ Installation Steps:

<p>1. Clone the Repository:</p>

```
git clone https://github.com/TURBO70/twitter-clone.git
```

<p>2. Navigate to the Project Directory:</p>

```
cd twitter-clone
```

<p>3. Install Dependencies:</p>

```
npm install
```

<p>4. Start the Application:</p>

```
npm start
```

## Contributing
<p>Contributions are welcome! Please submit issues or pull requests to improve the project. For major changes or feature requests, open an issue first to discuss the changes you'd like to make.</p>
