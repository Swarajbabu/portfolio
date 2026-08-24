/**
 * ==============================================================================
 * ADMIN TAB: ContactTab
 * ==============================================================================
 * Purpose:
 *   Manage contact details, social profiles (LinkedIn, GitHub, LeetCode, CodeChef,
 *   HackerRank), Formspree / Web3Forms email gateways, and footer copyright text.
 * ==============================================================================
 */

import React from "react";
import { TabProps } from "../types";

export const ContactTab: React.FC<TabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-neo-accent border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
        <h2 className="font-black text-xl uppercase tracking-tight text-black">
          Direct Contacts & Social Profiles
        </h2>
      </div>

      {/* Direct Contact Details */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2">
          Contact Information (Shown on Cards)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Email Address</label>
            <input
              type="email"
              value={formData.personal.email || ""}
              onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, email: e.target.value } })}
              placeholder="your.email@gmail.com"
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Mobile / Phone Number</label>
            <input
              type="text"
              value={formData.personal.phone || ""}
              onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, phone: e.target.value } })}
              placeholder="+91-9642985278"
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">Location / Country</label>
            <input
              type="text"
              value={formData.personal.location || ""}
              onChange={(e) => setFormData({ ...formData, personal: { ...formData.personal, location: e.target.value } })}
              placeholder="India"
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social Profiles & Developer Links */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2">
          Social & Coding Platform Profiles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">LinkedIn Profile URL</label>
            <input
              type="text"
              value={formData.personal.linkedin || formData.personal.socials?.linkedin || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: {
                    ...formData.personal,
                    linkedin: e.target.value,
                    socials: { ...formData.personal.socials, linkedin: e.target.value },
                  },
                })
              }
              placeholder="https://linkedin.com/in/username"
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">GitHub Profile URL</label>
            <input
              type="text"
              value={formData.personal.github || formData.personal.socials?.github || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: {
                    ...formData.personal,
                    github: e.target.value,
                    socials: { ...formData.personal.socials, github: e.target.value },
                  },
                })
              }
              placeholder="https://github.com/username"
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">LeetCode Profile URL</label>
            <input
              type="text"
              value={formData.personal.socials?.leetcode || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: {
                    ...formData.personal,
                    socials: { ...formData.personal.socials, leetcode: e.target.value },
                  },
                })
              }
              placeholder="https://leetcode.com/username"
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">CodeChef Profile URL</label>
            <input
              type="text"
              value={formData.personal.socials?.codechef || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: {
                    ...formData.personal,
                    socials: { ...formData.personal.socials, codechef: e.target.value },
                  },
                })
              }
              placeholder="https://codechef.com/users/username"
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">HackerRank Profile URL</label>
            <input
              type="text"
              value={formData.personal.socials?.hackerrank || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: {
                    ...formData.personal,
                    socials: { ...formData.personal.socials, hackerrank: e.target.value },
                  },
                })
              }
              placeholder="https://hackerrank.com/username"
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Free Email Form Delivery Settings */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black/10 pb-2">
          <h3 className="font-black text-sm uppercase tracking-widest text-black">
            Free Form Email Delivery (Receive in Gmail)
          </h3>
          <span className="neo-border bg-neo-accent px-2 py-0.5 font-black text-[10px] uppercase tracking-wider text-black">
            Free & Instant
          </span>
        </div>
        
        <div className="bg-[#FFFDF5] border-2 border-black p-3.5 space-y-2">
          <p className="text-xs font-bold text-black/80">
            💡 <strong>Option A (Formspree)</strong>: Create a free form at <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="underline font-black text-blue-700">formspree.io</a> and paste your Form ID (e.g. <code className="bg-yellow-200 px-1 border border-black">xdoqwpqr</code>) or full URL.
          </p>
          <p className="text-xs font-bold text-black/80">
            💡 <strong>Option B (Web3Forms)</strong>: Get a free instant Access Key at <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="underline font-black text-blue-700">web3forms.com</a> (sent directly to your Gmail with 0 setup).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
              Formspree Form ID or URL
            </label>
            <input
              type="text"
              value={formData.contact.formspreeId || formData.contact.formspreeUrl || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: {
                    ...formData.contact,
                    formspreeId: e.target.value.includes("/") ? "" : e.target.value,
                    formspreeUrl: e.target.value.includes("/") ? e.target.value : "",
                  },
                })
              }
              placeholder="e.g. xvgzpkqw or https://formspree.io/f/xvgzpkqw"
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-xs uppercase tracking-wider mb-1 text-black">
              Web3Forms Access Key
            </label>
            <input
              type="text"
              value={formData.contact.web3FormsKey || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, web3FormsKey: e.target.value },
                })
              }
              placeholder="e.g. 1a2b3c4d-5e6f-7g8h-9i0j..."
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section Copy & Footer Note */}
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h3 className="font-black text-sm uppercase tracking-widest text-black border-b-2 border-black/10 pb-2">
          Section Copy & Footer Settings
        </h3>
        <div>
          <label className="block font-black text-xs uppercase tracking-widest mb-1 text-black">
            Contact Subheadline Copy
          </label>
          <textarea
            rows={2}
            value={formData.contact.copy}
            onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, copy: e.target.value } })}
            className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-black text-xs uppercase tracking-widest mb-1 text-black">
              Form Button Label
            </label>
            <input
              type="text"
              value={formData.contact.submitLabel || "Send Message"}
              onChange={(e) =>
                setFormData({ ...formData, contact: { ...formData.contact, submitLabel: e.target.value } })
              }
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-black text-xs uppercase tracking-widest mb-1 text-black">
              Footer Copyright Note
            </label>
            <input
              type="text"
              value={formData.footer?.note || ""}
              onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, note: e.target.value } })}
              placeholder="© 2026 Swaraj Vecha • All rights reserved."
              className="w-full border-2 border-black bg-[#F7F4EA] px-4 py-2 font-bold text-sm text-black focus:bg-yellow-100 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
