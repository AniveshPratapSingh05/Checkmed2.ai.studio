import React, { useState } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Calendar, 
  Eye, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  Sparkles,
  ChevronRight,
  Info,
  Droplet,
  User,
  Plus
} from 'lucide-react';
import { FamilyMember, Patient } from '../../types';
import { store } from '../../lib/store';
import { FamilyMemberProfileModal } from './FamilyMemberProfileModal';

interface FamilyCentreModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryPatient: Patient;
  onBookAppointmentForMember: (member: FamilyMember) => void;
}

export const FamilyCentreModal: React.FC<FamilyCentreModalProps> = ({
  isOpen,
  onClose,
  primaryPatient,
  onBookAppointmentForMember
}) => {
  const [isAddingMember, setIsAddingMember] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);
  const [viewingProfileMember, setViewingProfileMember] = useState<FamilyMember | null>(null);

  // Add / Edit form states
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [healthIssue, setHealthIssue] = useState<string>('');
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('Other');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [phone, setPhone] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  // Retrieve current active family members for this account
  const familyMembers = store.getFamilyMembers(primaryPatient.id);
  const maxLimit = 4;
  const isLimitReached = familyMembers.length >= maxLimit;
  const remainingSlots = Math.max(0, maxLimit - familyMembers.length);

  const resetForm = () => {
    setName('');
    setAge('');
    setHealthIssue('');
    setRelationship('Other');
    setGender('Male');
    setBloodGroup('O+');
    setPhone('');
    setFormError('');
    setIsAddingMember(false);
    setEditingMember(null);
  };

  const handleStartAdd = (presetSlot?: number) => {
    if (isLimitReached) {
      setFormError('Maximum limit reached. You can manage up to 4 family members.');
      return;
    }
    resetForm();
    setIsAddingMember(true);
  };

  const handleStartEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setName(member.name);
    setAge(member.age.toString());
    setHealthIssue(member.health_issue);
    setRelationship(member.relationship || 'Other');
    setGender(member.gender || 'Male');
    setBloodGroup(member.blood_group || 'O+');
    setPhone(member.phone || '');
    setFormError('');
    setIsAddingMember(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter the family member\'s full name.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 130) {
      setFormError('Please enter a valid age (0 - 130).');
      return;
    }
    if (!healthIssue.trim()) {
      setFormError('Please enter the health issue / specialty reason for visit.');
      return;
    }

    if (editingMember) {
      const res = store.updateFamilyMember(editingMember.id, primaryPatient.id, {
        name: name.trim(),
        age: ageNum,
        health_issue: healthIssue.trim(),
        relationship,
        gender,
        blood_group: bloodGroup,
        phone: phone.trim()
      });
      if (res.success) {
        setSuccessMessage(`Updated profile for ${name.trim()} successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        resetForm();
      } else {
        setFormError(res.error || 'Failed to update family member.');
      }
    } else {
      const res = store.addFamilyMember({
        account_owner_id: primaryPatient.id,
        name: name.trim(),
        age: ageNum,
        health_issue: healthIssue.trim(),
        relationship,
        gender,
        blood_group: bloodGroup,
        phone: phone.trim()
      });
      if (res.success) {
        setSuccessMessage(`Added ${name.trim()} to your Family Centre successfully!`);
        setTimeout(() => setSuccessMessage(''), 3000);
        resetForm();
      } else {
        setFormError(res.error || 'Failed to add family member.');
      }
    }
  };

  const handleConfirmRemove = () => {
    if (!memberToDelete) return;
    const res = store.removeFamilyMember(memberToDelete.id, primaryPatient.id);
    if (res.success) {
      setSuccessMessage(`Removed ${memberToDelete.name} from active family list.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setMemberToDelete(null);
  };

  const getRelationshipBadge = (rel?: string) => {
    switch (rel?.toLowerCase()) {
      case 'father':
      case 'mother':
      case 'grandparent':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'child':
      case 'son':
      case 'daughter':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'spouse':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'brother':
      case 'sister':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
        <div className="bg-[#111C33] text-[#F8FAFC] w-full max-w-4xl rounded-3xl shadow-2xl border border-sky-500/30 overflow-hidden my-6 animate-fade-in flex flex-col max-h-[92vh]">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#162238] to-[#0D1527] p-5 sm:p-6 border-b border-slate-700/80 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
              title="Close Family Centre"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">👨‍👩‍👧‍👦</span>
                  <span className="text-xs uppercase tracking-widest font-black text-emerald-400">
                    Family Healthcare Profiles
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  Family Centre
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                  Manage healthcare profiles for your family members.
                </p>
              </div>

              {/* Status / Capacity Counter */}
              <div className="bg-[#090F1E] border border-sky-500/30 px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Profile Capacity</span>
                  <span className="text-sm font-black text-white">
                    {familyMembers.length} of {maxLimit} profiles used
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                  isLimitReached 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {familyMembers.length}/{maxLimit}
                </div>
              </div>
            </div>

            {/* Account Owner & Info Strip */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  Primary Account Holder: <strong className="text-white">{primaryPatient.full_name}</strong> (ID: {primaryPatient.id})
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                Separate medical records, prescriptions & appointments per family member
              </span>
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="bg-emerald-500/10 border-b border-emerald-500/30 p-3 px-6 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* Modal Main Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Limit Reached Warning Message (when 4 of 4 used) */}
            {isLimitReached && !isAddingMember && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-amber-300 text-sm">Maximum limit reached</h4>
                  <p className="text-slate-300 font-medium">
                    You can manage up to 4 family members. <strong>4 of 4 family profiles used.</strong>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    To add a different family member, you may edit an existing profile or remove an inactive one.
                  </p>
                </div>
              </div>
            )}

            {/* Top Action Bar: Add Member button + Slot options */}
            {!isAddingMember && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Family Profiles</h3>
                  <p className="text-xs text-slate-400">
                    {remainingSlots > 0 
                      ? `You can add ${remainingSlots} more family ${remainingSlots === 1 ? 'member' : 'members'}.`
                      : 'All 4 family profile slots are active.'
                    }
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartAdd()}
                    disabled={isLimitReached}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                      isLimitReached
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20 cursor-pointer active:scale-95'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Add Family Member</span>
                  </button>
                </div>
              </div>
            )}

            {/* ADD / EDIT FAMILY MEMBER FORM */}
            {isAddingMember && (
              <div className="p-5 sm:p-6 rounded-3xl bg-[#090F1E] border border-sky-500/40 shadow-xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      {editingMember ? <Edit3 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {editingMember ? `Edit Family Member: ${editingMember.name}` : 'Add New Family Member'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Enter family member details. Their appointments, prescriptions, and reports will stay isolated.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveMember} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Full Name (Patient Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Mehta, Priya Mehta"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-[#0B132B] text-white focus:ring-2 focus:ring-sky-500 font-medium"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Age (Years) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="130"
                        required
                        placeholder="e.g. 42 or 12"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-[#0B132B] text-white focus:ring-2 focus:ring-sky-500 font-medium"
                      />
                    </div>

                    {/* Health Issue / Reason for Visit */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Health Issue / Reason for Visit *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cardiology, Eye Care, Routine BP Checkup, Pediatrics, Orthopedics"
                        value={healthIssue}
                        onChange={(e) => setHealthIssue(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-[#0B132B] text-white focus:ring-2 focus:ring-sky-500 font-medium"
                      />
                    </div>

                    {/* Relationship */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Relationship to Account Owner
                      </label>
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value as any)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-[#0B132B] text-white focus:ring-2 focus:ring-sky-500 font-medium"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Gender & Blood Group */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value as any)}
                          className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-[#0B132B] text-white focus:ring-2 focus:ring-sky-500 font-medium"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Blood Group
                        </label>
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-[#0B132B] text-white focus:ring-2 focus:ring-sky-500 font-medium"
                        >
                          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                    >
                      {editingMember ? 'Save Changes' : 'Save Family Member'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* EMPTY STATE */}
            {familyMembers.length === 0 && !isAddingMember && (
              <div className="text-center py-12 px-4 rounded-3xl bg-[#090F1E] border border-slate-800 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-3xl mx-auto shadow-inner">
                  👨‍👩‍👧‍👦
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-lg font-black text-white">No family members added yet</h3>
                  <p className="text-xs text-slate-400">
                    Add a family member to manage their hospital appointments and healthcare information from your account.
                  </p>
                </div>
                <button
                  onClick={() => handleStartAdd()}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add Family Member</span>
                </button>
              </div>
            )}

            {/* FAMILY MEMBERS CARDS LIST */}
            {familyMembers.length > 0 && !isAddingMember && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familyMembers.map((member) => {
                  const appointments = store.getPatientAppointments(member.id);
                  const reports = store.getPatientLabReports(member.id);
                  const prescriptions = store.getPatientPrescriptions(member.id);

                  return (
                    <div
                      key={member.id}
                      className="p-5 rounded-3xl bg-[#090F1E] border border-slate-800 hover:border-sky-500/40 transition-all shadow-xl flex flex-col justify-between space-y-4 relative group"
                    >
                      {/* Top Row: Avatar + Name + Age + Relationship */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                              {member.gender === 'Female' ? '👩' : '👨'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-black text-white">{member.name}</h4>
                                <span className={`text-[10px] font-black px-2 py-0.2 rounded-full border ${getRelationshipBadge(member.relationship)}`}>
                                  {member.relationship || 'Family Member'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span>Age: <strong className="text-slate-200">{member.age}</strong></span>
                                <span>•</span>
                                <span>Blood: <strong className="text-rose-400">{member.blood_group || 'O+'}</strong></span>
                              </div>
                            </div>
                          </div>

                          <span className="font-mono text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 shrink-0">
                            {member.id}
                          </span>
                        </div>

                        {/* Health Issue Badge */}
                        <div className="mt-3.5 p-2.5 rounded-2xl bg-[#0B132B] border border-slate-800 flex items-center gap-2 text-xs">
                          <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Health Issue</span>
                            <span className="font-bold text-sky-300 truncate block">{member.health_issue}</span>
                          </div>
                        </div>

                        {/* Quick Stats Pill */}
                        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">
                            📅 {appointments.length} Appointments
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">
                            💊 {prescriptions.length} Prescriptions
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">
                            🧪 {reports.length} Reports
                          </span>
                        </div>
                      </div>

                      {/* 4 ACTION BUTTONS: [View Profile] [Book Appointment] [Edit] [Remove] */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
                        
                        {/* 1. View Profile */}
                        <button
                          onClick={() => setViewingProfileMember(member)}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          title="View complete health profile"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          <span>View Profile</span>
                        </button>

                        {/* 2. Book Appointment */}
                        <button
                          onClick={() => onBookAppointmentForMember(member)}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                          title={`Book OPD appointment for ${member.name}`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Appointment</span>
                        </button>

                        {/* 3. Edit */}
                        <button
                          onClick={() => handleStartEdit(member)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                          title="Edit Family Member"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* 4. Remove */}
                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                          title="Remove Family Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Privacy & Architecture Note */}
            <div className="p-4 rounded-2xl bg-[#090F1E] border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200">Independent Healthcare Architecture:</strong> Family members function as distinct healthcare entities linked to your primary CheckMed account. Their clinical history, appointments, and diagnostic reports remain completely isolated and will never alter your personal profile data.
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-[#0A1020] p-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {familyMembers.length} of {maxLimit} family member slots active
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>

        </div>
      </div>

      {/* CONFIRMATION MODAL FOR REMOVING A FAMILY MEMBER */}
      {memberToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-[#111C33] text-[#F8FAFC] w-full max-w-md rounded-3xl p-6 border border-rose-500/30 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-white">Remove Family Member?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to remove <strong className="text-white">{memberToDelete.name}</strong> from your Family Centre?
              </p>
              <p className="text-[11px] text-slate-400 bg-[#090F1E] p-2.5 rounded-xl border border-slate-800">
                ℹ️ Historical hospital medical records and past receipts will remain safely archived in the database and will not be destroyed.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setMemberToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PROFILE MODAL */}
      {viewingProfileMember && (
        <FamilyMemberProfileModal
          isOpen={!!viewingProfileMember}
          onClose={() => setViewingProfileMember(null)}
          member={viewingProfileMember}
          accountOwnerName={primaryPatient.full_name}
          onBookAppointment={(m) => {
            setViewingProfileMember(null);
            onBookAppointmentForMember(m);
          }}
          onEditMember={(m) => {
            setViewingProfileMember(null);
            handleStartEdit(m);
          }}
          onRemoveMember={(m) => {
            setViewingProfileMember(null);
            setMemberToDelete(m);
          }}
        />
      )}
    </>
  );
};
