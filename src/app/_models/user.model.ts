export interface User {
  username: string;
  knownAs: string;
  email: string
  token: string;
}

export interface UserWithRoles {
  name: string
  knownAs: string
  fullName: string
  lastName: string
  email: string
  roles: string
}

export interface UserWithPassword {
  knownAs: string
  fullName: string
  lastName: string
  email: string
  password: string
  roles: string
}
