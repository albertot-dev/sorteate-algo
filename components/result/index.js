import Confetti from "react-confetti";
import styles from "./Result.module.css";

export default function Result({ result, isTwitter, onClose }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.backdrop}></div>
        <Confetti />

        <div className={styles.result}>
          <h2>Ganador 🏆</h2>
          <div className={styles.winner}>
            <h1>{isTwitter ? result.winner.split(" | ")[0] : result.winner}</h1>
          </div>
          <button onClick={onClose}>Volver</button>
        </div>
      </div>
    </>
  );
}
