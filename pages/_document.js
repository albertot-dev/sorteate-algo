import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta lang="es" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />

        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Realiza sorteos en tus eventos! Puedes usar los asistentes de meetup o saraos.tech, también mediante #hashtags de Twitter."
        />

        <meta property="og:url" content="https://sorteatealgo.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sortéate 🦄 algo para tu evento" />
        <meta
          property="og:description"
          content="Realiza sorteos en tus eventos! Puedes usar los asistentes de meetup o saraos.tech, también mediante #hashtags de Twitter."
        />
        <meta
          property="og:image"
          content="https://sortate.vercel.app/social.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="sorteatealgo.vercel.app" />
        <meta
          property="twitter:url"
          content="https://sorteatealgo.vercel.app/"
        />
        <meta name="twitter:title" content="Sortéate 🦄 algo para tu evento" />
        <meta
          name="twitter:description"
          content="Realiza sorteos en tus eventos! Puedes usar los asistentes de meetup o saraos.tech, también mediante #hashtags de Twitter."
        />
        <meta
          name="twitter:image"
          content="https://sortate.vercel.app/social.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
