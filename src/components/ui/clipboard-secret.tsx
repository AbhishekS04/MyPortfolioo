"use client";

import { useEffect } from "react";

export const ClipboardSecret = () => {
    useEffect(() => {
        const handleCopy = (e: ClipboardEvent) => {
            const selection = window.getSelection();
            if (!selection) return;

            // Get text and normalize (remove line breaks, double spaces)
            const selectedText = selection.toString().replace(/\s+/g, ' ').trim().toLowerCase();

            console.log("📋 Clipboard Detect:", selectedText);

            // TRIGGERS
            // Note: identity-card.tsx has "Product Engineer."
            const triggers = ["product engineer", "abhishek"];

            const isMatch = triggers.some(trigger => selectedText.includes(trigger));

            if (isMatch) {
                e.preventDefault();
                if (e.clipboardData) {
                    const secret = "If you found this, we should talk.";
                    e.clipboardData.setData("text/plain", secret);
                    // Also try the navigator API as backup (though preventDefault usually handles it)
                    // navigator.clipboard.writeText(secret).catch(() => {}); 
                    console.log("🔒 Secret Injected");
                }
            }
        };

        document.addEventListener("copy", handleCopy);
        return () => document.removeEventListener("copy", handleCopy);
    }, []);

    return null; // Component is logic only, no visuals
};
