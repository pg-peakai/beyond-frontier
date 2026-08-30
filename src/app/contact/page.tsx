import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { Label, Section } from "@/components/ui";
import { BRAND, CONTACT } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us the task, the hours, and the failure mode you're trying to fix. We'll come back with a capture plan.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow={CONTACT.eyebrow}
        headline={CONTACT.headline}
        intro={[CONTACT.body]}
      />

      <Section tone="paper">
        <div className="grid gap-14 md:grid-cols-[1fr_1.7fr] md:gap-20">
          <div className="md:sticky md:top-28 md:self-start">
            <Label>Direct</Label>
            <a
              href={`mailto:${BRAND.email}`}
              className="mt-6 block text-xl tracking-[-0.02em] underline-offset-4 hover:underline"
            >
              {BRAND.email}
            </a>
            <p className="mt-8 max-w-[24ch] leading-relaxed text-ink/55">
              {BRAND.location}
            </p>
          </div>

          <ContactForm defaultIntent={intent} />
        </div>
      </Section>
    </>
  );
}
