<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $globalSeo = \App\Models\SeoSetting::where('page_key', 'global')->first();
        @endphp

        @if(!empty($globalSeo?->google_search_console_id))
            <meta name="google-site-verification" content="{{ $globalSeo->google_search_console_id }}" />
        @endif

        @if(!empty($globalSeo?->google_analytics_id))
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ $globalSeo->google_analytics_id }}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '{{ $globalSeo->google_analytics_id }}');
                window.GA_MEASUREMENT_ID = '{{ $globalSeo->google_analytics_id }}';
            </script>
        @endif

        @if(!empty($globalSeo?->custom_meta_tags))
            {!! $globalSeo->custom_meta_tags !!}
        @endif

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="developer-profile" type="application/json" href="/developer.json" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>