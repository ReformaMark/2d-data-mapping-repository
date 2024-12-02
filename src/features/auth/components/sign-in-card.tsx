"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuthActions } from "@convex-dev/auth/react"
import { Loader2, TriangleAlertIcon } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { AuthFlow } from "../types"

interface SignInCardProps {
    setState: (state: AuthFlow) => void
}

export const SignInCard = ({ setState }: SignInCardProps) => {
    const { signIn } = useAuthActions();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const router = useRouter()

    const onCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
    };

    const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (pending) return;
        
        // Validate reCAPTCHA
        if (!captchaToken) {
            setError("Please complete the reCAPTCHA verification");
            return;
        }
        
        setPending(true);
        setError("");

        try {
            const signInPromise = signIn("password", {
                email,
                password,
                flow: "signIn",
                captchaToken,
            });

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Request timeout")), 10000);
            });

            await Promise.race([signInPromise, timeoutPromise]);
            setError("");
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error("Sign in error:", error);
            
            if (error instanceof Error) {
                if (error.message.includes("Failed to fetch")) {
                    setError("Connection error. Please check your internet connection and try again.");
                } else if (error.message === "Request timeout") {
                    setError("Request timed out. Please try again.");
                } else {
                    setError(error.message);
                }
            } else {
                setError("Invalid email or password");
            }
            
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
        } finally {
            setPending(false);
        }
    };

    return (
        <Card className="w-full max-w-[450px] mx-auto p-4 sm:p-6 md:p-8">
            <CardHeader className="px-0 pt-0 space-y-2">
                <CardTitle className="text-primary text-xl sm:text-2xl">
                    Login to continue
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-2.5 sm:p-3 rounded-md flex items-center gap-x-2 text-xs sm:text-sm text-destructive mb-4 sm:mb-6">
                    <TriangleAlertIcon className="size-3 sm:size-4" />
                    {error}
                </div>
            )}
            <CardContent className="space-y-4 sm:space-y-5 px-0 pb-0">
                <form onSubmit={onSignIn} className="space-y-2 sm:space-y-2.5">
                    <Input
                        disabled={pending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                        className="h-10 sm:h-11"
                    />
                    <Input
                        disabled={pending}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                        className="h-10 sm:h-11"
                    />
                    <div className="flex justify-center my-3 sm:my-4 transform scale-90 sm:scale-100">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={onCaptchaChange}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-10 sm:h-11 text-sm sm:text-base"
                        size={"lg"}
                        disabled={pending || !captchaToken}
                    >
                        {pending ? (
                            <>
                                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </form>
                <Separator />
                <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Don&apos;t have an account? <span
                            className="text-primary hover:underline cursor-pointer"
                            onClick={() => setState("signUp")}>
                            Sign up
                        </span>
                    </p>

                    <p className="block lg:hidden text-xs sm:text-sm text-muted-foreground">
                        Changed your mind? <span
                            className="text-primary hover:underline cursor-pointer"
                            onClick={() => router.push("/")}>
                            Go back to homepage.
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}