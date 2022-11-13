import { Html, Head, Main, NextScript } from "next/document";
import { Navbar } from "../components/ui/Navbar";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <Navbar></Navbar>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
