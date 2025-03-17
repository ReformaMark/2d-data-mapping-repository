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
import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from "sonner"
import { AuthFlow } from "../types"
import { CodeInput } from "./code-input"
import { ResetPasswordWithEmailCode } from "./reset-password-with-email-code"

interface SignInCardProps {
    setState: (state: AuthFlow) => void
}

export const SignInCard = ({ setState }: SignInCardProps) => {
    const { signIn } = useAuthActions();
    const [step, setStep] = useState<"signIn" | { email: string } | "forgot">("signIn");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const onCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
        setError("");
    };

    if (step === "forgot") {
        return (
            <ResetPasswordWithEmailCode
                provider="password-code"
                handleCancel={() => setStep("signIn")}
            />
        )
    }

    if (step !== "signIn") {
        return (
            <Card className="w-full max-w-[450px] mx-auto p-8">
                <h2 className="text-2xl font-semibold mb-4">Check your email</h2>
                <p className="text-muted-foreground text-sm mb-6">
                    Enter the 8-digit code we sent to {typeof step === 'object' && 'email' in step ? step.email : ''}
                </p>
                <form
                    className="space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setPending(true);
                        const formData = new FormData(event.currentTarget);
                        signIn("password-code", formData)
                            .catch((error) => {
                                console.error(error);
                                toast.error("Code could not be verified, try again");
                            })
                            .finally(() => {
                                setPending(false);
                            });
                    }}
                >
                    <CodeInput />
                    <input
                        name="email"
                        value={typeof step === 'object' && 'email' in step ? step.email : ''}
                        type="hidden"
                    />
                    <input name="flow" value="email-verification" type="hidden" />
                    <Button type="submit" className="w-full" disabled={pending}>
                        {pending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify Email"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="link"
                        className="w-full"
                        onClick={() => setStep("signIn")}
                    >
                        Back to Sign In
                    </Button>
                </form>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-[450px] mx-auto p-4 sm:p-6 md:p-8">
            <CardHeader className="px-0 pt-0 space-y-2">
                <CardTitle className="text-primary text-xl sm:text-2xl">
                    Sign in or create an account
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                    Use your email to continue
                </CardDescription>
            </CardHeader>

            {!!error && (
                <div className="bg-destructive/15 p-2.5 sm:p-3 rounded-md flex items-center gap-x-2 text-xs sm:text-sm text-destructive mb-4 sm:mb-6">
                    <TriangleAlertIcon className="size-3 sm:size-4" />
                    {error}
                </div>
            )}

            <CardContent className="space-y-4 sm:space-y-5 px-0 pb-0">
                <form
                    className="space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (!captchaToken) {
                            setError("Please complete the reCAPTCHA verification");
                            return;
                        }
                        setPending(true);
                        const formData = new FormData(event.currentTarget);
                        formData.append("captchaToken", captchaToken);

                        signIn("password-code", formData)
                            .then(() => {
                                // Set email for verification step
                                setStep({ email: formData.get("email") as string });
                            })
                            .catch((error) => {
                                console.error(error);
                                toast.error("Could not sign in, please check your credentials");
                                recaptchaRef.current?.reset();
                                setCaptchaToken(null);
                            })
                            .finally(() => {
                                setPending(false);
                            });
                    }}
                >
                    <div className="space-y-2">
                        <label htmlFor="email">Email</label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            disabled={pending}
                            required
                            className="h-10 sm:h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password">Password</label>
                            <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto text-xs sm:text-sm"
                                onClick={() => setStep("forgot")}
                            >
                                Forgot password?
                            </Button>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            disabled={pending}
                            required
                            className="h-10 sm:h-11"
                        />
                    </div>
                    <div className="flex justify-center my-3 sm:my-4">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={onCaptchaChange}
                        />
                    </div>
                    <input name="flow" value="signIn" type="hidden" />
                    <Button
                        type="submit"
                        className="w-full h-10 sm:h-11"
                        disabled={pending || !captchaToken}
                    >
                        {pending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </form>

                <Separator />

                <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <span
                            className="text-primary hover:underline cursor-pointer"
                            onClick={() => setState("signUp")}
                        >
                            Sign up
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};