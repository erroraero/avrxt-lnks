'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function loginWithDiscord() {
    const supabase = await createClient()

    // Assuming we want to redirect back to the admin page or home of this subdomain
    // The original code redirected to /auth/callback which handles the session exchange
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lnks.avrxt.in'}/auth/callback`,
            scopes: 'guilds guilds.members.read',
        },
    })

    if (error) {
        redirect('/auth/login?error=' + encodeURIComponent(error.message))
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function logout() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        redirect('/auth/login?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/auth/login')
}
