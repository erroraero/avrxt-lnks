'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'

export async function createLink(formData: FormData) {
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

export async function deleteLink(id: string) {
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
