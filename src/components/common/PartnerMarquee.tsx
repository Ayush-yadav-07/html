import React from 'react';
import { 
  Building2, 
  Utensils, 
  Camera, 
  Music, 
  Flower2, 
  Sparkles, 
  Truck, 
  Palette, 
  CheckCircle2
} from 'lucide-react';
import { useEventContext } from '../../context/EventContext';
import { VendorCategory } from '../../types';

interface PartnerMarqueeProps {
  onSelectVendorCategory?: (category: string) => void;
}

const categoryIconMap: Record<VendorCategory, React.ElementType> = {
  'Catering': Utensils,
  'Photography & Video': Camera,
  'Venue': Building2,
  'Floral & Decor': Flower2,
  'Sound & DJ': Music,
  'Makeup & Styling': Sparkles,
  'Transport & Logistics': Truck,
  'Invitations & Gifts': Palette,
  'Other': Building2,
};

export const PartnerMarquee: React.FC<PartnerMarqueeProps> = () => {
  const { vendors } = useEventContext();

  const displayItems = vendors.length > 0 
    ? vendors 
    : [
        { id: 'v-1', name: 'Royal Flavours Gourmet Catering', category: 'Catering' as VendorCategory, status: 'Confirmed' },
        { id: 'v-2', name: 'Vivah Mandap & Floral Elegance', category: 'Floral & Decor' as VendorCategory, status: 'Confirmed' },
        { id: 'v-3', name: 'DreamLens Studio & Films', category: 'Photography & Video' as VendorCategory, status: 'Confirmed' },
        { id: 'v-4', name: 'DJ Shaan & Acoustics', category: 'Sound & DJ' as VendorCategory, status: 'Confirmed' },
        { id: 'v-5', name: 'ITC Grand Chola Logistics', category: 'Venue' as VendorCategory, status: 'Confirmed' },
        { id: 'v-6', name: 'The Leela Palace Hospitality', category: 'Venue' as VendorCategory, status: 'Confirmed' },
      ];

  const loopedItems = [...displayItems, ...displayItems];

  return (
    <div className="w-full py-2 overflow-hidden">
      <div className="flex items-center justify-between mb-3 px-1 text-xs text-[#483329]/70 font-medium">
        <span className="uppercase tracking-wider text-[11px] font-bold text-[#B96E42]">
          Partnered Hospitality & Artisan Event Suppliers
        </span>
        <span className="hidden sm:inline text-[11px] text-[#A6A77A] font-semibold">
          {displayItems.length} verified agencies in active roster
        </span>
      </div>

      <div className="relative w-full overflow-hidden py-1">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {loopedItems.map((vendor, index) => {
            const Icon = categoryIconMap[vendor.category as VendorCategory] || Building2;
            const isConfirmed = vendor.status === 'Confirmed';

            return (
              <div
                key={`${vendor.id}-${index}`}
                className="shrink-0 flex items-center gap-2.5 px-4 py-2 bg-[#FCF8F1] border border-[#E6D5C1] rounded-2xl shadow-2xs hover:border-[#D98261] hover:shadow-xs transition-all select-none group"
              >
                <div className="w-7 h-7 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] flex items-center justify-center text-[#B96E42] shrink-0 group-hover:bg-[#D98261] group-hover:text-white group-hover:border-[#D98261] transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-xs font-bold text-[#29231F]">
                    {vendor.name}
                  </span>
                  <span className="text-[11px] text-[#483329]/60 font-medium">
                    · {vendor.category}
                  </span>
                  {isConfirmed && (
                    <span title="Confirmed Supplier" className="inline-flex">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A6A77A] shrink-0" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
