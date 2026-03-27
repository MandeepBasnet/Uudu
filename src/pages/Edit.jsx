import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";
import {
  account,
  databases,
  storage,
  appwriteConfig,
  ID,
  Query,
} from "../lib/appwrite";
import localRamenData from "../data/updatedRamen.json";
import localToppingsData from "../data/updatedToppings.json";
import { assignDisplayIds } from "../hooks/useRamenData";
import { assignToppingDisplayIds } from "../hooks/useToppingsData";

// Helper to check if a string is a valid ID for Appwrite (alphanumeric, -, _, .)
const isValidId = (str) => /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(str);

const Edit = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("ramen"); // 'ramen' | 'toppings'

  // Generic List State
  const [itemsList, setItemsList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [originalItem, setOriginalItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // For initializing DB
  const [initStatus, setInitStatus] = useState("");

  // Crop Modal State
  const [cropModal, setCropModal] = useState({ open: false, src: null, file: null });
  const [cropAspect, setCropAspect] = useState(null); // null = free, number = ratio
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Shuffle Mode State
  const [sortOrder, setSortOrder] = useState(null);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [shuffleList, setShuffleList] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);

  // Business Hours State
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [businessHours, setBusinessHours] = useState({
    day1: "Mon – Thu",
    hours1: "11:00 AM – 9:00 PM",
    day2: "Fri – Sat",
    hours2: "11:00 AM – 10:00 PM",
    day3: "Sun",
    hours3: "12:00 PM – 8:00 PM",
  });
  const [originalBusinessHours, setOriginalBusinessHours] = useState(null);
  const [savingHours, setSavingHours] = useState(false);

  // --- Helpers ---

  const getCollectionId = (tab) => {
    return tab === "ramen"
      ? appwriteConfig.collectionId
      : appwriteConfig.toppingsCollectionId;
  };

  const hasChanges = () => {
    if (!selectedItem || !originalItem) return false;
    return JSON.stringify(selectedItem) !== JSON.stringify(originalItem);
  };

  const hasHoursChanges = () => {
    if (!originalBusinessHours) return false;
    return (
      JSON.stringify(businessHours) !== JSON.stringify(originalBusinessHours)
    );
  };

  // --- Effects ---

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchItems(activeTab);
      setSelectedItem(null);
      setOriginalItem(null);
      setMessage({ type: "", text: "" });
      setInitStatus("");
      setShuffleMode(false);
      setShuffleList([]);
    }
  }, [activeTab, user]);

  // --- Auth & Data Fetching ---

  const checkAuth = async () => {
    try {
      const isSessionActive = sessionStorage.getItem("uudu_admin_session");
      if (!isSessionActive) {
        try {
          await account.deleteSession("current");
        } catch (e) {}
        throw new Error("Session expired");
      }
      const userData = await account.get();
      setUser(userData);
      // fetchItems called via useEffect when user is set
    } catch (err) {
      navigate("/login");
    }
  };

  const fetchItems = async (tab) => {
    setLoading(true);
    try {
      const collectionId = getCollectionId(tab);
      console.log("Fetching from:", tab, "collectionId:", collectionId);
      if (!appwriteConfig.dbId || !collectionId) {
        console.warn("Missing config:", {
          dbId: appwriteConfig.dbId,
          collectionId,
        });
        setLoading(false);
        return;
      }

      const response = await databases.listDocuments(
        appwriteConfig.dbId,
        collectionId,
        [Query.limit(100)],
      );

      console.log("Response documents count:", response.documents.length);
      console.log("First document:", response.documents[0]);

      // Extract sort order metadata before filtering
      const sortOrderDoc = response.documents.find(
        (doc) => doc.id === "metadata_sort_order",
      );
      let fetchedSortOrder = null;
      if (sortOrderDoc?.description) {
        try {
          fetchedSortOrder = JSON.parse(sortOrderDoc.description);
        } catch (e) {}
      }
      setSortOrder(fetchedSortOrder);

      // Sort by ID naturally
      const sorted = response.documents
        .filter((doc) => !doc.id.startsWith("metadata_"))
        .sort((a, b) => a.id.localeCompare(b.id));
      console.log("Sorted list after filter:", sorted.length, "items");

      // For ramen: compute display_ids and sort available first, unavailable at bottom
      if (tab === "ramen") {
        const withDisplayIds = assignDisplayIds(sorted, fetchedSortOrder);
        withDisplayIds.sort((a, b) => {
          const aUnavail = a.display_id === null;
          const bUnavail = b.display_id === null;
          if (aUnavail && !bUnavail) return 1;
          if (!aUnavail && bUnavail) return -1;
          if (!aUnavail && !bUnavail)
            return a.display_id.localeCompare(b.display_id);
          return a.id.localeCompare(b.id);
        });
        setItemsList(withDisplayIds);
      } else {
        const withDisplayIds = assignToppingDisplayIds(sorted, fetchedSortOrder);
        withDisplayIds.sort((a, b) => {
          const aUnavail = a.display_id === null;
          const bUnavail = b.display_id === null;
          if (aUnavail && !bUnavail) return 1;
          if (!aUnavail && bUnavail) return -1;
          if (!aUnavail && !bUnavail)
            return a.display_id.localeCompare(b.display_id);
          return a.id.localeCompare(b.id);
        });
        setItemsList(withDisplayIds);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessHours = async () => {
    try {
      const response = await databases.getDocument(
        appwriteConfig.dbId,
        appwriteConfig.collectionId, // Metadata kept in ramen collection for simplicity
        "metadata_location",
      );
      if (response.description) {
        const parsed = JSON.parse(response.description);
        setBusinessHours(parsed);
        setOriginalBusinessHours(parsed);
      } else {
        setOriginalBusinessHours(businessHours);
      }
    } catch (err) {
      setOriginalBusinessHours(businessHours);
    }
  };

  // --- Handlers ---

  const handleSelect = (item) => {
    let cleanItem = { ...item };

    // Parse fields if needed (e.g. videos for ramen)
    if (activeTab === "ramen" && cleanItem.suggested_videos) {
      if (typeof cleanItem.suggested_videos === "string") {
        try {
          cleanItem.suggested_videos = JSON.parse(cleanItem.suggested_videos);
        } catch (e) {
          cleanItem.suggested_videos = [];
        }
      }
    }

    setSelectedItem(cleanItem);
    setOriginalItem(cleanItem);
    setMessage({ type: "", text: "" });
  };

  const handleChange = (field, value) => {
    setSelectedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await account.deleteSession("current");
    navigate("/login");
  };

  // --- Save Logic ---

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      let payload = { ...selectedItem };

      if (activeTab === "ramen") {
        payload.suggested_videos =
          typeof payload.suggested_videos === "object"
            ? JSON.stringify(payload.suggested_videos)
            : payload.suggested_videos;

        // Cleanup deletions
        delete payload.cooker_menu;
        delete payload.cooker_settings;
        delete payload.allergen;
      } else {
        // Toppings specific cleanup if any
      }

      // Remove system attributes and computed-only fields not stored in DB
      const cleanPayload = {};
      const excludedKeys = new Set(["display_id", "_isNew"]);
      Object.keys(payload).forEach((key) => {
        if (!key.startsWith("$") && !excludedKeys.has(key)) {
          cleanPayload[key] = payload[key];
        }
      });

      await databases.updateDocument(
        appwriteConfig.dbId,
        getCollectionId(activeTab),
        selectedItem.$id,
        cleanPayload,
      );

      setMessage({ type: "success", text: "Saved successfully!" });
      setItemsList((prev) => {
        const updated = prev.map((item) =>
          item.$id === selectedItem.$id ? { ...item, ...cleanPayload } : item,
        );
        if (activeTab === "ramen") {
          const withDisplayIds = assignDisplayIds(updated, sortOrder);
          withDisplayIds.sort((a, b) => {
            const aUnavail = a.display_id === null;
            const bUnavail = b.display_id === null;
            if (aUnavail && !bUnavail) return 1;
            if (!aUnavail && bUnavail) return -1;
            if (!aUnavail && !bUnavail)
              return a.display_id.localeCompare(b.display_id);
            return a.id.localeCompare(b.id);
          });
          return withDisplayIds;
        }
        // toppings
        const withDisplayIds = assignToppingDisplayIds(updated, sortOrder);
        withDisplayIds.sort((a, b) => {
          const aUnavail = a.display_id === null;
          const bUnavail = b.display_id === null;
          if (aUnavail && !bUnavail) return 1;
          if (!aUnavail && bUnavail) return -1;
          if (!aUnavail && !bUnavail)
            return a.display_id.localeCompare(b.display_id);
          return a.id.localeCompare(b.id);
        });
        return withDisplayIds;
      });
      setOriginalItem(selectedItem); // Update original to new state
    } catch (err) {
      console.error("Save failed", err);
      setMessage({
        type: "error",
        text: "Failed to save changes. " + err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHours = async (e) => {
    e.preventDefault();
    setSavingHours(true);
    try {
      const payload = {
        id: "metadata_location",
        name: "Location Metadata",
        status: "available",
        type: "Soup",
        country: "Other Asia",
        description: JSON.stringify(businessHours),
        image_url: "placeholder",
        price_packet: 0,
        price_bowl: 0,
        spiciness: "None",
        menu: "None",
      };

      const metaCollectionId = appwriteConfig.collectionId; // Always use ramen collection for metadata

      try {
        await databases.updateDocument(
          appwriteConfig.dbId,
          metaCollectionId,
          "metadata_location",
          payload,
        );
      } catch (err) {
        if (err.code === 404) {
          await databases.createDocument(
            appwriteConfig.dbId,
            metaCollectionId,
            "metadata_location",
            payload,
          );
        } else {
          throw err;
        }
      }
      setShowHoursModal(false);
      setMessage({ type: "success", text: "Business Hours updated!" });
    } catch (err) {
      alert("Failed to save hours: " + err.message);
    } finally {
      setSavingHours(false);
    }
  };

  // Shared upload logic used by both "upload original" and "crop & upload"
  const doUploadFile = useCallback(async (file) => {
    setSaving(true);
    try {
      const response = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        file,
      );
      const fileUrl = storage.getFileView(appwriteConfig.bucketId, response.$id);
      const finalUrl =
        fileUrl && typeof fileUrl === "object" && "href" in fileUrl
          ? fileUrl.href
          : fileUrl;
      setSelectedItem((prev) => ({ ...prev, image_url: finalUrl }));
      setMessage({ type: "success", text: "Image uploaded! Remember to Save." });
    } catch (err) {
      console.error("Upload failed", err);
      setMessage({ type: "error", text: "Image upload failed. " + err.message });
    } finally {
      setSaving(false);
    }
  }, []);

  // Opens the crop modal instead of uploading immediately
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropModal({ open: true, src: ev.target.result, file });
      setCropAspect(null);
      setCropZoom(1);
      setCropPosition({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    };
    reader.readAsDataURL(file);
  };

  // Reads the pixel region from react-easy-crop, draws it on a canvas, uploads.
  // Handles zoom-out: empty space outside the image is filled with white.
  const handleCropAndUpload = async () => {
    if (!croppedAreaPixels || !cropModal.src) return;
    const { x, y, width, height } = croppedAreaPixels;

    const image = new Image();
    image.src = cropModal.src;
    await new Promise((res) => { image.onload = res; });

    const maxDim = 1400;
    const outScale = Math.min(1, maxDim / Math.max(width, height));
    const canvasW = Math.round(width * outScale);
    const canvasH = Math.round(height * outScale);

    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d");

    // Canvas is transparent by default — no fill needed

    // Intersection of crop area with actual image bounds
    const srcX = Math.max(0, x);
    const srcY = Math.max(0, y);
    const srcRight = Math.min(image.naturalWidth, x + width);
    const srcBottom = Math.min(image.naturalHeight, y + height);
    const srcW = srcRight - srcX;
    const srcH = srcBottom - srcY;

    if (srcW > 0 && srcH > 0) {
      const dstX = ((srcX - x) / width) * canvasW;
      const dstY = ((srcY - y) / height) * canvasH;
      const dstW = (srcW / width) * canvasW;
      const dstH = (srcH / height) * canvasH;
      ctx.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    }

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], cropModal.file.name, { type: "image/png" });
      setCropModal({ open: false, src: null, file: null });
      await doUploadFile(croppedFile);
    }, "image/png");
  };

  // --- Migration Logic ---

  const handleInitialMigration = async () => {
    const collectionName = activeTab === "ramen" ? "Ramen" : "Toppings";
    if (
      !window.confirm(
        `This will attempt to upload all local ${collectionName} JSON data to Appwrite. Continue?`,
      )
    )
      return;

    setInitStatus("Starting migration...");
    let successCount = 0;
    let failCount = 0;

    const sourceData =
      activeTab === "ramen" ? localRamenData.ramen : localToppingsData.toppings;
    const targetCollectionId = getCollectionId(activeTab);

    for (const item of sourceData) {
      try {
        // Common payload construction
        const payload = { ...item };

        // Specific Adjustments
        if (activeTab === "ramen") {
          payload.suggested_videos = JSON.stringify(item.suggested_videos);
          delete payload.cooker_menu;
          delete payload.cooker_settings;
        } else {
          // For Toppings
          // ID is already cleaned to 'Txx' format in the JSON file by script
          // Ensure price is number
          payload.price = parseFloat(item.price);
        }

        // Remove ID from payload body if you want, but Appwrite usually ignores it if passed as docId separation
        // We will use item.id as the document ID
        const docId = item.id;

        // Note: If Appwrite schemas are strict, we must ensure payload matches exactly.
        // We'll try to send everything and rely on Appwrite to ignore extras if configured, or we should be precise.

        await databases.createDocument(
          appwriteConfig.dbId,
          targetCollectionId,
          docId,
          payload,
        );
        successCount++;
        setInitStatus(`Migrated ${item.id}...`);
      } catch (err) {
        console.error(`Failed to migrate ${item.id}`, err);
        failCount++;
        if (err.code === 409) {
          successCount++;
        } else {
          if (failCount === 1) {
            setInitStatus(`Failed on ${item.id}: ${err.message}`);
          }
        }
      }
    }

    if (failCount > 0) {
      setInitStatus((prev) => `${prev} | Finished with ${failCount} errors.`);
    } else {
      setInitStatus(
        `Migration Done based on ${collectionName} JSON. Success: ${successCount}`,
      );
    }
    fetchItems();
  };

  // --- Shuffle Mode Helpers & Handlers ---

  // Compute live preview N-numbers for the current shuffle list order.
  const getShufflePreviewIds = (list) => {
    const prefix = activeTab === "ramen" ? "N" : "T";
    const map = new Map();
    let counter = 1;
    for (const item of list) {
      const isUnavailable =
        item.status === "coming_soon" || item.status === "out_of_stock";
      if (isUnavailable || counter > 30) {
        map.set(item.id, null);
      } else {
        map.set(item.id, `${prefix}${String(counter).padStart(2, "0")}`);
        counter++;
      }
    }
    return map;
  };

  const enterShuffleMode = () => {
    // Available items first (in current slot order), unavailable at the bottom
    const available = itemsList.filter(
      (item) => item.status !== "coming_soon" && item.status !== "out_of_stock"
    );
    const unavailable = itemsList.filter(
      (item) => item.status === "coming_soon" || item.status === "out_of_stock"
    );
    setShuffleList([...available, ...unavailable]);
    setShuffleMode(true);
  };

  const exitShuffleMode = () => {
    setShuffleMode(false);
    setShuffleList([]);
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleAddBlankTemplate = () => {
    // Auto-generate a unique internal ID — the user never needs to manage this.
    // The N-number slot is determined by position in the shuffle list, not this ID.
    const prefix = activeTab === "ramen" ? "NEW" : "TNEW";
    let newId = `${prefix}${Date.now()}`;
    while (shuffleList.some((item) => item.id === newId)) {
      newId = `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
    const trimmed = newId;
    const blankItem =
      activeTab === "ramen"
        ? {
            id: trimmed,
            $id: trimmed,
            name: "(New Noodle)",
            status: "available",
            type: "Soup",
            country: "S. Korea",
            description: "",
            price_packet: 0,
            price_bowl: 0,
            spiciness: "5 out of 10 flames",
            menu: "Menu 1",
            manufacturer_url: "",
            suggested_toppings: "",
            suggested_videos: "[]",
            image_url: "",
            display_id: null,
            _isNew: true,
          }
        : {
            id: trimmed,
            $id: trimmed,
            name: "(New Topping)",
            status: "available",
            category: "Veggies",
            description: "",
            price: 0,
            spiciness: "1 out of 10 flames",
            image_url: "",
            display_id: null,
            _isNew: true,
          };
    setShuffleList((prev) => [...prev, blankItem]);
  };

  const handleDragStart = (e, itemId) => {
    setDraggingId(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, itemId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (itemId !== draggingId) setDragOverId(itemId);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;
    setShuffleList((prev) => {
      const list = [...prev];
      const fromIdx = list.findIndex((item) => item.id === draggingId);
      const toIdx = list.findIndex((item) => item.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return list;
    });
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const metaCollectionId = getCollectionId(activeTab);

      // Step 1: Create any new (_isNew) items in Appwrite
      for (const item of shuffleList.filter((i) => i._isNew)) {
        const payload =
          activeTab === "ramen"
            ? {
                id: item.id,
                name: item.name,
                status: item.status,
                type: item.type,
                country: item.country,
                description: item.description,
                price_packet: item.price_packet,
                price_bowl: item.price_bowl,
                spiciness: item.spiciness,
                menu: item.menu,
                manufacturer_url: item.manufacturer_url,
                suggested_toppings: item.suggested_toppings,
                suggested_videos: item.suggested_videos,
                image_url: item.image_url,
              }
            : {
                id: item.id,
                name: item.name,
                status: item.status,
                category: item.category,
                description: item.description,
                price: item.price,
                spiciness: item.spiciness,
                image_url: item.image_url,
              };
        try {
          await databases.createDocument(
            appwriteConfig.dbId,
            metaCollectionId,
            item.id,
            payload,
          );
        } catch (err) {
          if (err.code !== 409) throw err;
        }
      }

      // Step 2: Save sort order array as metadata document
      const orderedIds = shuffleList.map((i) => i.id);
      const sortPayload =
        activeTab === "ramen"
          ? {
              id: "metadata_sort_order",
              name: "Sort Order Metadata",
              status: "available",
              type: "Soup",
              country: "Other Asia",
              description: JSON.stringify(orderedIds),
              image_url: "placeholder",
              price_packet: 0,
              price_bowl: 0,
              spiciness: "None",
              menu: "None",
            }
          : {
              id: "metadata_sort_order",
              name: "Sort Order Metadata",
              status: "available",
              category: "Veggies",
              description: JSON.stringify(orderedIds),
              image_url: "placeholder",
              price: 0,
              spiciness: "None",
            };
      try {
        await databases.updateDocument(
          appwriteConfig.dbId,
          metaCollectionId,
          "metadata_sort_order",
          sortPayload,
        );
      } catch (err) {
        if (err.code === 404) {
          await databases.createDocument(
            appwriteConfig.dbId,
            metaCollectionId,
            "metadata_sort_order",
            sortPayload,
          );
        } else throw err;
      }

      // Step 3: Refresh and exit
      await fetchItems(activeTab);
      exitShuffleMode();
      setMessage({ type: "success", text: "Order saved!" });
    } catch (err) {
      console.error("Failed to save order:", err);
      setMessage({ type: "error", text: "Failed to save order: " + err.message });
    } finally {
      setSavingOrder(false);
    }
  };

  // --- Render ---

  if (loading && !itemsList.length)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Admin...
      </div>
    );

  const renderRamenForm = () => (
    <>
      {/* Ramen Specific Fields */}
      {/* Top Row: ID, Status, Country */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Display #{" "}
            {selectedItem.display_id ? "" : `(slot: ${selectedItem.id})`}
          </label>
          <input
            disabled
            value={selectedItem.display_id || selectedItem.id}
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Status
          </label>
          <select
            value={selectedItem.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Country
          </label>
          <select
            value={selectedItem.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="S. Korea">S. Korea</option>
            <option value="Japan">Japan</option>
            <option value="Taiwan">Taiwan</option>
            <option value="Other Asia">Other Asia</option>
          </select>
        </div>
      </div>

      {/* Name & Type */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Name
          </label>
          <input
            value={selectedItem.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Type
          </label>
          <select
            value={selectedItem.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Soup">Soup</option>
            <option value="Sauce">Sauce</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Description
        </label>
        <textarea
          value={selectedItem.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]"
        />
      </div>

      {/* Prices & Spiciness */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Packet Price ($)
          </label>
          <input
            type="number"
            step="0.25"
            value={selectedItem.price_packet}
            onChange={(e) =>
              handleChange("price_packet", parseFloat(e.target.value))
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Bowl Price ($)
          </label>
          <input
            type="number"
            step="0.25"
            value={selectedItem.price_bowl}
            onChange={(e) =>
              handleChange("price_bowl", parseFloat(e.target.value))
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Spiciness
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
              const currentLevel = parseInt(
                selectedItem.spiciness?.match(/\d+/)?.[0] || "0",
              );
              const isSelected = level === currentLevel;
              return (
                <div key={level} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange("spiciness", `${level} out of 10 flames`)
                    }
                    className={`w-6 h-6 border-2 rounded transition-all ${isSelected ? "bg-orange-500 border-orange-500" : "bg-white border-gray-400 hover:border-gray-500"}`}
                    title={`${level} out of 10 flames`}
                  >
                    {isSelected && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </button>
                  <span className="text-xs text-gray-500 mt-1">{level}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Selection */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Menu
        </label>
        <select
          value={selectedItem.menu}
          onChange={(e) => handleChange("menu", e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Menu 1">Menu 1</option>
          <option value="Menu 2">Menu 2</option>
          <option value="Menu 3A">Menu 3A</option>
          <option value="Menu 3B">Menu 3B</option>
          <option value="Menu 3C">Menu 3C</option>
          <option value="Menu 3D">Menu 3D</option>
          <option value="Menu 3E">Menu 3E</option>
          <option value="Coming Soon">Coming Soon</option>
        </select>
      </div>

      {/* Suggested Toppings */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Suggested Toppings
        </label>
        <textarea
          value={selectedItem.suggested_toppings || ""}
          onChange={(e) => handleChange("suggested_toppings", e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]"
          placeholder="Protein: ... Veggie: ..."
        />
      </div>

      {/* Suggested Videos */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
          Suggested Videos
        </label>
        <div className="space-y-3 mb-4">
          {Array.isArray(selectedItem.suggested_videos) &&
          selectedItem.suggested_videos.length > 0 ? (
            selectedItem.suggested_videos.map((video, idx) => (
              <div
                key={idx}
                className="flex gap-2 items-start bg-white p-3 rounded border border-gray-200"
              >
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-bold text-gray-700 truncate">
                    {video.description}
                  </div>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline truncate block"
                  >
                    {video.url}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newVideos = selectedItem.suggested_videos.filter(
                      (_, i) => i !== idx,
                    );
                    handleChange("suggested_videos", newVideos);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No videos added yet.</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="newVideoDesc"
            placeholder="Description"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <input
            id="newVideoUrl"
            placeholder="YouTube URL"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              const descInput = document.getElementById("newVideoDesc");
              const urlInput = document.getElementById("newVideoUrl");
              if (descInput.value && urlInput.value) {
                const newVideo = {
                  description: descInput.value,
                  url: urlInput.value,
                };
                setSelectedItem((prev) => ({
                  ...prev,
                  suggested_videos: [
                    ...(prev.suggested_videos || []),
                    newVideo,
                  ],
                }));
                descInput.value = "";
                urlInput.value = "";
              }
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-300"
          >
            Add
          </button>
        </div>
      </div>
    </>
  );

  const renderToppingsForm = () => (
    <>
      {/* ID & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            ID
          </label>
          <input
            disabled
            value={selectedItem.id}
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Status
          </label>
          <select
            value={selectedItem.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="available">Available</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
      </div>

      {/* Name & Category */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Name
          </label>
          <input
            value={selectedItem.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Category
          </label>
          <select
            value={selectedItem.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Veggies">Veggies</option>
            <option value="Flavoring">Flavoring</option>
            <option value="Garnishes">Garnishes</option>
            <option value="Protein">Protein</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Description
        </label>
        <textarea
          value={selectedItem.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]"
        />
      </div>

      {/* Price & Spiciness */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Price ($)
          </label>
          <input
            type="number"
            step="0.05"
            value={selectedItem.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Spiciness
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
              const currentLevel = parseInt(
                selectedItem.spiciness?.match(/\d+/)?.[0] || "0",
              );
              const isSelected = level === currentLevel;
              return (
                <div key={level} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange("spiciness", `${level} out of 10 flames`)
                    }
                    className={`w-6 h-6 border-2 rounded transition-all ${isSelected ? "bg-orange-500 border-orange-500" : "bg-white border-gray-400 hover:border-gray-500"}`}
                    title={`${level} out of 10 flames`}
                  >
                    {isSelected && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </button>
                  <span className="text-xs text-gray-500 mt-1">{level}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#F2F2F2]">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex flex-col gap-4">
          <a
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src="/images/logo.png" alt="Uudu" className="h-8 w-auto" />
            <span className="font-bold text-xl text-[#C84E00]">UUDU Admin</span>
          </a>

          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("ramen")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "ramen" ? "bg-white shadow text-[#99564c]" : "text-gray-500 hover:text-gray-700"}`}
            >
              Ramen
            </button>
            <button
              onClick={() => setActiveTab("toppings")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "toppings" ? "bg-white shadow text-[#99564c]" : "text-gray-500 hover:text-gray-700"}`}
            >
              Toppings
            </button>
          </div>

          <div className="flex justify-between items-center w-full">
            <h2 className="font-bold text-xs uppercase text-gray-500">
              {shuffleMode
                ? "Shuffle Mode"
                : activeTab === "ramen"
                  ? "Ramen Box List"
                  : "Toppings List"}
            </h2>
            <div className="flex items-center gap-3">
              {!shuffleMode && (
                <button
                  onClick={enterShuffleMode}
                  className="text-xs text-[#99564c] font-semibold hover:underline"
                  title="Drag and drop to reorder"
                >
                  Shuffle
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* ── SHUFFLE MODE ── */}
          {shuffleMode ? (
            (() => {
              const previewMap = getShufflePreviewIds(shuffleList);
              return shuffleList.map((item) => {
                const previewId = previewMap.get(item.id);
                const isUnavailable =
                  item.status === "coming_soon" || item.status === "out_of_stock";
                const isDragging = draggingId === item.id;
                const isDragTarget = dragOverId === item.id;
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDrop={(e) => handleDrop(e, item.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 cursor-grab select-none transition-all
                      ${isDragging ? "opacity-40 bg-orange-50" : "hover:bg-gray-50"}
                      ${isDragTarget ? "border-t-2 border-t-[#99564c]" : ""}
                      ${isUnavailable ? "bg-gray-50" : ""}
                    `}
                  >
                    <span className="text-gray-400 text-base leading-none flex-shrink-0">
                      ⠿
                    </span>
                    <span
                      className={`text-xs font-bold w-10 flex-shrink-0 ${previewId ? "text-[#99564c]" : "text-gray-400"}`}
                    >
                      {previewId ?? "—"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-700 truncate">
                        {item.name || "(empty)"}
                      </div>
                    </div>
                    {item._isNew && (
                      <span className="text-[9px] px-1 py-0.5 bg-green-100 text-green-700 rounded font-bold uppercase flex-shrink-0">
                        NEW
                      </span>
                    )}
                    {!item._isNew && isUnavailable && (
                      <span className="text-[9px] px-1 py-0.5 bg-yellow-100 text-yellow-700 rounded font-bold uppercase flex-shrink-0">
                        {item.status === "coming_soon" ? "SOON" : "OOS"}
                      </span>
                    )}
                  </div>
                );
              });
            })()
          ) : (
            /* ── NORMAL MODE ── */
            <>
              {itemsList.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 mb-4">No data found.</p>
                  <button
                    onClick={handleInitialMigration}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
                  >
                    Initialize {activeTab === "ramen" ? "Ramen" : "Toppings"}{" "}
                    DB
                  </button>
                  {initStatus && (
                    <p className="text-xs mt-2 text-gray-500 break-words">
                      {initStatus}
                    </p>
                  )}
                </div>
              )}
              {itemsList.map((item) => (
                <button
                  key={item.$id}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedItem?.$id === item.$id ? "bg-orange-50 border-l-4 border-l-[#99564c]" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    {item.display_id && (
                      <span className="font-bold text-gray-800">
                        {item.display_id}
                      </span>
                    )}
                    {!item.display_id && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 font-semibold uppercase">
                        {item.status === "coming_soon" ? "Soon" : "N/A"}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.name || "(empty)"}
                    {!item.display_id && (
                      <span className="text-gray-400 ml-1">({item.id})</span>
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
        <div className="p-4 border-t border-gray-200">
          {shuffleMode ? (
            <div className="space-y-2">
              <button
                onClick={handleAddBlankTemplate}
                disabled={savingOrder}
                className="w-full text-xs py-2 border border-dashed border-gray-400 rounded text-gray-600 hover:border-[#99564c] hover:text-[#99564c] transition-colors font-semibold disabled:opacity-50"
              >
                + Add Blank {activeTab === "ramen" ? "Noodle" : "Topping"}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={exitShuffleMode}
                  disabled={savingOrder}
                  className="flex-1 text-xs py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOrder}
                  disabled={savingOrder}
                  className="flex-1 text-xs py-2 rounded bg-[#99564c] text-white font-bold hover:bg-[#7a453d] disabled:opacity-50 transition-colors"
                >
                  {savingOrder ? "Saving..." : "Save Order"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                fetchBusinessHours();
                setShowHoursModal(true);
              }}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-sm transition-colors"
            >
              Edit Business Hours
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {selectedItem ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Editing {selectedItem.display_id || selectedItem.id} (
                {activeTab})
                {activeTab === "ramen" &&
                  selectedItem.display_id &&
                  selectedItem.display_id !== selectedItem.id && (
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      slot {selectedItem.id}
                    </span>
                  )}
              </h1>
              {message.text && (
                <div
                  className={`text-sm px-3 py-1 rounded ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                >
                  {message.text}
                </div>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {activeTab === "ramen" ? renderRamenForm() : renderToppingsForm()}

              {/* Image Upload (Shared) */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {selectedItem.image_url ? (
                      <img
                        src={
                          selectedItem.image_url.startsWith("http")
                            ? selectedItem.image_url
                            : `/images/${selectedItem.image_url}`
                        }
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Uploading will instantly update the preview URL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || !hasChanges()}
                  className={`px-8 py-3 rounded-lg font-bold transition-colors ${hasChanges() ? "bg-[#99564c] text-white hover:bg-[#7a453d]" : "bg-gray-300 text-gray-500 cursor-not-allowed"} disabled:opacity-50`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : activeTab === "ramen" ? (() => {
          const displayList = shuffleMode ? shuffleList : itemsList;
          const previewMap = shuffleMode ? getShufflePreviewIds(shuffleList) : null;
          const slots = [...displayList].slice(0, 30);
          while (slots.length < 30) slots.push(null);
          const countryColor = {
            "S. Korea": "#DC2626",
            "Japan": "#2563EB",
            "Taiwan": "#059669",
            "Other Asia": "#7C3AED",
          };
          return (
            <div className="p-6 max-w-5xl mx-auto w-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-black text-gray-800 tracking-tight" style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}>
                    Ramen Shelf
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {shuffleMode
                      ? "Drag cards to reorder · Click a card to edit"
                      : "Click any slot to edit · Use Shuffle in the sidebar to reorder"}
                  </p>
                </div>
                <div className="flex gap-3">
                  {Object.entries(countryColor).map(([country, color]) => (
                    <div key={country} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: color }} />
                      <span className="text-[10px] text-gray-500 font-medium">{country}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shelf */}
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: "linear-gradient(160deg, #4a2810 0%, #6b3d1a 40%, #4a2810 100%)" }}
              >
                {[0, 1, 2, 3, 4].map((row) => (
                  <div key={row}>
                    {/* Shelf board */}
                    <div
                      className="relative h-5"
                      style={{
                        background: "linear-gradient(to bottom, #c8832a 0%, #a0651a 40%, #7a4a10 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,220,130,0.3), 0 4px 10px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.15) 40px, rgba(255,255,255,0.15) 41px)",
                        }}
                      />
                    </div>

                    {/* Row of slots */}
                    <div className="grid grid-cols-6 gap-2 px-3 py-3">
                      {[0, 1, 2, 3, 4, 5].map((col) => {
                        const idx = row * 6 + col;
                        const item = slots[idx];
                        const previewId = shuffleMode && item
                          ? previewMap.get(item.id)
                          : item?.display_id;
                        const isUnavailable =
                          item?.status === "coming_soon" || item?.status === "out_of_stock";
                        const isDragging = shuffleMode && draggingId === item?.id;
                        const isDragTarget = shuffleMode && dragOverId === item?.id;
                        const isSelected = selectedItem?.$id === item?.$id;
                        const borderColor = item?.country ? (countryColor[item.country] || "#6b7280") : "transparent";
                        const imageUrl = item?.image_url
                          ? item.image_url.startsWith("http")
                            ? item.image_url
                            : `/images/${item.image_url}`
                          : null;

                        return (
                          <div
                            key={idx}
                            draggable={shuffleMode && !!item}
                            onDragStart={shuffleMode && item ? (e) => handleDragStart(e, item.id) : undefined}
                            onDragOver={shuffleMode && item ? (e) => handleDragOver(e, item.id) : undefined}
                            onDrop={shuffleMode && item ? (e) => handleDrop(e, item.id) : undefined}
                            onDragEnd={shuffleMode ? handleDragEnd : undefined}
                            onClick={() => item && handleSelect(item)}
                            className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-150 select-none
                              ${item ? "cursor-pointer shadow-md" : ""}
                              ${isDragging ? "opacity-30 scale-95" : ""}
                              ${isDragTarget ? "ring-2 ring-orange-400 scale-[1.06] z-10" : ""}
                              ${isSelected ? "ring-2 ring-white/80 scale-[1.04] z-10" : ""}
                              ${item && !isDragging && !isDragTarget && !isSelected ? "hover:scale-[1.05] hover:shadow-xl hover:z-10" : ""}
                              ${shuffleMode && item ? "cursor-grab" : ""}
                            `}
                            style={{ borderTop: `3px solid ${borderColor}` }}
                          >
                            {item ? (
                              <>
                                {/* Image or placeholder */}
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, #374151, #1f2937)" }}
                                  >
                                    <span className="text-3xl opacity-20">🍜</span>
                                  </div>
                                )}

                                {/* N-number badge */}
                                <div className="absolute top-1.5 left-1.5">
                                  <span
                                    className="text-[11px] font-black px-2 py-0.5 rounded-md shadow-lg"
                                    style={{ background: "rgba(0,0,0,0.82)", color: "#ffffff", letterSpacing: "0.03em" }}
                                  >
                                    {previewId ?? "—"}
                                  </span>
                                </div>

                                {/* Drag handle badge (shuffle mode) */}
                                {shuffleMode && !isUnavailable && (
                                  <div className="absolute top-1.5 right-1.5 text-white/70 text-sm leading-none">
                                    ⠿
                                  </div>
                                )}

                                {/* Name overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-2 pt-6 pb-1.5">
                                  <p className="text-white text-[10px] font-bold leading-tight truncate drop-shadow">
                                    {item.name}
                                  </p>
                                </div>

                                {/* Status overlays */}
                                {item.status === "coming_soon" && (
                                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-white bg-amber-500 px-2 py-1 rounded-full uppercase tracking-wider shadow">
                                      Soon
                                    </span>
                                  </div>
                                )}
                                {item.status === "out_of_stock" && (
                                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-white bg-red-600 px-2 py-1 rounded-full uppercase tracking-wider shadow">
                                      OOS
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center rounded-lg"
                                style={{ background: "rgba(0,0,0,0.25)", border: "1px dashed rgba(255,255,255,0.1)" }}
                              >
                                <span className="text-white/15 text-[10px] font-bold">
                                  {String(idx + 1).padStart(2, "0")}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Bottom board */}
                <div
                  className="h-6"
                  style={{
                    background: "linear-gradient(to bottom, #c8832a 0%, #7a4a10 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,220,130,0.2), 0 6px 16px rgba(0,0,0,0.6)",
                  }}
                />
              </div>

              {/* Slot count */}
              <p className="text-center text-[10px] text-gray-400 mt-3">
                {itemsList.filter(i => i.display_id).length} / 30 slots filled
              </p>
            </div>
          );
        })() : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-lg">Select a Topping to edit</p>
          </div>
        )}
      </div>

      {/* Business Hours Modal */}
      {showHoursModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Business Hours</h2>
            <form onSubmit={handleSaveHours} className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Days
                    </label>
                    <input
                      value={businessHours.day1}
                      onChange={(e) =>
                        setBusinessHours((prev) => ({
                          ...prev,
                          day1: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="Mon – Thu"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Hours
                    </label>
                    <input
                      value={businessHours.hours1}
                      onChange={(e) =>
                        setBusinessHours((prev) => ({
                          ...prev,
                          hours1: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="11:00 AM – 9:00 PM"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <input
                      value={businessHours.day2}
                      onChange={(e) =>
                        setBusinessHours((prev) => ({
                          ...prev,
                          day2: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="Fri – Sat"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      value={businessHours.hours2}
                      onChange={(e) =>
                        setBusinessHours((prev) => ({
                          ...prev,
                          hours2: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="11:00 AM – 10:00 PM"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <input
                      value={businessHours.day3}
                      onChange={(e) =>
                        setBusinessHours((prev) => ({
                          ...prev,
                          day3: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="Sun"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      value={businessHours.hours3}
                      onChange={(e) =>
                        setBusinessHours((prev) => ({
                          ...prev,
                          hours3: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="12:00 PM – 8:00 PM"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowHoursModal(false)}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingHours || !hasHoursChanges()}
                  className={`px-4 py-2 rounded font-bold transition-colors ${hasHoursChanges() ? "bg-[#99564c] text-white hover:bg-[#7a453d]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  {savingHours ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {cropModal.open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col" style={{ maxHeight: "90vh" }}>

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800">Crop Image</h2>
              <p className="text-xs text-gray-500 mt-0.5">Drag to reposition · pinch or slider to zoom in</p>
            </div>

            {/* Cropper area — checkerboard indicates transparency */}
            <div
              className="relative flex-shrink-0"
              style={{
                height: 360,
                backgroundImage:
                  "repeating-conic-gradient(#d1d5db 0% 25%, #ffffff 0% 50%)",
                backgroundSize: "20px 20px",
              }}
            >
              <Cropper
                image={cropModal.src}
                crop={cropPosition}
                zoom={cropZoom}
                minZoom={1}
                maxZoom={4}
                aspect={cropAspect ?? undefined}
                restrictPosition={false}
                onCropChange={setCropPosition}
                onZoomChange={setCropZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                style={{
                  containerStyle: { borderRadius: 0, background: "transparent" },
                  mediaStyle: { background: "transparent" },
                  cropAreaStyle: { borderRadius: 12 },
                }}
              />
            </div>

            {/* Controls */}
            <div className="px-5 py-4 space-y-4 flex-shrink-0">

              {/* Aspect ratio */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Aspect Ratio</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "Free", value: null },
                    { label: "Portrait 3:4", value: 3 / 4 },
                    { label: "Square 1:1", value: 1 },
                    { label: "Landscape 4:3", value: 4 / 3 },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setCropAspect(value);
                        setCropZoom(1);
                        setCropPosition({ x: 0, y: 0 });
                      }}
                      className={`px-3 py-1.5 rounded text-sm font-semibold border transition-colors ${
                        cropAspect === value
                          ? "bg-[#99564c] text-white border-[#99564c]"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom slider */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Zoom — {cropZoom.toFixed(2)}×
                </p>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.01}
                  value={cropZoom}
                  onChange={(e) => setCropZoom(Number(e.target.value))}
                  className="w-full accent-[#99564c]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 flex justify-end gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCropModal({ open: false, src: null, file: null })}
                className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const f = cropModal.file;
                  setCropModal({ open: false, src: null, file: null });
                  doUploadFile(f);
                }}
                className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
              >
                Upload Original
              </button>
              <button
                type="button"
                onClick={handleCropAndUpload}
                disabled={!croppedAreaPixels}
                className="px-4 py-2 text-sm rounded bg-[#99564c] text-white font-bold hover:bg-[#7a453d] transition-colors disabled:opacity-50"
              >
                Crop &amp; Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
