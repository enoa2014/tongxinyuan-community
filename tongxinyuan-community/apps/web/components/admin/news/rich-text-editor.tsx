
import React from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import { pb } from "@/lib/pocketbase"
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from "@/components/ui/button"
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Heading1, Heading2,
    Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
    Undo, Redo, LayoutTemplate
} from "lucide-react"
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

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const insertTemplate = (type: 'activity' | 'notice' | 'story') => {
        let content = ''
        switch (type) {
            case 'activity':
                content = `
                    <h2>📅 活动招募：[活动名称]</h2>
                    <p><strong>时间：</strong>2026年X月X日</p>
                    <p><strong>地点：</strong>[活动地点]</p>
                    <p><strong>招募对象：</strong>[描述]</p>
                    <h3>✨ 活动介绍</h3>
                    <p>在这里输入活动详细介绍...</p>
                    <h3>📝 报名方式</h3>
                    <p>点击下方链接报名或联系负责人。</p>
                `
                break
            case 'notice':
                content = `
                    <h2>📢 官方公告：[标题]</h2>
                    <p><strong>发布日期：</strong>${new Date().toLocaleDateString()}</p>
                    <hr>
                    <p>各位志愿者/家人们：</p>
                    <p>在这里输入公告正文...</p>
                    <br>
                    <p style="text-align: right">同心源社区支持中心</p>
                `
                break
            case 'story':
                content = `
                    <p><em>“在这里输入一句感人的引言...”</em></p>
                    <p><br></p>
                    <p>在这里讲述故事...</p>
                    <p><br></p>
                    <blockquote>同心源，让爱不再孤单。</blockquote>
                `
                break
        }

        // Insert content at cursor
        editor.chain().focus().insertContent(content).run()
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append('file', file)
            // 'media' collection must be created in PocketBase
            const record = await pb.collection('media').create(formData)
            const url = pb.files.getURL(record, record.file)
            editor.chain().focus().setImage({ src: url }).run()
        } catch (error: any) {
            console.error('Image upload failed (Full details):', JSON.stringify(error.data || error, null, 2))
            alert(`图片上传失败: ${error?.data?.message || error.message || '未知错误'}`)
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const triggerImageUpload = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="border-b bg-slate-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            {/* History */}
            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-slate-200 mx-1 self-center" />

            {/* Typography */}
            <Button
                variant={editor.isActive('heading', { level: 1 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('heading', { level: 2 }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-slate-200 mx-1 self-center" />

            {/* Basic Formatting */}
            <Button
                variant={editor.isActive('bold') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('italic') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('underline') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('strike') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-slate-200 mx-1 self-center" />

            {/* Alignment */}
            <Button
                variant={editor.isActive({ textAlign: 'left' }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive({ textAlign: 'center' }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive({ textAlign: 'right' }) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
                <AlignRight className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-slate-200 mx-1 self-center" />

            {/* Lists & Extras */}
            <Button
                variant={editor.isActive('bulletList') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('orderedList') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('blockquote') ? "secondary" : "ghost"}
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                variant={editor.isActive('link') ? "secondary" : "ghost"}
                size="sm"
                onClick={setLink}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={triggerImageUpload}
                title="上传图片"
            >
                <ImageIcon className="h-4 w-4" />
            </Button>

            <div className="flex-1" />

            {/* Templates */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 text-brand-green border-brand-green/20 hover:bg-brand-green/10">
                        <LayoutTemplate className="h-4 w-4" />
                        使用模板
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => insertTemplate('activity')}>
                        📅 活动招募
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertTemplate('notice')}>
                        📢 官方公告
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertTemplate('story')}>
                        ✨ 图文故事
                    </DropdownMenuItem>
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
                    class: 'text-brand-green hover:underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg shadow-md max-w-full my-4',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Write something...',
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value, // Initial content. Note: Tiptap doesn't fully controlled-component sync well if you update this prop often on typing.
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Handle external updates to value (e.g. initial load or reset)
    // Careful not to create loops. Check content equality roughly? 
    // For simplicity in this Admin UI, we assume value prop only changes on mount or reset.
    if (editor && value !== editor.getHTML() && value === '') {
        editor.commands.setContent(value)
    }

    return (
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-green/20 transition-shadow">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
