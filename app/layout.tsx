import {Inter} from 'next/font/google'
import './globals.css'
import {NextAuthProvider} from "@/providers";
import {Toaster} from "react-hot-toast";

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'Call for Blood',
    description: 'Call for Blood is a platform to connect blood donors with blood recipients.',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <NextAuthProvider>
            <Toaster />
            {children}
        </NextAuthProvider>
        </body>
        </html>
    )
}