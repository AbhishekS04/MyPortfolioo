import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const { rating } = await request.json();

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
        }

        const { error } = await supabase
            .from("ratings")
            .insert({ rating });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error submitting rating:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from("ratings")
            .select("rating");

        if (error) throw error;

        // Calculate stats
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.forEach((r: { rating: number }) => {
            if (r.rating >= 1 && r.rating <= 5) {
                // @ts-ignore
                counts[r.rating]++;
            }
        });

        const total = data.length;
        const average = total > 0
            ? (data.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1)
            : "0.0";

        return NextResponse.json({ counts, total, average });
    } catch (error) {
        console.error("Error fetching ratings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
