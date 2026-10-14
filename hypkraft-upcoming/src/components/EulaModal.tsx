import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface EulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EulaModal: React.FC<EulaModalProps> = ({ isOpen, onClose }) => {
  const [accepted, setAccepted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!accepted) return;
    setDownloadStarted(true);
    sounds.playBassDrop();

    // Trigger download of HypKraft Setup script or package
    const link = document.createElement('a');
    link.href = '/downloads/HypKraft-Studio-Setup-v1.0.0.exe';
    link.setAttribute('download', 'HypKraft-Studio-Setup-v1.0.0.exe');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative bg-white border border-slate-200/90 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Glow corner */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <img
              src="/hypkraft_logo.png"
              alt="HypKraft"
              className="w-10 h-10 rounded-2xl object-contain drop-shadow-md"
            />
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                HypKraft Studio Installation & EULA
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Official License Terms & Zero-Prerequisite Setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 relative z-10 space-y-4 max-h-[70vh] overflow-y-auto">
          {!downloadStarted ? (
            <>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>End User License Agreement (EULA) & Terms of Service</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before downloading and installing HypKraft Studio, you must read and accept the license terms below. This agreement confirms that HypKraft is completely standalone (no Node.js or Python required) and guarantees your 100% intellectual property ownership of all created content.
              </p>

              {/* Scrollable License Terms */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-52 overflow-y-auto text-[11px] font-mono text-slate-600 space-y-2.5 leading-relaxed">
                <p className="font-bold text-slate-900">
                  HYPKRAFT STUDIO END USER LICENSE AGREEMENT (EULA)
                </p>
                <p>Copyright (c) 2026 WebSpider Studios. All rights reserved.</p>
                <p>
                  <strong>1. LICENSE GRANT:</strong> WebSpider Studios grants you a personal, worldwide, non-exclusive license to download, install, and execute HypKraft Studio on Windows devices for multimedia creation, AI video generation, procedural audio composition, and 3D motion graphics.
                </p>
                <p>
                  <strong>2. ZERO-PREREQUISITE GUARANTEE:</strong> HypKraft Studio is engineered with an embedded runtime. The software functions standalone on your machine without requiring Python, Node.js, or external dev environments.
                </p>
                <p>
                  <strong>3. 100% CREATOR OWNERSHIP:</strong> All videos, timelines, audio stems, keyframes, 3D titles, and final rendered productions created by you using HypKraft Studio belong entirely to you. WebSpider Studios claims no royalty or copyright over your creative outputs.
                </p>
                <p>
                  <strong>4. PRIVACY & SECURITY:</strong> HypKraft Studio does not transmit your personal videos, media libraries, or private project assets to external servers without your explicit command. Local processing remains local.
                </p>
                <p>
                  <strong>5. PROHIBITED USES:</strong> You may not repackage malicious software, cryptominers, or unauthorized modified builds containing security exploits.
                </p>
                <p>
                  <strong>6. DISCLAIMER:</strong> HypKraft Studio is provided "AS IS". WebSpider Studios shall not be liable for indirect damages resulting from hardware limitations.
                </p>
              </div>

              {/* Mandatory Acceptance Checkbox */}
              <label className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-start gap-3 cursor-pointer transition hover:bg-indigo-50">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    if (e.target.checked) sounds.playBlip();
                  }}
                  className="w-4 h-4 mt-0.5 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
                <div className="text-xs text-slate-800 font-semibold select-none leading-relaxed">
                  I have read, understood, and accept the HypKraft Studio End User License Agreement (EULA) and Terms of Service.
                </div>
              </label>

              {!accepted && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>You must accept the terms of the EULA above before proceeding to download.</span>
                </div>
              )}
            </>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Download Started!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your HypKraft Studio Setup installer is downloading. Run the downloaded installer to launch your standalone AI studio immediately.
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 text-slate-700 font-medium max-w-md mx-auto">
                <div className="font-bold text-slate-900 mb-1">Quick Installation Steps:</div>
                <div>1. Run <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-700 font-mono text-[11px]">HypKraft-Studio-Setup.exe</code></div>
                <div>2. Confirm the EULA agreement checkbox in the setup wizard</div>
                <div>3. Click "Install" to create Desktop & Start Menu shortcuts</div>
                <div>4. Launch and start creating AI video timelines with zero setup!</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between relative z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            {downloadStarted ? 'Close' : 'Cancel'}
          </button>

          {!downloadStarted ? (
            <button
              onClick={handleDownload}
              disabled={!accepted}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Accept EULA & Download</span>
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1.5"
            >
              <span>Download again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
