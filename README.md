# PlateSwap

PlateSwap is a server-side platform designed to facilitate food sharing and surplus reduction. It provides robust APIs for users to share surplus food items, make requests for specific items, and manage their interactions securely.


## visit : https://plateswap-96379.web.app/ or https://plateswap.netlify.app/


## Introduction

PlateSwap addresses the critical issues of food waste and scarcity by serving as a central hub for food sharing and surplus reduction. Through its APIs, individuals and businesses can post surplus food items, search for specific foods, and connect with others in their community.

## Features

- **Food Sharing**: APIs for posting surplus food items, including details like quantity, expiration date, and pickup location.
- **Food Requests**: Users can make requests for specific food items they need, allowing others to respond and fulfill these requests.
- **Search and Filter**: Provides APIs for searching and filtering available food items based on various criteria such as food name, quantity, and status.
- **Secure Authentication**: Utilizes JSON Web Tokens (JWT) for secure user authentication and authorization.
- **Profile Management**: APIs for managing user profiles, including viewing posted items, requested items, and account settings.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Other Tools**: CORS, dotenv, cookie-parser


## Usage

1. Register or log in to your PlateSwap account using the provided APIs.
2. Explore available food items posted by other users and make requests for items you need.
3. Post surplus food items you wish to share with the community.
4. Manage your profile settings and view your activity history.
5. Log out securely after each session.

## JWT (JSON Web Tokens)

PlateSwap uses JWT for user authentication. When a user logs in or registers, a JWT token is generated and sent back to the client. This token should be included in subsequent requests to authenticate the user and grant access to protected endpoints.

## Contributing

Contributions to PlateSwap are welcome! Follow the guidelines in the repository for contributing.




