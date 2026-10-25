import React, { useState } from 'react';
import { 
  Search, Sparkles, AlertCircle, Stethoscope, 
  Calendar, ArrowRight, ShieldCheck, CheckCircle2, User 
} from 'lucide-react';
import { Doctor } from '../../types';
import { store } from '../../lib/store';

interface PatientConcernSearchProps {
  onSelectDoctorToBook: (doctor: Doctor) => void;
}

interface ConcernMapping {
  keywords: string[];
  department: string;
  category: string;
  description: string;
  recommendedTests: string[];
}

const CONCERN_DIRECTORY: ConcernMapping[] = [
  {
    keywords: ['eye', 'vision', 'blur', 'retina', 'cataract', 'glaucoma', 'cornea', 'spectacles', 'glasses', 'eye pain', 'dry eye', 'squint'],
    department: 'Ophthalmology',
    category: 'Eye Care & Vision Sciences',
    description: 'Comprehensive ophthalmic care, visual acuity, slit lamp, fundus examination, and refractive surgery consultations.',
    recommendedTests: ['Slit Lamp Bio-microscopy', 'Fundus Photography', 'Visual Acuity Test (Snellen)', 'Intraocular Pressure (Tonometry)']
  },
  {
    keywords: ['heart', 'chest', 'palpitation', 'bp', 'blood pressure', 'hypertension', 'breath', 'shortness of breath', 'cardiac', 'angina', 'cholesterol'],
    department: 'Cardiology',
    category: 'Cardiovascular Care',
    description: 'Specialized cardiac evaluation, ECG interpretation, 2D Echo Doppler, Holter monitoring, and cardiovascular risk reduction.',
    recommendedTests: ['12-Lead ECG', '2D Echocardiography', 'Lipid Profile (Cholesterol)', 'Cardiac Troponin I']
  },
  {
    keywords: ['fever', 'cough', 'cold', 'headache', 'weakness', 'infection', 'viral', 'typhoid', 'malaria', 'dengue', 'fatigue', 'body pain'],
    department: 'General Medicine',
    category: 'Internal & General Medicine',
    description: 'Diagnosis and management of infectious diseases, acute fever syndromes, metabolic conditions, and preventative health.',
    recommendedTests: ['Complete Blood Count (CBC)', 'Dengue NS1 Antigen', 'Widal Slide Test', 'Blood Culture']
  },
  {
    keywords: ['bone', 'joint', 'knee', 'back', 'spine', 'fracture', 'arthritis', 'shoulder', 'ortho', 'neck pain', 'ligament', 'sprain'],
    department: 'Orthopedics',
    category: 'Bone & Joint Care',
    description: 'Orthopedic trauma, arthroscopy, joint replacement, spinal disorders, and musculoskeletal rehabilitation.',
    recommendedTests: ['Digital X-Ray (AP/Lateral)', 'MRI Joint Scan', 'Serum Calcium & Vitamin D3', 'Uric Acid']
  },
  {
    keywords: ['child', 'pediatric', 'baby', 'infant', 'vaccine', 'vaccination', 'growth', 'pediatrics', 'kids'],
    department: 'Pediatrics',
    category: 'Child Health & Pediatrics',
    description: 'Newborn care, childhood immunization, pediatric growth milestones, nutritional guidance, and childhood illnesses.',
    recommendedTests: ['Pediatric CBC', 'Growth Chart Screening', 'Serum Electrolytes']
  },
  {
    keywords: ['skin', 'rash', 'acne', 'itching', 'allergy', 'eczema', 'psoriasis', 'fungal', 'hair fall', 'dermatology'],
    department: 'Dermatology',
    category: 'Skin & Allergy Care',
    description: 'Clinical dermatology, skin barrier repair, allergy testing, fungal cultures, and cosmetic dermatosurgery.',
    recommendedTests: ['Skin Scraping for Fungus', 'Serum IgE Allergy Profile', 'Skin Biopsy']
  },
  {
    keywords: ['stomach', 'abdomen', 'gastric', 'acidity', 'gas', 'constipation', 'diarrhea', 'liver', 'jaundice', 'vomiting', 'gastro'],
    department: 'Gastroenterology',
    category: 'Digestive & Liver Health',
    description: 'Evaluation of gastrointestinal disorders, acid peptic diseases, hepatic function, and endoscopic evaluations.',
    recommendedTests: ['Liver Function Test (LFT)', 'Abdominal Ultrasound (USG)', 'Stool Routine & Microscopy']
  },
  {
    keywords: ['brain', 'nerve', 'seizure', 'stroke', 'paralysis', 'dizziness', 'vertigo', 'tremor', 'numbness', 'neurology'],
    department: 'Neurology',
    category: 'Neuro Sciences',
    description: 'Diagnosis and clinical care for cerebrovascular conditions, epilepsy, peripheral neuropathy, and neurological headaches.',
    recommendedTests: ['Brain MRI / CT Scan', 'Electroencephalogram (EEG)', 'Nerve Conduction Study (NCS)']
  }
];

