import "./Profile.scss";
const Profile = () => {
  return (
    <div className="profile-page">
      <h1>Profile details</h1>
      <div className="profile-avatar">
        <div className="profile-avatar-detail">
          <img src="profile.svg" width="100px" className="profile-image"></img>
          <div className="profile-name">John Doe</div>
        </div>
        <div className="profile-avatar-edit">
          <button className="edit-picture">Change picture</button>
        </div>
      </div>
      <form className="profile-description">
        <div className="profile-description-detail">
          <label>Name</label>
          <div className="detail-container">
            <span className="detail">John Doe</span>
            <button>Edit Email</button>
          </div>
        </div>
        <div className="profile-description-detail">
          <label>Email</label>
          <div className="detail-container">
            <span className="detail">demo@demo.com</span>
            <button>Edit Email</button>
          </div>
        </div>
        <div className="profile-description-detail">
          <label>Phone number</label>
          <div className="detail-container">
            <span className="detail"> XXXXXXXXXX</span>
            <button>Edit Phone</button>
          </div>
        </div>
        <button className="submit-details">Submit</button>
      </form>
    </div>
  );
};
export default Profile;
