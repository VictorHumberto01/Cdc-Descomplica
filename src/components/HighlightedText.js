"use client";

export default function HighlightedText({ text = "", searchQuery = "" }) {
  if (!searchQuery) return text;

  const parts = [];
  const safeText = text || "";
  const lowerText = safeText.toLowerCase();
  const lowerSearch = searchQuery.toLowerCase();
  let lastIndex = 0;

  while (true) {
    const index = lowerText.indexOf(lowerSearch, lastIndex);
    if (index === -1) {
      // Add remaining text and break
      parts.push({
        text: text.slice(lastIndex),
        highlight: false
      });
      break;
    }

    // Add non-matching text
    if (index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, index),
        highlight: false
      });
    }

    // Add matching text
    parts.push({
      text: text.slice(index, index + searchQuery.length),
      highlight: true
    });

    lastIndex = index + searchQuery.length;
  }

  return (
    <>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            className="bg-amber-200 px-0.5 rounded"
          >
            {part.text}
          </mark>
        ) : (
          part.text
        )
      )}
    </>
  );
}
