import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

const API_URL = "http://localhost:5000/api/wardrobe";
const OUTFIT_API_URL = "http://localhost:5000/api/outfits";

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

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" />
    </svg>
  );
}

/* =====================================================
   OUTFITS
===================================================== */

function Outfits() {
  const navigate = useNavigate();

  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [savedOutfits, setSavedOutfits] = useState([]);
  const [savedOutfitsLoading, setSavedOutfitsLoading] =
    useState(true);

  const [activeCategory, setActiveCategory] = useState("Tops");

  const [selectedOutfit, setSelectedOutfit] = useState({
    Tops: null,
    Bottoms: null,
    Shoes: null,
    Accessories: null,
  });

  const [outfitName, setOutfitName] =
    useState("Untitled Look");

  const [occasion, setOccasion] =
    useState("Casual");

  const [saved, setSaved] = useState(false);

  const carouselRef = useRef(null);

  const categories = [
    "Tops",
    "Bottoms",
    "Shoes",
    "Accessories",
  ];

  /* =====================================================
     LOAD WARDROBE
  ===================================================== */

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        setLoading(true);

        const response = await axios.get(API_URL);

        const items = Array.isArray(response.data)
          ? response.data
          : [];

        const currentUser = auth.currentUser;

        if (currentUser) {
          const userItems = items.filter(
            (item) =>
              item.userId === currentUser.uid
          );

          setWardrobeItems(userItems);
        } else {
          setWardrobeItems(items);
        }
      } catch (error) {
        console.error(
          "Failed to load wardrobe:",
          error
        );

        setWardrobeItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWardrobe();
  }, []);

  /* =====================================================
     LOAD SAVED OUTFITS
  ===================================================== */

  useEffect(() => {
    const fetchSavedOutfits = async () => {
      try {
        setSavedOutfitsLoading(true);

        const currentUser = auth.currentUser;

        if (!currentUser) {
          setSavedOutfits([]);
          return;
        }

        const response = await axios.get(
          `${OUTFIT_API_URL}?userId=${currentUser.uid}`
        );

        const outfits = Array.isArray(response.data)
          ? response.data
          : [];

        setSavedOutfits(outfits);
      } catch (error) {
        console.error(
          "Failed to load saved outfits:",
          error
        );

        setSavedOutfits([]);
      } finally {
        setSavedOutfitsLoading(false);
      }
    };

    fetchSavedOutfits();
  }, []);

  /* =====================================================
     CATEGORY ITEMS
  ===================================================== */

  const categoryItems = useMemo(() => {
    return wardrobeItems.filter(
      (item) =>
        item.category === activeCategory
    );
  }, [
    wardrobeItems,
    activeCategory,
  ]);

  /* =====================================================
     SELECT ITEM
  ===================================================== */

  const selectItem = (item) => {
    setSelectedOutfit((previous) => ({
      ...previous,
      [activeCategory]: item,
    }));

    setSaved(false);
  };

  /* =====================================================
     CAROUSEL
  ===================================================== */

  const scrollWardrobe = (direction) => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left:
        direction === "left"
          ? -320
          : 320,
      behavior: "smooth",
    });
  };

  /* =====================================================
     REMOVE ITEM FROM LOOK
  ===================================================== */

  const removeItem = (category) => {
    setSelectedOutfit((previous) => ({
      ...previous,
      [category]: null,
    }));

    setSaved(false);
  };

  /* =====================================================
     RESET OUTFIT
  ===================================================== */

  const resetOutfit = () => {
    setSelectedOutfit({
      Tops: null,
      Bottoms: null,
      Shoes: null,
      Accessories: null,
    });

    setOutfitName("Untitled Look");
    setOccasion("Casual");
    setSaved(false);
  };

  /* =====================================================
     SAVE OUTFIT TO MONGODB
  ===================================================== */

  const saveOutfit = async () => {
    const items = Object.values(
      selectedOutfit
    ).filter(Boolean);

    if (items.length === 0) {
      alert(
        "Add at least one item to your outfit."
      );
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const outfitData = {
        userId: currentUser.uid,

        name:
          outfitName.trim() ||
          "Untitled Look",

        occasion,

        items: {
          Tops:
            selectedOutfit.Tops || null,

          Bottoms:
            selectedOutfit.Bottoms || null,

          Shoes:
            selectedOutfit.Shoes || null,

          Accessories:
            selectedOutfit.Accessories || null,
        },
      };

      const response = await axios.post(
        OUTFIT_API_URL,
        outfitData
      );

      if (response.data?.item) {
        setSavedOutfits((previous) => [
          response.data.item,
          ...previous,
        ]);
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);

    } catch (error) {
      console.error(
        "Failed to save outfit:",
        error
      );

      alert(
        "Failed to save outfit. Make sure the server is running."
      );
    }
  };

  /* =====================================================
     DELETE SAVED OUTFIT
  ===================================================== */

  const deleteSavedOutfit = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this outfit?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${OUTFIT_API_URL}/${id}`
      );

      setSavedOutfits((previous) =>
        previous.filter(
          (outfit) =>
            outfit._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete outfit:",
        error
      );

      alert(
        "Failed to delete outfit."
      );
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
      console.error(error);
      navigate("/login");
    }
  };

  /* =====================================================
     SELECTED ITEMS
  ===================================================== */

  const selectedItems = [
    {
      category: "Tops",
      item: selectedOutfit.Tops,
    },
    {
      category: "Bottoms",
      item: selectedOutfit.Bottoms,
    },
    {
      category: "Shoes",
      item: selectedOutfit.Shoes,
    },
    {
      category: "Accessories",
      item: selectedOutfit.Accessories,
    },
  ];

  const selectedCount =
    selectedItems.filter(
      (entry) => entry.item
    ).length;

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
            className="ow-nav-item active"
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
            className="ow-nav-item"
            onClick={() =>
              navigate("/profile")
            }
          >
            <UserIcon />
            <span>Profile</span>
          </button>

        </nav>

        <button
          type="button"
          className="ow-nav-item ow-logout"
          onClick={handleLogout}
        >
          <LogoutIcon />
          <span>Log out</span>
        </button>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="ow-main">

        {/* HEADER */}

        <header className="ow-header">

          <div>

            <div className="ow-kicker">
              WEARWISE / OUTFIT STUDIO
            </div>

            <h1>
              Create your look.
            </h1>

            <p>
              Put together pieces from your
              wardrobe and make an outfit
              worth wearing.
            </p>

          </div>

          <button
            type="button"
            className="ow-new-button"
            onClick={resetOutfit}
          >
            <PlusIcon />
            New outfit
          </button>

        </header>

        {/* =================================================
            OUTFIT BOARD
        ================================================= */}

        <section className="ow-board">

          <div className="ow-board-top">

            <div>

              <span className="ow-board-label">
                CURRENT LOOK
              </span>

              <h2>
                {outfitName}
              </h2>

            </div>

            <div className="ow-board-meta">

              <span>
                {occasion}
              </span>

              <span>
                {selectedCount}{" "}
                {selectedCount === 1
                  ? "piece"
                  : "pieces"}
              </span>

            </div>

          </div>

          {/* SELECTED CLOTHES */}

          <div className="ow-look-grid">

            {selectedItems.map(
              ({ category, item }) => (

                <div
                  className={
                    item
                      ? "ow-look-card filled"
                      : "ow-look-card empty"
                  }
                  key={category}
                >

                  {item ? (

                    <>

                      <div className="ow-look-image">

                        <img
                          src={item.image}
                          alt={item.name}
                        />

                        <button
                          type="button"
                          className="ow-remove"
                          onClick={() =>
                            removeItem(
                              category
                            )
                          }
                        >
                          <XIcon />
                        </button>

                      </div>

                      <div className="ow-look-info">

                        <div>

                          <span>
                            {category}
                          </span>

                          <strong>
                            {item.name}
                          </strong>

                        </div>

                        <small>
                          {item.type}
                        </small>

                      </div>

                    </>

                  ) : (

                    <button
                      type="button"
                      className="ow-empty-button"
                      onClick={() =>
                        setActiveCategory(
                          category
                        )
                      }
                    >

                      <span className="ow-empty-plus">
                        +
                      </span>

                      <strong>
                        Add {category}
                      </strong>

                      <small>
                        Choose from wardrobe
                      </small>

                    </button>

                  )}

                </div>

              )
            )}

          </div>

          {/* BOARD FOOTER */}

          <div className="ow-board-footer">

            <div className="ow-name-control">

              <label htmlFor="ow-name">
                OUTFIT NAME
              </label>

              <input
                id="ow-name"
                type="text"
                value={outfitName}
                onChange={(event) => {
                  setOutfitName(
                    event.target.value
                  );
                  setSaved(false);
                }}
              />

            </div>

            <div className="ow-occasion-control">

              <label htmlFor="ow-occasion">
                OCCASION
              </label>

              <select
                id="ow-occasion"
                value={occasion}
                onChange={(event) => {
                  setOccasion(
                    event.target.value
                  );
                  setSaved(false);
                }}
              >
                <option>Casual</option>
                <option>College</option>
                <option>Everyday</option>
                <option>Streetwear</option>
                <option>Party</option>
                <option>Formal</option>
                <option>Date Night</option>
                <option>Sporty</option>
              </select>

            </div>

            <button
              type="button"
              className={
                saved
                  ? "ow-save saved"
                  : "ow-save"
              }
              onClick={saveOutfit}
            >

              <HeartIcon />

              {saved
                ? "Saved"
                : "Save outfit"}

            </button>

          </div>

        </section>

        {/* =================================================
            WARDROBE PICKER
        ================================================= */}

        <section className="ow-picker">

          <div className="ow-picker-header">

            <div>

              <div className="ow-picker-kicker">
                YOUR WARDROBE
              </div>

              <h2>
                Pick a piece
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/wardrobe")
              }
            >
              Manage wardrobe →
            </button>

          </div>

          {/* CATEGORY TABS */}

          <div className="ow-tabs">

            {categories.map(
              (category) => (

                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory ===
                    category
                      ? "ow-tab active"
                      : "ow-tab"
                  }
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                >

                  {category}

                  <span>
                    {
                      wardrobeItems.filter(
                        (item) =>
                          item.category ===
                          category
                      ).length
                    }
                  </span>

                </button>

              )
            )}

          </div>

          {/* FASHION CAROUSEL */}

          {loading ? (

            <div className="ow-loading">
              Loading your wardrobe...
            </div>

          ) : categoryItems.length === 0 ? (

            <div className="ow-no-items">

              <div>
                No{" "}
                {activeCategory.toLowerCase()}{" "}
                yet.
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/wardrobe")
                }
              >
                Add one to your wardrobe
              </button>

            </div>

          ) : (

            <div className="ow-carousel-wrapper">

              <button
                type="button"
                className="ow-carousel-arrow left"
                onClick={() =>
                  scrollWardrobe("left")
                }
                aria-label="Previous items"
              >
                ‹
              </button>

              <div
                className="ow-carousel"
                ref={carouselRef}
              >

                {categoryItems.map(
                  (item) => {

                    const isSelected =
                      selectedOutfit[
                        activeCategory
                      ]?._id ===
                      item._id;

                    return (

                      <button
                        type="button"
                        key={item._id}
                        className={
                          isSelected
                            ? "ow-fashion-card selected"
                            : "ow-fashion-card"
                        }
                        onClick={() =>
                          selectItem(item)
                        }
                      >

                        <div className="ow-fashion-image">

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                          {!isSelected && (
                            <div className="ow-add-overlay">

                              <div className="ow-add-circle">
                                +
                              </div>

                              <span>
                                Add to look
                              </span>

                            </div>
                          )}

                          {isSelected && (
                            <div className="ow-added-overlay">

                              <div className="ow-added-circle">
                                ✓
                              </div>

                              <span>
                                Added
                              </span>

                            </div>
                          )}

                        </div>

                        <div className="ow-fashion-info">

                          <div>

                            <strong>
                              {item.name}
                            </strong>

                            <span>
                              {item.type}
                            </span>

                          </div>

                          <div className="ow-fashion-color">
                            {item.color}
                          </div>

                        </div>

                      </button>

                    );
                  }
                )}

              </div>

              <button
                type="button"
                className="ow-carousel-arrow right"
                onClick={() =>
                  scrollWardrobe("right")
                }
                aria-label="Next items"
              >
                ›
              </button>

            </div>

          )}

        </section>

        {/* =================================================
            SAVED OUTFITS
        ================================================= */}

        <section className="saved-outfits-section">

          <div className="saved-outfits-heading">

            <div>

              <p className="saved-outfits-eyebrow">
                YOUR COLLECTION
              </p>

              <h2>
                Saved outfits
              </h2>

              <p className="saved-outfits-subtitle">
                Your favorite looks, all in
                one place.
              </p>

            </div>

            <span className="saved-outfits-count">
              {savedOutfits.length}{" "}
              {savedOutfits.length === 1
                ? "look"
                : "looks"}
            </span>

          </div>

          {savedOutfitsLoading ? (

            <div className="saved-outfits-loading">
              Loading your saved outfits...
            </div>

          ) : savedOutfits.length === 0 ? (

            <div className="saved-outfits-empty">

              <div className="saved-empty-icon">
                ✦
              </div>

              <h3>
                No saved outfits yet
              </h3>

              <p>
                Create an outfit above and
                save it here.
              </p>

            </div>

          ) : (

            <div className="saved-outfits-grid">

              {savedOutfits.map(
                (outfit) => {

                  const outfitItems = [
                    outfit.items?.Tops,
                    outfit.items?.Bottoms,
                    outfit.items?.Shoes,
                    outfit.items?.Accessories,
                  ].filter(Boolean);

                  return (

                    <div
                      className="saved-outfit-card"
                      key={outfit._id}
                    >

                      {/* OUTFIT IMAGES */}

                      <div className="saved-outfit-images">

                        {outfitItems
                          .slice(0, 4)
                          .map(
                            (item, index) => (

                              <div
                                className="saved-outfit-image"
                                key={
                                  item._id ||
                                  `${item.name}-${index}`
                                }
                              >

                                {item.image ? (

                                  <img
                                    src={item.image}
                                    alt={
                                      item.name
                                    }
                                  />

                                ) : (

                                  <div className="saved-outfit-no-image">
                                    {item.name}
                                  </div>

                                )}

                              </div>

                            )
                          )}

                      </div>

                      {/* OUTFIT INFORMATION */}

                      <div className="saved-outfit-info">

                        <div>

                          <span className="saved-outfit-occasion">
                            {outfit.occasion}
                          </span>

                          <h3>
                            {outfit.name}
                          </h3>

                        </div>

                        <button
                          type="button"
                          className="saved-outfit-delete"
                          onClick={() =>
                            deleteSavedOutfit(
                              outfit._id
                            )
                          }
                          aria-label="Delete outfit"
                        >
                          <XIcon />
                        </button>

                      </div>

                      {/* ITEMS */}

                      <div className="saved-outfit-items">

                        {Object.entries(
                          outfit.items || {}
                        )
                          .filter(
                            ([, item]) =>
                              item
                          )
                          .map(
                            ([
                              category,
                              item,
                            ]) => (

                              <span
                                key={
                                  category
                                }
                                className="saved-item-tag"
                              >
                                {item.name}
                              </span>

                            )
                          )}

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </section>

        {/* =================================================
            BOTTOM NOTE
        ================================================= */}

        <div className="ow-tip">

          <SparkleIcon />

          <span>
            Tip: Start with a top, then add
            a bottom and shoes to complete
            your look.
          </span>

        </div>

      </main>

    </div>
  );
}

export default Outfits;