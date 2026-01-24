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
    
    // For initializing DB
    const [initStatus, setInitStatus] = useState('');

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
            const sorted = response.documents.sort((a, b) => a.id.localeCompare(b.id)); // Assuming stored ID is used as document ID or 'id' field
            setRamenList(sorted);
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (ramen) => {
        setSelectedRamen({ ...ramen }); // Deep copy if needed, but shallow is okay for flat inputs
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
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Spiciness</label>
                                    <input 
                                        value={selectedRamen.spiciness} 
                                        onChange={(e) => handleChange('spiciness', e.target.value)}
                                        placeholder="X out of 10 flames"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </div>
                            </div>

                            {/* Menu Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Menu Code (e.g. Menu 1, Menu 3E)</label>
                                <input 
                                    value={selectedRamen.menu} 
                                    onChange={(e) => handleChange('menu', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
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

                            {/* Save Button */}
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#99564c] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#7a453d] transition-colors disabled:opacity-50"
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
        </div>
    );
};

export default Edit;
