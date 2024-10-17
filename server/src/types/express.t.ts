
// Define the user role type
export type UserRole = "admin" | "doctor";

// Defining the User interface
export interface User {
  id: string;
  username: string;
  role: UserRole;
}

// Extend Express's Request interface to include User
declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user attribute and make it contain information such as ID, role, and user name
    }
  }
}