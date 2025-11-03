"use client";

import { useSession } from "@/lib/client-auth";
import { useEffect, useState } from "react";

export function useAuth() {
    const { data: session, isPending } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return {
        session,
        user: session?.user,
        isLoading: isPending || isLoading,
        isAuthenticated: !!session,
    };
}