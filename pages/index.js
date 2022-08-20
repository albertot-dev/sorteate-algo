import Platforms from "libs/platforms-avaiables";
import Head from "next/head";
import { useState } from "react";
import Sorteo from "../components/sorteo";
import styles from "../styles/Home.module.css";
import splitbee from "@splitbee/web";

export default function Home() {
  const [sourceSelected, setSource] = useState(Platforms[0]);

  const handleSource = (e) => {
    setSource(Platforms.find((platform) => platform.id === e.target.innerText));
  };

  let sourceComponent = null;

  if (sourceSelected !== "lista de asistentes") {
    sourceComponent = <Sorteo platform={sourceSelected} />;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sortéate 🦄 algo para tu evento</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Sortéate 🦄</h1>

        <small className={styles.description}>algo para tu evento</small>

        <div className={styles.tabs}>
          {Platforms.map((source) => (
            <div
              key={source.id}
              onClick={handleSource}
              className={sourceSelected.id === source.id ? styles.active : ""}
            >
              {source.id}
            </div>
          ))}
        </div>
        {sourceComponent}
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/albertot-dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by albertot_dev
        </a>
      </footer>
    </div>
  );
}
