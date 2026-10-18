import { Children, Fragment, isValidElement, type ReactNode } from "react";

/**
 * Splits plain text into words that rise one after another when revealed (data-reveal="words"
 * on an ancestor, see globals.css). Fragments are unwrapped; other elements, such as a
 * highlighted span or a line break, are kept whole.
 */
export function SplitWords({ children }: { children: ReactNode }) {
  let w = 0;
  const parts: ReactNode[] = [];

  const walk = (nodes: ReactNode, path: string) => {
    Children.forEach(nodes, (child, i) => {
      const key = `${path}-${i}`;
      if (typeof child === "string" || typeof child === "number") {
        String(child)
          .split(/\s+/)
          .filter(Boolean)
          .forEach((word, j) => {
            parts.push(
              <span key={`${key}-${j}`} className="word">
                <span style={{ "--w": w++ } as React.CSSProperties}>{word}</span>
              </span>,
              " ",
            );
          });
      } else if (isValidElement<{ children?: ReactNode }>(child)) {
        if (child.type === Fragment) walk(child.props.children, key);
        else if (child.type === "br") parts.push(<br key={key} />);
        else
          parts.push(
            <span key={key} className="word">
              <span style={{ "--w": w++ } as React.CSSProperties}>{child}</span>
            </span>,
            " ",
          );
      }
    });
  };

  walk(children, "w");
  return <>{parts}</>;
}
