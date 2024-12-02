import { UserNav } from "@/components/Navbar/user-nav";
import Image from "next/image";

export default function Navbar() {
    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <Image className="rotate-[150deg]" src="/assets/images/blood-icon.png" alt="logo" width={32} height={32} />
                    <h1 className="text-2xl font-bold text-primary">Blood Deft</h1>
                </div>
                <UserNav />
            </div>
        </header>
    );
}