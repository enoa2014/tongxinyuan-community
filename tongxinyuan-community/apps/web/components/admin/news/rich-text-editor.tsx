import React from "react"
import { Editor, EditorContent, useEditor } from "@tiptap/react"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Image as ImageIcon,
    Italic,
    LayoutTemplate,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo,
} from "lucide-react"

import { pb } from "@/lib/pocketbase"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

type PocketBaseUploadError = {
    data?: {
        message?: string
    }
    message?: string
}

function getUploadErrorMessage(error: unknown) {
    if (typeof error === "object" && error !== null) {
        const uploadError = error as PocketBaseUploadError
        return uploadError.data?.message || uploadError.message || "未知错误"
    }

    return "未知错误"
}

const templates: Record<"activity" | "notice" | "story", string> = {
    activity: `
        <h2>活动招募：[活动名称]</h2>
        <p><strong>时间：</strong>2026年X月X日</p>
        <p><strong>地点：</strong>[活动地点]</p>
        <p><strong>招募对象：</strong>[描述]</p>
        <h3>活动介绍</h3>
        <p>请在这里补充活动详细内容。</p>
        <h3>报名方式</h3>
        <p>请在这里补充报名入口或负责人联系方式。</p>
    `,
    notice: `
        <h2>官方公告：[标题]</h2>
        <p><strong>发布日期：</strong>${new Date().toLocaleDateString()}</p>
        <hr>
        <p>各位志愿者、家属：</p>
        <p>请在这里填写公告正文。</p>
        <br>
        <p style="text-align: right">同心苑社区支持中心</p>
    `,
    story: `
        <p><em>“请在这里写下一句最打动人的引言。”</em></p>
        <p><br></p>
        <p>请在这里撰写故事正文。</p>
        <p><br></p>
        <blockquote>同心苑，让陪伴不再孤单。</blockquote>
    `,
}

function MenuBar({ editor }: { editor: Editor | null }) {
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)

        if (url === null) {
            return
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    const insertTemplate = (type: keyof typeof templates) => {
        editor.chain().focus().insertContent(templates[type]).run()
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) {
            return
        }

        try {
            const formData = new FormData()
            formData.append("file", file)

            const record = await pb.collection("media").create(formData)
            const url = pb.files.getURL(record, record.file)
            editor.chain().focus().setImage({ src: url }).run()
        } catch (error: unknown) {
            console.error("Image upload failed:", error)
            alert(`图片上传失败: ${getUploadErrorMessage(error)}`)
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    return (
        <div className="sticky top-0 z-10 flex flex-wrap gap-1 border-b bg-slate-50 p-2">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo className="h-4 w-4" />
            </Button>

            <div className="mx-1 h-6 w-px self-center bg-slate-200" />

            <Button
                variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2 className="h-4 w-4" />
            </Button>

            <div className="mx-1 h-6 w-px self-center bg-slate-200" />

            <Button
                variant={editor.isActive("bold") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive("italic") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive("underline") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive("strike") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <div className="mx-1 h-6 w-px self-center bg-slate-200" />

            <Button
                variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
                <AlignRight className="h-4 w-4" />
            </Button>

            <div className="mx-1 h-6 w-px self-center bg-slate-200" />

            <Button
                variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive("link") ? "secondary" : "ghost"}
                size="sm"
                onClick={setLink}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} title="上传图片">
                <ImageIcon className="h-4 w-4" />
            </Button>

            <div className="flex-1" />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 border-brand-green/20 text-brand-green hover:bg-brand-green/10">
                        <LayoutTemplate className="h-4 w-4" />
                        使用模板
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => insertTemplate("activity")}>活动招募</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertTemplate("notice")}>官方公告</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertTemplate("story")}>图文故事</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "cursor-pointer text-brand-green hover:underline",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "my-4 max-w-full rounded-lg shadow-md",
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || "Write something...",
            }),
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "prose prose-slate min-h-[300px] max-w-none p-4 focus:outline-none",
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            onChange(currentEditor.getHTML())
        },
    })

    if (editor && value !== editor.getHTML() && value === "") {
        editor.commands.setContent(value)
    }

    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-brand-green/20">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
