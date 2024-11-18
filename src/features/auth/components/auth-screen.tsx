"use client"

import { useConvexAuth } from "convex/react"
import Image from "next/image"
import { SignInCard } from "./sign-in-card"
import { RoleCheck } from "./role-check"
import { AuthFlow } from "../types"
import { useState } from "react"
import { SignUpCard } from "./sign-up-card"

export const AuthScreen = () => {
    const [state, setState] = useState<AuthFlow>("signIn")
    const { isAuthenticated } = useConvexAuth()

    if (isAuthenticated) {
        return <RoleCheck />
    }

    return (
        <div className="h-screen w-full lg:flex lg:flex-row">
            <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-primary/80">
                <div className="h-full flex flex-col justify-center items-center px-24 space-y-8">
                    <div className="bg-white rounded-lg p-8 shadow-lg w-fit">
                        <div className="flex flex-row items-center justify-center gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-[300px] h-[60px] relative">
                                    <Image
                                        src="/turu-logo.png"
                                        alt="Turu Logo"
                                        fill
                                        className="object-contain hover:scale-105 transition-transform"
                                        priority
                                        sizes="(max-width: 300px) 100vw, 300px"
                                    />
                                </div>
                                <span className="text-sm text-gray-600 mt-2">Barangay Turu</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-[260px] h-[60px] relative">
                                    <Image
                                        src="/mapinya-logo.png"
                                        alt="Mapinya Logo"
                                        fill
                                        className="object-contain hover:scale-105 transition-transform"
                                        priority
                                        sizes="(max-width: 260px) 100vw, 260px"
                                    />
                                </div>
                                <span className="text-sm text-gray-600 mt-2">Barangay Mapinya & Balitucan</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center space-y-3">
                        <h1 className="text-5xl font-bold text-white">Welcome</h1>
                        <p className="text-xl text-white/80">
                            Visualizing the future of agriculture in the Philippines
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-full w-full lg:w-[50%] flex flex-col flex-1 items-center justify-center">
                <div className="h-full flex items-center justify-center ">
                    <div className="md:h-auto md:w-[420px]">
                        {state === "signIn" ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
                        {/* <SignInCard /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}