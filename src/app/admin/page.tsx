import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createLink, deleteLink } from './actions'
import { Database } from '@/types/database.types'

// Simple Trash Icon component
function TrashIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}

export default async function AdminPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: links } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <main className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
            {/* Background Ambient Mesh */}
            <div className="mesh-gradient opacity-40 fixed inset-0 pointer-events-none" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none fixed" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-8 pt-10">
                <header className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Link Dashboard</h1>
                    <div className="text-sm text-zinc-500">
                        {user.email}
                    </div>
                </header>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold mb-4">Create New Link</h2>
                    <form action={createLink} className="flex gap-4 flex-col md:flex-row">
                        <input
                            name="slug"
                            placeholder="Slug (e.g. ig)"
                            className="bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 flex-shrink-0 md:w-48 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all placeholder:text-zinc-600"
                            required
                        />
                        <input
                            name="target_url"
                            placeholder="Target URL (https://...)"
                            className="bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 flex-grow focus:ring-2 focus:ring-white/20 focus:outline-none transition-all placeholder:text-zinc-600"
                            required
                            type="url"
                        />
                        <button
                            type="submit"
                            className="bg-white text-black font-medium px-6 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            Create
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Your Links</h2>
                    {links && links.length > 0 ? (
                        <div className="grid gap-4">
                            {links.map((link) => (
                                <div key={link.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 flex items-center justify-between group hover:border-zinc-700 transition-all">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-zinc-400">/</span>
                                            <span className="font-mono text-white font-medium">{link.slug}</span>
                                        </div>
                                        <div className="text-sm text-zinc-500 truncate">{link.target_url}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs text-zinc-600 font-mono">
                                            {link.clicks || 0} clicks
                                        </div>
                                        <form action={deleteLink.bind(null, link.id)}>
                                            <button
                                                type="submit"
                                                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Link"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                            No links created yet
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
