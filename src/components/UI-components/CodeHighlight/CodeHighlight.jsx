import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styled from "styled-components";
import { theme } from "../../../theme/theme";

export function CodeHighlight({ code, language = "javascript" }) {
  return (
    <CodeWrapper>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: 0,
          background: "transparent",
          fontSize: theme.typography.sizes.xs,
          fontFamily: '"SF Mono", "Monaco", "Consolas", "Courier New", monospace',
          lineHeight: theme.typography.lineHeights.relaxed,
        }}
        codeTagProps={{
          style: {
            fontFamily: "inherit",
            fontSize: "inherit",
            background: "transparent",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </CodeWrapper>
  );
}

const CodeWrapper = styled.div`
  position: relative;

  pre {
    margin: 0 !important;
    padding: ${theme.spacing.xs} !important;
    background: ${theme.colors.bg.primary} !important;
    border-radius: 0 !important;
    overflow-x: auto !important;
    max-height: 200px;
    overflow-y: auto;
    font-size: ${theme.typography.sizes.xs} !important;
  }

  code {
    font-family: "SF Mono", "Monaco", "Consolas", "Courier New", monospace !important;
    background: transparent !important;
  }
`;
