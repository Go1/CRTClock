import React from 'react';
import { X, Settings as SettingsIcon, Palette, Monitor, Zap, Type, Sparkles, Sun, Tv } from 'lucide-react';
import { ClockSettings, fontColorClasses } from '../types/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClockSettings;
  onSettingsChange: (settings: Partial<ClockSettings>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const fontSizeOptions = [
    { value: 'small', label: '小' },
    { value: 'medium', label: '中' },
    { value: 'large', label: '大' },
    { value: 'extra-large', label: '特大' },
  ] as const;

  const fontColorOptions = [
    { value: 'amber', label: 'アンバー', colorClass: 'bg-amber-400' },
    { value: 'blue', label: 'ブルー', colorClass: 'bg-blue-400' },
    { value: 'green', label: 'グリーン', colorClass: 'bg-green-400' },
    { value: 'red', label: 'レッド', colorClass: 'bg-red-400' },
    { value: 'purple', label: 'パープル', colorClass: 'bg-purple-400' },
    { value: 'white', label: 'ホワイト', colorClass: 'bg-white' },
  ] as const;

  const fontFamilyOptions = [
    { value: 'mono', label: 'モノスペース', description: '等幅フォント' },
    { value: 'sans', label: 'サンセリフ', description: 'モダンなゴシック体' },
    { value: 'serif', label: 'セリフ', description: 'クラシックな明朝体' },
    { value: 'pixel', label: 'ピクセル', description: 'Sixtyfour 8ビット風フォント' },
  ] as const;

  const displayFlavorOptions = [
    { 
      value: 'realistic', 
      label: 'リアル', 
      description: '現実的なフリップ時計',
      icon: <Monitor className="w-4 h-4" />
    },
    { 
      value: 'material', 
      label: 'マテリアル', 
      description: 'モダンなマテリアルデザイン',
      icon: <Palette className="w-4 h-4" />
    },
    { 
      value: 'retro-8bit', 
      label: '8ビット', 
      description: 'レトロな8ビット風（Sixtyfourフォント）',
      icon: <Zap className="w-4 h-4" />
    },
  ] as const;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">設定</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Brightness Control */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <Sun className="w-4 h-4" />
              <span>画面の明るさ</span>
              <span className="text-xs text-gray-500">({Math.round(settings.brightness * 100)}%)</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={settings.brightness}
                onChange={(e) => onSettingsChange({ brightness: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>30%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* CRT Effects */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <Tv className="w-4 h-4" />
              <span>CRTエフェクト</span>
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onSettingsChange({ crtEffects: !settings.crtEffects })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.crtEffects ? 'bg-amber-400' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.crtEffects ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-gray-300">
                {settings.crtEffects ? 'ON' : 'OFF'}
              </span>
            </div>
            
            {/* CRT Intensity Slider */}
            {settings.crtEffects && (
              <div className="space-y-2 ml-6">
                <label className="text-xs text-gray-400">
                  エフェクト強度 ({Math.round(settings.crtIntensity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={settings.crtIntensity}
                  onChange={(e) => onSettingsChange({ crtIntensity: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>

          {/* Display Flavor */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              表示フレーバー
            </label>
            <div className="space-y-2">
              {displayFlavorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSettingsChange({ displayFlavor: option.value })}
                  className={`w-full p-3 rounded-lg border text-left transition-colors flex items-center space-x-3 ${
                    settings.displayFlavor === option.value
                      ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className={`${settings.displayFlavor === option.value ? 'text-amber-400' : 'text-gray-400'}`}>
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm opacity-75">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <Type className="w-4 h-4" />
              <span>フォントファミリー</span>
            </label>
            <div className="space-y-2">
              {fontFamilyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSettingsChange({ fontFamily: option.value })}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    settings.fontFamily === option.value
                      ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm opacity-75">{option.description}</div>
                </button>
              ))}
            </div>
            {(settings.displayFlavor === 'retro-8bit' || settings.fontFamily === 'pixel') && (
              <p className="text-xs text-green-400 bg-green-400/10 p-2 rounded">
                💡 Sixtyfourフォントが適用されています
              </p>
            )}
          </div>

          {/* Font Glow - Show for all modes */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <Sparkles className="w-4 h-4" />
              <span>フォントグロー</span>
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onSettingsChange({ fontGlow: !settings.fontGlow })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.fontGlow ? (
                    settings.displayFlavor === 'retro-8bit' || settings.fontFamily === 'pixel' ? 'bg-green-400' : 
                    settings.displayFlavor === 'material' ? 'bg-blue-400' : 'bg-amber-400'
                  ) : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.fontGlow ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-gray-300">
                {settings.fontGlow ? 'フォントにグロー効果を適用' : 'グロー効果なし'}
              </span>
            </div>
          </div>

          {/* Time Format */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              時刻表示形式
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => onSettingsChange({ timeFormat: '24h' })}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  settings.timeFormat === '24h'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                24時間
              </button>
              <button
                onClick={() => onSettingsChange({ timeFormat: '12h' })}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  settings.timeFormat === '12h'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                12時間
              </button>
            </div>
          </div>

          {/* Show Seconds */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              秒表示
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onSettingsChange({ showSeconds: !settings.showSeconds })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showSeconds ? 'bg-amber-400' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showSeconds ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-gray-300">
                {settings.showSeconds ? '表示する' : '表示しない'}
              </span>
            </div>
          </div>

          {/* Flip Mode */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              フリップ構成
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onSettingsChange({ flipMode: 'single' })}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  settings.flipMode === 'single'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">一桁フリップ</div>
                <div className="text-sm opacity-75">各桁が個別にフリップします</div>
              </button>
              <button
                onClick={() => onSettingsChange({ flipMode: 'double' })}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  settings.flipMode === 'double'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">二桁フリップ</div>
                <div className="text-sm opacity-75">時・分・秒が一体でフリップします</div>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              フォントサイズ（動的調整の基準値）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSettingsChange({ fontSize: option.value })}
                  className={`py-2 px-4 rounded-lg border transition-colors ${
                    settings.fontSize === option.value
                      ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              実際のサイズは画面サイズと表示要素数に基づいて自動調整されます
            </p>
          </div>

          {/* Font Color */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              フォントカラー
              {settings.displayFlavor === 'retro-8bit' && (
                <span className="text-xs text-gray-500 ml-2">
                  (8ビットモードでは緑色固定)
                </span>
              )}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontColorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSettingsChange({ fontColor: option.value })}
                  disabled={settings.displayFlavor === 'retro-8bit'}
                  className={`py-3 px-3 rounded-lg border transition-colors flex items-center space-x-2 ${
                    settings.fontColor === option.value
                      ? 'bg-amber-400/20 border-amber-400'
                      : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                  } ${settings.displayFlavor === 'retro-8bit' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-4 h-4 rounded-full ${option.colorClass}`}></div>
                  <span className={`text-sm ${
                    settings.fontColor === option.value ? 'text-amber-400' : 'text-gray-300'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-lg transition-colors"
          >
            設定を保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;