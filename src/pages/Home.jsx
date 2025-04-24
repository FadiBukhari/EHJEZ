import "./CSS/Home.scss";

const Home = () => {
  return (
    <div>
      <div className="home-section1">
        <div className="part-home">
          <h1 className="part-home-title">Our clients</h1>
          <div className="clients-section">
            <div className="client client1-img"></div>
            <div className="client client2-img"></div>
            <div className="client client3-img"></div>
          </div>
        </div>
      </div>
      <div className="side-images-section">
        <div className="mini-section1">
          <div className="mini-description">
            <h1>Header</h1>
            <p className="mini-paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
          </div>
          <div className="mini-image image1"></div>
        </div>
        <div className="mini-section1">
          <div className="mini-image image2"></div>
          <div className="mini-description">
            <h1>Header</h1>
            <p className="mini-paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
          </div>
        </div>
      </div>

      <div class="last-section">
        <div className="last-section-content">
          <img src="logo.png" width="100px" className="logo" />
          <div className="toho">
            <span>About us</span>
            <span>Privacy policy</span>
            <span>Terms of use</span>
          </div>
          <div className="social-media">
            <div className="social simage1"></div>
            <div className="social simage2"></div>
            <div className="social simage3"></div>
            <div className="social simage4"></div>
          </div>
        </div>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
};
export default Home;
