export interface UrlsRequest extends Request {
  user: User;
}

interface User {
  id: number;
  iat: number;
}
