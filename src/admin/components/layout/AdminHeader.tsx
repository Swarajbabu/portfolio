/**
 * ==============================================================================
 * ADMIN COMPONENT: AdminHeader
 * ==============================================================================
 * Purpose:
 *   Top admin header bar containing:
 *   - Return to portfolio button
 *   - Title & subtitle
 *   - Action buttons: Change Passkey, Save Changes, Reset Defaults, Export JSON
 * ==============================================================================
 */

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Key, Save, RotateCcw, Download } from "lucide-react";

interface AdminHeaderProps {
  onOpenPasskeyModal: () => void;
  onSave: () => void;
  onReset: () => void;
  onExport: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenPasskeyModal,
  onSave,
  onReset,
  onExport,
}) => {
  return (
    <header className="border-4 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="border-2 border-black bg-neo-accent p-2 shadow-[3px_3px_0px_0px_#000] neo-btn-press flex-shrink-0 cursor-pointer"
            title="Return to Main Portfolio"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-black" strokeWidth={3} />
          </Link>
          <h1 className="font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-black">
            Portfolio Admin Portal
          </h1>
        </div>
        <p className="font-bold text-[11px] sm:text-xs uppercase tracking-widest text-black/70 mt-1">
          Dynamically edit main page text, skills, projects, & certs
        </p>
      </div>

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
        <button
          onClick={onOpenPasskeyModal}
          className="w-full sm:w-auto border-2 border-black bg-[#FAF8F5] hover:bg-yellow-200 px-3 py-2 sm:px-4 sm:py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center justify-center gap-1.5 sm:gap-2 text-black cursor-pointer"
        >
          <Key className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
          <span>Passkey</span>
        </button>

        <button
          onClick={onSave}
          className="w-full sm:w-auto border-2 border-black bg-neo-accent px-3 py-2 sm:px-5 sm:py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center justify-center gap-1.5 sm:gap-2 text-black cursor-pointer"
        >
          <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
          <span>Save</span>
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto border-2 border-black bg-neo-muted px-3 py-2 sm:px-4 sm:py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center justify-center gap-1.5 sm:gap-2 text-black cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
          <span>Reset</span>
        </button>

        <button
          onClick={onExport}
          className="w-full sm:w-auto border-2 border-black bg-neo-secondary px-3 py-2 sm:px-4 sm:py-2.5 font-black text-xs sm:text-sm uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] neo-btn-press flex items-center justify-center gap-1.5 sm:gap-2 text-black cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
