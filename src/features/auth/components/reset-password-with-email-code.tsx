"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthActions } from "@convex-dev/auth/react"
import { useState } from "react"
import { CodeInput } from "./code-input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { SignInWithEmailCode } from "./sign-in-with-email-code"
import { toast } from "sonner"

interface ResetPasswordProps {
    handleCancel: () => void
    provider: string
}

export function ResetPasswordWithEmailCode({
    handleCancel,
    provider,
}: ResetPasswordProps) {
    const { signIn } = useAuthActions()
    const [step, setStep] = useState<"forgot" | { email: string }>("forgot")
    const [pending, setPending] = useState(false)

    return (
        <Card className="w-full max-w-[450px] mx-auto p-8">
            {step === "forgot" ? (
                <>
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl font-semibold">
                            Send password reset code
                        </CardTitle>
                    </CardHeader>
                    <SignInWithEmailCode
                        handleCodeSent={(email) => setStep({ email })}
                        provider={provider}
                    >
                        <input name="flow" type="hidden" value="reset" />
                    </SignInWithEmailCode>
                    <Button
                        type="button"
                        variant="link"
                        onClick={handleCancel}
                        className="mt-2"
                    >
                        Back to Sign In
                    </Button>
                </>
            ) : (
                <>
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl font-semibold mb-4">
                            Check your email
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Enter the 8-digit code we sent to {step.email} and choose a new
                            password.
                        </p>
                    </CardHeader>
                    <form
                        className="space-y-4"
                        onSubmit={(event) => {
                            event.preventDefault()
                            setPending(true)
                            const formData = new FormData(event.currentTarget)
                            signIn(provider, formData)
                                .catch((error) => {
                                    console.error(error)
                                    toast.error(
                                        "Code could not be verified or new password is too short"
                                    )
                                })
                                .finally(() => {
                                    setPending(false)
                                })
                        }}
                    >
                        <div className="space-y-2">
                            <label htmlFor="code">Verification Code</label>
                            <CodeInput />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="newPassword">New Password</label>
                            <Input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                className="h-10 sm:h-11"
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <input type="hidden" name="flow" value="reset-verification" />
                        <input type="hidden" name="email" value={step.email} />
                        <Button type="submit" className="w-full" disabled={pending}>
                            {pending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="link"
                            className="w-full"
                            onClick={() => setStep("forgot")}
                        >
                            Back
                        </Button>
                    </form>
                </>
            )}
        </Card>
    )
}