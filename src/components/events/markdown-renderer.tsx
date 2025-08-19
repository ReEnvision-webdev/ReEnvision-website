
"use client"

import { useMemo } from "react"

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderedContent = useMemo(() => {
    if (!content) return ""

    // Simple markdown-to-HTML conversion
    let html = content
      // Headers
      .replace(/^### (.*$)/gim, "<h3 class='text-xl font-semibold mt-6 mb-3'>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2 class='text-2xl font-semibold mt-8 mb-4'>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1 class='text-3xl font-bold mt-8 mb-4'>$1</h1>")
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
      // Links
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        "<a href='$2' class='text-primary hover:underline' target='_blank' rel='noopener noreferrer'>$1</a>",
      )
      // Line breaks
      .replace(/\n\n/g, "</p><p class='mb-4'>")
      .replace(/\n/g, "<br>")
      // Lists
      .replace(/^\* (.*$)/gim, "<li class='ml-4 mb-1'>• $1</li>")
      .replace(/^- (.*$)/gim, "<li class='ml-4 mb-1'>• $1</li>")
      // Code blocks
      .replace(/```([\s\S]*?)```/g, "<pre class='bg-muted p-4 rounded-md overflow-x-auto my-4'><code>$1</code></pre>")
      // Inline code
      .replace(/`([^`]+)`/g, "<code class='bg-muted px-1 py-0.5 rounded text-sm'>$1</code>")

    // Wrap in paragraphs if not already wrapped
    if (!html.startsWith("<")) {
      html = `<p class='mb-4'>${html}</p>`
    }

    return html
  }, [content])

  if (!content) {
    return <p className="text-muted-foreground italic">No description available.</p>
  }

  return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
}
