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

##### DB Design
The DB is hosted through MongoDB Atlas which is a multi-cloud database service. Under the 'shop' Database data is stored in the following collections.
    -Products: stores all the products
    -Users: stores all the users with encrypted password and their role
    -Orders: stores all orders from all users. Orders are timestamped and the user and products they ordered are stored
    -Resets: stores the one time reset codes for the users. Set with a time to life to let them expire after 30mins

## Fault Tolerance

Our server utilises many different error handling techniques to provide a high availability service.
We ran a variety of different tests to ensure the api was acting appropriately given user inputs as documented in the test cases and cache test pages sections.
We utilise try/catch in spots with user input, so that user inputs cannot have any effect on the stability of the system.
The microservice architecture means that in theory if we had more resources outside of a university project context, we could make duplicates of each microservice each with a load balancer in order to seamlessly switch between them in the case any fail. This is because we utilise a stateless rest api, all state is client-side or in Json Web Tokens.
If any of our microservices goes down, the default state is to be safe and not allow for different behavior to occur which could allow for exploits if the server is not behaving as expected. If the microservice is down, the client simpys shows nothing in its spot and it is not even known there is a problem. If the oauth service is down, google users are simply unable to login however all other functionality remains stable.
Our deployment settings are set to restart the server upon any crashing occuring, meaning minimal downtime even in the worst case scenario. 


## Running Postman with Authorization

The server uses a token for authorization, if the route you are wanting to access above is listed as a "HTML" endpoint it should use the following method for authentication:

1. Login to the application using your authorized account
2. Open developer tools, then open the "Application" tab
3. Click Cookies > boatsboatsboats-aovb.onrender.com
4. Copy the value of the "jwt" cookie
5. Click "Cookies" underneath the send button on Postman
6. Add the domain name boatsboatsboats-aovb.onrender.com
7. Add a cookie with the name "jwt" and the value you copied previously


To run json endpoints use the above method, with these additional steps:

1. Login to the application using your authorized account
2. Add an item to your cart
3. Open developer tools, then open the "Application" tab
4. Click Local Storage > boatsboatsboats-aovb.onrender.com
5. Copy the value of the "accessToken" entry
6. Click "Authorization" tab on Postman and select type of bearer token
7. Paste the value into the box

**Note: This token expires, so if it gives you an authorization error it has expired**



## Cache Test Cases

Using postman and taking the `jwt` cookie from a logged in admin user, and adding it to postman, the following requests should have their cache control set to no cache so that the results are always updated. See above for running the requests.

You can use the postman test

```javascript
pm.test("Cache control header set to no cache", function () {
    pm.response.to.have.header("Cache-Control");
    pm.response.to.be.header("Cache-Control", "no-store")
});
```

- https://boatsboatsboats-aovb.onrender.com/products/6506347cf848557fbb47fbb1/edit
- https://boatsboatsboats-aovb.onrender.com/order
- https://boatsboatsboats-aovb.onrender.com/cart


Cache should be enabled on these pages:

You can use the postman test
```javascript
pm.test("Cache control header set to cache", function () {
    let value = pm.response.headers.get("Cache-Control");
    pm.expect(value).to.not.equal('no-store');
});
```

- https://boatsboatsboats-aovb.onrender.com/order/650ba01220652fe2b4144ae0
- https://boatsboatsboats-aovb.onrender.com/privacy

These all pass
