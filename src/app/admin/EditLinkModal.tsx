'use client'

import { useActionState, useState } from 'react'
import { updateLink, ActionState } from './actions'
import { Pencil, X } from 'lucide-react'

interface EditLinkModalProps {
    link: {
        id: string
        slug: string
        target_url: string
    }
}

export function EditLinkModal({ link }: EditLinkModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const initialState: ActionState = { message: '', error: '' }
    const [state, formAction, isPending] = useActionState(updateLink, initialState)

    // Close modal on success
    if (state?.success && isOpen) {
        setIsOpen(false)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Edit Link"
            >
                <Pencil className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-semibold mb-6">Edit Link</h2>

                        <form action={formAction} className="space-y-4">
                            <input type="hidden" name="id" value={link.id} />

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Slug</label>
                                <input
                                    name="slug"
                                    defaultValue={link.slug}
                                    placeholder="Slug (e.g. ig)"
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all placeholder:text-zinc-600"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Target URL</label>
                                <input
                                    name="target_url"
                                    defaultValue={link.target_url}
                                    placeholder="https://..."
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all placeholder:text-zinc-600"
                                    required
                                    type="url"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4 uppercase text-xs tracking-[0.2em]"
                            >
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </button>

                            {state?.error && (
                                <p className="text-red-400 text-sm mt-2 text-center">{state.error}</p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
