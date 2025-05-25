import "./JoinUs.scss";
const JoinUs = () => {
  return (
    <div className="join-us-container">
      <span className="join-us-title">Company Registration</span>
      <form className="join-us-form">
        <div className="company-details-small">
          <label>Company Name</label>
          <input className="input-join" type="text" required />
        </div>
        <div className="company-details-big">
          <div className="company-details-small inbig">
            <label>Company Email</label>
            <input className="input-join-big" type="text" required />
          </div>
          <div className="company-details-small inbig">
            <label>Company Phone</label>
            <input className="input-join-big" type="text" required />
          </div>
        </div>
        <div className="company-details-small">
          <label className="">City</label>
          <input className="input-join" type="text" required />
        </div>
        <button type="submit">Send a request</button>
      </form>
    </div>
  );
};
export default JoinUs;
