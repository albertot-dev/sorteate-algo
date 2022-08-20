import "../styles/globals.css";
import splitbee from "@splitbee/web";

function MyApp({ Component, pageProps }) {
  splitbee.init({
    token: "K6ZY45EX0UPO",
  });
  return <Component {...pageProps} />;
}

export default MyApp;
