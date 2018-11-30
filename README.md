# playvine
web app for musicians to find sessions to participate, or create sessions to find other musicians to participate


## Description

Allows musicians to create gigs, or 'sessions', to which other musicians can apply to fulfill a needed role. For example, a singer looking for a guitarist for an upcoming concert can create a session and handle requests from applicants.


## User Stories

- **404** - As a user I want to see a 404 page when the page I'm looking for doesn't exist, so I can go to another place and not waste my time
- **500** - As a user I want to see an error page when there's a server issue, so I can get frustrated right away and blame the devs
- **homepage** - As a user I want to be able to access the homepage so I can see what the app is about and sign up if I'm interested
- **sign up** - As a user I want to sign up so I can create sessions and request to join sessions posted by other musicians
- **login** - As a user I want to be able to log in to have access to account functions like creating and responding to sessions
- **logout** - As a user I want to be able to log out to make sure no one accesses my account
- **sessions list** - As a user I want to see all upcoming sessions for my city/area, so I can check out the only the ones I'm interested in
- **session detail** - As a user I want to see the session details and information to be able to join
- **create session** - As a user I want to create a session so I can find the musicians I need for my upcoming gigs. 
- **edit session** - I want to be able to modify details
- **delete session** - delete a session if the situation changes or if it will no longer take place.
- **join session** - As a user I want to be able to request to join a session with my instrument of choice and 
- **check session request status** - be able to check the state of my request so I know if I've been accepted or rejected.
- **accept session request** - As a user I want to be able to accept requests from other musicians
- **reject session request** - As a user I want to be able to reject requests from other musicians


## Backlog - List of other features outside of the MVP's scope

**User profile:**
- See and edit profile
- Upload profile picture
- Add style preference (to be able to filter the list of sessions)
- List of recommendations (by other users)

**Find profile of other users (musicians)**
Search by name
Search by instrument
Search by style preference
Show their profile

**Features on the profile page**
Recommendation button on the profile of other users (Ask other users to recommend you. Recommendations will be displayed on your profile page. You are able to withdraw your recommendation upon a bad experience.)
Follow button on the profile of other users. You will be notified when a user you follow is organizing or attending a session.
Block button on the profile of other users. You won't see sessions organized or joined by users you don't want to work with.
Invite a user to a session.

**Sessions**
Extra optional list filter to filter the list of sessions by area (see geolocation), style, creator ('only my sessions'), dates on which you are available (see availibility).
Display the musicians that are attending the session.
Send whatsapp/sms message throw Twilio, to get into contact with attending musicians about a session. This feature should only work for users that are accepted to a session.

**Geo Location:**
Use the user's location preference to filter the list of sessions by location (f.i. ø 50 km around Barcelona)
Display the sessions on a map instead of a list

**Availability**
Add dates when you are not available to your personal calendar
Filter the list of sessions according to your availibility (so you don't see sessions you are not able to attend anyway.`


## ROUTES:

- GET / 
  - renders the homepage
- GET /auth/signup
  - redirects to /sessions (session list view) if user is already logged in
  - renders the signup form (with flash messages for required fields)
- POST /auth/signup
  - redirects to /sessions if user is already logged in
  - body:
    - username
    - password
    - phonenum
    - instruments played
    - location (city)
- GET /auth/login
  - redirects to /sessions (session list view) if user is already logged in
  - renders the login form (with flash messages)
- POST /auth/login
  - redirects to /sessions
  - body:
    - username
    - password
- POST /auth/logout
  - Can only log out if already logged in
  - Redirects to /
  - Body: (empty)
- GET /sessions
  - Renders the sessions list view
  - If user not signed up or logged in, redirects to /
- GET /sessions/create
  - Render the session creator/editor view
  - If user not signed up or logged in, redirects to /
- POST /sessions/create
  - If user not signed up or logged in, redirects to /
  - Redirects to /sessions
   - body:
    - creatorId
    - name
    - startTime
    - location (city)
    - roles
    - sessionInfo
- GET /sessions/:session-id/edit
  - Checks userId === creatorId for the session, and in that case:
  - checks if you are logged in
  - checks if the sessionID is valid
  - Render the session creator/editor view
- POST /sessions/:session-id/edit
  - Checks if logged in userId === creatorId for the session, and in that case:
  - checks if you are logged in
  - checks if the sessionID is valid
  - Redirects to /sessions
   - body:
    - sessionId
    - name
    - startTime
    - location (city)
    - roles
    - sessionInfo
- POST /sessions/:session-id/delete
  - Checks if logged in userId === creatorId for the session, and in that case:
  - checks if you are logged in
  - checks if the sessionID is valid
  - Redirects to /sessions
  - Body: empty
- GET /sessions/:id
  - Checks if logged in userId === creatorId for the session, and in that case:
  - Redirects to /sessions/:session-id/edit
  - Renders session detail view if user is logged in but is not creator
- POST /sessions/:id/join
  - If user not signed up or logged in, redirects to /
  - Redirects to /sessions (after a flash confirmation message)
   - Body:
    - request.create
    - userID
- POST /sessions/:session-id/confirm
  - If user not signed up or logged in, redirects to /
  - Checks if logged in userId === creatorId for the session, and in that case:
  - Redirects to /sessions
   - body:
    - session.roles.joinerId
    - request.status is 'accepted' or 'rejected'


## Models (User, Session and Request)

**USER**

```
'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phonenum: {
    type: Number,
    required: true
  },
  instruments: [{
    type: String,
    enum: ['Guitar', 'Drums', 'Bass', 'Keyboard', 'Trumpet', 'Saxophone', 'Strings', 'Vocals'],
    required: true
  }],
  location: {
    type: String,
    required: true,
    trim: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


```

**SESSION**

```

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const sessionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  roles: [{
  	instrument: {
		type: String,
		enum: ['Guitar', 'Drums', 'Bass', 'Keyboard', 'Trumpet', 'Saxophone', 'Strings', 'Vocals'],
    		required: true,
	},
	requests: [{
    		type: ObjectId
	    	ref: 'Request'
    	}]
  }],
  sessionInfo: {
    type: String,
    required: true
  },
  creatorId: {
    type: ObjectId,
    ref: 'User'
  }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;


```

**REQUEST**

```
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const requestSchema = new Schema({
  joinerId: {
    type: objectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    required: true,
    default: 'Pending'
  }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
``` 


## Links


### Kanban Board

Picture goes here


### Views Mockup

https://www.figma.com/file/CMCIOGltk7r6UEk3DgoMJwFb/sessionplayer?node-id=55%3A0


### Git

The url to your repository and to your deployed project

[Repository Link](http://github.com)

[Deploy Link](https://playvine.herokuapp.com/)


### Slides

The url to your presentation slides

[Slides Link](https://slides.com/ceciliabarudi/playvine)


