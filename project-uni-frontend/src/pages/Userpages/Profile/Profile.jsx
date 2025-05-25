import { useEffect, useState } from "react";
import "./Profile.scss";
import API from "../../../services/api";
import useAuthStore from "../../../useStore";
const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const { user, setUser } = useAuthStore();
  useEffect(() => {
    API.get("/users/profile")
      .then((res) => {
        setProfileData(res.data);
        setEmail(res.data.email || "");
        setPhoneNumber(res.data.phoneNumber || "");
        setUsername(res.data.username || "");
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);
  const handleSave = (field) => {
    const updatedData = {};
    switch (field) {
      case "email":
        if (email === profileData.email) {
          setIsEmailEditable(false);
          return;
        }
        updatedData.email = email;
        break;
      case "phone":
        if (phoneNumber === profileData.phoneNumber) {
          setIsPhoneEditable(false);
          return;
        }
        updatedData.phoneNumber = phoneNumber;
        break;
      case "username":
        if (username === profileData.username) {
          setIsUsernameEditable(false);
          return;
        }
        updatedData.username = username;
        break;
      default:
        break;
    }

    API.put("/users/editprofile", updatedData)
      .then((res) => {
        setProfileData((prevData) => ({
          ...prevData,
          ...updatedData,
        }));

        setUser(updatedData);

        switch (field) {
          case "email":
            setIsEmailEditable(false);
            break;
          case "phone":
            setIsPhoneEditable(false);
            break;
          case "username":
            setIsUsernameEditable(false);
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleEdit = (field) => {
    switch (field) {
      case "email":
        setIsEmailEditable(!isEmailEditable);
        break;
      case "phone":
        setIsPhoneEditable(!isPhoneEditable);
        break;
      case "username":
        setIsUsernameEditable(!isUsernameEditable);
        break;
      default:
        break;
    }
  };
  const handleCancel = (field) => {
    switch (field) {
      case "email":
        setIsEmailEditable(false);
        setEmail(profileData.email || "");
        break;
      case "phone":
        setIsPhoneEditable(false);
        setPhoneNumber(profileData.phoneNumber || "");
        break;
      case "username":
        setIsUsernameEditable(false);
        setUsername(profileData.username || "");
        break;

      default:
        break;
    }
  };
  return (
    <div className="profile-page">
      <h1>Profile details</h1>
      <div className="profile-avatar">
        <div className="profile-avatar-detail">
          <img src="/profile.svg" width="100px" className="profile-image"></img>
          <div className="profile-name">{user.username}</div>
        </div>
        {/* <div className="profile-avatar-edit">
          <button className="edit-picture">Change picture</button>
        </div> */}
      </div>
      <div className="profile-description">
        <div className="profile-description-detail">
          <label>Name</label>
          <div className="detail-container">
            <input
              className="detail"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              disabled={!isUsernameEditable}
            />

            {isUsernameEditable ? (
              <>
                <button onClick={() => handleSave("username")}>Save</button>
                <button onClick={() => handleCancel("username")}>Cancel</button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleEdit("username");
                }}
              >
                Edit name
              </button>
            )}
          </div>
        </div>
        <div className="profile-description-detail">
          <label>Email</label>
          <div className="detail-container">
            <input
              className="detail"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              disabled={!isEmailEditable}
            />
            {isEmailEditable ? (
              <>
                <button onClick={() => handleSave("email")}>Save</button>
                <button onClick={() => handleCancel("email")}>Cancel</button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleEdit("email");
                }}
              >
                Edit Email
              </button>
            )}
          </div>
        </div>

        <div className="profile-description-detail">
          <label>Phone number</label>
          <div className="detail-container">
            <input
              className="detail"
              type="phone"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              disabled={!isPhoneEditable}
            />

            {isPhoneEditable ? (
              <>
                <button onClick={() => handleSave("phone")}>Save</button>
                <button onClick={() => handleCancel("phone")}>Cancel</button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleEdit("phone");
                }}
              >
                Edit Phone
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
