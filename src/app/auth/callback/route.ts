import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { checkDiscordRole } from '@/utils/discord';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/admin';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lnks.avrxt.in';

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.session) {
            // Check for Discord Role
            const providerToken = data.session.provider_token;

            if (providerToken) {
                const guildId = process.env.DISCORD_GUILD_ID;
                const roleId = process.env.DISCORD_ROLE_ID;

                if (guildId && roleId) {
                    const { authorized, error: rbacError } = await checkDiscordRole(providerToken, guildId, roleId);

                    if (!authorized) {
                        await supabase.auth.signOut();
                        return NextResponse.redirect(`${baseUrl}/auth/login?error=${encodeURIComponent(rbacError || 'Unauthorized')}`);
                    }

                    // Authorized
                    return NextResponse.redirect(`${baseUrl}${next}`);
                } else {
                    await supabase.auth.signOut();
                    return NextResponse.redirect(`${baseUrl}/auth/login?error=Server configuration error`);
                }
            } else {
                await supabase.auth.signOut();
                return NextResponse.redirect(`${baseUrl}/auth/login?error=Could not verify Discord membership`);
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${baseUrl}/auth/login?error=Auth failed`);
}
