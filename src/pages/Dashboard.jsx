import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const API_URL = `${import.meta.env.VITE_API_URL}`;
const OUTFIT_API_URL = `${import.meta.env.VITE_API_URL}/api/outfits`;

/* =====================================================
   ICONS
===================================================== */

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="menu-icon">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function WardrobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="menu-icon">
      <path d="M8 4h8" />
      <path d="M9 4v3l-5 3v10h16V10l-5-3V4" />
      <path d="M9 7c1.2 1.5 4.8 1.5 6 0" />
    </svg>
  );
}

function OutfitIcon() {
  return (
    <svg viewBox="0 0 24 24" className="menu-icon">
      <path d="M12 3l1.5 4L17 8.5 13.5 10 12 14l-1.5-4L7 8.5 10.5 7 12 3Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="menu-icon">
      <path d="M20.8 8.8c0 5.5-8.8 11-8.8 11s-8.8-5.5-8.8-11A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="menu-icon">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="menu-icon">
      <path d="M10 5H5v14h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="menu-icon">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="plus-icon">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="arrow-icon">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [wardrobeLoading, setWardrobeLoading] = useState(true);

  const [outfitCount, setOutfitCount] = useState(0);

  /* =====================================================
     FIREBASE AUTH STATE
  ===================================================== */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  /* =====================================================
     FETCH WARDROBE
  ===================================================== */

  useEffect(() => {
    if (!user) return;

    const fetchWardrobe = async () => {
      try {
        setWardrobeLoading(true);

        const response = await axios.get(API_URL);

        const allItems = Array.isArray(response.data)
          ? response.data
          : [];

        const userItems = allItems.filter(
          (item) => item.userId === user.uid
        );

        setWardrobeItems(userItems);
      } catch (error) {
        console.error("Failed to load wardrobe:", error);
        setWardrobeItems([]);
      } finally {
        setWardrobeLoading(false);
      }
    };

    fetchWardrobe();
  }, [user]);

  /* =====================================================
     FETCH OUTFITS
  ===================================================== */

  useEffect(() => {
    if (!user) return;

    const fetchOutfits = async () => {
      try {
        const response = await axios.get(
          `${OUTFIT_API_URL}?userId=${user.uid}`
        );

        const outfits = Array.isArray(response.data)
          ? response.data
          : [];

        setOutfitCount(outfits.length);
      } catch (error) {
        console.error("Failed to load outfits:", error);
        setOutfitCount(0);
      }
    };

    fetchOutfits();
  }, [user]);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* =====================================================
     LOADING SCREEN
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

  /* =====================================================
     USER NAME
  ===================================================== */

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Fashion Lover";

  const firstName = 
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "User";

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  /* =====================================================
     LIVE COUNTS
  ===================================================== */

  const wardrobeCount = wardrobeItems.length;

  const favoriteCount = wardrobeItems.filter(
    (item) => item.favorite === true
  ).length;

  /*
    API returns newest items first.
    Show the latest 3 on the dashboard.
  */
  const recentItems = wardrobeItems.slice(0, 3);

  /* =====================================================
     DASHBOARD
  ===================================================== */

  return (
    <div className="dashboard-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          <img
            src="/wearwise-logo.png"
            alt="WearWise"
          />
        </div>

        <nav className="dashboard-nav">

          {/* DASHBOARD */}
          <button
            type="button"
            className="nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            <span className="nav-icon">
              <HomeIcon />
            </span>

            <span>Dashboard</span>
          </button>

          {/* WARDROBE */}
          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/wardrobe")}
          >
            <span className="nav-icon">
              <WardrobeIcon />
            </span>

            <span>Wardrobe</span>
          </button>

          {/* OUTFITS */}
          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/outfits")}
          >
            <span className="nav-icon">
              <OutfitIcon />
            </span>

            <span>Outfits</span>
          </button>

          {/* FAVORITES */}
          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/favorites")}
          >
            <span className="nav-icon">
              <HeartIcon />
            </span>

            <span>Favorites</span>
          </button>

          {/* PROFILE */}
          <button
            type="button"
            className="nav-item"
            onClick={() => navigate("/profile")}
          >
            <span className="nav-icon">
              <UserIcon />
            </span>

            <span>Profile</span>
          </button>

        </nav>

        {/* LOGOUT */}
        <div className="sidebar-bottom">
          <button
            type="button"
            className="nav-item logout-button"
            onClick={handleLogout}
          >
            <span className="nav-icon">
              <LogoutIcon />
            </span>

            <span>Log out</span>
          </button>
        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="dashboard-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="dashboard-header">

          <div>
            <p className="dashboard-small-title">
              YOUR PERSONAL STYLE SPACE
            </p>

            <h1>
              Hey, {firstName}
              <span className="wave">👋</span>
            </h1>

            <p className="dashboard-subtitle">
              Ready to create your next look?
            </p>
          </div>

          <div className="dashboard-header-right">

            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
            >
              <BellIcon />
              <span className="notification-dot"></span>
            </button>

            <button
              type="button"
              className="dashboard-avatar"
              onClick={() => navigate("/profile")}
            >
              {user?.photoURL ? (
                <img src={user.photoURL} 
                alt={displayName || "Profile"} />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </button>

          </div>

        </header>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="dashboard-stats">

          {/* WARDROBE */}
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">
                WARDROBE
              </span>

              <WardrobeIcon />
            </div>

            <h2>
              {wardrobeLoading ? "—" : wardrobeCount}
            </h2>

            <p>Items in your wardrobe</p>
          </div>

          {/* OUTFITS */}
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">
                OUTFITS
              </span>

              <OutfitIcon />
            </div>

            <h2>{outfitCount}</h2>

            <p>Looks you've created</p>
          </div>

          {/* FAVORITES */}
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-label">
                FAVORITES
              </span>

              <HeartIcon />
            </div>

            <h2>
              {wardrobeLoading ? "—" : favoriteCount}
            </h2>

            <p>Your favorite pieces</p>
          </div>

        </section>

        {/* =================================================
            YOUR COLLECTION
        ================================================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <p className="section-eyebrow">
                YOUR COLLECTION
              </p>

              <h2>Your wardrobe</h2>
            </div>

            <button
              type="button"
              className="view-all-button"
              onClick={() => navigate("/wardrobe")}
            >
              View all
              <ArrowIcon />
            </button>

          </div>

          {/* =================================================
              CLEAN WARDROBE PREVIEW
          ================================================= */}

          <div className="dashboard-wardrobe-grid">

            {wardrobeLoading ? (
              <>
                <div className="dashboard-wardrobe-card dashboard-card-loading"></div>
                <div className="dashboard-wardrobe-card dashboard-card-loading"></div>
                <div className="dashboard-wardrobe-card dashboard-card-loading"></div>
              </>
            ) : (
              <>
                {recentItems.map((item) => (
                  <button
                    type="button"
                    className="dashboard-wardrobe-card"
                    key={item._id}
                    onClick={() => navigate("/wardrobe")}
                  >

                    {/* IMAGE */}
                    <div className="dashboard-wardrobe-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <div className="dashboard-no-image">
                          No image
                        </div>
                      )}

                    </div>

                    {/* INFORMATION */}
                    <div className="dashboard-wardrobe-info">

                      <div>
                        <span className="dashboard-item-category">
                          {item.category}
                        </span>

                        <h3>{item.name}</h3>

                        <p>{item.type}</p>
                      </div>

                    </div>

                  </button>
                ))}

                {/* ADD NEW CARD */}
                <button
                  type="button"
                  className="dashboard-wardrobe-add"
                  onClick={() => navigate("/wardrobe")}
                >

                  <div className="dashboard-add-icon">
                    <PlusIcon />
                  </div>

                  <h3>Add something new</h3>

                  <p>Grow your wardrobe</p>

                </button>
              </>
            )}

          </div>

          {/* EMPTY WARDROBE */}
          {!wardrobeLoading &&
            recentItems.length === 0 && (
              <div className="dashboard-empty-wardrobe">

                <p>Your wardrobe is empty.</p>

                <button
                  type="button"
                  onClick={() => navigate("/wardrobe")}
                >
                  Add your first item
                  <ArrowIcon />
                </button>

              </div>
            )}

        </section>

        {/* =================================================
            STYLE BANNER
        ================================================= */}

        <section className="style-banner">

          <div className="style-banner-content">

            <span className="banner-tag">
              STYLE OF THE DAY
            </span>

            <h2>
              Your wardrobe.
              <br />
              Your rules.
            </h2>

            <p>
              Organize your clothes, discover
              new combinations and build looks
              that feel completely you.
            </p>

            <button
              type="button"
              className="banner-button"
              onClick={() => navigate("/outfits")}
            >
              Explore outfits
              <ArrowIcon />
            </button>

          </div>

          <div className="banner-decoration">
            <div className="decoration-circle circle-one"></div>
            <div className="decoration-circle circle-two"></div>
            <div className="decoration-circle circle-three"></div>
          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;