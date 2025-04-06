import NextAuth from "next-auth";
import { handlers } from "@/lib/auth"; // Import your NextAuth configuration

export const { GET, POST } = handlers