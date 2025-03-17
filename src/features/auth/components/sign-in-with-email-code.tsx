"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthActions } from "@convex-dev/auth/react"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface SignInWithEmailCodeProps {
    handleCodeSent: (email: string) => void
    provider?: string
    children?: React.ReactNode
}

export function SignInWithEmailCode({
    handleCodeSent,
    provider,
    children,
}: SignInWithEmailCodeProps) {
    const { signIn } = useAuthActions()
    const [pending, setPending] = useState(false)

    return (
        <form
            className="space-y-4"
            onSubmit={(event) => {
                event.preventDefault()
                setPending(true)
                const formData = new FormData(event.currentTarget)
                signIn(provider ?? "resend-otp", formData)
                    .then(() => handleCodeSent(formData.get("email") as string))
                    .catch((error) => {
                        console.error(error)
                        toast.error("Could not send reset code")
                    })
                    .finally(() => {
                        setPending(false)
                    })
            }}
        >
            <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                    name="email"
                    id="email"
                    type="email"
                    className="h-10 sm:h-11"
                    autoComplete="email"
                    required
                    disabled={pending}
                />
            </div>
            {children}
            <Button type="submit" className="w-full" disabled={pending}>
                {pending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending code...
                    </>
                ) : (
                    "Send reset code"
                )}
            </Button>
        </form>
    )
}