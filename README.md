Retrieves a list of up to 100 contacts via emails exchanged (i.e. when there's a reply to a sent email)

## To run:

```$ npm i```


```$ node .```

Navigate to ```localhost:3000/login``` and login with your Google account.


## To test:

```$ npm test```

Only added unit tests for parsing business logic.
In production, we could add integration tests if we want to ensure behavior involving API/DBMS calls.


## Endpoints:

`/login`

Generates an authentication URL with Google OAuth2 API with requested scopes and redirects user to OAuth consent screen.

`/oauth2/redirect`

Callback from Google OAuth. Sets credentials (access + refresh token) for OAuth2 client and redirects user to `/list` endpoint

`/list`

Uses Google Gmail API to parse an authenticated user's inbox, retrieving message headers and filtering for sender emails.


## Potential improvements:

- I use the maximum records allowed by Google's API (500) to retrieve sent emails - since we are concerned with exchanges, it's possible that under 100 contacts are ultimately returned. (e.g. if the last 500 emails someone has sent has no replies). A way to solve this is by batching API calls until we have 100 contacts, but I did not implement this edge case in the interest of time.

- Dynamic authorization scopes in environment

- Authentication middleware to protect endpoints instead of checking the client credentials

- Persistance layer (not necessary in context of this application)

- Integration tests