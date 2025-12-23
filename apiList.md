## Auth apis

POST /login
POST /signup
POST /logout


## Profile routes

GET /profile/view
PATCH /profile/edit
PATCH /profile/password // forgot password API


## Communication routes

POST /request/send/:status/:userId
POST /request/review/:status/:requestId

## user routes

GET /user/connections
GET /user/requests          -- get all the pending requests for the user
GET /user/feed              -- 
