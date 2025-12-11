'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  AlertTriangle,
  Trash2,
  UserX,
  Database,
  ShieldOff,
  Download,
  RotateCcw,
  Lock,
  X,
  Check,
  Loader
} from 'lucide-react';

export default function DangerZonePage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    setProcessing(true);
    
    // TODO: Implement actual account deletion API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Account deletion request submitted. You will receive a confirmation email.');
    setProcessing(false);
    setShowDeleteModal(false);
    setConfirmText('');
  };

  const handleDeactivateAccount = async () => {
    if (confirmText !== 'DEACTIVATE') {
      alert('Please type DEACTIVATE to confirm');
      return;
    }

    setProcessing(true);
    
    // TODO: Implement actual account deactivation API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Account deactivated successfully. You can reactivate anytime by logging in.');
    setProcessing(false);
    setShowDeactivateModal(false);
    setConfirmText('');
  };

  const handleClearData = async () => {
    if (confirmText !== 'CLEAR') {
      alert('Please type CLEAR to confirm');
      return;
    }

    setProcessing(true);
    
    // TODO: Implement actual data clearing API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('All personal data has been cleared successfully.');
    setProcessing(false);
    setShowClearDataModal(false);
    setConfirmText('');
  };

  const handleRevokeAccess = async () => {
    setProcessing(true);
    
    // TODO: Implement actual revoke access API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('All third-party access has been revoked successfully.');
    setProcessing(false);
    setShowRevokeModal(false);
  };

  const handleExportData = async () => {
    // TODO: Implement actual data export
    alert('Your data export will be emailed to you within 24 hours.');
  };

  const ConfirmationModal = ({ 
    show, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    confirmWord,
    icon: Icon,
    color = 'red'
  }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-md w-full border-2 border-red-500/30 shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${color}-500/20 rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${color}-400`} />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <h2 className="text-white text-xl font-bold">{title}</h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-300 text-sm mb-6">
              {description}
            </p>

            {confirmWord && (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Type <span className="text-white font-bold">{confirmWord}</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={confirmWord}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-800/50 border-t border-gray-800 flex gap-3">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={processing || (confirmWord && confirmText !== confirmWord)}
              className={`flex-1 bg-${color}-600 hover:bg-${color}-500 disabled:bg-gray-700 disabled:text-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black pb-6">
      {/* MOBILE ONLY: Header with back button */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </Link>
          <div>
            <h1 className="text-white text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Danger Zone
            </h1>
            <p className="text-gray-400 text-xs">Irreversible actions - proceed with caution</p>
          </div>
        </div>
      </div>

        {/* DESKTOP ONLY: Simple page header */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-white text-2xl font-bold">Danger Zone</h1>
            <p className="text-gray-400 text-sm">Irreversible actions - proceed with caution</p>
        </div>
        </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Warning Banner */}
        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6">
          <div className="flex gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div>
              <h2 className="text-red-400 font-bold text-lg mb-2">Warning</h2>
              <p className="text-red-300/80 text-sm leading-relaxed">
                The actions in this section are permanent and cannot be undone. Please make sure you understand the consequences before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Safe Actions First */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-white font-semibold">Safe Actions</h2>
            <p className="text-gray-400 text-xs mt-1">These actions can be reversed</p>
          </div>

          {/* Export Data */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Export Your Data</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Download a copy of all your account data, including profile information, orders, and preferences.
                  </p>
                  <ul className="text-gray-500 text-xs space-y-1 mb-3">
                    <li>• Includes all personal information</li>
                    <li>• Order history and tickets</li>
                    <li>• Delivered via email within 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Request Data Export
            </button>
          </div>

          {/* Revoke Third-Party Access */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldOff className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Revoke Third-Party Access</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Remove all third-party app connections and API access to your account.
                  </p>
                  <ul className="text-gray-500 text-xs space-y-1 mb-3">
                    <li>• Disconnects all connected apps</li>
                    <li>• Revokes API tokens</li>
                    <li>• Can be restored by reconnecting</li>
                  </ul>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowRevokeModal(true)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Revoke All Access
            </button>
          </div>
        </div>

        {/* Destructive Actions */}
        <div className="bg-gray-900 rounded-2xl border-2 border-red-500/30 overflow-hidden">
          <div className="p-6 border-b border-red-500/30 bg-red-500/5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-red-400 font-semibold">Destructive Actions</h2>
            </div>
            <p className="text-red-300/70 text-xs mt-1">These actions cannot be undone</p>
          </div>

          {/* Clear All Data */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Clear All Data</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Permanently delete all your order history, favorites, and preferences while keeping your account active.
                  </p>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                    <p className="text-yellow-400 text-xs font-semibold mb-1">⚠️ This will remove:</p>
                    <ul className="text-yellow-300/80 text-xs space-y-1">
                      <li>• All order history</li>
                      <li>• Saved favorites and preferences</li>
                      <li>• Past ticket information</li>
                      <li>• Your account will remain active</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowClearDataModal(true)}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Clear All Data
            </button>
          </div>

          {/* Deactivate Account */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Deactivate Account</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Temporarily disable your account. You can reactivate it anytime by logging back in.
                  </p>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-3">
                    <p className="text-orange-400 text-xs font-semibold mb-1">ℹ️ What happens:</p>
                    <ul className="text-orange-300/80 text-xs space-y-1">
                      <li>• Your profile will be hidden</li>
                      <li>• You won't receive notifications</li>
                      <li>• Active tickets remain valid</li>
                      <li>• Reactivate anytime by logging in</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Deactivate Account
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-6 bg-red-500/5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Delete Account Permanently</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Permanently delete your account and all associated data. This action cannot be reversed.
                  </p>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                    <p className="text-red-400 text-xs font-semibold mb-1">🔥 This will permanently delete:</p>
                    <ul className="text-red-300/80 text-xs space-y-1">
                      <li>• Your account and profile</li>
                      <li>• All order history and tickets</li>
                      <li>• Saved preferences and favorites</li>
                      <li>• Payment methods</li>
                      <li>• All personal data</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-3">
                    <p className="text-gray-400 text-xs">
                      <strong className="text-white">Note:</strong> Any active tickets will remain valid until the event date, but you won't be able to access them through your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account Permanently
            </button>
          </div>
        </div>

        {/* Support Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold text-sm mb-1">Need Help?</h3>
              <p className="text-blue-300/80 text-xs mb-3">
                If you're having issues with your account, our support team can help. You don't need to delete your account to resolve most problems.
              </p>
              <Link href="/contact">
                <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                  Contact Support →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConfirmText('');
        }}
        onConfirm={handleDeleteAccount}
        title="Delete Account Permanently"
        description="This action cannot be undone. Your account and all associated data will be permanently deleted. Any active tickets will remain valid but won't be accessible through your account."
        confirmWord="DELETE"
        icon={Trash2}
        color="red"
      />

      <ConfirmationModal
        show={showDeactivateModal}
        onClose={() => {
          setShowDeactivateModal(false);
          setConfirmText('');
        }}
        onConfirm={handleDeactivateAccount}
        title="Deactivate Account"
        description="Your account will be temporarily disabled. You can reactivate it anytime by logging back in. Your data will be preserved."
        confirmWord="DEACTIVATE"
        icon={Lock}
        color="orange"
      />

      <ConfirmationModal
        show={showClearDataModal}
        onClose={() => {
          setShowClearDataModal(false);
          setConfirmText('');
        }}
        onConfirm={handleClearData}
        title="Clear All Data"
        description="This will permanently delete all your order history, favorites, and preferences. Your account will remain active but all data will be removed."
        confirmWord="CLEAR"
        icon={Database}
        color="yellow"
      />

      <ConfirmationModal
        show={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        onConfirm={handleRevokeAccess}
        title="Revoke Third-Party Access"
        description="This will disconnect all third-party apps and revoke all API access to your account. You can reconnect apps later if needed."
        icon={ShieldOff}
        color="orange"
      />
    </div>
  );
}