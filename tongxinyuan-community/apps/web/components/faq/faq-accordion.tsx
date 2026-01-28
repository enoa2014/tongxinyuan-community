
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQs } from "@/lib/data/faqs"

interface FaqAccordionProps {
    category?: 'family' | 'volunteer' | 'donor'
}

export function FaqAccordion({ category }: FaqAccordionProps) {
    const filteredFaqs = category
        ? FAQs.filter(faq => faq.category === category)
        : FAQs;

    return (
        <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-slate-800 hover:text-brand-green">
                        {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed">
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
