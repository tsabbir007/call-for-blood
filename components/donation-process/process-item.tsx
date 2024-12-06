import { cn } from "@/lib/utils";

export default function ProcessItem({ order, color, title, description }: { order: number, color: string, title: string, description: string }) {
    return (
        <div className={"rounded-lg space-y-2"}>
            <div className={cn("text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-2xl", color)}>
                {order}
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm">{description}</p>
        </div>
    )
}