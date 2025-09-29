                                RIDE BOOKING SYSTEM

Node.js, Express and MongoDB is used here for the ride booking app backend. It supports user authentication,ride request,driver management,ride status update and fare and destination calculation. For the distance calculation ---- algorithm has been used.

API Endpoints
AUTH(/api/v1/auth)
-login(/login)
-refreshToken(/refresh-token)
-logout(/logout)
-reset password(reset-password)

USERS(/api/v1/users)
-register(/register)
-get all users(/all-users)

RIDES(/api/v1/rides)
-request ride(/request)
-cancel ride(/:id/cancel)
-get all ride history(/history)
-estimate fare(/estimate)

DRIVERS(/api/v1/drivers)
-approve driver(/approve)
-update driver location(/updateLocation)
-drivers availability update(/availability)
-earning history(/history)
-requested rides(/:id/available)
-pickedup(/:id/pickup)
-complete(/:id/complete)
-accept ride(/:id/accept)

ADMIN
-can cancel ride
-approve driver
-block unblock driver

block/unblock,active/inactive,approved all checks are done in checkAuth middleware
