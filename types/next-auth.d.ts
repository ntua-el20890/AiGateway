import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    name?: string;
    email?: string;
    image?: string;
    token?: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      name?: string;
      email?: string;
      image?: string;
      token?: string; 
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    accessToken?: string; 
  }
}