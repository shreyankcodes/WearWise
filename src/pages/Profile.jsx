import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/sufrpmll/image/upload";

const CLOUDINARY_PRESET = "wearwise_unsigned";

/* =====================================================
   ICONS
===================================================== */

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function WardrobeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M8 4h8" />
      <path d="M9 4v3l-5 3v10h16V10l-5-3V4" />
      <path d="M9 7c1.2 1.5 4.8 1.5 6 0" />
    </svg>
  );
}

function OutfitIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 3l1.5 4L17 8.5 13.5 10 12 14l-1.5-4L7 8.5 10.5 7 12 3Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M20.8 8.8c0 5.5-8.8 11-8.8 11s-8.8-5.5-8.8-11A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M10 5H5v14h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 7h4l1.5-2h5L16 7h4v12H4V7Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

/* =====================================================
   PROFILE
===================================================== */

function Profile() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [uploadingPhoto, setUploadingPhoto] =
    useState(false);

  const [photoError, setPhotoError] =
    useState("");

  /* =====================================================
     AUTH LISTENER
  ===================================================== */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          navigate("/login");
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      navigate("/login");
    }
  };

  /* =====================================================
     OPEN FILE PICKER
  ===================================================== */

  const handleChangePhoto = () => {
    if (uploadingPhoto) return;

    fileInputRef.current?.click();
  };

  /* =====================================================
     PROFILE PHOTO UPLOAD
  ===================================================== */

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPhotoError("");

    /* Validate image */

    if (!file.type.startsWith("image/")) {
      setPhotoError(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    /* 5 MB limit */

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError(
        "Please choose an image smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingPhoto(true);

      /* ================================================
         UPLOAD TO CLOUDINARY
      ================================================= */

      const uploadData = new FormData();

      uploadData.append("file", file);

      uploadData.append(
        "upload_preset",
        CLOUDINARY_PRESET
      );

      uploadData.append(
        "folder",
        `wearwise/profile/${user.uid}`
      );

      const response = await axios.post(
        CLOUDINARY_URL,
        uploadData
      );

      const photoURL =
        response.data.secure_url;

      /* ================================================
         UPDATE FIREBASE PROFILE
      ================================================= */

      await updateProfile(user, {
        photoURL,
      });

      /* ================================================
         UPDATE LOCAL UI
      ================================================= */

      setUser({
        ...user,
        photoURL,
      });

      setPhotoError("");

    } catch (error) {
      console.error(
        "Profile photo upload failed:",
        error
      );

      setPhotoError(
        error.response?.data?.error?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to update profile picture."
      );
    } finally {
      setUploadingPhoto(false);

      /*
        Reset input so the user can select
        the same image again if needed.
      */
      event.target.value = "";
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <img
          src="/wearwise-logo.png"
          alt="WearWise"
          className="loading-logo"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  /* =====================================================
     USER DATA
  ===================================================== */

  const displayName =
    user.displayName ||
    user.email?.split("@")[0] ||
    "WearWise User";

  const initials = displayName
    .split(" ")
    .map((name) =>
      name.charAt(0)
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const accountCreated =
    user.metadata?.creationTime
      ? new Date(
          user.metadata.creationTime
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "Not available";

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="ow-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="ow-sidebar">

        <div className="ow-logo">
          <img
            src="/wearwise-logo.png"
            alt="WearWise"
          />
        </div>

        <nav className="ow-nav">

          <button
            type="button"
            className="ow-nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <HomeIcon />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className="ow-nav-item"
            onClick={() =>
              navigate("/wardrobe")
            }
          >
            <WardrobeIcon />
            <span>Wardrobe</span>
          </button>

          <button
            type="button"
            className="ow-nav-item"
            onClick={() =>
              navigate("/outfits")
            }
          >
            <OutfitIcon />
            <span>Outfits</span>
          </button>

          <button
            type="button"
            className="ow-nav-item"
            onClick={() =>
              navigate("/favorites")
            }
          >
            <HeartIcon />
            <span>Favorites</span>
          </button>

          <button
            type="button"
            className="ow-nav-item active"
            onClick={() =>
              navigate("/profile")
            }
          >
            <UserIcon />
            <span>Profile</span>
          </button>

        </nav>

        <div className="ow-logout">

          <button
            type="button"
            className="ow-nav-item"
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span>Log out</span>
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="profile-main">

        {/* HEADER */}

        <header className="profile-header">

          <div>

            <p className="profile-kicker">
              WEARWISE / ACCOUNT
            </p>

            <h1>
              Your profile.
            </h1>

            <p>
              Manage your WearWise account
              and personal information.
            </p>

          </div>

        </header>

        {/* =================================================
            PROFILE HERO
        ================================================= */}

        <section className="profile-hero">

          {/* PROFILE AVATAR */}

          <div className="profile-avatar-wrapper">

            <div className="profile-avatar">

              {user.photoURL ? (

                <img
                  src={user.photoURL}
                  alt={displayName}
                />

              ) : (

                <span>
                  {initials}
                </span>

              )}

              {/* CAMERA BUTTON */}

              <button
                type="button"
                className="profile-photo-button"
                onClick={handleChangePhoto}
                disabled={uploadingPhoto}
                aria-label="Change profile picture"
              >
                <CameraIcon />
              </button>

              {/* HIDDEN INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                hidden
              />

            </div>

            <button
              type="button"
              className="profile-change-photo"
              onClick={handleChangePhoto}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto
                ? "Uploading..."
                : "Change photo"}
            </button>

          </div>

          <div className="profile-hero-info">

            <span className="profile-label">
              WELCOME BACK
            </span>

            <h2>
              {displayName}
            </h2>

            <p>
              {user.email}
            </p>

            {photoError && (
              <p className="profile-photo-error">
                {photoError}
              </p>
            )}

          </div>

        </section>

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <section className="profile-section">

          <div className="profile-section-heading">

            <div>

              <p>
                ACCOUNT
              </p>

              <h2>
                Account information
              </h2>

            </div>

          </div>

          <div className="profile-info-grid">

            <div className="profile-info-card">

              <span>
                NAME
              </span>

              <strong>
                {displayName}
              </strong>

            </div>

            <div className="profile-info-card">

              <span>
                EMAIL
              </span>

              <strong>
                {user.email}
              </strong>

            </div>

            <div className="profile-info-card">

              <span>
                ACCOUNT CREATED
              </span>

              <strong>
                {accountCreated}
              </strong>

            </div>

            <div className="profile-info-card">

              <span>
                SIGN-IN METHOD
              </span>

              <strong>
                Email & Password
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="profile-section">

          <div className="profile-section-heading">

            <div>

              <p>
                EXPLORE
              </p>

              <h2>
                Your WearWise
              </h2>

            </div>

          </div>

          <div className="profile-actions">

            <button
              type="button"
              className="profile-action-card"
              onClick={() =>
                navigate("/wardrobe")
              }
            >

              <div className="profile-action-icon">
                <WardrobeIcon />
              </div>

              <div>

                <h3>
                  My wardrobe
                </h3>

                <p>
                  View and manage your
                  clothing collection.
                </p>

              </div>

              <ArrowIcon />

            </button>

            <button
              type="button"
              className="profile-action-card"
              onClick={() =>
                navigate("/outfits")
              }
            >

              <div className="profile-action-icon">
                <OutfitIcon />
              </div>

              <div>

                <h3>
                  My outfits
                </h3>

                <p>
                  Create and manage your
                  saved looks.
                </p>

              </div>

              <ArrowIcon />

            </button>

            <button
              type="button"
              className="profile-action-card"
              onClick={() =>
                navigate("/favorites")
              }
            >

              <div className="profile-action-icon">
                <HeartIcon />
              </div>

              <div>

                <h3>
                  My favorites
                </h3>

                <p>
                  See the pieces you love
                  the most.
                </p>

              </div>

              <ArrowIcon />

            </button>

          </div>

        </section>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <section className="profile-logout-section">

          <div>

            <span>
              ACCOUNT ACTION
            </span>

            <h2>
              Ready to leave?
            </h2>

            <p>
              You can safely sign out of
              your WearWise account.
            </p>

          </div>

          <button
            type="button"
            onClick={handleLogout}
          >
            <LogoutIcon />
            Log out
          </button>

        </section>

      </main>

    </div>
  );
}

export default Profile;