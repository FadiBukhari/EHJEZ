import { useEffect, useState } from "react";
import "./Profile.scss";
import API from "../../../services/api";
import useAuthStore from "../../../useStore";

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [closingHours, setClosingHours] = useState("");
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isHoursEditable, setIsHoursEditable] = useState(false);
  const { user, setUser } = useAuthStore();
  useEffect(() => {
    API.get("/users/profile")
      .then((res) => {
        setProfileData(res.data);
        setEmail(res.data.email || "");
        setPhoneNumber(res.data.phoneNumber || "");
        setUsername(res.data.username || "");
        setOpeningHours(res.data.clientProfile?.openingHours || "");
        setClosingHours(res.data.clientProfile?.closingHours || "");
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
        if (!/^\d{10}$/.test(phoneNumber)) {
          alert("Phone number must be exactly 10 digits");
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
      case "hours":
        if (
          openingHours === profileData.clientProfile?.openingHours &&
          closingHours === profileData.clientProfile?.closingHours
        ) {
          setIsHoursEditable(false);
          return;
        }
        updatedData.openingHours = openingHours;
        updatedData.closingHours = closingHours;
        break;
      default:
        break;
    }

    API.put("/users/editprofile", updatedData)
      .then(() => {
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
          case "hours":
            setIsHoursEditable(false);
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
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
      case "hours":
        setIsHoursEditable(true);
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
      case "hours":
        setIsHoursEditable(false);
        setOpeningHours(profileData.clientProfile?.openingHours || "");
        setClosingHours(profileData.clientProfile?.closingHours || "");
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
          <img
            src="/profile.svg"
            width="100px"
            className="profile-image-avatar"
          ></img>
          <div className="profile-name">{user?.username || "User"}</div>
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
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow digits and max length of 10
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              disabled={!isPhoneEditable}
              pattern="\d{10}"
              maxLength="10"
              title="Phone number must be exactly 10 digits"
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

        {user?.role === "client" && (
          <>
            <div className="profile-description-detail">
              <label>Opening Hours</label>
              <div className="detail-container">
                <input
                  className="detail"
                  type="time"
                  step="3600"
                  value={openingHours}
                  onChange={(e) => {
                    setOpeningHours(e.target.value);
                  }}
                  disabled={!isHoursEditable}
                />
              </div>
            </div>

            <div className="profile-description-detail">
              <label>Closing Hours</label>
              <div className="detail-container">
                <input
                  className="detail"
                  type="time"
                  step="3600"
                  value={closingHours}
                  onChange={(e) => {
                    setClosingHours(e.target.value);
                  }}
                  disabled={!isHoursEditable}
                />
                {isHoursEditable ? (
                  <>
                    <button onClick={() => handleSave("hours")}>Save</button>
                    <button onClick={() => handleCancel("hours")}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleEdit("hours");
                    }}
                  >
                    Edit Hours
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Profile;
