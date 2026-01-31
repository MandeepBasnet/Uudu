import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, databases, storage, appwriteConfig, ID, Query } from '../lib/appwrite';
import localRamenData from '../data/updatedRamen.json';

// Helper to check if a string is a valid ID for Appwrite (alphanumeric, -, _, .)
const isValidId = (str) => /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(str);

const Edit = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [ramenList, setRamenList] = useState([]);
    const [selectedRamen, setSelectedRamen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [originalRamen, setOriginalRamen] = useState(null);
    
    // For initializing DB
    const [initStatus, setInitStatus] = useState('');

    // Check if any changes have been made
    const hasChanges = () => {
        if (!selectedRamen || !originalRamen) return false;
        return JSON.stringify(selectedRamen) !== JSON.stringify(originalRamen);
        return JSON.stringify(selectedRamen) !== JSON.stringify(originalRamen);
    };

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

    const hasHoursChanges = () => {
        if (!originalBusinessHours) return false;
        return JSON.stringify(businessHours) !== JSON.stringify(originalBusinessHours);
    };

    const fetchBusinessHours = async () => {
        try {
            const response = await databases.getDocument(
                appwriteConfig.dbId,
                appwriteConfig.collectionId,
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
            // Default hours already set
            setOriginalBusinessHours(businessHours);
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

            // Try to update, if fail (404), create
            try {
                await databases.updateDocument(
                    appwriteConfig.dbId,
                    appwriteConfig.collectionId,
                    'metadata_location',
                    payload
                );
            } catch (err) {
                if (err.code === 404) {
                    await databases.createDocument(
                        appwriteConfig.dbId,
                        appwriteConfig.collectionId,
                        'metadata_location',
                        payload
                    );
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

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Check for session storage flag (Tab-based session)
            const isSessionActive = sessionStorage.getItem('uudu_admin_session');
            if (!isSessionActive) {
                // If the flag is missing, force logout even if Appwrite thinks we are logged in
                // This ensures that closing the tab/browser effectively logs the user out
                try {
                    await account.deleteSession('current');
                } catch (e) {
                    // Ignore error if already logged out
                }
                throw new Error("Session expired");
            }

            const userData = await account.get();
            setUser(userData);
            fetchRamen();
        } catch (err) {
            navigate('/login');
        }
    };

    const fetchRamen = async () => {
        try {
            if (!appwriteConfig.dbId || !appwriteConfig.collectionId) {
                // Config missing
                setLoading(false);
                return;
            }

            const response = await databases.listDocuments(
                appwriteConfig.dbId,
                appwriteConfig.collectionId,
                [
                    Query.limit(100)
                ] 
            );
            
            // Sort by ID naturally if possible (N01, N02...)
            // Simple sort
            const sorted = response.documents
                .filter(doc => !doc.id.startsWith('metadata_'))
                .sort((a, b) => a.id.localeCompare(b.id)); 
            setRamenList(sorted);
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (ramen) => {
        let parsedVideos = ramen.suggested_videos;
        if (typeof parsedVideos === 'string') {
            try {
                parsedVideos = JSON.parse(parsedVideos);
            } catch (e) {
                parsedVideos = [];
            }
        }
        const ramenWithParsedVideos = { ...ramen, suggested_videos: parsedVideos };
        setSelectedRamen(ramenWithParsedVideos);
        setOriginalRamen(ramenWithParsedVideos);
        setMessage({ type: '', text: '' });
    };

    const handleInitialMigration = async () => {
        if (!window.confirm("This will attempt to upload all local JSON data to Appwrite. Continue?")) return;
        setInitStatus("Starting migration...");
        
        let successCount = 0;
        let failCount = 0;

        for (const item of localRamenData.ramen) {
            try {
                // Clean data for Appwrite
                // Remove keys that might conflict or are local-only if any
                // Ensure ID is valid document ID. "N01" is valid.
                const docId = item.id; 
                
                // Construct payload. 
                // Note: Attribute names in Appwrite MUST exist. 
                // We'll throw the whole object and hope schema is loose or defined.
                // Assuming we simply dump the fields we know.
                const payload = {
                    id: item.id,
                    name: item.name,
                    status: item.status,
                    type: item.type,
                    menu: item.menu,
                    country: item.country,
                    description: item.description,
                    price_packet: item.price_packet,
                    price_bowl: item.price_bowl,
                    spiciness: item.spiciness,
                    suggested_toppings: item.suggested_toppings,
                    image_url: item.image_url,
                    // cooker_menu and cooker_setting removed
                    suggested_videos: JSON.stringify(item.suggested_videos),
                };

                await databases.createDocument(
                    appwriteConfig.dbId,
                    appwriteConfig.collectionId,
                    docId, // Use the RAMEN ID as the Document ID
                    payload
                );
                successCount++;
                setInitStatus(`Migrated ${item.id}...`);
            } catch (err) {
                console.error(`Failed to migrate ${item.id}`, err);
                failCount++;
                // If 409, it already exists, which is fine/good.
                if (err.code === 409) {
                    successCount++; 
                } else {
                    // Show the first error reason to help debug
                    if (failCount === 1) {
                         setInitStatus(`Failed on ${item.id}: ${err.message}`);
                    }
                }
            }
        }
        
        if (failCount > 0) {
             setInitStatus(prev => `${prev} | Finished with ${failCount} errors. Check console/attributes.`);
        } else {
             setInitStatus(`Migration Done. Success: ${successCount}`);
        }
        fetchRamen();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Prepare payload
            const payload = {
                ...selectedRamen,
                suggested_videos: typeof selectedRamen.suggested_videos === 'object' ? JSON.stringify(selectedRamen.suggested_videos) : selectedRamen.suggested_videos,
            };
            
            // Remove deleted fields from payload just in case they persist in state
            delete payload.cooker_menu;
            delete payload.cooker_settings;
            delete payload.allergen;

            // Remove system attributes (starts with $)
            const cleanPayload = {};
            Object.keys(payload).forEach(key => {
                if (!key.startsWith('$')) {
                    cleanPayload[key] = payload[key];
                }
            });

            await databases.updateDocument(
                appwriteConfig.dbId,
                appwriteConfig.collectionId,
                selectedRamen.$id, // Use system ID for update
                cleanPayload
            );
            
            setMessage({ type: 'success', text: 'Saved successfully!' });
            // Update list
            setRamenList(prev => prev.map(item => item.$id === selectedRamen.$id ? { ...item, ...cleanPayload } : item));
        } catch (err) {
            console.error("Save failed", err);
            setMessage({ type: 'error', text: 'Failed to save changes. ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSaving(true);
        try {
            // Upload to Bucket
            const response = await storage.createFile(
                appwriteConfig.bucketId,
                ID.unique(),
                file
            );

            // Get File View URL
            const fileUrl = storage.getFileView(appwriteConfig.bucketId, response.$id);
            
            // Handle if fileUrl is returned as a URL object or a string
            const finalUrl = fileUrl && typeof fileUrl === 'object' && 'href' in fileUrl 
                ? fileUrl.href 
                : fileUrl;

            setSelectedRamen(prev => ({
                ...prev,
                image_url: finalUrl // Store the full URL
            }));

            setMessage({ type: 'success', text: 'Image uploaded! Remember to Save.' });
        } catch (err) {
            console.error("Upload failed", err);
            setMessage({ type: 'error', text: 'Image upload failed. ' + err.message });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await account.deleteSession('current');
        navigate('/login');
    };

    const handleChange = (field, value) => {
        setSelectedRamen(prev => ({ ...prev, [field]: value }));
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading Admin...</div>;

    return (
        <div className="flex h-screen bg-[#F2F2F2]">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex flex-col gap-4">
                    <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <img src="/images/logo.png" alt="Uudu" className="h-8 w-auto" />
                        <span className="font-bold text-xl text-[#C84E00]">UUDU</span>
                    </a>
                    <div className="flex justify-between items-center w-full">
                        <h2 className="font-bold text-xs uppercase text-gray-500">Ramen List</h2>
                        <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Logout</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {ramenList.length === 0 && (
                        <div className="p-4 text-center">
                            <p className="text-sm text-gray-500 mb-4">No data found.</p>
                            <button 
                                onClick={handleInitialMigration}
                                className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
                            >
                                Initialize DB (Load JSON)
                            </button>
                            {initStatus && <p className="text-xs mt-2 text-gray-500 break-words">{initStatus}</p>}
                        </div>
                    )}
                    {ramenList.map(item => (
                        <button
                            key={item.$id}
                            onClick={() => handleSelect(item)}
                            className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedRamen?.$id === item.$id ? 'bg-orange-50 border-l-4 border-l-[#99564c]' : ''}`}
                        >
                            <div className="font-bold text-gray-800">{item.id}</div>
                            <div className="text-xs text-gray-500 truncate">{item.name}</div>
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => {
                            fetchBusinessHours();
                            setShowHoursModal(true);
                        }}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-sm transition-colors"
                    >
                        Edit Business Hours
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {selectedRamen ? (
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Editing {selectedRamen.id}</h1>
                            {message.text && (
                                <div className={`text-sm px-3 py-1 rounded ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {message.text}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Top Row: ID, Status, Country */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID (Box)</label>
                                    <input 
                                        disabled
                                        value={selectedRamen.id} 
                                        className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                    <select 
                                        value={selectedRamen.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    >
                                        <option value="available">Available</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                        <option value="coming_soon">Coming Soon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country</label>
                                    <select 
                                        value={selectedRamen.country}
                                        onChange={(e) => handleChange('country', e.target.value)}
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                    <input 
                                        value={selectedRamen.name} 
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                    <select 
                                        value={selectedRamen.type}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    >
                                        <option value="Soup">Soup</option>
                                        <option value="Sauce">Sauce</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea 
                                    value={selectedRamen.description} 
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]"
                                />
                            </div>

                            {/* Prices & Spiciness */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Packet Price ($)</label>
                                    <input 
                                        type="number" step="0.25"
                                        value={selectedRamen.price_packet} 
                                        onChange={(e) => handleChange('price_packet', parseFloat(e.target.value))}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bowl Price ($)</label>
                                    <input 
                                        type="number" step="0.25"
                                        value={selectedRamen.price_bowl} 
                                        onChange={(e) => handleChange('price_bowl', parseFloat(e.target.value))}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Spiciness</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
                                            const currentLevel = parseInt(selectedRamen.spiciness?.match(/\d+/)?.[0] || '0');
                                            const isSelected = level === currentLevel;
                                            return (
                                                <div key={level} className="flex flex-col items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleChange('spiciness', `${level} out of 10 flames`)}
                                                        className={`w-6 h-6 border-2 rounded transition-all ${
                                                            isSelected 
                                                                ? 'bg-orange-500 border-orange-500' 
                                                                : 'bg-white border-gray-400 hover:border-gray-500'
                                                        }`}
                                                        title={`${level} out of 10 flames`}
                                                    >
                                                        {isSelected && <span className="text-white text-xs">✓</span>}
                                                    </button>
                                                    <span className="text-xs text-gray-500 mt-1">{level}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{selectedRamen.spiciness || 'Click to set spiciness'}</p>
                                </div>
                            </div>

                            {/* Menu Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Menu</label>
                                <select 
                                    value={selectedRamen.menu}
                                    onChange={(e) => handleChange('menu', e.target.value)}
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
                                <p className="text-xs text-gray-400 mt-1">This controls the cooker instructions logic.</p>
                            </div>

                            {/* Image Upload */}
                            <div className="border-t border-gray-200 pt-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                        {selectedRamen.image_url ? (
                                            <img 
                                                src={selectedRamen.image_url.startsWith('http') ? selectedRamen.image_url : `/images/${selectedRamen.image_url}`} 
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
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100
                                            "
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Uploading will instantly update the preview URL.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Suggested Toppings */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Suggested Toppings</label>
                                <textarea 
                                    value={selectedRamen.suggested_toppings || ''} 
                                    onChange={(e) => handleChange('suggested_toppings', e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#99564c]"
                                    placeholder="Protein: ... Veggie: ..."
                                />
                            </div>

                            {/* Suggested Videos */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Suggested Videos</label>
                                
                                {/* Video List */}
                                <div className="space-y-3 mb-4">
                                    {Array.isArray(selectedRamen.suggested_videos) && selectedRamen.suggested_videos.length > 0 ? (
                                        selectedRamen.suggested_videos.map((video, idx) => (
                                            <div key={idx} className="flex gap-2 items-start bg-white p-3 rounded border border-gray-200">
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="text-xs font-bold text-gray-700 truncate">{video.description}</div>
                                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block">
                                                        {video.url}
                                                    </a>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newVideos = selectedRamen.suggested_videos.filter((_, i) => i !== idx);
                                                        handleChange('suggested_videos', newVideos);
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

                                {/* Add New Video */}
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input 
                                        id="newVideoDesc"
                                        placeholder="Description (e.g. Hack Video)" 
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
                                            const descInput = document.getElementById('newVideoDesc');
                                            const urlInput = document.getElementById('newVideoUrl');
                                            
                                            if (descInput.value && urlInput.value) {
                                                const newVideo = { description: descInput.value, url: urlInput.value };
                                                
                                                // Use functional update to get the latest state
                                                setSelectedRamen(prev => {
                                                    const currentVideos = Array.isArray(prev.suggested_videos) ? prev.suggested_videos : [];
                                                    return { ...prev, suggested_videos: [...currentVideos, newVideo] };
                                                });
                                                
                                                // Clear inputs
                                                descInput.value = '';
                                                urlInput.value = '';
                                            }
                                        }}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-300"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving || !hasChanges()}
                                    className={`px-8 py-3 rounded-lg font-bold transition-colors ${
                                        hasChanges() 
                                            ? 'bg-[#99564c] text-white hover:bg-[#7a453d]' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    } disabled:opacity-50`}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>

                        </form>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <p className="text-lg">Select a Ramen Box to edit</p>
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
                                {/* Row 1 */}
                                <div className="flex gap-2">
                                    <div className="w-1/3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Days</label>
                                        <input 
                                            value={businessHours.day1}
                                            onChange={(e) => setBusinessHours(prev => ({ ...prev, day1: e.target.value }))}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                            placeholder="Mon – Thu"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hours</label>
                                        <input 
                                            value={businessHours.hours1}
                                            onChange={(e) => setBusinessHours(prev => ({ ...prev, hours1: e.target.value }))}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                            placeholder="11:00 AM – 9:00 PM"
                                        />
                                    </div>
                                </div>
                                {/* Row 2 */}
                                <div className="flex gap-2">
                                    <div className="w-1/3">
                                        <input 
                                            value={businessHours.day2}
                                            onChange={(e) => setBusinessHours(prev => ({ ...prev, day2: e.target.value }))}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                            placeholder="Fri – Sat"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input 
                                            value={businessHours.hours2}
                                            onChange={(e) => setBusinessHours(prev => ({ ...prev, hours2: e.target.value }))}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                            placeholder="11:00 AM – 10:00 PM"
                                        />
                                    </div>
                                </div>
                                {/* Row 3 */}
                                <div className="flex gap-2">
                                    <div className="w-1/3">
                                        <input 
                                            value={businessHours.day3}
                                            onChange={(e) => setBusinessHours(prev => ({ ...prev, day3: e.target.value }))}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                            placeholder="Sun"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input 
                                            value={businessHours.hours3}
                                            onChange={(e) => setBusinessHours(prev => ({ ...prev, hours3: e.target.value }))}
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
                                    className={`px-4 py-2 rounded font-bold transition-colors ${
                                        hasHoursChanges() 
                                            ? 'bg-[#99564c] text-white hover:bg-[#7a453d]' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
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
