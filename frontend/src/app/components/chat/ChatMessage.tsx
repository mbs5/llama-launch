import { Copy } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type ChatMessageProps = {
  message: Message;
  onCopyToSidebar?: (content: string) => void;
};

export default function ChatMessage({ message, onCopyToSidebar }: ChatMessageProps) {
  const isUser = message.role === "user";

  const formatContent = (content: string) => {
    if (isUser) return <p className="text-white/90">{content}</p>;

    // Split content into sections
    const sections = content.split('#').filter(s => s.trim());
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(l => l.trim());
      const formattedLines: JSX.Element[] = [];
      
      lines.forEach((line, idx) => {
        if (line.startsWith('##')) {
          // Subheading (Feature names)
          formattedLines.push(
            <h4 key={`h4-${idx}`} className="text-2xl font-light text-white/90 mt-8 mb-4">
              {line.replace('##', '').trim()}
            </h4>
          );
        } else if (line.startsWith('-')) {
          // Bullet points
          const indent = line.match(/^\s*/)?.[0].length || 0;
          formattedLines.push(
            <p key={`bullet-${idx}`} 
               className={`text-white/80 font-light leading-relaxed ${indent > 2 ? 'ml-8' : 'ml-4'}`}>
              • {line.replace('-', '').trim()}
            </p>
          );
        } else if (/^\d+\./.test(line)) {
          // Numbered points
          formattedLines.push(
            <p key={`num-${idx}`} className="text-white/80 font-light leading-relaxed ml-4">
              {line.trim()}
            </p>
          );
        } else if (line.trim()) {
          // Main heading or regular text
          if (idx === 0) {
            formattedLines.push(
              <h3 key={`h3-${idx}`} className="text-3xl font-light text-white/90 mb-6">
                {line.trim()}
              </h3>
            );
          } else {
            formattedLines.push(
              <p key={`text-${idx}`} className="text-white/80 font-light leading-relaxed mb-4">
                {line.trim()}
              </p>
            );
          }
        }
      });

      return (
        <div key={index} className="mb-12">
          {formattedLines}
        </div>
      );
    });
  };

  return (
    <div className={`group relative w-full transition-colors duration-200 ${isUser ? "bg-transparent" : "bg-white/[0.02]"}`}>
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="flex items-start gap-6">
          <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            isUser ? "bg-white/[0.05] text-white/60" : "bg-white/[0.05] text-white/60"
          } font-light text-sm`}>
            {isUser ? "You" : "AI"}
          </div>
          
          <div className="flex-1">
            <div className="text-base leading-relaxed tracking-wide">
              {formatContent(message.content)}
            </div>
          </div>
        </div>
      </div>

      {!isUser && onCopyToSidebar && (
        <button
          onClick={() => onCopyToSidebar(message.content)}
          className="absolute right-4 top-4 p-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20"
          title="Copy to PRD"
        >
          <Copy className="w-4 h-4 text-white/70" />
        </button>
      )}
    </div>
  );
} 