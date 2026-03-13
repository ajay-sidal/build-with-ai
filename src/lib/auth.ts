import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [],
  pages: {
    signIn: '/login',
  },
};
