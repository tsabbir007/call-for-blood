import { PrismaClient } from "@prisma/client"
import Navbar from "@/components/Navbar/navbar"
import { DonorTable } from "@/components/donor-table"
import Hero from "@/components/Hero/hero"
import { Button } from "@/components/ui/button"
import DonateButton from "@/components/donate-button"

const prisma = new PrismaClient()

export default async function HomePage() {

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-r from-green-50 to-slate-50 rounded-tl-[300px] rounded-br-[300px]">
                <div className="container">
                    <Navbar />
                    <div className="container mx-auto px-4 py-2 md:py-4 space-y-20">
                        <Hero />
                    </div>
                </div>
                <div className="flex gap-10 items-center justify-between bg-gradient-to-r from-red-500 to-red-600 p-10 rounded-tr-[70px] me-20 my-20">
                    <div className="flex flex-col gap-2 container">
                        <h2 className="text-3xl font-bold text-white">We are helping people for 3 years</h2>
                        <p className="text-base text-white/80">We are a team of dedicated professionals who are passionate about saving lives through blood donation. Our journey began in 2021, and since then, we have been committed to making a difference in the lives of those in need.</p>
                    </div>
                    <DonateButton />
                </div>
                <div className="container">
                    <div>
                        <DonorTable />
                    </div>
                </div>
            </div>
        </div>
    )
}