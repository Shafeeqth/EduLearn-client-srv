import NextAuth from 'next-auth';
import { authOptions } from './_nextAuth';

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };
