Retrieves a list of senders associated with the 100 most recent emails for a gmail user.


## To run:

```$ npm i```


```$ node .```

Navigate to ```localhost:3000/login``` and login with your Google account.


## To test:

```$ npm test```

Only added unit tests for business logic for parsing.
In production, we could add integration tests if we want to ensure behavior involving API/DBMS calls.


## Routes:

`/login`

Generates an authentication URL with Google OAuth2 API with requested scopes and redirects user to OAuth consent screen.

`/oauth2/redirect`

Callback from Google OAuth. Sets credentials (access + refresh token) for OAuth2 client and redirects user to `/list` endpoint

`/list`

Uses Google Gmail API to parse an authenticated user's inbox, retrieving message headers and filtering for sender emails.


## Potential improvements:

- Dynamic authorization scopes in environment

- Authentication middleware to protect endpoints

- Persistance layer (not necessary in context of this application)

- Integration tests