export const PatientConcernSearch: React.FC<PatientConcernSearchProps> = ({ onSelectDoctorToBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const allDoctors = store.doctors;

  // Filter matched departments
  const normalizedQuery = searchTerm.toLowerCase().trim();
  
  const matchedCategories = CONCERN_DIRECTORY.filter(item => {
    if (!normalizedQuery) return true;
    return (
      item.keywords.some(k => normalizedQuery.includes(k) || k.includes(normalizedQuery)) ||
      item.department.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Search Hero */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#152038] to-[#0F172A] border border-[#334155] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Care Navigation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Find Specialists by Health Concern or Symptom</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Search what you are feeling (e.g., <span className="text-amber-300 font-semibold">"eye problem"</span>, <span className="text-rose-300 font-semibold">"chest pain"</span>, <span className="text-sky-300 font-semibold">"fever and cold"</span>) to find relevant departments and available specialists.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type symptoms or concern, e.g. 'eye problem', 'knee pain', 'chest pain'..."
            className="w-full bg-[#0F172A] border-2 border-[#334155] focus:border-sky-400 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:outline-none transition"
          />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-bold">Popular Queries:</span>
          {['Eye Problem', 'Chest Discomfort', 'Viral Fever', 'Knee Joint Pain', 'Child Vaccination', 'Skin Rash', 'Stomach Acidity'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-3 py-1 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] hover:border-sky-400 text-slate-300 hover:text-white rounded-full text-xs transition cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Mandatory Medical Disclaimer */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-200 shadow-inner">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <strong className="text-amber-300 font-black uppercase tracking-wider block">Clinical Safety Disclaimer:</strong>
            <p>
              CheckMed provides hospital department and doctor recommendations based strictly on your search keywords. 
              <strong> CheckMed does not provide automated or AI medical diagnosis.</strong> Always consult a qualified medical doctor for proper diagnosis and treatment. In medical emergencies, call 108/112 immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Matched Departments & Doctors */}
      <div className="space-y-6">
        {matchedCategories.map((item, idx) => {
          const deptDoctors = allDoctors.filter(d => 
            d.department.toLowerCase() === item.department.toLowerCase() ||
            (d.specialization && d.specialization.toLowerCase().includes(item.department.toLowerCase())) ||
            (item.department === 'Ophthalmology' && ((d.department as string) === 'Eye Care' || d.specialization.toLowerCase().includes('eye')))
          );

          return (
            <div
              key={idx}
              className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#334155]">
                <div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-sky-400" />
                    <h3 className="text-lg font-black text-white">{item.category}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">{item.description}</p>
                </div>
                <span className="text-xs font-bold text-sky-300 bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto font-mono">
                  {deptDoctors.length} Available Doctors
                </span>
              </div>

              {/* Recommended Diagnostic Investigations */}
              <div className="bg-[#0F172A] p-4 rounded-2xl border border-[#334155]/60 text-xs space-y-1.5">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Common Diagnostic Tests in {item.department}:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.recommendedTests.map((t, tidx) => (
                    <span key={tidx} className="bg-[#1E293B] text-slate-300 border border-[#334155] px-2.5 py-1 rounded-lg text-[11px]">
                      • {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Specialist Doctors in this Department */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Consulting Specialists:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deptDoctors.map(doctor => (
                    <div
                      key={doctor.id}
                      className="bg-[#0F172A] border border-[#334155] hover:border-sky-500/50 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center font-bold shrink-0">
                          {doctor.full_name.replace('Dr. ', '').charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-white">{doctor.full_name}</p>
                          <p className="text-[11px] text-sky-400 font-medium">{doctor.specialization}</p>
                          <p className="text-[10px] text-slate-400">Room: {doctor.room_no || 'OPD-101'} • Fee: ₹{doctor.consultation_fee}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectDoctorToBook(doctor)}
                        className="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
