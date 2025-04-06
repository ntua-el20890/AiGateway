"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to the index page if not authenticated
    }
  }, [status, router]);

  // Show a loading state while checking authentication
  if (status === "loading") {
    return (
      <div>
        <Loader className="animate-spin h-5 w-5 text-muted-foreground" />
        <p>Loading...</p>
      </div>
    );
  }

  // Render the children if authenticated
  return <>{children}</>;
}