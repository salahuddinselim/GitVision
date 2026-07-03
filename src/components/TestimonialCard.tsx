interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  content: string;
}

export default function TestimonialCard({ name, role, avatar, content }: TestimonialCardProps) {
  return (
    <div className="rounded-xl border border-gray-700/50 bg-surface/50 backdrop-blur-sm p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-100">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed italic">“{content}”</p>
    </div>
  );
}