"use client";

import {signOut} from "next-auth/react";
import {Button} from "@/components/ui/button";

interface SignInProps {
    callbackUrl: string;
    children?: React.ReactNode;
}

export default function SignIn ({callbackUrl, children}: SignInProps) {
    const handleSignIn = async () => {
        await signOut({ redirectTo: callbackUrl });
    };

    return (
        <Button onClick={handleSignIn} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 h-10 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-lg">
            {children}
        </Button>
    );
}