import { Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Icon } from "../components/common/Icon";
import "./NotFound.css";

function NotFound() {
  return (
    <div>
      <Header />
      <main className="not-found-page">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>Oops! The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            <Icon icon="fa-solid fa-house" />
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;
