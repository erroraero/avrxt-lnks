'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'
// Define the state type for actions
export type ActionState = {
    error?: string
    success?: boolean
    message?: string
}

export async function createLink(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const slug = formData.get('slug') as string
    const target_url = formData.get('target_url') as string

    if (!slug || !target_url) {
        return { error: 'Slug and Target URL are required' }
    }

    // Basic URL validation
    try {
        new URL(target_url)
    } catch (e) {
        return { error: 'Invalid Target URL' }
    }

    const { error } = await supabase
        .from('links')
        .insert({
            user_id: user.id,
            slug,
            target_url,
        })

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { error: 'Slug already exists' }
        }
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function deleteLink(prevState: any, id: string): Promise<ActionState> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function updateLink(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const id = formData.get('id') as string
    const slug = formData.get('slug') as string
    const target_url = formData.get('target_url') as string

    if (!id || !slug || !target_url) {
        return { error: 'All fields are required' }
    }

    // Basic URL validation
    try {
        new URL(target_url)
    } catch (e) {
        return { error: 'Invalid Target URL' }
    }

    const { error } = await supabase
        .from('links')
        .update({
            slug,
            target_url,
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        if (error.code === '23505') {
            return { error: 'Slug already exists' }
        }
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}
