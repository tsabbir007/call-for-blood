import Image from "next/image"
import { Button } from "../ui/button"
import DonateButton from "../donate-button"

export default function Hero() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
            <div className="flex me-auto flex-col justify-center items-start gap-4">
                <h2 className="text-5xl font-bold mb-2 md:mb-6 text-center md:text-left">The Gift of blood <br /> is the gift of life</h2>
                <p className="text-lg">If you are a donor, please sign up to donate blood and save lives.</p>
                <div className="flex gap-4">
                    <DonateButton />
                    <Button variant="destructive" className="h-12 px-5 text-base">Need Blood?</Button>
                </div>
            </div>
            <div className="relative">
                <Image
                    className="rounded-full rounded-bl-none w-full h-[70vh] ms-auto object-cover relative z-20"
                    src="/assets/images/donor.png"
                    alt="Hero"
                    width={500}
                    height={500}
                />
                <Image
                    className="rounded-full rounded-bl-none absolute top-5 -left-5 w-full h-full object-cover z-10"
                    src="/assets/images/red-bg.jpg"
                    alt="Hero-bg"
                    width={500}
                    height={500}
                />
            </div>
        </div>
    )
}