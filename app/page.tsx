import { PrismaClient } from "@prisma/client"
import { DonorTable } from "@/components/table/donor-table"
import Hero from "@/components/hero"
import DonateButton from "@/components/donate-button"
import DonationProcess from "@/components/donation-process"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar/navbar"

export default async function HomePage() {
    return (
        <div className="min-h-screen bg-white">
          
            <div className="min-h-screen lg:h-screen bg-gradient-to-r from-green-50 to-red-50 rounded-tl-[100px] lg:rounded-tl-[300px] rounded-br-[100px] lg:rounded-br-[300px] relative">
                <Navbar />
                <Hero />
                
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center justify-between bg-gradient-to-r from-red-500 to-red-600 p-6 lg:p-10 py-10 lg:py-16 rounded-tr-[70px] mx-4 lg:me-20 ms-0 !mt-20">
                    <div className="flex flex-col gap-2 container">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white text-center lg:text-left">We are helping people for 3 years</h2>
                        <p className="text-sm lg:text-base text-white/80 text-center lg:text-left">We are a team of dedicated professionals who are passionate about saving lives through blood donation. Our journey began in 2021, and since then, we have been committed to making a difference in the lives of those in need.</p>
                    </div>
                    <div className="flex-shrink-0">
                        <DonateButton title="See Donation Process" link="/#donation-process" />
                    </div>
                </div>
            </div>

            <div className="container space-y-16 lg:space-y-32 pt-16 lg:pt-32 px-4">
                <DonationProcess />
                <DonorTable />
            </div>
            <Footer />
        </div>
    )
}