"use client";

import {signOut} from "next-auth/react";

interface SignOutProps {
    callbackUrl: string;
    children?: React.ReactNode;
}

export default function SignOut ({callbackUrl, children}: SignOutProps) {
    const handleSignOut = async () => {
        await signOut( {redirectTo: callbackUrl});
    };

    return (
        <div className={`cursor-pointer`} onClick={handleSignOut}>
            {children}
        </div>
    );
}