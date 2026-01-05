import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../useStore";
import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect <span>Room Space</span>
          </h1>
          <p className="hero-description">
            Discover and book premium rooms across the city. Whether you need a quiet space for work, a meeting room for business, or a collaborative area for projects, EHJEZ connects you with the ideal environment for your needs.
          </p>
          {!user && (
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate("/signup")}>
                Get Started
              </button>
              <button className="btn-secondary" onClick={() => navigate("/signin")}>
                Sign In
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Top Booked Section */}
      <section className="top-booked-section">
        <div className="section-header">
          <h2 className="section-title">Top Booked Venues</h2>
          <p className="section-subtitle">Trusted by thousands of customers every day</p>
        </div>
        <div className="clients-section">
          <div className="client-card">
            <div className="client client1-img"></div>
            <h3>Premium Hub</h3>
            <p>Quiet & Focused</p>
          </div>
          <div className="client-card">
            <div className="client client2-img"></div>
            <h3>Modern Center</h3>
            <p>Group Friendly</p>
          </div>
          <div className="client-card">
            <div className="client client3-img"></div>
            <h3>Elite Space</h3>
            <p>24/7 Access</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose EHJEZ?</h2>
          <p className="section-subtitle">Everything you need for a productive session</p>
        </div>
        <div className="home-features-grid">
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Easy Location</h3>
            <p>Find rooms near you with our interactive map. Filter by amenities, price, and availability.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Booking</h3>
            <p>Book your spot in seconds. No waiting, no hassle. Secure your room with just a few clicks.</p>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="side-images-section">
        <div className="mini-section1">
          <div className="mini-description">
            <span className="mini-tag">For Customers</span>
            <h2>Focus on What Matters</h2>
            <p className="mini-paragraph">
              Stop wasting time searching for the perfect space. EHJEZ brings you curated rooms with all the amenities you need - fast WiFi, comfortable seating, quiet environment, and more.
            </p>
            <button className="btn-outline" onClick={() => navigate("/signup")}>
              Get Started →
            </button>
          </div>
          <div className="mini-image image1"></div>
        </div>
        <div className="mini-section1 reverse">
          <div className="mini-image image2"></div>
          <div className="mini-description">
            <span className="mini-tag">For Owners</span>
            <h2>Grow Your Business</h2>
            <p className="mini-paragraph">
              Own a venue? Join EHJEZ and reach thousands of customers looking for quality spaces. Manage bookings, communicate with customers, and grow your revenue effortlessly.
            </p>
            <button className="btn-outline" onClick={() => navigate("/joinus")}>
              Join as Partner →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Find Your Perfect Space?</h2>
          <p>Join thousands of customers who have found their ideal room with EHJEZ.</p>
          <button className="btn-primary btn-large" onClick={() => navigate("/signup")}>
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
