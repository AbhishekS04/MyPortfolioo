"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

export function ReadmeViewer({ content }: { content: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const links = containerRef.current.querySelectorAll('a');
            links.forEach(link => {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            });
        }
    }, [content]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="border border-white/10 rounded-lg overflow-hidden bg-[#0d1117]"
        >
            {/* File Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/10">
                <div className="flex items-center gap-2 text-sm font-mono text-white/70">
                    <span className="font-semibold text-white/90">AbhishekS04</span>
                    <span className="text-white/40">/</span>
                    <span>README.md</span>
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                    <PenLine className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="p-8">
                <article
                    ref={containerRef}
                    className="
              prose prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-code:bg-white/10 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-white/90
              prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-white/10 prose-pre:p-4 prose-pre:rounded-xl
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:text-white/70
              prose-hr:border-white/10 prose-hr:my-8
              
              /* Image & Badge styling fixes */
              prose-img:m-0 prose-img:inline-block prose-img:rounded-sm
              
              /* Support for align='center' in markdown */
              [&_[align=center]]:text-center 
              [&_[align=center]_img]:mx-auto
              
              /* Target paragraphs containing images to be flex row (Badges) */
              [&_p:has(img)]:flex 
              [&_p:has(img)]:flex-wrap 
              [&_p:has(img)]:justify-center
              [&_p:has(img)]:gap-3 
              [&_p:has(img)]:items-center
              
              /* Ensure links wrapping images play nice */
              [&_a:has(img)]:inline-flex 
              [&_a:has(img)]:transition-transform 
              [&_a:has(img)]:duration-200 
              [&_a:has(img)]:hover:scale-105

              /* Hide GitHub's default anchor links on headers */
              [&_.anchor]:hidden
            "
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </motion.div>
    );
}
