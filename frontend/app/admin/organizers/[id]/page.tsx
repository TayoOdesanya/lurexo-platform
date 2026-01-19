'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Download,
  ExternalLink,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import ApproveVerificationModal from '../../../components/admin/ApproveVerificationModal';
import RejectVerificationModal from '../../../components/admin/RejectVerificationModal';
import { mockOrganizerDetailForVerification } from '../../../../lib/mockData/adminStats';

export default function OrganizerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  // In production, fetch organizer by params.id
  const organizer = mockOrganizerDetailForVerification;

  const handleApprove = async () => {
    // TODO: Call API to approve verification
    console.log('Approving organizer:', organizer.id);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowApproveModal(false);
    alert('Organizer verified successfully!');
    router.push('/admin/organizers/pending-verification');
  };

  const handleReject = async (reason: string) => {
    // TODO: Call API to reject verification
    console.log('Rejecting organizer:', organizer.id, 'Reason:', reason);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowRejectModal(false);
    alert('Verification rejected. Organizer has been notified.');
    router.push('/admin/organizers/pending-verification');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      business_license: 'Business License',
      tax_document: 'Tax Document',
      id_proof: 'ID Proof',
      insurance: 'Insurance Certificate',
    };
    return labels[type] || type;
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'business_license':
        return <Building2 className="w-4 h-4" />;
      case 'tax_document':
        return <FileText className="w-4 h-4" />;
      case 'id_proof':
        return <Shield className="w-4 h-4" />;
      case 'insurance':
        return <Shield className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      verified: {
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Verified',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
      },
      pending: {
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Pending Review',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
      },
      rejected: {
        icon: <XCircle className="w-4 h-4" />,
        label: 'Rejected',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
      },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-sm ${config.bg} ${config.border} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/organizers/pending-verification"
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Organizer Verification
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Review and verify organizer details
          </p>
        </div>
        {getStatusBadge(organizer.verificationStatus)}
      </div>

      {/* Verification Alert */}
      {organizer.verificationStatus === 'pending' && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">
                Verification Pending
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                This organizer has submitted all required documents and is awaiting verification approval. Please review the information below carefully before making a decision.
              </p>
              <p className="text-xs text-slate-400">
                Submitted {formatDate(organizer.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - Basic Info (1/3) */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Company Info Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Building2 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{organizer.name}</h3>
                <p className="text-xs text-slate-400">Organization</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <a href={`mailto:${organizer.email}`} className="text-sm text-indigo-400 hover:text-indigo-300 break-all">
                    {organizer.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <a href={`tel:${organizer.phone}`} className="text-sm text-indigo-400 hover:text-indigo-300">
                    {organizer.phone}
                  </a>
                </div>
              </div>

              {organizer.website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Website</p>
                    <a 
                      href={organizer.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {organizer.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Address</p>
                  <p className="text-sm text-white">
                    {organizer.address.street}<br />
                    {organizer.address.city}, {organizer.address.postcode}<br />
                    {organizer.address.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Details */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wide">
              Registration Details
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Company Registration</p>
                <p className="text-sm font-mono text-white bg-slate-800/50 px-3 py-2 rounded border border-slate-700/50">
                  {organizer.companyRegistration}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Tax ID</p>
                <p className="text-sm font-mono text-white bg-slate-800/50 px-3 py-2 rounded border border-slate-700/50">
                  {organizer.taxId}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Account Created</p>
                <p className="text-sm text-white">{formatDate(organizer.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                Bank Details
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Account Name</p>
                <p className="text-sm text-white">{organizer.bankDetails.accountName}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Sort Code</p>
                <p className="text-sm font-mono text-white">{organizer.bankDetails.sortCode}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Account Number</p>
                <p className="text-sm font-mono text-white">••••{organizer.bankDetails.accountNumber.slice(-4)}</p>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wide">
              Platform Activity
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Events Created</span>
                <span className="text-lg font-bold text-white">{organizer.totalEvents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Total Revenue</span>
                <span className="text-lg font-bold text-emerald-400">£{organizer.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Documents & Verification (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Documents Section */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Verification Documents
              </h3>
              <span className="ml-auto px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-semibold text-emerald-400">
                {organizer.documents.length} Documents
              </span>
            </div>

            <div className="space-y-3">
              {organizer.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                      {getDocumentIcon(doc.type)}
                      <span className="text-indigo-400"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {getDocumentTypeLabel(doc.type)}
                      </h4>
                      <p className="text-xs text-slate-400 mb-1 truncate">
                        {doc.fileName}
                      </p>
                      <p className="text-xs text-slate-500">
                        Uploaded {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      doc.status === 'approved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {doc.status === 'approved' ? 'Verified' : 'Pending'}
                    </span>
                    <button className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {organizer.documents.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No documents uploaded yet</p>
              </div>
            )}
          </div>

          {/* Admin Notes */}
          {organizer.notes && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Admin Notes</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {organizer.notes}
              </p>
            </div>
          )}

          {/* Verification Checklist */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Verification Checklist
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-300">Company registration number provided</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-300">Tax ID provided</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-300">Bank details submitted</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-300">
                  {organizer.documents.length} verification document{organizer.documents.length !== 1 ? 's' : ''} uploaded
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-300">Contact information verified</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {organizer.verificationStatus === 'pending' && (
            <div className="sticky bottom-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 rounded-xl font-semibold transition-all"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Verification
                </button>
                
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Verification
                </button>
              </div>
            </div>
          )}

          {/* Already Verified/Rejected Status */}
          {organizer.verificationStatus === 'verified' && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-emerald-400">
                    Organizer Verified
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Verified on {organizer.verifiedAt && formatDate(organizer.verifiedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showApproveModal && (
        <ApproveVerificationModal
          organizerName={organizer.name}
          onConfirm={handleApprove}
          onCancel={() => setShowApproveModal(false)}
        />
      )}

      {showRejectModal && (
        <RejectVerificationModal
          organizerName={organizer.name}
          onConfirm={handleReject}
          onCancel={() => setShowRejectModal(false)}
        />
      )}
    </div>
  );
}