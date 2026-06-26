import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, Bell, Palette, Sparkles, Languages, Save, Trash2, 
  Download, Upload, Printer, RotateCcw, Check, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SettingsPage: React.FC = () => {
  const { 
    settings, updateSettings, resetAllData, exportTasks, importTasks, progress, tasks
  } = useApp();

  const [currentSettings, setCurrentSettings] = useState(settings);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync state modifications
  const updateSettingField = (field: keyof typeof settings, value: any) => {
    const updated = { ...currentSettings, [field]: value };
    setCurrentSettings(updated);
    
    // Write back to context instantly for seamless reactivity
    updateSettings(updated);
    
    // Quick success toast for micro-interactions
    if (field === 'themeColor') {
      setSuccessToast(`Theme changed to ${String(value).toUpperCase()}! ✨`);
      setTimeout(() => setSuccessToast(null), 1500);
    }
  };

  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem('tf_settings', JSON.stringify(currentSettings));
    setSuccessToast('Settings applied successfully! ✨');
    setTimeout(() => {
      setSuccessToast(null);
      // Trigger instant app reload to flush theme variables
      window.location.reload();
    }, 1000);
  };

  // Import JSON handler
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            importTasks(parsed);
            setSuccessToast(`Successfully imported ${parsed.length} tasks! 🎉`);
            setTimeout(() => setSuccessToast(null), 3000);
          } else {
            alert('Invalid JSON structure. Must be an array of tasks.');
          }
        } catch (err) {
          alert('Failed to parse backup JSON file.');
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  // Trigger direct browser print for tasks checklist
  const handlePrintTasks = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const activeTasks = tasks.filter(t => !t.archived);
      
      let html = `
        <html>
          <head>
            <title>TaskFlow Checklist Report</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
              h1 { font-size: 28px; margin-bottom: 5px; color: #FF8A3D; }
              p { color: #666; font-size: 14px; margin-top: 0; }
              .task { border-bottom: 1px solid #eee; padding: 15px 0; display: flex; align-items: center; justify-content: space-between; }
              .task-title { font-weight: bold; font-size: 16px; }
              .completed { text-decoration: line-through; color: #999; }
              .meta { font-size: 12px; color: #888; margin-top: 4px; }
              .badge { background: #f0f0f0; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>TaskFlow Active Focus Checklist</h1>
            <p>Generated on ${new Date().toLocaleDateString()} • Streak status: ${progress.streak} days • Current Level: ${progress.level}</p>
            <hr />
      `;

      if (activeTasks.length === 0) {
        html += '<p>No active tasks in database.</p>';
      } else {
        activeTasks.forEach(task => {
          html += `
            <div class="task">
              <div>
                <span class="task-title ${task.completed ? 'completed' : ''}">${task.emoji || '🎯'} ${task.title}</span>
                <div class="meta">Category: ${task.category} • Priority: ${task.priority} • Due: ${task.dueDate || 'All day'}</div>
              </div>
              <span class="badge">${task.completed ? 'COMPLETED' : 'IN PROGRESS'}</span>
            </div>
          `;
        });
      }

      html += `
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full relative z-10 animate-fade-in text-left">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#67C587] text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-[#FF8A3D]" />
          <span>Application Settings</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Customize pastel presets, configure speech reminders, backup checklists, or reset local storage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column options navigation shortcuts */}
        <div className="md:col-span-1 flex flex-col gap-3">
          <div className="p-4 rounded-3xl bg-white/70 border border-white/40 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Quick Preferences</span>
            <div className="flex flex-col gap-2">
              <button onClick={() => updateSettingField('themeColor', 'warm')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#FF8A3D]" />
                <span>Classic Warm Cream</span>
              </button>
              <button onClick={() => updateSettingField('themeColor', 'peach')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#FF8A3D]" />
                <span>Sweet Peach</span>
              </button>
              <button onClick={() => updateSettingField('themeColor', 'pink')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#FF6B6B]" />
                <span>Pastel Pink Candy</span>
              </button>
              <button onClick={() => updateSettingField('themeColor', 'mint')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#67C587]" />
                <span>Organic Mint Green</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Local Storage Database</span>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
              All data is cached locally. Clearing browser cookie cache or factory resets clears tasklists. Import backups anytime.
            </p>
          </div>
        </div>

        {/* Right column core configurations */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Section 1: Bright Presets Theme Selection */}
          <div className="p-6 md:p-8 rounded-[32px] bg-white/70 border border-white/40 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#FF8A3D]" />
              <span>Theme Color Selector</span>
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Option 1 */}
              <button 
                onClick={() => updateSettingField('themeColor', 'warm')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  currentSettings.themeColor === 'warm' ? 'border-[#FF8A3D] bg-orange-50/10 shadow-sm ring-1 ring-[#FF8A3D]' : 'border-slate-100 hover:bg-slate-50/50'
                }`}
              >
                <span className="text-xs font-extrabold text-slate-800">Warm Cream</span>
                <span className="text-[10px] text-slate-400 font-semibold">Background: #FFFDF8</span>
                <div className="flex gap-1.5 mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFFDF8] border border-slate-200" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF8A3D]" />
                </div>
              </button>

              {/* Option 2 */}
              <button 
                onClick={() => updateSettingField('themeColor', 'peach')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  currentSettings.themeColor === 'peach' ? 'border-[#FF8A3D] bg-orange-50/10 shadow-sm ring-1 ring-[#FF8A3D]' : 'border-slate-100 hover:bg-slate-50/50'
                }`}
              >
                <span className="text-xs font-extrabold text-slate-800">Sweet Peach</span>
                <span className="text-[10px] text-slate-400 font-semibold">Background: #FFE7D6</span>
                <div className="flex gap-1.5 mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE7D6] border border-slate-200" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF8A3D]" />
                </div>
              </button>

              {/* Option 3 */}
              <button 
                onClick={() => updateSettingField('themeColor', 'pink')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  currentSettings.themeColor === 'pink' ? 'border-[#FF6B6B] bg-orange-50/10 shadow-sm ring-1 ring-[#FF6B6B]' : 'border-slate-100 hover:bg-slate-50/50'
                }`}
              >
                <span className="text-xs font-extrabold text-slate-800">Pastel Pink</span>
                <span className="text-[10px] text-slate-400 font-semibold">Background: #FFEFF5</span>
                <div className="flex gap-1.5 mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFEFF5] border border-slate-200" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF6B6B]" />
                </div>
              </button>

              {/* Option 4 */}
              <button 
                onClick={() => updateSettingField('themeColor', 'mint')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  currentSettings.themeColor === 'mint' ? 'border-[#67C587] bg-orange-50/10 shadow-sm ring-1 ring-[#67C587]' : 'border-slate-100 hover:bg-slate-50/50'
                }`}
              >
                <span className="text-xs font-extrabold text-slate-800">Organic Mint</span>
                <span className="text-[10px] text-slate-400 font-semibold">Background: #EAFBF2</span>
                <div className="flex gap-1.5 mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#EAFBF2] border border-slate-200" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#67C587]" />
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: General Preferences toggles */}
          <div className="p-6 md:p-8 rounded-[32px] bg-white/70 border border-white/40 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#FF8A3D]" />
              <span>General Toggle Switches</span>
            </h3>

            <div className="flex flex-col gap-4">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/40 border border-slate-100">
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Push Notifications</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Receive desktop prompt alerts when timers expire</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={currentSettings.notificationsEnabled}
                  onChange={(e) => updateSettingField('notificationsEnabled', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-[#FF8A3D] w-4 h-4 border-slate-300 cursor-pointer"
                />
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/40 border border-slate-100">
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Sound & Speech Reminders</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Play soft bell alerts on task completions</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={currentSettings.remindersEnabled}
                  onChange={(e) => updateSettingField('remindersEnabled', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-[#FF8A3D] w-4 h-4 border-slate-300 cursor-pointer"
                />
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/40 border border-slate-100">
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Framer Motion Animations</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Enable particle confetti and slide transitions</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={currentSettings.animationsEnabled}
                  onChange={(e) => updateSettingField('animationsEnabled', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-[#FF8A3D] w-4 h-4 border-slate-300 cursor-pointer"
                />
              </div>

              {/* Selector Language */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/40 border border-slate-100">
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">System Language Selector</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Translate user checklists automatically</span>
                </div>
                <select
                  value={currentSettings.language}
                  onChange={(e) => updateSettingField('language', e.target.value)}
                  className="bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 focus:outline-none"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="de">Deutsch (DE)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 3: Backup Export, Print & Reset */}
          <div className="p-6 md:p-8 rounded-[32px] bg-white/70 border border-white/40 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              <Save className="w-5 h-5 text-[#FF8A3D]" />
              <span>Data Export & Printing</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={exportTasks}
                className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 text-left flex items-start gap-3 cursor-pointer"
              >
                <span className="p-2 rounded-xl bg-orange-50 text-[#FF8A3D]">
                  <Download className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Export JSON File</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Backup all tasks and settings</span>
                </div>
              </button>

              <div className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 text-left flex items-start gap-3 cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImportJson}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <span className="p-2 rounded-xl bg-emerald-50 text-[#67C587]">
                  <Upload className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Import JSON File</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Overwrite/add external backups</span>
                </div>
              </div>

              <button 
                onClick={handlePrintTasks}
                className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 text-left flex items-start gap-3 cursor-pointer"
              >
                <span className="p-2 rounded-xl bg-slate-100 text-slate-600">
                  <Printer className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 block">Print Checklist / Save as PDF</span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Print task report instantly</span>
                </div>
              </button>

              <button 
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to reset all TaskFlow data? This cannot be undone.')) {
                    resetAllData();
                    setSuccessToast('Application data has been wiped clean! 🧹');
                    setTimeout(() => setSuccessToast(null), 2000);
                  }
                }}
                className="p-4 rounded-2xl border border-red-100 hover:bg-red-50/20 text-left flex items-start gap-3 cursor-pointer"
              >
                <span className="p-2 rounded-xl bg-red-50 text-red-500">
                  <RotateCcw className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-extrabold text-red-500 block">Reset All Data</span>
                  <span className="text-[10px] text-red-400 font-semibold block mt-0.5">Wipe device local storage cache</span>
                </div>
              </button>
            </div>
          </div>

          {/* Apply Changes Trigger footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleSaveSettings}
              className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md shadow-slate-900/10 cursor-pointer active:scale-95 transition-all"
            >
              Apply Theme Colorways
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
