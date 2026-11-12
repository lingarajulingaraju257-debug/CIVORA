import React from 'react';
import { X, ZoomIn, Download } from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';

export const ImageModal: React.FC = () => {
  const { selectedPreviewImage, closeImagePreview } = useCivora();

  if (!selectedPreviewImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-blue-400" />
            <div>
              <h4 className="text-sm font-bold text-white">{selectedPreviewImage.title}</h4>
              {selectedPreviewImage.subtitle && (
                <p className="text-xs text-slate-400">{selectedPreviewImage.subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={selectedPreviewImage.url}
              download={selectedPreviewImage.title.replace(/\s+/g, '_') + '.jpg'}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={closeImagePreview}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image viewport */}
        <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-4">
          <img
            src={selectedPreviewImage.url}
            alt={selectedPreviewImage.title}
            className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg border border-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
