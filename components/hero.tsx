import Image from "next/image"
import DonateButton from "./donate-button"

export default function Hero() {
    return (
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto pt-16">
            <div className="flex me-auto flex-col justify-center items-start gap-10">
                <h2 className="text-6xl text-slate-800 leading-tight font-bold text-center md:text-left">Donate blood <br /> save life!</h2>
                <p className="text-xl">If you are a donor, please sign up to donate blood and save lives.</p>
                <DonateButton title="Need Blood?" link="/#donor-table" />
            </div>
            <div className="relative">
                <Image
                    className="rounded-full rounded-bl-none w-[90%] h-[60vh] ms-auto object-cover relative z-20"
                    src="/assets/images/donor-2.jpeg"
                    alt="Hero"
                    width={1000}
                    height={1000}
                />
                <Image
                    className="rounded-full rounded-bl-none absolute top-5 left-12 w-[90%] h-full object-cover z-10"
                    src="/assets/images/red-bg.jpg"
                    alt="Hero-bg"
                    width={500}
                    height={500}
                />
            </div>
        </div>
    )
}