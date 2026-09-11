export default function Prose({ html }) {
  return (
    // dangerouslySetInnerHTML is safe here: `html` is markdown authored by
    // the site owner and compiled at build time by content.js — never user
    // input at runtime.
    <div
      /* Figures deliberately escape the 62ch measure that paragraphs keep:
         they are dense 16:9 deck pages and need the full reading column to
         stay legible before anyone clicks to enlarge them. */
      className="[&_p]:mb-6 [&_p]:max-w-[62ch] [&_li]:max-w-[62ch] [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-5 [&_figure]:my-12 [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-2xl [&_strong]:font-semibold [&_a]:underline [&_a]:underline-offset-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
