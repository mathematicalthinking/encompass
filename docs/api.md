# ENCOMPASS API

There are a number of ways of querying the encompass database, each query behaving differently depending on the user account. This is a resource to help understand what to expect from a query.

Find routes in app_server/datasource/api. Requests are processed by app_server/middelware/access.

## GET /api/stats

Returns a json object of the number of documents of each major schema: users, workspaces, submissions, comments, selections, etc

## GET /api/users

- Admin user (not in student role) gets a list of all users not marked isTrashed
- PdAdmin user (not in student role) gets users in PdAdmin's organization, workspaces, classes, responses, and assignments not marked isTrashed
- Teacher user (not in student role) gets users in Teachers's organization, workspaces, classes, responses, and assignments not marked isTrashed
- Student user / role gets users in Student's workspaces, classes, responses, and assignments not marked isTrashed

NOTE: students cannot access /users in encompass

### ?alias=current

Initial request made to find currentUser in client

### ?usernameSearch=<username>

Finds by username
Paired with ?filterBy, but does not appear to be used

### ?username=<username>

Finds by username

### ?ids=<ids>&ids=<id>...

Finds by array of ids

## GET /api/users/:id

Sends user with associated id

- admin can get any individual user
- any user can fetch themself
- any user can fetch a user they created
- any user can get a user in their organization
- any user can get a user part of the same response thread
- students cannot access individual users

## POST /api/users

Creates a new user

- only available to Admin accounts
- returns error message for non-Admin accounts

## PUT /api/users/:id

Updates a user

- Admins can update any user
- PdAdmin and Teachers can update users they created
- Anyone can update themself
