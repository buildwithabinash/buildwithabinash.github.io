/**
 * Emits a schema.org block. The JSON is built from our own data at build time,
 * so the only escaping needed is for "<" which would otherwise close the script.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
