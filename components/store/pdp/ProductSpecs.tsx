"use client";

interface ProductSpec {
  label: string;
  value: string;
}

interface ProductSpecsProps {
  specs: ProductSpec[];
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  if (specs.length === 0) return null;

  return (
    <div className="space-y-4 py-4 border-t border-b border-evol-grey">
      <h3 className="font-sans text-sm tracking-wider text-gray-500 uppercase">
        Product Specifications
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specs.map((spec, idx) => (
          <div key={idx} className="flex justify-between items-start">
            <span className="font-body text-sm text-gray-600">
              {spec.label}
            </span>
            <span className="font-body text-sm text-gray-900 text-right ml-4">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
