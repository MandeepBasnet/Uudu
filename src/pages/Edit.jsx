import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, databases, storage, appwriteConfig, ID, Query } from '../lib/appwrite';
import localRamenData from '../data/updatedRamen.json';
import localToppingsData from '../data/updatedToppings.json';

// Helper to check if a string is a valid ID for Appwrite (alphanumeric, -, _, .)
const isValidId = (str) => /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(str);

const Edit = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('ramen'); // 'ramen' | 'toppings'
    
    // Generic List State
    const [itemsList, setItemsList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // For initializing DB
    const [initStatus, setInitStatus] = useState('');

    // Business Hours State
    const [showHoursModal, setShowHoursModal] = useState(false);
    const [businessHours, setBusinessHours] = useState({
        day1: "Mon – Thu",
        hours1: "11:00 AM – 9:00 PM",
        day2: "Fri – Sat",
        hours2: "11:00 AM – 10:00 PM",
        day3: "Sun",
        hours3: "12:00 PM – 8:00 PM"
    });
    const [originalBusinessHours, setOriginalBusinessHours] = useState(null);
    const [savingHours, setSavingHours] = useState(false);

    // --- Helpers ---

    const getCollectionId = (tab) => {
        return tab === 'ramen' ? appwriteConfig.collectionId : appwriteConfig.toppingsCollectionId;
    };

    const hasChanges = () => {
        if (!selectedItem || !originalItem) return false;
        return JSON.stringify(selectedItem) !== JSON.stringify(originalItem);
    };

    const hasHoursChanges = () => {
        if (!originalBusinessHours) return false;
        return JSON.stringify(businessHours) !== JSON.stringify(originalBusinessHours);
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
            setMessage({ type: '', text: '' });
            setInitStatus('');
        }
    }, [activeTab, user]);

    // --- Auth & Data Fetching ---

    const checkAuth = async () => {
        try {
            const isSessionActive = sessionStorage.getItem('uudu_admin_session');
            if (!isSessionActive) {
                try { await account.deleteSession('current'); } catch (e) {}
                throw new Error("Session expired");
            }
            const userData = await account.get();
            setUser(userData);
            // fetchItems called via useEffect when user is set
        } catch (err) {
            navigate('/login');
        }
    };

    const fetchItems = async (tab) => {
        setLoading(true);
        try {
            const collectionId = getCollectionId(tab);
            console.log('Fetching from:', tab, 'collectionId:', collectionId);
            if (!appwriteConfig.dbId || !collectionId) {
                console.warn('Missing config:', { dbId: appwriteConfig.dbId, collectionId });
                setLoading(false);
                return;
            }

            const response = await databases.listDocuments(
                appwriteConfig.dbId,
                collectionId,
                [Query.limit(100)]
            );
            
            console.log('Response documents count:', response.documents.length);
            console.log('First document:', response.documents[0]);
            
            // Sort by ID naturally
            const sorted = response.documents
                .filter(doc => !doc.id.startsWith('metadata_'))
                .sort((a, b) => a.id.localeCompare(b.id)); 
            console.log('Sorted list after filter:', sorted.length, 'items');
            setItemsList(sorted);
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
                'metadata_location'
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
        if (activeTab === 'ramen' && cleanItem.suggested_videos) {
            if (typeof cleanItem.suggested_videos === 'string') {
                try {
                    cleanItem.suggested_videos = JSON.parse(cleanItem.suggested_videos);
                } catch (e) {
                    cleanItem.suggested_videos = [];
                }
            }
        }

        setSelectedItem(cleanItem);
        setOriginalItem(cleanItem);
        setMessage({ type: '', text: '' });
    };

    const handleChange = (field, value) => {
        setSelectedItem(prev => ({ ...prev, [field]: value }));
    };

    const handleLogout = async () => {
        await account.deleteSession('current');
        navigate('/login');
    };

    // --- Save Logic ---

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            let payload = { ...selectedItem };

            if (activeTab === 'ramen') {
                payload.suggested_videos = typeof payload.suggested_videos === 'object' 
                    ? JSON.stringify(payload.suggested_videos) 
                    : payload.suggested_videos;
                
                // Cleanup deletions
                delete payload.cooker_menu;
                delete payload.cooker_settings;
                delete payload.allergen;
            } else {
                // Toppings specific cleanup if any
            }

            // Remove system attributes
            const cleanPayload = {};
            Object.keys(payload).forEach(key => {
                if (!key.startsWith('$')) {
                    cleanPayload[key] = payload[key];
                }
            });

            await databases.updateDocument(
                appwriteConfig.dbId,
                getCollectionId(activeTab),
                selectedItem.$id,
                cleanPayload
            );
            
            setMessage({ type: 'success', text: 'Saved successfully!' });
            setItemsList(prev => prev.map(item => item.$id === selectedItem.$id ? { ...item, ...cleanPayload } : item));
            setOriginalItem(selectedItem); // Update original to new state
        } catch (err) {
            console.error("Save failed", err);
            setMessage({ type: 'error', text: 'Failed to save changes. ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveHours = async (e) => {
        e.preventDefault();
        setSavingHours(true);
        try {
            const payload = {
                id: 'metadata_location',
                name: 'Location Metadata',
                status: 'available',
                type: 'Soup',
                country: 'Other Asia',
                description: JSON.stringify(businessHours),
                image_url: 'placeholder',
                price_packet: 0,
                price_bowl: 0,
                spiciness: 'None',
                menu: 'None'
            };

            const metaCollectionId = appwriteConfig.collectionId; // Always use ramen collection for metadata

            try {
                await databases.updateDocument(appwriteConfig.dbId, metaCollectionId, 'metadata_location', payload);
            } catch (err) {
                if (err.code === 404) {
                    await databases.createDocument(appwriteConfig.dbId, metaCollectionId, 'metadata_location', payload);
                } else {
                    throw err;
                }
            }
            setShowHoursModal(false);
            setMessage({ type: 'success', text: 'Business Hours updated!' });
        } catch (err) {
            alert('Failed to save hours: ' + err.message);
        } finally {
            setSavingHours(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSaving(true);
        try {
            const response = await storage.createFile(
                appwriteConfig.bucketId,
                ID.unique(),
                file
            );

            const fileUrl = storage.getFileView(appwriteConfig.bucketId, response.$id);
            const finalUrl = fileUrl && typeof fileUrl === 'object' && 'href' in fileUrl ? fileUrl.href : fileUrl;

            setSelectedItem(prev => ({
                ...prev,
                image_url: finalUrl
            }));

            setMessage({ type: 'success', text: 'Image uploaded! Remember to Save.' });
        } catch (err) {
            console.error("Upload failed", err);
            setMessage({ type: 'error', text: 'Image upload failed. ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    // --- Migration Logic ---

    const handleInitialMigration = async () => {
        const collectionName = activeTab === 'ramen' ? 'Ramen' : 'Toppings';
        if (!window.confirm(`This will attempt to upload all local ${collectionName} JSON data to Appwrite. Continue?`)) return;
        
        setInitStatus("Starting migration...");
        let successCount = 0;
        let failCount = 0;

        const sourceData = activeTab === 'ramen' ? localRamenData.ramen : localToppingsData.toppings;
        const targetCollectionId = getCollectionId(activeTab);

        for (const item of sourceData) {
            try {
                // Common payload construction
                const payload = { ...item };
                
                // Specific Adjustments
                if (activeTab === 'ramen') {
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
                    payload
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
             setInitStatus(prev => `${prev} | Finished with ${failCount} errors.`);
        } else {
             setInitStatus(`Migration Done based on ${collectionName} JSON. Success: ${successCount}`);
        }
        fetchItems();
    };

    // --- Render ---

    if (loading && !itemsList.length) return <div className="h-screen flex items-center justify-center">Loading Admin...</div>;

    const renderRamenForm = () => (
        <>
            {/* Ramen Specific Fields */}
            {/* Top Row: ID, Status, Country */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID (Box)</label>
                    <input disabled value={selectedItem.id} className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                    <select value={selectedItem.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                        <option value="available">Available</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="coming_soon">Coming Soon</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country</label>
                    <select value={selectedItem.country} onChange={(e) => handleChange('country', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
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
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                    <input value={selectedItem.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                    <select value={selectedItem.type} onChange={(e) => handleChange('type', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                        <option value="Soup">Soup</option>
                        <option value="Sauce">Sauce</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea value={selectedItem.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]" />
            </div>

            {/* Prices & Spiciness */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Packet Price ($)</label>
                    <input type="number" step="0.25" value={selectedItem.price_packet} onChange={(e) => handleChange('price_packet', parseFloat(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bowl Price ($)</label>
                    <input type="number" step="0.25" value={selectedItem.price_bowl} onChange={(e) => handleChange('price_bowl', parseFloat(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div className="col-span-3">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Spiciness</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
                            const currentLevel = parseInt(selectedItem.spiciness?.match(/\d+/)?.[0] || '0');
                            const isSelected = level === currentLevel;
                            return (
                                <div key={level} className="flex flex-col items-center">
                                    <button type="button" onClick={() => handleChange('spiciness', `${level} out of 10 flames`)} className={`w-6 h-6 border-2 rounded transition-all ${isSelected ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-400 hover:border-gray-500'}`} title={`${level} out of 10 flames`}>
                                        {isSelected && <span className="text-white text-xs">✓</span>}
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
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Menu</label>
                <select value={selectedItem.menu} onChange={(e) => handleChange('menu', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
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
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Suggested Toppings</label>
                <textarea value={selectedItem.suggested_toppings || ''} onChange={(e) => handleChange('suggested_toppings', e.target.value)} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]" placeholder="Protein: ... Veggie: ..." />
            </div>

            {/* Suggested Videos */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Suggested Videos</label>
                <div className="space-y-3 mb-4">
                    {Array.isArray(selectedItem.suggested_videos) && selectedItem.suggested_videos.length > 0 ? (
                        selectedItem.suggested_videos.map((video, idx) => (
                            <div key={idx} className="flex gap-2 items-start bg-white p-3 rounded border border-gray-200">
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-xs font-bold text-gray-700 truncate">{video.description}</div>
                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{video.url}</a>
                                </div>
                                <button type="button" onClick={() => {
                                    const newVideos = selectedItem.suggested_videos.filter((_, i) => i !== idx);
                                    handleChange('suggested_videos', newVideos);
                                }} className="text-red-500 hover:text-red-700 p-1">✕</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 italic">No videos added yet.</p>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input id="newVideoDesc" placeholder="Description" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                    <input id="newVideoUrl" placeholder="YouTube URL" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                    <button type="button" onClick={() => {
                        const descInput = document.getElementById('newVideoDesc');
                        const urlInput = document.getElementById('newVideoUrl');
                        if (descInput.value && urlInput.value) {
                            const newVideo = { description: descInput.value, url: urlInput.value };
                            setSelectedItem(prev => ({ ...prev, suggested_videos: [...(prev.suggested_videos || []), newVideo] }));
                            descInput.value = ''; urlInput.value = '';
                        }
                    }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-300">Add</button>
                </div>
            </div>
        </>
    );

    const renderToppingsForm = () => (
        <>
            {/* ID & Status */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID</label>
                    <input disabled value={selectedItem.id} className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                    <select value={selectedItem.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                        <option value="available">Available</option>
                        <option value="coming_soon">Coming Soon</option>
                    </select>
                </div>
            </div>

            {/* Name & Category */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                    <input value={selectedItem.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]" />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                    <select value={selectedItem.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                        <option value="Veggies">Veggies</option>
                        <option value="Flavoring">Flavoring</option>
                        <option value="Garnishes">Garnishes</option>
                        <option value="Protein">Protein</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea value={selectedItem.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]" />
            </div>

             {/* Price & Spiciness */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                    <input type="number" step="0.05" value={selectedItem.price} onChange={(e) => handleChange('price', parseFloat(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Spiciness</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
                            const currentLevel = parseInt(selectedItem.spiciness?.match(/\d+/)?.[0] || '0');
                            const isSelected = level === currentLevel;
                            return (
                                <div key={level} className="flex flex-col items-center">
                                    <button type="button" onClick={() => handleChange('spiciness', `${level} out of 10 flames`)} className={`w-6 h-6 border-2 rounded transition-all ${isSelected ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-400 hover:border-gray-500'}`} title={`${level} out of 10 flames`}>
                                        {isSelected && <span className="text-white text-xs">✓</span>}
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
                    <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <img src="/images/logo.png" alt="Uudu" className="h-8 w-auto" />
                        <span className="font-bold text-xl text-[#C84E00]">UUDU Admin</span>
                    </a>
                    
                    {/* Tabs */}
                    <div className="flex rounded-lg bg-gray-100 p-1">
                        <button onClick={() => setActiveTab('ramen')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'ramen' ? 'bg-white shadow text-[#99564c]' : 'text-gray-500 hover:text-gray-700'}`}>
                            Ramen
                        </button>
                        <button onClick={() => setActiveTab('toppings')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'toppings' ? 'bg-white shadow text-[#99564c]' : 'text-gray-500 hover:text-gray-700'}`}>
                            Toppings
                        </button>
                    </div>

                    <div className="flex justify-between items-center w-full">
                        <h2 className="font-bold text-xs uppercase text-gray-500">{activeTab === 'ramen' ? 'Ramen Box List' : 'Toppings List'}</h2>
                        <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Logout</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {itemsList.length === 0 && (
                        <div className="p-4 text-center">
                            <p className="text-sm text-gray-500 mb-4">No data found.</p>
                            <button 
                                onClick={handleInitialMigration}
                                className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
                            >
                                Initialize {activeTab === 'ramen' ? 'Ramen' : 'Toppings'} DB
                            </button>
                            {initStatus && <p className="text-xs mt-2 text-gray-500 break-words">{initStatus}</p>}
                        </div>
                    )}
                    {itemsList.map(item => (
                        <button
                            key={item.$id}
                            onClick={() => handleSelect(item)}
                            className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedItem?.$id === item.$id ? 'bg-orange-50 border-l-4 border-l-[#99564c]' : ''}`}
                        >
                            <div className="font-bold text-gray-800">{item.id}</div>
                            <div className="text-xs text-gray-500 truncate">{item.name}</div>
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => { fetchBusinessHours(); setShowHoursModal(true); }}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-sm transition-colors"
                    >
                        Edit Business Hours
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {selectedItem ? (
                     <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Editing {selectedItem.id} ({activeTab})</h1>
                            {message.text && (
                                <div className={`text-sm px-3 py-1 rounded ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {message.text}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {activeTab === 'ramen' ? renderRamenForm() : renderToppingsForm()}

                             {/* Image Upload (Shared) */}
                             <div className="border-t border-gray-200 pt-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                        {selectedItem.image_url ? (
                                            <img 
                                                src={selectedItem.image_url.startsWith('http') ? selectedItem.image_url : `/images/${selectedItem.image_url}`} 
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
                                        <p className="text-xs text-gray-500 mt-2">Uploading will instantly update the preview URL.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={saving || !hasChanges()} className={`px-8 py-3 rounded-lg font-bold transition-colors ${hasChanges() ? 'bg-[#99564c] text-white hover:bg-[#7a453d]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} disabled:opacity-50`}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                     </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <p className="text-lg">Select a {activeTab === 'ramen' ? 'Ramen Box' : 'Topping'} to edit</p>
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
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Days</label>
                                        <input value={businessHours.day1} onChange={(e) => setBusinessHours(prev => ({ ...prev, day1: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Mon – Thu" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hours</label>
                                        <input value={businessHours.hours1} onChange={(e) => setBusinessHours(prev => ({ ...prev, hours1: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="11:00 AM – 9:00 PM" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-1/3"><input value={businessHours.day2} onChange={(e) => setBusinessHours(prev => ({ ...prev, day2: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Fri – Sat" /></div>
                                    <div className="flex-1"><input value={businessHours.hours2} onChange={(e) => setBusinessHours(prev => ({ ...prev, hours2: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="11:00 AM – 10:00 PM" /></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-1/3"><input value={businessHours.day3} onChange={(e) => setBusinessHours(prev => ({ ...prev, day3: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Sun" /></div>
                                    <div className="flex-1"><input value={businessHours.hours3} onChange={(e) => setBusinessHours(prev => ({ ...prev, hours3: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="12:00 PM – 8:00 PM" /></div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowHoursModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" disabled={savingHours || !hasHoursChanges()} className={`px-4 py-2 rounded font-bold transition-colors ${hasHoursChanges() ? 'bg-[#99564c] text-white hover:bg-[#7a453d]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                                    {savingHours ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Edit;
