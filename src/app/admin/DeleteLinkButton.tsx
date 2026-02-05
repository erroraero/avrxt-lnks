'use client'

import { useActionState } from 'react'
import { deleteLink } from './actions'

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

export function DeleteLinkButton({ id }: { id: string }) {
    const deleteAction = deleteLink.bind(null, null, id) // Bind null for prevState, then id
    // Note: useActionState expects (prevState, formData) -> State. 
    // But deleteLink above is (prevState, id). 
    // If we want to use form action, we need strict signature.
    // Ideally, we just use a form with bind.
    // However, useActionState works best with (prevState, formData).

    // Let's wrap it properly:
    const action = async (prevState: any, formData: FormData) => {
        return await deleteLink(prevState, id);
    }

    const [state, formAction, isPending] = useActionState(action, null)

    return (
        <form action={formAction}>
            <button
                type="submit"
                disabled={isPending}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Delete Link"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
            {state?.error && <span className="sr-only">Error: {state.error}</span>}
        </form>
    )
}
