
import { Button } from "@/components/ui/button"
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, List, Quote, Heading1, Heading2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface MarkdownEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
    const insertText = (before: string, after: string = "") => {
        const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = value.substring(start, end)

        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
        onChange(newText)

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + before.length, end + before.length)
        }, 0)
    }

    return (
        <div className="border rounded-md">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-slate-50">
                <Button type="button" variant="ghost" size="sm" onClick={() => insertText("# ", "")} title="Heading 1">
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => insertText("## ", "")} title="Heading 2">
                    <Heading2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <Button type="button" variant="ghost" size="sm" onClick={() => insertText("**", "**")} title="Bold">
                    <Bold className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => insertText("*", "*")} title="Italic">
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <Button type="button" variant="ghost" size="sm" onClick={() => insertText("- ", "")} title="List">
                    <List className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => insertText("> ", "")} title="Quote">
                    <Quote className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <Button type="button" variant="ghost" size="sm" onClick={() => insertText("[", "](url)")} title="Link">
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => insertText("![alt](", ")")} title="Image">
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </div>
            <Textarea
                id="markdown-editor"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-h-[300px] border-0 rounded-t-none focus-visible:ring-0 font-mono text-sm"
            />
        </div>
    )
}
