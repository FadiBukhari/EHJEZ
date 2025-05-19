import "./Contactus.scss";
const Contactus = () => {
  return (
    <div className="contactus-page">
      <span className="contactus-title">Contact us</span>
      <span className="contactus-page-description">
        Please leave your contact details and enquiry below, and someone from
        our team will get back to you shortly.
      </span>
      <form className="contactus-form">
        <label>Subject</label>
        <input type="text" className="contactus-form-input" />
        <label>Message</label>
        <input type="text" className="contactus-form-textarea" />
        <button className="contactus-form-button">Send</button>
      </form>
    </div>
  );
};
export default Contactus;
