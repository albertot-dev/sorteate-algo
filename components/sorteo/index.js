import { useEffect, useRef, useState } from "react";
import styles from "./Sorteo.module.css";

import ErrorUrl from "components/error-url";
import Result from "components/result";
import ValidUrl from "libs/valid-url";

export default function Sorteo({ platform }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("");
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("url"); // "url", "list", or "random"
  const [participants, setParticipants] = useState("");
  const [minRange, setMinRange] = useState("");
  const [maxRange, setMaxRange] = useState("");
  const urlInput = useRef();

  useEffect(() => {
    setResult(null);
    setError(null);
    setSource("");
    setParticipants("");
    setMinRange("");
    setMaxRange("");
    setMode("url");
    if (urlInput.current) urlInput.current.value = "";
  }, [platform]);

  const handleClose = () => {
    setError(null);
    setResult(null);
  };

  const handleSource = (e) => {
    if (!e.target.value.startsWith("#") && platform.id === "twitter") {
      setSource("#" + e.target.value);
      if (urlInput.current) urlInput.current.value = "#" + e.target.value;
    } else {
      setSource(e.target.value);
      if (urlInput.current) urlInput.current.value = e.target.value;
    }
  };

  const handleSortear = async () => {
    setResult(null);
    setIsLoading(true);
    setError(null);

    if (mode === "url") {
      handleSortearURL();
    } else if (mode === "list") {
      handleSortearList();
    } else if (mode === "random") {
      handleSortearRandom();
    }
  };

  const handleSortearURL = () => {
    if (!source.startsWith("https://") && !source.startsWith("#")) {
      setError("La URL debe comenzar con https://");
      setIsLoading(false);
      return;
    }

    if (!ValidUrl(source) && !source.startsWith("#")) {
      setError("La URL no es válida");
      setIsLoading(false);
      return;
    }

    fetch("/api/hazelsorteoya", {
      method: "POST",
      body: JSON.stringify({
        source,
        platform: platform.id,
      }),
    })
      .then((response) => response.json())
      .then((dog) => {
        setIsLoading(false);
        if (!dog.message && dog.attendees.length > 0) {
          setResult(dog);
        } else {
          setError("No se ha encontrado el evento o hay 0 asistentes");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Error al procesar el sorteo");
      });
  };

  const handleSortearList = () => {
    if (!participants.trim()) {
      setError("Por favor, introduce participantes");
      setIsLoading(false);
      return;
    }

    const attendees = participants
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (attendees.length === 0) {
      setError("Por favor, introduce al menos un participante");
      setIsLoading(false);
      return;
    }

    const winner = attendees[Math.floor(Math.random() * attendees.length)];
    setIsLoading(false);
    setResult({
      winner,
      attendees,
    });
  };

  const handleSortearRandom = () => {
    const min = parseInt(minRange);
    const max = parseInt(maxRange);

    if (isNaN(min) || isNaN(max)) {
      setError("Por favor, introduce números válidos");
      setIsLoading(false);
      return;
    }

    if (min >= max) {
      setError("El mínimo debe ser menor que el máximo");
      setIsLoading(false);
      return;
    }

    const winner = Math.floor(Math.random() * (max - min + 1)) + min;
    setIsLoading(false);
    setResult({
      winner: winner.toString(),
      attendees: Array.from(
        { length: max - min + 1 },
        (_, i) => (min + i).toString()
      ),
    });
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.titulo}>
          {platform.name} {platform.icon}
        </h1>

        {/* Mode Tabs */}
        <div className={styles.modeTabs}>
          <button
            className={`${styles.modeTab} ${mode === "url" ? styles.active : ""}`}
            onClick={() => setMode("url")}
          >
            URL/Hashtag
          </button>
          <button
            className={`${styles.modeTab} ${mode === "list" ? styles.active : ""}`}
            onClick={() => setMode("list")}
          >
            Lista
          </button>
          <button
            className={`${styles.modeTab} ${mode === "random" ? styles.active : ""}`}
            onClick={() => setMode("random")}
          >
            Número Random
          </button>
        </div>

        {/* Error Container */}
        <div className={styles.error_container}>
          {error && <ErrorUrl error={error} />}
        </div>

        {/* URL/Hashtag Mode */}
        {mode === "url" && (
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
              disabled={!source || source.length < 3 || isLoading}
              onClick={handleSortear}
              type="button"
            >
              {isLoading ? "Sorteando..." : "Sortear"}
            </button>
            <small className={styles.ejemplo}>
              Ej: {platform.example}
            </small>
          </div>
        )}

        {/* List Mode */}
        {mode === "list" && (
          <div className={styles.input_sorteo}>
            <textarea
              className={styles.textarea}
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Introduce los participantes (uno por línea)"
              rows="8"
            />
            <button
              disabled={!participants.trim() || isLoading}
              onClick={handleSortear}
              type="button"
            >
              {isLoading ? "Sorteando..." : "Sortear"}
            </button>
            <small className={styles.ejemplo}>
              Cada línea es un participante
            </small>
          </div>
        )}

        {/* Random Mode */}
        {mode === "random" && (
          <div className={styles.input_sorteo}>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                placeholder="Número mínimo"
                value={minRange}
                onChange={(e) => setMinRange(e.target.value)}
              />
              <span className={styles.separator}>-</span>
              <input
                type="number"
                placeholder="Número máximo"
                value={maxRange}
                onChange={(e) => setMaxRange(e.target.value)}
              />
            </div>
            <button
              disabled={
                !minRange || !maxRange || isLoading || minRange >= maxRange
              }
              onClick={handleSortear}
              type="button"
            >
              {isLoading ? "Sorteando..." : "Sortear"}
            </button>
            <small className={styles.ejemplo}>
              Ej: 1 - 100
            </small>
          </div>
        )}

        {result && (
          <Result
            result={result}
            isTwitter={platform.id === "twitter"}
            isInstagram={platform.id === "instagram"}
            onClose={handleClose}
          />
        )}
      </div>
    </>
  );
}
