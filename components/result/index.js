import Confetti from "react-confetti";
import styles from "./Result.module.css";
import { useState } from "react";

export default function Result({ result, isTwitter, isInstagram, onClose }) {
  const [showParticipants, setShowParticipants] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.backdrop}></div>
        <Confetti />

        <div className={styles.result}>
          <h2>Ganador 🏆</h2>
          <div className={styles.winner}>
            <h1>{(isTwitter || isInstagram) ? result.winner.split(" | ")[0] : result.winner}</h1>
          </div>
          
          <div className={styles.buttonGroup}>
            <button onClick={onClose}>Volver</button>
            <button 
              onClick={() => setShowParticipants(!showParticipants)}
              className={styles.secondaryBtn}
            >
              {showParticipants ? "Ocultar" : "Ver"} participantes ({result.attendees.length})
            </button>
          </div>

          {showParticipants && (
            <div className={styles.participantsList}>
              <h3>Participantes ({result.attendees.length})</h3>
              <div className={styles.listContainer}>
                {result.attendees.map((attendee, index) => (
                  <div 
                    key={index} 
                    className={`${styles.participant} ${
                      attendee === result.winner ? styles.winner : ''
                    }`}
                  >
                    {(isTwitter || isInstagram) ? attendee.split(" | ")[0] : attendee}
                    {attendee === result.winner && <span className={styles.badge}>🏆</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
