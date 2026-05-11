import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import "./UnderDevelopment.css";

function UnderDevelopment() {
  return (
    <div>
      <Header />
      <main className="under-development-page">
        <div className="container">
          <Icon icon="fa-gears" size="2xl" className="icon" />
          <h1>Under Development</h1>
          <p>This feature is coming soon. Stay tuned!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UnderDevelopment;