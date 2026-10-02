import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

const API_URL = "http://localhost:5000/api/wardrobe";

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/sufrpmll/image/upload";

const CLOUDINARY_PRESET = "wearwise_unsigned";

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

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ow-nav-icon-svg">
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

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="wardrobe-plus-icon">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="wardrobe-search-icon">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="detail-icon">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="action-icon">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="action-icon">
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function HeartDetailIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`detail-heart-icon ${filled ? "filled" : ""}`}
    >
      <path d="M20.8 8.8c0 5.5-8.8 11-8.8 11s-8.8-5.5-8.8-11A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z" />
    </svg>
  );
}

/* =====================================================
   WARDROBE
===================================================== */

function Wardrobe() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* =====================================================
     FORM STATE
  ===================================================== */

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Tops");
  const [itemType, setItemType] = useState("T-Shirt");
  const [itemColor, setItemColor] = useState("Black");
  const [itemStyle, setItemStyle] = useState("Casual");

  const categories = [
    "All",
    "Tops",
    "Bottoms",
    "Shoes",
    "Accessories",
  ];

  /* =====================================================
     CURRENT USER
  ===================================================== */

  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "test-user-001";
  };

  /* =====================================================
     LOAD WARDROBE
  ===================================================== */

  const fetchWardrobe = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      const userId = getCurrentUserId();

      const userItems = response.data.filter(
        (item) => item.userId === userId
      );

      setWardrobeItems(userItems);
    } catch (error) {
      console.error("Failed to load wardrobe:", error);

      alert(
        "Unable to load your wardrobe. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardrobe();
  }, []);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredItems = wardrobeItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" ||
      item.category === activeCategory;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  /* =====================================================
     IMAGE UPLOAD
  ===================================================== */

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setImagePreview("");
    setImageFile(null);

    setItemName("");
    setItemCategory("Tops");
    setItemType("T-Shirt");
    setItemColor("Black");
    setItemStyle("Casual");
  };

  /* =====================================================
     OPEN ADD MODAL
  ===================================================== */

  const openAddModal = () => {
    resetForm();
    setShowAddItem(true);
  };

  /* =====================================================
     CLOSE ADD MODAL
  ===================================================== */

  const closeAddModal = () => {
    if (saving) return;

    setShowAddItem(false);
    resetForm();
  };

  /* =====================================================
     OPEN EDIT
  ===================================================== */

  const openEditModal = () => {
    if (!selectedItem) return;

    setItemName(selectedItem.name || "");
    setItemCategory(selectedItem.category || "Tops");
    setItemType(selectedItem.type || "T-Shirt");
    setItemColor(selectedItem.color || "Black");
    setItemStyle(selectedItem.style || "Casual");

    setImagePreview(selectedItem.image || "");
    setImageFile(null);

    setShowEditItem(true);
  };

  /* =====================================================
     CLOSE EDIT
  ===================================================== */

  const closeEditModal = () => {
    if (saving) return;

    setShowEditItem(false);
    resetForm();
  };

  /* =====================================================
     ADD ITEM
  ===================================================== */

  const handleAddItem = async (event) => {
    event.preventDefault();

    if (!imageFile) {
      alert("Please upload a clothing image.");
      return;
    }

    if (!itemName.trim()) {
      alert("Please enter an item name.");
      return;
    }

    try {
      setSaving(true);

      const userId = getCurrentUserId();

      /* Upload image to Cloudinary */

      const uploadData = new FormData();

      uploadData.append("file", imageFile);

      uploadData.append(
        "upload_preset",
        CLOUDINARY_PRESET
      );

      uploadData.append(
        "folder",
        `wearwise/${userId}`
      );

      const cloudinaryResponse = await axios.post(
        CLOUDINARY_URL,
        uploadData
      );

      const imageUrl =
        cloudinaryResponse.data.secure_url;

      /* Save item to MongoDB */

      const newItem = {
        userId,
        name: itemName.trim(),
        category: itemCategory,
        type: itemType,
        color: itemColor,
        style: itemStyle,
        image: imageUrl,
        favorite: false,
      };

      const response = await axios.post(
        API_URL,
        newItem
      );

      setWardrobeItems((previousItems) => [
        response.data.item,
        ...previousItems,
      ]);

      closeAddModal();

      setActiveCategory("All");
      setSearch("");
    } catch (error) {
      console.error("Failed to add item:", error);

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to add item."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     UPDATE ITEM
  ===================================================== */

  const handleUpdateItem = async (event) => {
    event.preventDefault();

    if (!selectedItem) return;

    if (!itemName.trim()) {
      alert("Please enter an item name.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = selectedItem.image;

      /* Upload new image only if selected */

      if (imageFile) {
        const uploadData = new FormData();

        uploadData.append("file", imageFile);

        uploadData.append(
          "upload_preset",
          CLOUDINARY_PRESET
        );

        uploadData.append(
          "folder",
          `wearwise/${getCurrentUserId()}`
        );

        const cloudinaryResponse =
          await axios.post(
            CLOUDINARY_URL,
            uploadData
          );

        imageUrl =
          cloudinaryResponse.data.secure_url;
      }

      const updatedData = {
        name: itemName.trim(),
        category: itemCategory,
        type: itemType,
        color: itemColor,
        style: itemStyle,
        image: imageUrl,
      };

      const response = await axios.put(
        `${API_URL}/${selectedItem._id}`,
        updatedData
      );

      const updatedItem = response.data.item;

      setWardrobeItems((previousItems) =>
        previousItems.map((item) =>
          item._id === updatedItem._id
            ? updatedItem
            : item
        )
      );

      setSelectedItem(updatedItem);

      setShowEditItem(false);

      resetForm();
    } catch (error) {
      console.error(
        "Failed to update item:",
        error
      );

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to update item."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     OPEN DELETE CONFIRMATION
  ===================================================== */

  const openDeleteConfirmation = () => {
    if (!selectedItem) return;

    setShowDeleteConfirm(true);
  };

  /* =====================================================
     DELETE ITEM
  ===================================================== */

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      setDeleting(true);

      await axios.delete(
        `${API_URL}/${selectedItem._id}`
      );

      setWardrobeItems((previousItems) =>
        previousItems.filter(
          (item) =>
            item._id !== selectedItem._id
        )
      );

      setSelectedItem(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error(
        "Failed to delete item:",
        error
      );

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to delete item."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =====================================================
     FAVORITE
  ===================================================== */

  const toggleFavorite = async (itemId) => {
    const item = wardrobeItems.find(
      (wardrobeItem) =>
        wardrobeItem._id === itemId
    );

    if (!item) return;

    const newFavoriteStatus = !item.favorite;

    try {
      const response = await axios.put(
        `${API_URL}/${itemId}`,
        {
          favorite: newFavoriteStatus,
        }
      );

      const updatedItem = response.data.item;

      setWardrobeItems((previousItems) =>
        previousItems.map((wardrobeItem) =>
          wardrobeItem._id === itemId
            ? updatedItem
            : wardrobeItem
        )
      );

      setSelectedItem((current) =>
        current?._id === itemId
          ? updatedItem
          : current
      );
    } catch (error) {
      console.error(
        "Failed to update favorite:",
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
     RENDER
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
            className="ow-nav-item active"
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

      <main className="wardrobe-main">

        <header className="wardrobe-header">

          <div>
            <p className="wardrobe-eyebrow">
              YOUR COLLECTION
            </p>

            <h1>
              My Wardrobe
            </h1>

            <p className="wardrobe-description">
              Everything you own, organized in one place.
            </p>
          </div>

          <button
            type="button"
            className="add-item-button"
            onClick={openAddModal}
          >
            <PlusIcon />
            Add Item
          </button>

        </header>

        {/* SEARCH */}

        <div className="wardrobe-toolbar">

          <div className="wardrobe-search">

            <SearchIcon />

            <input
              type="text"
              placeholder="Search your wardrobe..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <div className="wardrobe-count">
            {filteredItems.length} items
          </div>

        </div>

        {/* CATEGORIES */}

        <div className="wardrobe-categories">

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                activeCategory === category
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>
          ))}

        </div>

        {/* ITEMS */}

        <section className="wardrobe-items-grid">

          {loading ? (

            <div className="wardrobe-empty">

              <h2>
                Loading wardrobe...
              </h2>

              <p>
                Getting your clothes from MongoDB.
              </p>

            </div>

          ) : filteredItems.length > 0 ? (

            filteredItems.map((item, index) => {

              const isFavorite =
                item.favorite === true;

              return (
                <article
                  className="wardrobe-item"
                  key={item._id}
                  style={{
                    animationDelay:
                      `${index * 0.06}s`,
                  }}
                  onClick={() =>
                    setSelectedItem(item)
                  }
                >

                  <div className="wardrobe-item-image">

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

                    <button
                      type="button"
                      className={`item-heart ${
                        isFavorite
                          ? "favorite-active"
                          : ""
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(item._id);
                      }}
                    >
                      <HeartDetailIcon
                        filled={isFavorite}
                      />
                    </button>

                  </div>

                  <div className="wardrobe-item-info">

                    <div>

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.type}
                      </p>

                    </div>

                    <span>
                      {item.category}
                    </span>

                  </div>

                </article>
              );
            })

          ) : (

            <div className="wardrobe-empty">

              <h2>
                Nothing found
              </h2>

              <p>
                Try another search or category.
              </p>

            </div>

          )}

        </section>

      </main>

      {/* =================================================
          ITEM DETAIL MODAL
      ================================================= */}

      {selectedItem &&
        !showEditItem &&
        !showDeleteConfirm && (

        <div
          className="wardrobe-detail-overlay"
          onClick={() =>
            setSelectedItem(null)
          }
        >

          <div
            className="wardrobe-detail-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="wardrobe-detail-image">

              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                />
              ) : (
                <div className="favorite-no-image">
                  No image
                </div>
              )}

              <div className="wardrobe-detail-gradient"></div>

              {/* CLOSE */}

              <button
                type="button"
                className="detail-close-button"
                onClick={() =>
                  setSelectedItem(null)
                }
              >
                <CloseIcon />
              </button>

              {/* FAVORITE */}

              <button
                type="button"
                className={`detail-favorite-button ${
                  selectedItem.favorite
                    ? "favorite-active"
                    : ""
                }`}
                onClick={() =>
                  toggleFavorite(
                    selectedItem._id
                  )
                }
              >
                <HeartDetailIcon
                  filled={selectedItem.favorite}
                />
              </button>

              <div className="wardrobe-detail-content">

                <span className="detail-category">
                  {selectedItem.category}
                </span>

                <h2>
                  {selectedItem.name}
                </h2>

                <p>
                  {selectedItem.type}
                </p>

                <div className="detail-tags">

                  <span>
                    {selectedItem.color}
                  </span>

                  <span>
                    {selectedItem.style}
                  </span>

                  <span>
                    WearWise
                  </span>

                </div>

                {/* ACTIONS */}

                <div className="detail-actions">

                  <button
                    type="button"
                    className="detail-edit-button"
                    onClick={openEditModal}
                  >
                    <EditIcon />
                    Edit Item
                  </button>

                  <button
                    type="button"
                    className="detail-delete-button"
                    onClick={openDeleteConfirmation}
                  >
                    <TrashIcon />
                    Delete
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          ADD ITEM MODAL
      ================================================= */}

      {showAddItem && (

        <div
          className="add-item-overlay"
          onClick={closeAddModal}
        >

          <div
            className="add-item-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="add-item-modal-header">

              <div>

                <p className="add-item-eyebrow">
                  NEW PIECE
                </p>

                <h2>
                  Add to your wardrobe
                </h2>

                <p>
                  Add a piece and make it part
                  of your personal collection.
                </p>

              </div>

              <button
                type="button"
                className="add-modal-close"
                onClick={closeAddModal}
                disabled={saving}
              >
                <CloseIcon />
              </button>

            </div>

            <div className="add-item-modal-scroll">

              <form
                className="add-item-form"
                onSubmit={handleAddItem}
              >

                <div className="upload-section">

                  <div className="upload-preview">

                    {imagePreview ? (

                      <>
                        <img
                          src={imagePreview}
                          alt="Clothing preview"
                        />

                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={() => {
                            setImagePreview("");
                            setImageFile(null);
                          }}
                          disabled={saving}
                        >
                          <CloseIcon />
                        </button>
                      </>

                    ) : (

                      <label className="upload-empty">

                        <PlusIcon />

                        <strong>
                          Upload clothing photo
                        </strong>

                        <span>
                          Click to choose an image
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          hidden
                        />

                      </label>

                    )}

                  </div>

                </div>

                <div className="form-field">

                  <label>
                    Item Name
                  </label>

                  <input
                    value={itemName}
                    onChange={(event) =>
                      setItemName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. White Sneakers"
                    disabled={saving}
                  />

                </div>

                <div className="form-row">

                  <div className="form-field">

                    <label>
                      Category
                    </label>

                    <select
                      value={itemCategory}
                      onChange={(event) => {

                        const category =
                          event.target.value;

                        setItemCategory(category);

                        if (category === "Tops") {
                          setItemType("T-Shirt");
                        }

                        if (category === "Bottoms") {
                          setItemType("Jeans");
                        }

                        if (category === "Shoes") {
                          setItemType("Sneakers");
                        }

                        if (
                          category === "Accessories"
                        ) {
                          setItemType("Watch");
                        }

                      }}
                      disabled={saving}
                    >
                      <option>Tops</option>
                      <option>Bottoms</option>
                      <option>Shoes</option>
                      <option>Accessories</option>
                    </select>

                  </div>

                  <div className="form-field">

                    <label>
                      Type
                    </label>

                    <select
                      value={itemType}
                      onChange={(event) =>
                        setItemType(
                          event.target.value
                        )
                      }
                      disabled={saving}
                    >
                      <option>T-Shirt</option>
                      <option>Shirt</option>
                      <option>Hoodie</option>
                      <option>Jacket</option>
                      <option>Sweater</option>
                      <option>Jeans</option>
                      <option>Pants</option>
                      <option>Shorts</option>
                      <option>Sneakers</option>
                      <option>Boots</option>
                      <option>Sandals</option>
                      <option>Watch</option>
                      <option>Bag</option>
                      <option>Cap</option>
                      <option>Other</option>
                    </select>

                  </div>

                </div>

                <div className="form-row">

                  <div className="form-field">

                    <label>
                      Color
                    </label>

                    <input
                      value={itemColor}
                      onChange={(event) =>
                        setItemColor(
                          event.target.value
                        )
                      }
                      placeholder="Black"
                      disabled={saving}
                    />

                  </div>

                  <div className="form-field">

                    <label>
                      Style
                    </label>

                    <select
                      value={itemStyle}
                      onChange={(event) =>
                        setItemStyle(
                          event.target.value
                        )
                      }
                      disabled={saving}
                    >
                      <option>Casual</option>
                      <option>Streetwear</option>
                      <option>Formal</option>
                      <option>Minimal</option>
                      <option>Sporty</option>
                      <option>Party</option>
                    </select>

                  </div>

                </div>

                <button
                  type="submit"
                  className="save-item-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Item"}
                </button>

              </form>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          EDIT ITEM MODAL
      ================================================= */}

      {showEditItem && selectedItem && (

        <div
          className="add-item-overlay"
          onClick={closeEditModal}
        >

          <div
            className="add-item-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="add-item-modal-header">

              <div>

                <p className="add-item-eyebrow">
                  UPDATE PIECE
                </p>

                <h2>
                  Edit your item
                </h2>

                <p>
                  Update the details of this
                  wardrobe piece.
                </p>

              </div>

              <button
                type="button"
                className="add-modal-close"
                onClick={closeEditModal}
                disabled={saving}
              >
                <CloseIcon />
              </button>

            </div>

            <div className="add-item-modal-scroll">

              <form
                className="add-item-form"
                onSubmit={handleUpdateItem}
              >

                <div className="upload-section">

                  <div className="upload-preview">

                    {imagePreview ? (

                      <>
                        <img
                          src={imagePreview}
                          alt="Clothing preview"
                        />

                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={() => {
                            setImagePreview("");
                            setImageFile(null);
                          }}
                          disabled={saving}
                        >
                          <CloseIcon />
                        </button>
                      </>

                    ) : (

                      <label className="upload-empty">

                        <PlusIcon />

                        <strong>
                          Change clothing photo
                        </strong>

                        <span>
                          Click to choose an image
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          hidden
                        />

                      </label>

                    )}

                  </div>

                </div>

                <div className="form-field">

                  <label>
                    Item Name
                  </label>

                  <input
                    value={itemName}
                    onChange={(event) =>
                      setItemName(
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />

                </div>

                <div className="form-row">

                  <div className="form-field">

                    <label>
                      Category
                    </label>

                    <select
                      value={itemCategory}
                      onChange={(event) =>
                        setItemCategory(
                          event.target.value
                        )
                      }
                      disabled={saving}
                    >
                      <option>Tops</option>
                      <option>Bottoms</option>
                      <option>Shoes</option>
                      <option>Accessories</option>
                    </select>

                  </div>

                  <div className="form-field">

                    <label>
                      Type
                    </label>

                    <select
                      value={itemType}
                      onChange={(event) =>
                        setItemType(
                          event.target.value
                        )
                      }
                      disabled={saving}
                    >
                      <option>T-Shirt</option>
                      <option>Shirt</option>
                      <option>Hoodie</option>
                      <option>Jacket</option>
                      <option>Sweater</option>
                      <option>Jeans</option>
                      <option>Pants</option>
                      <option>Shorts</option>
                      <option>Sneakers</option>
                      <option>Boots</option>
                      <option>Sandals</option>
                      <option>Watch</option>
                      <option>Bag</option>
                      <option>Cap</option>
                      <option>Other</option>
                    </select>

                  </div>

                </div>

                <div className="form-row">

                  <div className="form-field">

                    <label>
                      Color
                    </label>

                    <input
                      value={itemColor}
                      onChange={(event) =>
                        setItemColor(
                          event.target.value
                        )
                      }
                      disabled={saving}
                    />

                  </div>

                  <div className="form-field">

                    <label>
                      Style
                    </label>

                    <select
                      value={itemStyle}
                      onChange={(event) =>
                        setItemStyle(
                          event.target.value
                        )
                      }
                      disabled={saving}
                    >
                      <option>Casual</option>
                      <option>Streetwear</option>
                      <option>Formal</option>
                      <option>Minimal</option>
                      <option>Sporty</option>
                      <option>Party</option>
                    </select>

                  </div>

                </div>

                <button
                  type="submit"
                  className="save-item-button"
                  disabled={saving}
                >
                  {saving
                    ? "Updating..."
                    : "Update Item"}
                </button>

              </form>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

      {showDeleteConfirm && selectedItem && (

        <div
          className="delete-confirm-overlay"
          onClick={() =>
            !deleting &&
            setShowDeleteConfirm(false)
          }
        >

          <div
            className="delete-confirm-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="delete-icon-circle">
              <TrashIcon />
            </div>

            <h2>
              Delete Item?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                "{selectedItem.name}"
              </strong>
              ?
              <br />
              This action cannot be undone.
            </p>

            <div className="delete-confirm-actions">

              <button
                type="button"
                className="delete-cancel-button"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={handleDeleteItem}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Wardrobe;