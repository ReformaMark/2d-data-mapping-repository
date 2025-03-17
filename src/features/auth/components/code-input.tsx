"use client"
import { Input } from "@/components/ui/input"
import { useRef } from "react"

export function CodeInput() {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <Input
            ref={inputRef}
            name="code"
            type="text"
            pattern="[0-9]{8}"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="12345678"
            className="mb-4 text-center tracking 4"
            required
            onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8)
            }}
        />
    )
}