import { ArrowRight} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function DonateButton({ title, link }: { title: string, link: string }) {
    return (
        <Link href={link}>
            <Button className="bg-white text-black rounded-full rounded-tr-none hover:bg-white h-14 pe-1.5">
                <div className="flex gap-2 items-center">
                <span className="font-bold text-base px-4">{title}</span>
                <div className="h-10 w-10 bg-red-500 rounded-full rounded-tr-none flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white font-bold" />
                </div>
                </div>
            </Button>
        </Link>
    )
}