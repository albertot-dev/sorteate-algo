import { useEffect, useRef, useState } from "react";
import styles from "./Sorteo.module.css";

import ErrorUrl from "components/error-url";
import Result from "components/result";
import ValidUrl from "libs/valid-url";
export default function Sorteo({ platform }) {
  const [error, setError] = useState(null);
  const [source, setSource] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    setResult(null);
    setError(null);
    setSource("");
    urlInput.current.value = "";
  }, [platform]);

  const handleClose = () => {
    setError(null);
    setResult(null);
  };

  const handleSource = (e) => {
    if (!e.target.value.startsWith("#") && platform.id === "twitter") {
      setSource("#" + e.target.value);
      urlInput.current.value = "#" + e.target.value;
    } else {
      setSource(e.target.value);
      urlInput.current.value = e.target.value;
    }
  };

  const urlInput = useRef();

  const handleSortear = async () => {
    setResult(null);

    if (!source.startsWith("https://") && !source.startsWith("#")) {
      setError("La URL debe comenzar con https://");
      return;
    }

    if (!ValidUrl(source) && !source.startsWith("#")) {
      setError("La URL no es válida");
      return;
    }

    setError(null);

    fetch("/api/hazelsorteoya", {
      method: "POST",
      body: JSON.stringify({
        source,
      }),
    })
      .then((response) => response.json())
      .then((dog) => {
        if (!dog.message && dog.attendees.length > 0) {
          setResult(dog);
        } else {
          setError("No se ha encontrado el evento o hay 0 asistentes");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div
        style={{
          minWidth: "40%",
        }}
      >
        <h1 className={styles.titulo}>
          {platform.name} {platform.icon}
        </h1>
        <div className={styles.error_container}>
          {error && <ErrorUrl error={error} />}
        </div>
        <div className={styles.input_sorteo}>
          <input
            ref={urlInput}
            onChange={handleSource}
            type="text"
            placeholder={
              platform.placeholder || "Introduce aqui la URL del evento"
            }
          />
          <button
            disabled={!source || source.length < 3}
            onClick={handleSortear}
            type="button"
          >
            Sortear
          </button>
        </div>
        <small className={styles.ejemplo}>
          Ej:
          {platform.example}
        </small>
        {result && (
          <Result
            result={result}
            isTwitter={platform.id === "twitter"}
            onClose={handleClose}
          />
        )}
      </div>
    </>
  );
}
