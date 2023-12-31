# GroupProjectNWEN304

## Application URL

Our application runs through the free tier of render.com, because of this the server automatically shuts down when not in use. Before accessing the website, please load all three of these urls until they respond with { message: 'OK' }, they will take approximately one minute to load.

https://boatsboatsboats-aovb.onrender.com/status
https://oauthmicroservice.onrender.com/status
https://recommendationservice.onrender.com/status

To access the site visit

https://boatsboatsboats-aovb.onrender.com/

An example admin account is provided below for testing purposes:

Username: Adminkoolguy420@gmail.com

Password: 123

Please note if you would like to test the reset password and Google Oauth you will need to use your own gmail

GitHub:

https://github.com/Burrouwill/BoatsBoatsBoats

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

## DB Design
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


##### POSTMAN ENDPOINT REQUESTS
The majority of these end points require a valid accessToken & Admin authority. This can be aquired via accessing the /auth end point & passing valid credentials (As mentioned earlier in this doc). Bare in mind the expiry of the accessToken is short, so re-authentication may be required. 

The headers for each request should include the following (If not autofilled by your API testing suite of choice):

    Name: Value
    Accept : */*
    Content-Type: application/json


##### HTML Endpoints
- Home Page - /
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/
    ```
- Login Page - /login
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/login
    ```
- Register Page - /register
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/register 
    ```
- Send Reset Password - /reset
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/reset
    Auth.Bearer: *Valid accessToken*
  ```

- Reset Password Confirm - /reset/:code
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/reset/resetCode *This must be a valid reset code acquired from /reset!*
    Auth.Bearer: *Valid accessToken*
  ```

- Edit Product - /products/:productId/edit
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/products/6506340f3fa56732141b90fd/edit *ID must be valid*
    Auth.Bearer: *Valid accessToken*
  ```

- New Product - /products/new
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/products/new
    Auth.Bearer: *Valid accessToken*
    ```

- Privacy Policy - /privacy
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/privacy
    ```

- View Cart - /cart
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/cart
    Auth.Bearer: *Valid accessToken*
    ```

- View Order - /order/:orderId
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/order/:orderId *ID must be valid*
    Auth.Bearer: *Valid accessToken*
  ```
- View Orders - /order
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/order
    Auth.Bearer: *Valid accessToken*
  ```
  
- Google Auth Entrypoint - /auth/google
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/auth/google
  ```

- Get cart recommendations - /recommendations
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/recommendations
    Auth.Bearer: *Valid accessToken*
  ```

- Applies a refresh token cookie - /finish/:refreshToken
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/finish/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWlua29vbGd1eTQyMEBnbWFpbC5jb20iLCJpYXQiOjE2OTc5MjY0MDAsImV4cCI6MTY5ODAxMjgwMH0.tfjjFJPvErpwS_J3KrkCcStyHFs4U_8u9LM6bt-IdjU *Assuming this is a valid refreshToken & user logged in*
    *This is an internal function used to pass cookie info from OAuth -> Server*
  ```


##### JSON Endpoints
*See Server/tests/ for additional info on DB endpoints*

- Get server status - GET /status
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/status
  ```

- Fetch all products - GET /allProducts
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/allProducts
    Auth.Bearer: *Valid accessToken*
    *Might take a while as there are many images*
  ```

- Insert product - POST /product/insert
  ```
    POST @ https://boatsboatsboats-aovb.onrender.com/product/insert 
    Auth.Bearer: *Valid accessToken*
    Body: {
            "name": "NotARealBoat",
            "price": "14.99",
            "description": "Epic",
            "imgUrl": "validImage",
            "id": 8
          }
    *Body contains the params you wish to update & ID handled by seq generator in MngoDB*
  ```

- Update product - PUT /product/:id
  ```
    PUT @ https://boatsboatsboats-aovb.onrender.com/product/65063375533acb75f17a5e96 *Suffix = product ID*
    Auth.Bearer: *Valid accessToken*
    Body: {
            "name": "Cool boat",
            "price": "14.99",
            "description": "Epic",
            "imgUrl": "validImage",
            "id": 8
          }
    *Body contains the params you wish to update*
    ```
- Get product details - GET /product/:id
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/product/65063375533acb75f17a5e96 *Suffix = product ID*
    Auth.Bearer: *Valid accessToken*
  ```

- Delete product - DELETE /product/:id
  ```
    DELETE @ https://boatsboatsboats-aovb.onrender.com/product/notAProductID *Suffix = product ID*
    Auth.Bearer: *Valid accessToken*
  ```

- Create order - POST /orders/insert
  ```
    POST @ https://boatsboatsboats-aovb.onrender.com/orders/insert 
    Auth.Bearer: *Valid accessToken*
    Body: {
            "productName": "Example Product",
            "quantity": 3,
            "price": 25.99
          }
    *Body contains the params you wish to add to orders*
  ```

- Update order - PUT /orders/:id
  ```
    PUT @ https://boatsboatsboats-aovb.onrender.com/orders/notAProductId *Suffix = product ID* 
    Auth.Bearer: *Valid accessToken*
    Body: {
            "productName": "Example Product",
            "quantity": 3,
            "price": 25.99
          }
    *Body contains the params you wish to update*
  ```

- Get order details - GET /orders/:id
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/orders/notAProductId *Suffix = product ID* 
    Auth.Bearer: *Valid accessToken*
    ```

- Delete order - DELETE /orders/:id
  ```
    DELETE @ https://boatsboatsboats-aovb.onrender.com/orders/notAProductId *Suffix = product ID* 
    Auth.Bearer: *Valid accessToken*
  ```

- Register new user - POST /register
  ```
    POST @ https://boatsboatsboats-aovb.onrender.com/register
    Body: {
            "user": "newuseremail@gmail.com",
            "pwd": "aValidPassword"
          }
    *Adds new user to DB if valid credentials passed*
  ```

- Login a new user - POST /auth
  ```
    POST @ https://boatsboatsboats-aovb.onrender.com/auth
    Body: {
            "user": "Userkoolguy420@gmail.com",
            "pwd": "123"
          }
  ```
            
- Fetch a new refresh token for a user - GET /refresh
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/refresh
    *This only works if user already Authenticated & has valid refreshToken in DB*
    ```

- Log a user out - GET /logout
  ```
    GET @ https://boatsboatsboats-aovb.onrender.com/logout
    *Logs whichever user was logged in, clears refresh token from cookie if there is one*
  ```

- Sends a password reset email - POST /sendResetPassword
  ```
    POST @ https://boatsboatsboats-aovb.onrender.com/sendResetPassword 
    Body: {
            "username": "someValidRegisteredEmail@gmail.com"
          }
  ```

- Applies a new password - POST /resetPassword
  ```
    POST @ https://boatsboatsboats-aovb.onrender.com/resetPassword
    Auth.Bearer: *Valid accessToken*
    Body: {
            "username": "Adminkoolguy420@gmail.com",
            "password": "123",
            "code": "1234567" *Code must be a valid one sent to email via posting at /sendResetPassword end*
          }
  ```

- Makes a user admin - PUT /admin
  ```
    PUT @ https://boatsboatsboats-aovb.onrender.com/admin
    Body: {
            "user": "emailOfUserYouWantToMakeAnAdmin@gmail.com",
            "pwd": "123"
          }
    *This only works if the user sending the request is an Admin*
  ```
