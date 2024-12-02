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
        <Button onClick={handleSignIn}>
            {children}
        </Button>
    );
}