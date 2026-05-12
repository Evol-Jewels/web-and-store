"use client";

interface ProductTagsProps {
  tags?: string[];
}

export function ProductTags({ tags }: ProductTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8 md:py-12">
      <div className="space-y-4">
        <h3 className="font-serif text-lg md:text-xl text-gray-900">
          Product Attributes
        </h3>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {tags.map((tag, index) => (
            <div
              key={tag}
              className="group relative"
            >
              <div
                className={`px-3 md:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border border-evol-grey bg-white text-gray-900 hover:border-evolRed hover:text-evolRed hover:bg-red-50 cursor-default`}
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                {tag}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
