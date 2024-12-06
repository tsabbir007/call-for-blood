import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {PrismaClient} from "@prisma/client";
import {auth} from "@/auth";
import SignOut from "@/components/navbar/sign-out";
import SignIn from "@/components/navbar/sign-in";
import Link from "next/link";

const prisma = new PrismaClient();

export async function UserNav() {
    const session = await auth();

    if (!session) {
        return (
            <SignIn callbackUrl={`/profile`}>
                Sign in for Donate
            </SignIn>
        )
    }

    const email = session?.user?.email ?? undefined;

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 md:h-10 w-8 md:w-10 border-2 border-green-500">
                        <AvatarImage src={user?.image || ""} alt={user?.name || ""}/>
                        <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link href="/profile">
                            Profile
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <SignOut callbackUrl={`/`}>
                        Sign out
                    </SignOut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}