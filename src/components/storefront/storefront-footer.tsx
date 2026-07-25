import Link from "next/link";

const footerGroups = [
  {
    title: "Client care",
    links: ["Contact", "Delivery & returns", "Book an appointment"],
  },
  {
    title: "The maison",
    links: ["Our story", "Craftsmanship", "Responsibility"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Accessibility"],
  },
];

export function StorefrontFooter() {
  return (
    <footer className="mt-auto bg-cinematic text-cinematic-foreground">
      <div className="luxury-container grid gap-14 py-16 md:grid-cols-[1.2fr_2fr] md:py-20">
        <div>
          <Link
            href="/"
            className="font-heading text-2xl uppercase tracking-[0.3em]"
          >
            Evol
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-6 text-cinematic-foreground/60">
            Fine jewellery shaped by light, material and moments that endure.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-cinematic-foreground/45">
                {group.title}
              </p>
              <ul className="mt-5 space-y-3 text-sm text-cinematic-foreground/75">
                {group.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-cinematic-foreground/10 px-5 py-5 text-center text-[0.58rem] uppercase tracking-[0.18em] text-cinematic-foreground/40">
        © 2026 Evol. All rights reserved.
      </div>
    </footer>
  );
}
