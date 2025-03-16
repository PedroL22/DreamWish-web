export interface User {
  id: string
  email: string
  username: string
  role: string
}

export interface LoginCredentials {
  credential: string
  password: string
}

export interface AuthResponse {
  message: string
  user?: User
}
