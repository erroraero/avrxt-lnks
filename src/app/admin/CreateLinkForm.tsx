'use client'

import { useActionState } from 'react'
import { createLink } from './actions'

const initialState = {
    message: '',
}

export function CreateLinkForm() {
    const [state, formAction, isPending] = useActionState(createLink, initialState)

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Create New Link</h2>
            <form action={formAction} className="flex gap-4 flex-col md:flex-row">
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
                    disabled={isPending}
                    className="bg-white text-black font-medium px-6 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Creating...' : 'Create'}
                </button>
            </form>
            {state?.error && (
                <p className="text-red-400 text-sm mt-2">{state.error}</p>
            )}
            {state?.success && (
                <p className="text-emerald-400 text-sm mt-2">Link created successfully!</p>
            )}
        </div>
    )
}
