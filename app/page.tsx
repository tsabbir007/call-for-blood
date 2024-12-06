import { PrismaClient } from "@prisma/client"
import Navbar from "@/components/navbar/navbar"
import { DonorTable } from "@/components/table/donor-table"
import Hero from "@/components/hero"
import DonateButton from "@/components/donate-button"
import DonationProcess from "@/components/donation-process"
import Footer from "@/components/footer"

const prisma = new PrismaClient()

export default async function HomePage() {
    return (
        <div className="min-h-screen bg-white">
           
            <div className="h-screen bg-gradient-to-r from-green-50 to-red-50 rounded-tl-[300px] rounded-br-[300px] relative">
                <Navbar />
                <Hero />
                <div className="flex gap-10 items-center justify-between bg-gradient-to-r from-red-500 to-red-600 p-10 py-16 rounded-tr-[70px] me-20 !mt-20">
                    <div className="flex flex-col gap-2 container">
                        <h2 className="text-3xl font-bold text-white">We are helping people for 3 years</h2>
                        <p className="text-base text-white/80">We are a team of dedicated professionals who are passionate about saving lives through blood donation. Our journey began in 2021, and since then, we have been committed to making a difference in the lives of those in need.</p>
                    </div>
                    <DonateButton title="See Donation Process" link="/#donation-process" />
                </div>
            </div>
            
           
            <div className="container space-y-32 pt-32">
                <DonationProcess />
                <DonorTable />
            </div>
            <Footer />
        </div>
    )
}