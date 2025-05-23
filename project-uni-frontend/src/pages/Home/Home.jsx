import "./Home.scss";

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
    </div>
  );
};
export default Home;
