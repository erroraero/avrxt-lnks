import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'

interface Params {
    params: Promise<{
        slug: string
    }>
}

export default async function RedirectPage(props: Params) {
    const params = await props.params;
    const { slug } = params
    const supabase = await createClient()

    // 1. Fetch link
    const { data: link, error } = await supabase
        .from('links')
        .select('target_url, id, clicks')
        .eq('slug', slug)
        .single()

    if (error || !link) {
        // Link not found -> Redirect to home as requested
        redirect('/')
    }

    // 2. Async increment clicks (fire and forget pattern ideally, 
    // but here we await to ensure it happens or use a background job if possible. 
    // For simplicity/speed we just fire it. 
    // Note: This adds latency. For high throughput, use edge functions or specific analytics service).
    try {
        await supabase.rpc('increment_clicks', { row_id: link.id })
    } catch (e) {
        // Fallback if RPC doesn't exist (user needs to create it, 
        // but for now we can do a simple update even if race-condition prone)
        await supabase.from('links').update({ clicks: (link.clicks || 0) + 1 }).eq('id', link.id)
    }

    // 3. Redirect
    // Using 301 for permanent if we are sure, but usually shortlinks might change? 
    // 307 Temporary Redirect is safer for analytics tracking usually, 
    // but 301 is better for SEO of the target.
    // Given the requirement "shorting links", typically 301 or 307. 
    // Let's use 307 Temporary Redirect by default (Next.js default for redirect()).
    redirect(link.target_url)
}
