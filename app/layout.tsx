import './globals.css'
import { NextAuthProvider } from "@/providers";
import { Toaster } from "react-hot-toast";

//mona sans
import { Work_Sans } from 'next/font/google'
import TanstackQueryProvider from '@/provider/tanstack-query';
const workSans = Work_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
})

export const metadata = {
    title: 'Call for Blood',
    description: 'Call for Blood is a platform to connect blood donors with blood recipients.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={workSans.className}>
                <NextAuthProvider>
                    <TanstackQueryProvider>
                        <Toaster />
                        {children}
                    </TanstackQueryProvider>
                </NextAuthProvider>
            </body>
        </html>
    )
}