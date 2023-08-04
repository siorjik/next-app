export type UserType = {
  id: number,  
  firstName: string,
  lastName: string,
  email: string,
  isActive: boolean,
  createdAt: string,
  updatedAt: string,
  isTwoFa: boolean,
  twoFaHash: string | null
}

export type ProfileUserType = { firstName: string, lastName: string, email: string, id: string, isTwoFa: boolean }
