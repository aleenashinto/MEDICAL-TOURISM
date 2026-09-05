// Simple in-memory database for demo purposes.
// In a real application, this would be a real database connection (PostgreSQL, MongoDB, etc.)

// Define a global type so it persists across Next.js hot-reloads in development
declare global {
  var __maides_users: Array<{email: string, password: string, name: string, role: string}> | undefined;
}

if (!global.__maides_users) {
  global.__maides_users = [
    {
      email: "sarah.jenkins@example.com",
      password: "Password123", // In a real app, this MUST be hashed
      name: "Sarah Jenkins",
      role: "PATIENT"
    }
  ];
}

export const db = {
  users: {
    find: (email: string) => {
      return global.__maides_users?.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    add: (user: {email: string, password: string, name: string, role: string}) => {
      if (!global.__maides_users) global.__maides_users = [];
      global.__maides_users.push(user);
    }
  }
};
