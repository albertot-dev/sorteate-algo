import styles from "./ErrorUrl.module.css";
export default function ErrorUrl({ error }) {
  return (
    <div className={styles.error}>
      <span>&#9888; {error}</span>
    </div>
  );
}
