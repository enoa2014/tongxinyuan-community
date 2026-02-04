import { z } from "zod"

export const residentFormSchema = z.object({
    name: z.string().min(2, {
        message: "姓名至少需要2个字符。",
    }),
    id: z.string().min(1, {
        message: "ID是必填项。",
    }).optional(), // For updates
    phone: z.string().min(11, {
        message: "手机号格式不正确。",
    }).max(11, {
        message: "手机号格式不正确。",
    }).optional().or(z.literal("")),
    address: z.string().optional(),
    status: z.enum(["active", "inactive", "deceased", "unknown"]).default("active"),
    avatar: z.any().optional(),
    tags: z.string().optional(), // Comma separated string for simplicity in form
})

export type ResidentFormValues = z.infer<typeof residentFormSchema>
