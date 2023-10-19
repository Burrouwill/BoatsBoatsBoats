# GroupProjectNWEN304

## Application URL

Our application runs through the free tier of render.com, because of this the server automatically shuts down when not in use. Before accessing the website, please load all three of these urls until they respond with { message: 'OK' }, they will take approximately one minute to load.

https://boatsboatsboats-aovb.onrender.com/status
https://oauthmicroservice.onrender.com/status
https://recommendationservice.onrender.com/status

To access the site visit

https://boatsboatsboats-aovb.onrender.com/

An example admin account is provided below for testing purposes:

Username: 

Password:

## Running

Run the following steps on each of the microservices

Copy example.env to .env and fill out variables, then run

`npm i`

`npm run dev`

The server will be accessable on http://localhost:3000

## Exposed endpoints:

### Server
##### HTML Endpoints
- Home Page - /
- Login Page - /login
- Register Page - /register
- Send Reset Password - /reset
- Reset Password Confirm - /reset/:code
- Edit Product - /products/:productId/edit
- New Product - /products/new
- Privacy Policy - /privacy
- View Cart - /cart
- View Order - /order/:orderId
- View Orders - /order
- Google Auth Entrypoint - /auth/google
- Get cart recommendations - /recommendations
- Applies a refresh token cookie - /finish/:refreshToken

##### JSON Endpoints
- Get server status - GET /status
- Fetch all products - GET /allProducts
- Insert product - POST /product/insert
- Update product - PUT /product/:id
- Get product details - GET /product/:id
- Delete product - DELETE /product/:id
- Create order - POST /orders/insert
- Update order - PUT /orders/:id
- Get order details - GET /orders/:id
- Delete order - DELETE /orders/:id
- Register new user - POST /register
- Login a new user - POST /auth
- Fetch a new refresh token for a user - GET /refresh
- Log a user out - GET /logout
- Sends a password reset email - POST /sendResetPassword
- Applies a new password - POST /resetPassword
- Makes a user admin - PUT /admin

### RecommendationService

##### HTML Endpoints
- Get a users cart recommendations - GET /getRecommendations

##### JSON Endpoints
- Get server status - GET /status

### OAuthService

##### HTML Endpoints
- Entry point into flow - GET /auth/google
- Google callback - GET /google/callback
- Success route - GET /auth/google/success
- Failure route - GET /auth/google/failure

##### JSON Endpoints
- Get server status - GET /status

## Fault Tolerance

TODO