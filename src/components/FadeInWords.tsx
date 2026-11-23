/**
 * Streamed words, each fading in as it arrives. Keys are word positions, so words
 * already on screen keep their element and don't animate again.
 */
export function FadeInWords({ words }: { words: string[] }) {
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="word-in">
          {i > 0 ? " " : ""}
          {word}
        </span>
      ))}
    </>
  );
}
