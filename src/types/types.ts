/**
 * Model Account
 * 
 */
export type Account = {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
}

/**
 * Model Session
 * 
 */
export type Session = {
  id: string
  sessionToken: string
  userId: string
  expires: Date
}

/**
 * Model User
 * 
 */
export type User = {
  id: string
  name: string | null
  userName: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  role: string
}

/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = {
  identifier: string
  token: string
  expires: Date
}

/**
 * Model Classroom
 * 
 */
export type Classroom = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  capacity: number
  hasComputer: boolean
}

/**
 * Model Booking
 * 
 */
export type Booking = {
  id: string
  createdAt: Date
  updatedAt: Date
  from: Date
  to: Date
  bookerId: string
  classroomId: string
  description: string | null
}

export type BookingWithAllData = {
  booker: Pick<User, 'name'>,
  classroom: Classroom
} & Booking;

export type BookingWithBooker = Omit<BookingWithAllData, 'classroom'>;