export interface Login {
  success: boolean;
  token: string;
  user: User;
}

interface User {
  id: number;
  email: string;
}
