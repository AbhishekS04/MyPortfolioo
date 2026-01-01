import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Contributor {
    id: string;
    project_id: string;
    name: string;
    role: string;
    avatar_url: string;
    social_url: string;
    display_order: number;
}

export function ContributorsManager({ projectId }: { projectId: string }) {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [newContributor, setNewContributor] = useState({
        name: "",
        role: "",
        avatar_url: "",
        social_url: ""
    });
    const supabase = createClient();

    useEffect(() => {
        if (projectId && projectId !== 'new') {
            fetchContributors();
        }
    }, [projectId]);

    const fetchContributors = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("project_contributors")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error(error);
            alert("Error fetching contributors: " + error.message);
        }

        if (data) setContributors(data);
        setLoading(false);
    };

    const handleAdd = async () => {
        if (!newContributor.name || !newContributor.avatar_url) return alert("Name and Avatar URL are required");

        const { data, error } = await supabase.from("project_contributors").insert([{
            project_id: projectId,
            ...newContributor
        }]).select();

        if (error) {
            alert(error.message);
            return;
        }

        if (data) {
            setContributors([...contributors, data[0]]);
            setNewContributor({ name: "", role: "", avatar_url: "", social_url: "" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this contributor?")) return;

        const { error } = await supabase.from("project_contributors").delete().eq("id", id);
        if (error) {
            alert(error.message);
        } else {
            setContributors(contributors.filter(c => c.id !== id));
        }
    };

    if (projectId === 'new') {
        return (
            <div className="flex items-center justify-center p-12 border border-dashed border-white/10 rounded-xl">
                <p className="text-white/40 text-sm">Please save the project first before adding contributors.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* List */}
            <div className="space-y-3">
                {contributors.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={c.avatar_url} className="object-cover" />
                                <AvatarFallback>{c.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="text-sm font-medium text-white">{c.name}</h4>
                                <div className="flex gap-2 text-xs text-white/40">
                                    <span>{c.role}</span>
                                    {c.social_url && <a href={c.social_url} target="_blank" className="text-blue-400 hover:underline">Link</a>}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {contributors.length === 0 && !loading && (
                    <p className="text-center text-white/20 text-sm py-4">No contributors yet.</p>
                )}
            </div>

            {/* Add Form */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <h3 className="text-sm font-medium text-white/60">Add Contributor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        placeholder="Name"
                        value={newContributor.name}
                        onChange={e => setNewContributor({ ...newContributor, name: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                    />
                    <input
                        placeholder="Role (e.g. Designer)"
                        value={newContributor.role}
                        onChange={e => setNewContributor({ ...newContributor, role: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                    />
                    <input
                        placeholder="Avatar URL"
                        value={newContributor.avatar_url}
                        onChange={e => setNewContributor({ ...newContributor, avatar_url: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                    />
                    <input
                        placeholder="Social URL"
                        value={newContributor.social_url}
                        onChange={e => setNewContributor({ ...newContributor, social_url: e.target.value })}
                        className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                    />
                </div>
                <button onClick={handleAdd} className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors">
                    Add Member
                </button>
            </div>
        </div>
    );
}
