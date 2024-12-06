import { UserNav } from "@/components/navbar/user-nav";
import Image from "next/image";

export default function Navbar() {
    return (
        <div className="sticky top-8 z-50 shadow-lg max-w-2xl bg-white rounded-full mx-auto px-8 py-5 flex justify-between items-center">
            <div className="flex items-center gap-1">
                <Image className="rotate-[150deg] w-8 h-8" src="/assets/images/blood-icon.png" alt="logo" width={50} height={50} />
                <h1 className="text-xl text-[24px] font-bold text-primary">Blood Deft</h1>
            </div>
            <UserNav />
        </div>
    );
}