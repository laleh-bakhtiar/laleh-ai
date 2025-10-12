import Head from 'next/head';

export default function LegacyHead({ title, description, ogDescription, children }) {
	return (
		<Head>
			{title && <title>{title}</title>}
			<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta name="msapplication-TileColor" content="#00aba9" />
			<meta name="theme-color" content="#ffffff" />
			<meta name="google-site-verification" content="SlVXql45QApFE2w38skX-iAY-6Yo4OrXg_MLTxEMiA0" />
			<meta property="og:site_name" content="Laleh Bakhtiar" />
			{description && <meta name="description" content={description} />}
			{ogDescription && <meta property="og:description" content={ogDescription} />}

			<link rel="apple-touch-icon" sizes="180x180" href="/files/theme/images/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/files/theme/images/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/files/theme/images/favicon-16x16.png" />
			<link rel="manifest" href="/files/theme/images/site.webmanifest.txt" />

			<link id="wsite-base-style" rel="stylesheet" href="https://cdn2.editmysite.com/css/sites.css?buildTime=1717901577" />
			<link rel="stylesheet" href="https://cdn2.editmysite.com/css/old/fancybox.css?1717901577" />
			<link rel="stylesheet" href="https://cdn2.editmysite.com/css/social-icons.css?buildtime=1717901577" media="screen,projection" />
			<link rel="stylesheet" href="/files/main_style%EF%B9%961717952241.css" title="wsite-theme-css" />
			<link href="https://cdn2.editmysite.com/fonts/Quattrocento/font.css?2" rel="stylesheet" />
			<link href="https://cdn2.editmysite.com/fonts/Quattrocento_Sans/font.css?2" rel="stylesheet" />
			<link href="https://cdn2.editmysite.com/fonts/Crimson_Text/font.css?2" rel="stylesheet" />
			<link href="https://cdn2.editmysite.com/fonts/Open_Sans/font.css?2" rel="stylesheet" />
			<link href="https://cdn2.editmysite.com/fonts/Cardo/font.css?2" rel="stylesheet" />
			<link href="https://cdn2.editmysite.com/fonts/Yanone_Kaffeesatz/font.css?2" rel="stylesheet" />
			<link href="https://cdn2.editmysite.com/fonts/Journal/font.css?2" rel="stylesheet" />

			{children}
		</Head>
	);
}
