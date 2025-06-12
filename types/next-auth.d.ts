import 'next-auth';

export type UserRole = 'super-admin' | 'admin' | 'moderator' | 'user';

declare module 'next-auth' {
  interface User {
    role?: UserRole;
  }

  interface Session {
    user: User & {
      role?: UserRole;
    };
  }
}
