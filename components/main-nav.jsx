"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { MobileNav } from "@/components/mobile-nav";
import lwsLogo from "@/assets/lws_logo.svg";
import Image from "next/image";
import { X } from "lucide-react";
import { Command } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
export function MainNav({ items, children }) {
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [loginSession, setLoginSession] = useState(null);
	const [hydrated, setHydrated] = useState(false);
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		setHydrated(true);
		setLoginSession(session);
	}, [session]);

	// Prevent hydration mismatch by not rendering session-dependent content until hydrated
	if (!hydrated) {
		return (
			<>
				<div className="flex gap-6 lg:gap-10">
					<Link href="/">
						<Image className="max-w-[100px]" src={lwsLogo} alt="Logo" />
					</Link>
					{items?.length ? (
						<nav className="hidden gap-6 lg:flex">
							{items?.map((item, index) => (
								<Link
									key={index}
									href={item.disabled ? "#" : item.href}
									className={cn(
										"flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
									)}>
									{item.title}
								</Link>
							))}
						</nav>
					) : null}
				</div>
				<nav className="flex items-center gap-3">
					<div className="items-center gap-3 hidden lg:flex">
						<Link
							href="/login"
							className={cn(buttonVariants({ size: "sm" }), "px-4")}>
							Login
						</Link>
						<Button variant="outline" size="sm">
							Register
						</Button>
					</div>
					<button
						className="flex items-center space-x-2 lg:hidden"
						onClick={() => setShowMobileMenu(!showMobileMenu)}>
						{showMobileMenu ? <X /> : <Menu />}
					</button>
				</nav>
			</>
		);
	}

	return (
		<>
			<div className="flex gap-6 lg:gap-10">
				<Link href="/">
					<Image className="max-w-[100px]" src={lwsLogo} alt="Logo" />
				</Link>
				{items?.length ? (
					<nav className="hidden gap-6 lg:flex">
						{items?.map((item, index) => (
							<Link
								key={index}
								href={item.disabled ? "#" : item.href}
								className={cn(
									"flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
								)}>
								{item.title}
							</Link>
						))}
					</nav>
				) : null}

				{showMobileMenu && items && (
					<MobileNav loginSession={loginSession} items={items}>{children}</MobileNav>
				)}
			</div>
			<nav className="flex items-center gap-3">
				{!loginSession && (
					<div className="items-center gap-3 hidden lg:flex">
					<Link
						href="/login"
						className={cn(buttonVariants({ size: "sm" }), "px-4")}>
						Login
					</Link>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								Register
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56 mt-4">
							<DropdownMenuItem 
								className="cursor-pointer"
								onClick={() => router.push('/register/student')}
							>
								Student
							</DropdownMenuItem>
							<DropdownMenuItem 
								className="cursor-pointer"
								onClick={() => router.push('/register/instructor')}
							>
								Instructor
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				)}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="cursor-pointer">
							<Avatar>
								<AvatarImage
									src="https://github.com/shadcn.png"
									alt="@shadcn"
								/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56 mt-4">
						<DropdownMenuItem 
							className="cursor-pointer"
							onClick={() => router.push('/account')}
						>
							Profile
						</DropdownMenuItem>
						<DropdownMenuItem 
							className="cursor-pointer"
							onClick={() => router.push('/account/enrolled-courses')}
						>
							My Courses
						</DropdownMenuItem>
						<DropdownMenuItem 
							className="cursor-pointer"
							onClick={() => router.push('/account/testimonials')}
						>
							Testimonials & Certificates
						</DropdownMenuItem>
						{!!loginSession && (
							<DropdownMenuItem 
								className="cursor-pointer"
								onClick={() => signOut()}
							>
								Logout
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
				<button
					className="flex items-center space-x-2 lg:hidden"
					onClick={() => setShowMobileMenu(!showMobileMenu)}>
					{showMobileMenu ? <X /> : <Menu />}
				</button>
			</nav>
		</>
	);
}
