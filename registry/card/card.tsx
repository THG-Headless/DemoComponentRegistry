import { Button } from "../button/button.tsx";

interface CardProps {
  title?: string;
  content: string;
  buttonText?: string;
}

export function Card({
  title = "Card Title",
  content,
  buttonText = "Click Me",
}: CardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-gray-600">{content}</p>
      </div>
      <div className="mt-4">
        <HelloWorld title={buttonText} />
      </div>
    </div>
  );
}
