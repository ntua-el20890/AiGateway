import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth from "next-auth"
import axios from "axios"; 
import { connectToDatabase, COLLECTIONS, hashPassword, verifyPassword } from '@/services/mongoService';
const { getToken } = require("next-auth/jwt");

// Replace with your actual API endpoint that's running the Python script
const API_URL = 'http://localhost:3002/api/login';

export const validateCredentials = async (username: string, password: string): Promise<boolean> => {
  try {
    // This would call your Python script on the backend
    const response = await axios.post(API_URL, {
      username, 
      password, 
    });
    
    console.log('Backend response:', response.data);

    // Assuming your API returns { success: true/false }
    if (!response.data.success) {
      console.error('Authentication failed:', response.data.error || 'Unknown error');
    }
    return response.data.success;
  } catch (error) {
    console.error('Authentication error:', (error as any).response?.data || (error as any).message);
    // For development, you can return true to test the flow without the actual API
    // Remove this in production
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('DEV MODE: Bypassing authentication');
    //   return true;
    // }
    return false;
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Partial<Record<"username" | "password", unknown>>) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Use the new validateCredentials function
        const isValid = await validateCredentials(
          credentials.username as string,
          credentials.password as string
        );

        if (isValid) {
          const token = await getToken({
            req: {
              headers: {
                authorization: `Bearer ${credentials.username}`,
              },
            },
            secret: process.env.NEXTAUTH_SECRET || "your-jwt-secret-key",
          });
          console.log("Token from JWT", token);
          // Return a user object that will be stored in the JWT
          return {
            id: String(credentials.username),
            name: `User ${credentials.username}`,
            username: String(credentials.username),
            token: token, 
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    //max age 1 day
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback", { token, user });
      // Add user data to token when first signing in
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.accessToken = user.token; // Add the token to the JWT
      }
      console.log("JWT Token", token);
      return token;
    },
    async session({ session, token }) {
      // Add user data from token to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.token = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-jwt-secret-key", // Replace with an actual secure secret in production
  debug: process.env.NODE_ENV === "development",
})
