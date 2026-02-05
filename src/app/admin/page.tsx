import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'
import { CreateLinkForm } from './CreateLinkForm'
import { DeleteLinkButton } from './DeleteLinkButton'
import { EditLinkModal } from './EditLinkModal'

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

                <CreateLinkForm />

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
                                        <div className="flex items-center gap-2">
                                            <EditLinkModal link={link} />
                                            <DeleteLinkButton id={link.id} />
                                        </div>
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
