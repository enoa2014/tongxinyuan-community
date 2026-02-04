"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { Card } from "@/components/ui/card"

interface QrScannerProps {
    onScanSuccess: (decodedText: string, decodedResult: any) => void
    onScanFailure?: (error: any) => void
    fps?: number
    qrbox?: number
    aspectRatio?: number
    disableFlip?: boolean
}

export function QrScanner({
    onScanSuccess,
    onScanFailure,
    fps = 10,
    qrbox = 250,
    aspectRatio = 1,
    disableFlip = false,
}: QrScannerProps) {
    const scannerRegionId = "html5qr-code-full-region"

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            scannerRegionId,
            {
                fps,
                qrbox,
                aspectRatio,
                disableFlip,
            },
            /* verbose= */ false
        )

        scanner.render(
            (decodedText, decodedResult) => {
                // Clear scanner after success to prevent multiple reads
                scanner.clear().catch(error => {
                    console.error("Failed to clear scanner", error)
                })
                onScanSuccess(decodedText, decodedResult)
            },
            (errorMessage) => {
                if (onScanFailure) {
                    onScanFailure(errorMessage)
                }
            }
        )

        // Cleanup
        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear scanner during cleanup", error)
            })
        }
    }, [onScanSuccess, onScanFailure, fps, qrbox, aspectRatio, disableFlip])

    return (
        <Card className="p-4 bg-slate-100 border-none shadow-inner">
            <div id={scannerRegionId} className="w-full" />
            <p className="text-center text-xs text-slate-500 mt-2">
                请将二维码置于框内
            </p>
        </Card>
    )
}
