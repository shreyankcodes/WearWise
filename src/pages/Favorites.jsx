import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

const API_URL = `${import.meta.env.VITE_API_URL}/api/wardrobe`;

/* =====================================================
   ICONS
===================================================== */

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ow-nav-icon-svg">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function WardrobeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ow-nav-icon-svg">
      <path d="M8 4h8" />
      <path d="M9 4v3l-5 3v10h16V10l-5-3V4" />
      <path d="M9 7c1.2 1.5 4.8 1.5 6 0" />
    </svg>
  );
}

function OutfitIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ow-nav-icon-svg">
      <path d="M12 3l1.5 4L17 8.5 13.5 10 12 14l-1.5-4L7 8.5 10.5 7 12 3Z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
    </svg>
  );
}

function HeartIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`ow-nav-icon-svg ${
        filled ? "favorite-heart-filled" : ""
      }`}
    >
      <path d="M20.8 8.8c0 5.5-8.8 11-8.8 11s-8.8-5.5-8.8-11A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ow-nav-icon-svg">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ow-nav-icon-svg">
      <path d="M10 5H5v14h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="favorites-arrow-icon"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/* =====================================================
   FAVORITES
===================================================== */

function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD FAVORITES
  ===================================================== */

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          navigate("/login");
          return;
        }

        const response = await axios.get(API_URL);

        const allItems = Array.isArray(response.data)
          ? response.data
          : [];

        const userFavorites = allItems.filter(
          (item) =>
            item.userId === currentUser.uid &&
            item.favorite === true
        );

        setFavorites(userFavorites);
      } catch (error) {
        console.error(
          "Failed to load favorites:",
          error
        );

        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  /* =====================================================
     REMOVE FAVORITE
  ===================================================== */

  const removeFavorite = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        favorite: false,
      });

      setFavorites((previous) =>
        previous.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove favorite:",
        error
      );

      alert("Failed to update favorite.");
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    try {
      await auth.signOut();
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
            className="ow-nav-item active"
            onClick={() =>
              navigate("/favorites")
            }
          >
            <HeartIcon />
            <span>Favorites</span>
          </button>

          <button
            type="button"
            className="ow-nav-item"
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

      <main className="favorites-main">

        {/* HEADER */}

        <header className="favorites-header">

          <div>

            <p className="favorites-kicker">
              YOUR COLLECTION
            </p>

            <h1>Favorites</h1>

            <p>
              The pieces you love most,
              all in one place.
            </p>

          </div>

          <div className="favorites-count">

            <HeartIcon filled />

            <span>
              {favorites.length}
            </span>

          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        {loading ? (

          <div className="favorites-loading">
            Loading your favorites...
          </div>

        ) : favorites.length === 0 ? (

          <div className="favorites-empty">

            <div className="favorites-empty-icon">
              <HeartIcon />
            </div>

            <h2>
              No favorites yet
            </h2>

            <p>
              Tap the heart on items in your
              wardrobe to save them here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/wardrobe")
              }
            >
              Go to wardrobe
              <ArrowIcon />
            </button>

          </div>

        ) : (

          <div className="favorites-grid">

            {favorites.map((item) => (

              <article
                className="favorite-card"
                key={item._id}
              >

                {/* IMAGE */}

                <div className="favorite-card-image">

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  ) : (

                    <div className="favorite-no-image">
                      No image
                    </div>

                  )}

                  {/* REMOVE FAVORITE */}

                  <button
                    type="button"
                    className="favorite-remove"
                    onClick={() =>
                      removeFavorite(
                        item._id
                      )
                    }
                    aria-label="Remove from favorites"
                  >
                    <HeartIcon filled />
                  </button>

                  {/* CATEGORY */}

                  <div className="favorite-category">
                    {item.category}
                  </div>

                </div>

                {/* INFORMATION */}

                <div className="favorite-card-info">

                  <div className="favorite-primary-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.type}
                    </p>

                  </div>

                  <span className="favorite-color">
                    {item.color}
                  </span>

                </div>

                {/* FOOTER */}

                <div className="favorite-card-footer">

                  <span>
                    {item.style}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/wardrobe")
                    }
                  >
                    View wardrobe
                    <ArrowIcon />
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Favorites;