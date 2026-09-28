import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Image, 
  ExternalLink, 
  Sparkles,
  Cloud,
  FileText
} from 'lucide-react';
import { CircuitEngineService } from '../services/circuitEngine';
import type { ThemeMode } from '../types/circuit';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuitTitle: string;
  netlist: string;
  theme: ThemeMode;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  circuitTitle,
  netlist,
  theme
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedNetlist, setCopiedNetlist] = useState(false);

  if (!isOpen) return null;

  const compressed = CircuitEngineService.compressNetlist(netlist);
  const shareUrl = `${window.location.origin}/#ctz=${compressed}`;
  const falstadUrl = `https://www.falstad.com/circuit/circuitjs.html?ctz=${compressed}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyNetlist = () => {
    navigator.clipboard.writeText(netlist);
    setCopiedNetlist(true);
    setTimeout(() => setCopiedNetlist(false), 2000);
  };

  const handleDownloadNetlist = () => {
    const blob = new Blob([netlist], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${circuitTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSvg = () => {
    const svgContent = CircuitEngineService.generateSvgPreview(circuitTitle, theme);
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${circuitTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" id="share-modal-backdrop" onClick={onClose}>
      <div className="modal-dialog share-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <Share2 size={20} className="modal-icon" />
            <div>
              <h2 className="modal-title">Share & Export Schematic</h2>
              <p className="modal-sub">Cloudflare Edge Shortlink, Netlist & Vector Graphics</p>
            </div>
          </div>
          <button 
            id="btn-close-share"
            className="modal-close-btn" 
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="share-modal-body">
          {/* 1. Cloudflare Shareable Link */}
          <div className="share-section">
            <label className="section-label">
              <Cloud size={14} className="label-icon" />
              <span>Cloudflare Shareable Web Link</span>
            </label>
            <div className="link-copy-box">
              <input
                id="share-link-input"
                type="text"
                readOnly
                value={shareUrl}
                className="share-link-input font-mono"
              />
              <button 
                id="btn-copy-share-link"
                className={`copy-btn ${copiedLink ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <p className="section-hint">
              State is compressed with LZ-String algorithms. Anyone with this link gets the exact interactive circuit.
            </p>
          </div>

          {/* 2. Falstad Cross-Compatibility */}
          <div className="share-section">
            <label className="section-label">
              <ExternalLink size={14} className="label-icon" />
              <span>Falstad Interoperability</span>
            </label>
            <div className="falstad-row">
              <a
                href={falstadUrl}
                target="_blank"
                rel="noreferrer"
                className="falstad-link-btn"
              >
                <span>Open in Official Falstad CircuitJS</span>
                <ExternalLink size={13} />
              </a>
              <button 
                id="btn-copy-netlist"
                className={`copy-netlist-btn ${copiedNetlist ? 'copied' : ''}`}
                onClick={handleCopyNetlist}
              >
                {copiedNetlist ? <Check size={13} /> : <FileText size={13} />}
                <span>{copiedNetlist ? 'Netlist Copied!' : 'Copy Netlist Text'}</span>
              </button>
            </div>
          </div>

          {/* 3. Export Options Grid */}
          <div className="share-section">
            <label className="section-label">
              <Download size={14} className="label-icon" />
              <span>Export Schematic Formats</span>
            </label>
            <div className="export-grid">
              <button 
                id="btn-export-svg"
                className="export-tile"
                onClick={handleDownloadSvg}
              >
                <div className="tile-icon-circle green">
                  <Image size={18} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Scalable Vector (SVG)</span>
                  <span className="tile-desc">Crisp vector graphic for papers, lab reports, & slides</span>
                </div>
                <Download size={14} className="tile-dl-icon" />
              </button>

              <button 
                id="btn-export-netlist-file"
                className="export-tile"
                onClick={handleDownloadNetlist}
              >
                <div className="tile-icon-circle cyan">
                  <FileCode size={18} />
                </div>
                <div className="tile-info">
                  <span className="tile-title">Falstad Text File (.txt)</span>
                  <span className="tile-desc">Standard schematic netlist for offline simulation</span>
                </div>
                <Download size={14} className="tile-dl-icon" />
              </button>
            </div>
          </div>

          {/* Cloudflare Edge Hosting Feature Callout */}
          <div className="edge-feature-callout">
            <div className="callout-header">
              <Sparkles size={14} className="callout-icon" />
              <span>Cloudflare Hosting Advantages</span>
            </div>
            <p className="callout-desc">
              This app is architected for <strong>Cloudflare Pages</strong> with edge caching and <strong>Cloudflare Workers + D1</strong> for persistent user schematics with zero egress bandwidth charges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
