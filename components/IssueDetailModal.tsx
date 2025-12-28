import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { loadModel, detectPothole } from '../utils/potholeDetector'; // Importing your specific model
import type { Issue, User } from '../types';
import { Status, Role } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { XIcon, SpinnerIcon } from './icons/Icons';

// 👇 CRITICAL FIX: Define your actual storage bucket name here.
const SUPABASE_STORAGE_BUCKET = 'issue-photos';

interface IssueDetailModalProps {
  user: User;
  issue: Issue;
  onClose: () => void;
  onUpdate: (issue: Issue, updates: Partial<Issue>) => Promise<void> | void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ user, issue, onClose, onUpdate }) => {
    const [resolutionText, setResolutionText] = useState(issue.resolution || '');
    const [currentStatus, setCurrentStatus] = useState(issue.status);
    
    // AI Verification State
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(issue.resolutionPhoto || null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [aiScore, setAiScore] = useState<number | null>(null); // Store the probability score

    const canEdit = user.role === Role.Administrator || user.role === Role.Resolver;
    const availableStatuses = Object.values(Status).filter(s => s !== 'Closed');

    // Pre-load the model when modal opens for faster verify
    useEffect(() => {
        loadModel(); 
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProofFile(file);
            setProofPreview(URL.createObjectURL(file));
            // Reset states on new file
            setAiError(null); 
            setAiScore(null);
        }
    };

    const handleSave = async () => {
        if (!canEdit || isVerifying) return;

        // 1. Validation: Mandatory Proof for Potholes
        if (currentStatus === Status.Resolved && issue.category === 'Pothole' && !proofFile && !issue.resolutionPhoto) {
            alert("You must upload a photo of the repaired road to mark this as Resolved.");
            return;
        }

        setIsVerifying(true);

        try {
            let finalPhotoUrl = issue.resolutionPhoto;

            // 2. AI Verification Logic (Only if a NEW file is uploaded)
            if (proofFile && currentStatus === Status.Resolved && issue.category === 'Pothole') {
                console.log("Running AI Verification...");
                
                const imgElement = document.createElement('img');
                imgElement.src = URL.createObjectURL(proofFile);
                
                // Wait for image to load
                await new Promise((resolve) => { imgElement.onload = resolve; });

                // --- RUN YOUR MODEL ---
                const predictionScore = await detectPothole(imgElement);
                setAiScore(predictionScore);

                console.log(`AI Score for this image: ${predictionScore}`);

                // --- BLOCKING LOGIC ---
                if (predictionScore > 0.5) {
                    setAiError(`🚫 Verification Failed: The AI is ${(predictionScore * 100).toFixed(1)}% sure this is still a pothole.`);
                    setIsVerifying(false);
                    return; // STOP HERE. Do not save to DB.
                } else {
                    console.log(`✅ Verification Passed: Clean Road (Confidence: ${(1 - predictionScore).toFixed(2)})`);
                }

                // 3. If Passed, Upload Image to Supabase Storage
                const fileExt = proofFile.name.split('.').pop();
                const fileName = `${issue.id}_resolution_${Math.random()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from(SUPABASE_STORAGE_BUCKET) // ✅ Use constant
                    .upload(fileName, proofFile);

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data } = supabase.storage
                    .from(SUPABASE_STORAGE_BUCKET) // ✅ Use constant
                    .getPublicUrl(fileName);
                
                finalPhotoUrl = data.publicUrl;
            }

            // 4. Save to Database (Only reached if AI passes)
            await onUpdate(issue, { 
                status: currentStatus, 
                resolution: resolutionText,
                resolutionPhoto: finalPhotoUrl 
            });
            
            onClose();

        } catch (error) {
            console.error("Failed to save:", error);
            alert("Error processing request. Check console for details. (Likely Storage Bucket or RLS policy)");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{issue.title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 space-y-6 overflow-y-auto">
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-4">
                            <div><strong>ID:</strong> <span className="font-mono text-gray-600 dark:text-gray-400">{issue.id}</span></div>
                            <div><strong>Category:</strong> <span className="text-gray-600 dark:text-gray-400">{issue.category}</span></div>
                            <div className="flex items-center"><strong>Priority:</strong> <PriorityBadge priority={issue.priority} className="ml-2" /></div>
                        </div>
                        <div className="space-y-4">
                            <div><strong>Reporter:</strong> <span className="text-gray-600 dark:text-gray-400">{issue.reporter.name}</span></div>
                            <div className="flex items-center"><strong>Status:</strong> <StatusBadge status={issue.status} className="ml-2"/></div>
                        </div>
                    </div>

                    {/* Original Issue Image */}
                    {issue.imageUrl && (
                        <div className="relative group">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Original Report</p>
                            <img src={issue.imageUrl} alt="Issue" className="rounded-lg w-full object-cover max-h-48 border border-gray-200" />
                             <a href={issue.imageUrl} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 bg-white text-xs px-2 py-1 rounded shadow opacity-80 hover:opacity-100">View Full</a>
                        </div>
                    )}

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* --- ADMIN ACTION SECTION --- */}
    1.  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">Update Resolution</h3>
                        
                        {/* Status Dropdown */}
                        <div>
                            <label htmlFor="status" className="font-semibold block mb-2 text-sm">Status</label>
                            <select
                                id="status"
                                value={currentStatus}
                                onChange={(e) => setCurrentStatus(e.target.value as Status)}
                                disabled={!canEdit}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                            >
                                {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {/* Resolution Notes */}
                        <div>
                            <label htmlFor="resolution" className="font-semibold block mb-2 text-sm">Resolution Notes</label>
                            <textarea
                                id="resolution"
                                rows={3}
                                value={resolutionText}
                                onChange={(e) => setResolutionText(e.target.value)}
                                placeholder="Describe how the issue was resolved..."
                                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700"
                            />
                        </div>

                        {/* PROOF OF REPAIR (Only if Resolved + Pothole) */}
                        {currentStatus === Status.Resolved && issue.category === 'Pothole' && (
                            <div className={`border-2 border-dashed p-4 rounded-lg transition-colors ${aiError ? 'border-red-400 bg-red-50' : 'border-blue-300 bg-blue-50'}`}>
                                <label className="block font-bold text-blue-800 mb-2">
                                    📸 AI Verification Required
                                </label>
                                <p className="text-xs text-gray-600 mb-3">
                                    Upload a photo of the repaired road. The AI model will scan it. If a pothole is still detected, the update will be blocked.
                                </p>
                                
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-100 file:text-blue-700
                                    hover:file:bg-blue-200"
                                />

                                {proofPreview && (
                                    <div className="mt-3">
                                        <img src={proofPreview} alt="Preview" className="h-32 w-auto rounded border border-blue-200" />
                                    </div>
                                )}

                                {/* Success/Error Messages */}
                                {aiScore !== null && !aiError && (
                                    <div className="mt-3 p-2 bg-green-100 text-green-800 text-sm rounded font-medium animate-pulse">
                                        ✅ Verification Passed! (Clean Confidence: {((1 - aiScore) * 100).toFixed(1)}%)
                                    </div>
                                )}

                                {aiError && (
                                    <div className="mt-3 p-3 bg-red-100 text-red-700 text-sm rounded flex items-center font-bold animate-pulse">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                        {aiError}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="flex justify-end p-5 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onClose} disabled={isVerifying} className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                        Cancel
                    </button>
                    {canEdit && (
                        <button 
                            onClick={handleSave} 
                            disabled={isVerifying}
                            className={`px-4 py-2 text-white rounded-lg w-40 flex justify-center items-center
                                ${isVerifying ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                            `}
                        >
                            {isVerifying ? (
                                <>
                                    <SpinnerIcon className="w-5 h-5 animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : 'Verify & Save'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};