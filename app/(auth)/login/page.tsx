'use client'

import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function LoginPage() {
    const handleGoogleSignIn = () => {
        signIn('google', { redirectTo: '/profile' }).then()
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-r from-green-50 to-slate-50 min-h-screen rounded-tl-[300px] rounded-br-[300px]">
                <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 h-screen">
                  
                    <div className="relative hidden md:block">
                        <Image
                            className="rounded-full rounded-bl-none w-[80%] h-[70vh] mt-20 object-cover relative z-20"
                            src="/assets/images/donor-2.jpeg"
                            alt="Login Hero"
                            width={1000}
                            height={1000}
                        />
                        <Image
                            className="rounded-full rounded-bl-none absolute top-24 -left-5 w-[80%] h-[70vh] object-cover z-10"
                            src="/assets/images/red-bg.jpg"
                            alt="Login Hero Background"
                            width={500}
                            height={500}
                        />
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-lg">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
                                <p className="text-gray-600 mb-8">Sign in to continue your journey of saving lives</p>
                            </div>

                            <Button
                                onClick={handleGoogleSignIn}
                                variant="outline"
                                className="mx-auto h-12 flex items-center justify-center gap-3 text-base hover:bg-gray-50"
                            >
                                <Image
                                    src="/assets/images/google.png"
                                    className='w-8 h-8'
                                    alt="Google"
                                    width={50}
                                    height={50}
                                />
                                Continue with Google
                            </Button>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-500">
                                    By signing in, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}