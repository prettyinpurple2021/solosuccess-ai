import React, { useEffect } from 'react';
import { X, Command, Search, Palette, HelpCircle } from 'lucide-react';

interface KeyboardShortcutsOverlayProps {
    onClose: () => void;
}

export const KeyboardShortcutsOverlay: React.FC<KeyboardShortcutsOverlayProps> = ({ onClose }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const shortcuts = [
        {
            category: "Navigation",
            items: [
                { keys: ["Cmd", "/"], description: "Open Universal Search" },
                { keys: ["Cmd", "K"], description: "Open Command Palette" },
                { keys: ["?"], description: "Show Keyboard Shortcuts" },
                { keys: ["Esc"], description: "Close Overlays/Modals" }
            ]
        },
        {
            category: "Actions",
            items: [
                { keys: ["Enter"], description: "Submit Input / Execute Command" },
                { keys: ["Cmd", "S"], description: "Save Current Item" },
                { keys: ["Cmd", "E"], description: "Export Current View" }
            ]
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                            <HelpCircle className="text-indigo-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase">Keyboard Shortcuts</h2>
                            <p className="text-xs text-zinc-500 font-mono">Productivity at your fingertips</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
                    {shortcuts.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">{section.category}</h3>
                            <div className="space-y-3">
                                {section.items.map((shortcut, itemIdx) => (
                                    <div key={itemIdx} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                                        <span className="text-sm text-zinc-300">{shortcut.description}</span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, keyIdx) => (
                                                <React.Fragment key={keyIdx}>
                                                    <kbd className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-white shadow-sm min-w-[28px] text-center">
                                                        {key === "Cmd" ? <Command size={12} className="inline" /> : key}
                                                    </kbd>
                                                    {keyIdx < shortcut.keys.length - 1 && <span className="text-zinc-600">+</span>}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-950 text-center">
                    <p className="text-xs text-zinc-500 font-mono">
                        Press <kbd className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs mx-1">Esc</kbd> to close
                    </p>
                </div>
            </div>
        </div>
    );
};
