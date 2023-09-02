1. POST '/signup'</br>
Register new user. Body:
```
{
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

response:
```
{
  accessToken: string
}
```

2. POST '/login'</br>
Body:
```
{
  username: string;
  password: string;
}
```

response:
```
{
  accessToken: string
}
```

3. POST '/create-url'</br>
Create new shorten url.</br>
Authorization: Bearer ${accessToken} (optional)</ br>
Body:
```
{
  url: string;
}
```
Response:
```
{
  full_url: string,
  shorten_url: string,
  usage_count: 0,
  user: {       // optional (if authorized)
    id: number
  }
}
```

4. GET '/user-urls' (only for authorized users)</br>
Response:
```
[
  {
    full_url: string,
    shorten_url: string,
    usage_count: number,
  },
  ...
]

```

5. GET '/:shortenUrl'</br>
Redirect to full url