import { DottedMap } from "@/components/ui/dotted-map"

export function CraftCard() {
    return (
        <div className="relative w-full h-full min-h-[180px] rounded-[32px] overflow-hidden group border border-white/5 bg-[#111]">
            <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-opacity duration-100">
                <DottedMap
                    className="text-white/40 w-full max-w-[6000px]"
                    markers={[{ lat: 20.6, lng: 78.96, size: 0.8 }]}
                    markerColor="#F97316"
                    dotRadius={0.2}
                />
            </div>


        </div>
    )
}
