import { useState, useRef } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string, file?: File) => Promise<void>;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !fileInputRef.current?.files?.[0]) return;

    setIsLoading(true);
    try {
      await onSendMessage(content, fileInputRef.current?.files?.[0]);
      setContent('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);

      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={() => {
            /* 필요한 경우 파일 선택 핸들러 추가 */
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-circle btn-ghost"
          disabled={isLoading}
        >
          📎
        </button>
        <input
          type="text"
          ref={messageInputRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 input input-bordered bg-white"
          disabled={isLoading}
          autoFocus
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? '전송 중...' : '전송'}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
