import { useEffect, useState } from 'react';

interface Heading {
  depth: number;
  text: string;
  slug: string;
}

export default function TocMinimal({
  headings,
}: {
  headings: Heading[];
}) {
  const [activeSlug, setActiveSlug] = useState('');

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      if (!elements.length) return;

      if (elements[0].getBoundingClientRect().top > 116) {
        setActiveSlug('');
        return;
      }

      let current = elements[0];

      for (const el of elements) {
        if (el.getBoundingClientRect().top <= 116) {
          current = el;
        } else {
          break;
        }
      }

      setActiveSlug(current.id);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [headings]);

  return (
    <div className="group relative">
      <div className="flex flex-col gap-3 items-center py-4 transition-opacity duration-200 group-hover:opacity-0">
        {headings.map((h) => (
            <div key={h.slug} className={`w-4 h-0.5 rounded-full transition-colors duration-200 ${activeSlug === h.slug
                ? 'bg-(--accent) dark:bg-(--fg-strong)'
                : 'bg-(--border-subtle)'}`}
            />
        ))}
      </div>
      <div
        className="
          absolute
          right-full
          w-72
          top-1/2
          -translate-y-1/2
          rounded-lg
          border border-(--border)
          bg-(--bg)
          opacity-0
          translate-x-2
          pointer-events-none
          transition-all
          duration-200
          group-hover:opacity-100
          group-hover:translate-x-0
          group-hover:pointer-events-auto
          group-focus-within:opacity-100 
          group-focus-within:translate-x-0 
          group-focus-within:pointer-events-auto
        "
      >
        <div className="px-4 py-2 text-[13px] font-semibold text-(--fg-muted)">
          On this page
        </div>
        <nav className="max-h-[70vh] overflow-y-auto px-2 pb-2 space-y-1">
          {headings.map((h) => (
            <a
              key={h.slug}
              href={`#${h.slug}`}
              className={`
                block
                rounded-lg
                py-2.5
                text-[13px]
                font-medium
                ${h.depth === 3
                    ? 'pl-8 pr-3'
                    : 'pl-4 pr-3'
                }

                ${activeSlug === h.slug
                    ? 'bg-(--bg-subtle) text-(--fg-strong)'
                    : 'text-(--fg-muted) hover:bg-(--bg-subtle)'
                }
              `}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}