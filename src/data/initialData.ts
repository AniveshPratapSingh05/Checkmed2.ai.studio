import { 
  Doctor, Patient, FamilyMember, Appointment, Token, Bed, LabReport, Bill, Ambulance, BloodStock, Medicine, HospitalRecord,
  IcuBedRecord, IcuPatientRecord, IcuVitalsRecord, IcuTimelineEvent, IcuEquipmentRecord, IcuOxygenSupportRecord,
  IcuStaffAssignment, IcuAlertRecord, IcuTransferDischargeLog, IcuAuditLog,
  EyeRecord, EyeSurgeryRecord, OxygenCylinderRecord, XRayRecord, MriRecord, CtScanRecord,
  CardiologyRecord, PathologyTestRecord, OtRoom, SurgeryScheduleRecord, BloodBankUnitRecord, BloodRequestRecord,
  MedicalEquipmentRecord, ModuleAuditLog,
  DoctorPrescription, DoctorClinicalNote, DoctorNotification, DoctorFollowUp, DoctorActivityLog,
  DoctorResourceRequest, AdminDoctorMessage, ConsultationFeeRecord, MedicalSupplyItem, SystemAuditLog
} from '../types';

export const INITIAL_HOSPITALS: HospitalRecord[] = [
  // Varanasi
  {
    id: 'hosp-vns-1',
    name: 'Sir Sunderlal Hospital (IMS BHU)',
    city: 'Varanasi',
    address: 'Lanka, BHU Campus, Varanasi, Uttar Pradesh 221005',
    contact_number: '+91 542 2367568',
    emergency_hotline: '+91 542 2307500',
    icu_beds_available: 38,
    total_beds: 1500,
    blood_bank_status: 'Adequate',
    ambulance_count: 12,
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Oncology', 'Emergency'],
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Medical College'
  },
  {
    id: 'hosp-vns-2',
    name: 'Heritage Hospitals',
    city: 'Varanasi',
    address: 'Lanka-GTM Road, Near BHU Gate, Varanasi, Uttar Pradesh 221005',
    contact_number: '+91 542 7188888',
    emergency_hotline: '+91 542 7188800',
    icu_beds_available: 18,
    total_beds: 350,
    blood_bank_status: 'Adequate',
    ambulance_count: 6,
    departments: ['Cardiology', 'Orthopedics', 'Gastro Care' as any, 'Emergency', 'ENT', 'Dermatology'],
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Super Speciality'
  },
  {
    id: 'hosp-vns-3',
    name: 'Apex Super Speciality Hospital',
    city: 'Varanasi',
    address: 'DLW Hydel Road, Kakarmatta, Varanasi, Uttar Pradesh 221004',
    contact_number: '+91 542 2311222',
    emergency_hotline: '+91 542 2311999',
    icu_beds_available: 12,
    total_beds: 200,
    blood_bank_status: 'Limited',
    ambulance_count: 4,
    departments: ['Oncology', 'Neurology', 'Orthopedics', 'General Medicine', 'Pediatrics'],
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Multispeciality'
  },

  // Lucknow
  {
    id: 'hosp-lko-1',
    name: "King George's Medical University (KGMU)",
    city: 'Lucknow',
    address: 'Shah Mina Road, Chowk, Lucknow, Uttar Pradesh 226003',
    contact_number: '+91 522 2257450',
    emergency_hotline: '+91 522 2257500',
    icu_beds_available: 65,
    total_beds: 4500,
    blood_bank_status: 'Adequate',
    ambulance_count: 24,
    departments: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'ENT', 'Dermatology'],
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Medical College'
  },
  {
    id: 'hosp-lko-2',
    name: 'Sanjay Gandhi Postgraduate Institute (SGPGI)',
    city: 'Lucknow',
    address: 'Raebareli Road, Lucknow, Uttar Pradesh 226014',
    contact_number: '+91 522 2668700',
    emergency_hotline: '+91 522 2668800',
    icu_beds_available: 42,
    total_beds: 1200,
    blood_bank_status: 'Adequate',
    ambulance_count: 10,
    departments: ['Neurology', 'Cardiology', 'Oncology', 'General Medicine', 'Pediatrics'],
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Government'
  },
  {
    id: 'hosp-lko-3',
    name: 'Medanta Super Speciality Hospital',
    city: 'Lucknow',
    address: 'Sector B, Pocket 1, Amar Shaheed Path, Lucknow, Uttar Pradesh 226030',
    contact_number: '+91 522 4505050',
    emergency_hotline: '+91 522 4505000',
    icu_beds_available: 50,
    total_beds: 1000,
    blood_bank_status: 'Adequate',
    ambulance_count: 15,
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'Oncology', 'Gynecology'],
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Super Speciality'
  },

  // Kanpur
  {
    id: 'hosp-knp-1',
    name: 'GSVM Medical College & LLL Hospital',
    city: 'Kanpur',
    address: 'Swaroop Nagar, Kanpur, Uttar Pradesh 208002',
    contact_number: '+91 512 2535483',
    emergency_hotline: '+91 512 2535500',
    icu_beds_available: 28,
    total_beds: 1800,
    blood_bank_status: 'Adequate',
    ambulance_count: 8,
    departments: ['Emergency', 'Cardiology', 'General Medicine', 'Orthopedics', 'Pediatrics', 'Gynecology'],
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Medical College'
  },
  {
    id: 'hosp-knp-2',
    name: 'Regency Hospital (Rawatpur)',
    city: 'Kanpur',
    address: 'A-2, Sarvodaya Nagar, Rawatpur, Kanpur, Uttar Pradesh 208005',
    contact_number: '+91 512 3081111',
    emergency_hotline: '+91 512 3081000',
    icu_beds_available: 22,
    total_beds: 500,
    blood_bank_status: 'Adequate',
    ambulance_count: 6,
    departments: ['Oncology', 'Cardiology', 'Neurology', 'Orthopedics', 'Emergency'],
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Super Speciality'
  },
  {
    id: 'hosp-knp-3',
    name: 'Fortune Hospital',
    city: 'Kanpur',
    address: 'Sharda Nagar, Kakadeo, Kanpur, Uttar Pradesh 208025',
    contact_number: '+91 512 2500052',
    emergency_hotline: '+91 512 2500108',
    icu_beds_available: 14,
    total_beds: 250,
    blood_bank_status: 'Limited',
    ambulance_count: 4,
    departments: ['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics'],
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Multispeciality'
  },

  // Gorakhpur
  {
    id: 'hosp-gkp-1',
    name: 'AIIMS Gorakhpur',
    city: 'Gorakhpur',
    address: 'Kuni, Deoria Road, Gorakhpur, Uttar Pradesh 273008',
    contact_number: '+91 551 2205501',
    emergency_hotline: '+91 551 2205508',
    icu_beds_available: 35,
    total_beds: 750,
    blood_bank_status: 'Adequate',
    ambulance_count: 9,
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Emergency', 'ENT'],
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Government'
  },
  {
    id: 'hosp-gkp-2',
    name: 'BRD Medical College & Hospital',
    city: 'Gorakhpur',
    address: 'Medical Road, Gorakhpur, Uttar Pradesh 273013',
    contact_number: '+91 551 2310112',
    emergency_hotline: '+91 551 2310100',
    icu_beds_available: 30,
    total_beds: 1100,
    blood_bank_status: 'Adequate',
    ambulance_count: 7,
    departments: ['Pediatrics', 'Emergency', 'General Medicine', 'Gynecology', 'Orthopedics'],
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Medical College'
  },
  {
    id: 'hosp-gkp-3',
    name: 'Rana Hospital & Trauma Center',
    city: 'Gorakhpur',
    address: 'Paddila, Near Transport Nagar, Gorakhpur, Uttar Pradesh 273001',
    contact_number: '+91 551 2200210',
    emergency_hotline: '+91 551 2200108',
    icu_beds_available: 15,
    total_beds: 200,
    blood_bank_status: 'Limited',
    ambulance_count: 5,
    departments: ['Emergency', 'Orthopedics', 'Neurology', 'General Medicine'],
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Multispeciality'
  },

  // Allahabad (Prayagraj)
  {
    id: 'hosp-ald-1',
    name: 'MLN Medical College & SRN Hospital',
    city: 'Allahabad (Prayagraj)',
    address: 'Lowther Road, George Town, Prayagraj, Uttar Pradesh 211002',
    contact_number: '+91 532 2256402',
    emergency_hotline: '+91 532 2256108',
    icu_beds_available: 40,
    total_beds: 1600,
    blood_bank_status: 'Adequate',
    ambulance_count: 11,
    departments: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Gynecology'],
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Medical College'
  },
  {
    id: 'hosp-ald-2',
    name: 'Nazareth Hospital',
    city: 'Allahabad (Prayagraj)',
    address: '13-A, Kamla Nehru Road, Thornton, Civil Lines, Prayagraj, Uttar Pradesh 211001',
    contact_number: '+91 532 2407423',
    emergency_hotline: '+91 532 2407108',
    icu_beds_available: 16,
    total_beds: 350,
    blood_bank_status: 'Adequate',
    ambulance_count: 5,
    departments: ['General Medicine', 'Orthopedics', 'Pediatrics', 'Gynecology', 'ENT'],
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Multispeciality'
  },
  {
    id: 'hosp-ald-3',
    name: 'Vatsalya Hospital',
    city: 'Allahabad (Prayagraj)',
    address: '6/8-A, Hashimpur Road, Tagore Town, Prayagraj, Uttar Pradesh 211002',
    contact_number: '+91 532 2465134',
    emergency_hotline: '+91 532 2465100',
    icu_beds_available: 12,
    total_beds: 180,
    blood_bank_status: 'Limited',
    ambulance_count: 3,
    departments: ['Gynecology', 'Pediatrics', 'General Medicine', 'Dermatology'],
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    is_24_7_emergency: true,
    type: 'Super Speciality'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  // --- PRE-AUTHORIZED CHECKMED DOCTORS ---
  {
    id: 'doc-anivesh',
    full_name: 'Dr. Anivesh Pratap Singh',
    email: 'aniveshpratapsingh@gmail.com',
    phone: '+91 98765 00101',
    department: 'Cardiology',
    specialization: 'Cardiology & Blood Testing',
    qualification: 'MBBS, MD (Cardiology) - AIIMS Delhi',
    graduation: 'AIIMS Delhi',
    experience_yrs: 16,
    consultation_fee: 800,
    room_no: 'OPD 101 - Cardiology & Blood Testing Wing',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    shift_hours: '09:00 AM - 02:00 PM',
    rating: 4.9,
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    city: 'Varanasi',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'doc-deepanshu',
    full_name: 'Dr. Deepanshu Singh',
    email: 'deepanshusingh@gmail.com',
    phone: '+91 98765 00202',
    department: 'Neurology',
    specialization: 'Neurology & CT Scan Reading',
    qualification: 'MBBS, DM (Neurology) - AIIMS Madras',
    graduation: 'AIIMS Madras',
    experience_yrs: 14,
    consultation_fee: 850,
    room_no: 'OPD 204 - Neuro & CT Diagnostic Wing',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    shift_hours: '10:00 AM - 03:00 PM',
    rating: 4.9,
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    city: 'Varanasi',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'doc-rahul',
    full_name: 'Dr. Rahul Singh',
    email: 'rahulsingh@gmail.com',
    phone: '+91 98765 00303',
    department: 'General Medicine',
    specialization: 'Eye Care / Eye Specialist & X-Ray',
    qualification: 'MBBS, MS (Ophthalmology) - AIIMS Delhi',
    graduation: 'AIIMS Delhi',
    experience_yrs: 12,
    consultation_fee: 700,
    room_no: 'OPD 305 - Eye Care & Digital X-Ray Wing',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    shift_hours: '09:00 AM - 02:00 PM',
    rating: 4.8,
    available_days: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
    city: 'Varanasi',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },

  // Varanasi Doctors
  {
    id: 'doc-vns-1',
    full_name: 'Dr. Rajesh Sharma',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology & Heart Surgery',
    qualification: 'MD, DM (Cardiology), FACC',
    experience_yrs: 18,
    consultation_fee: 800,
    room_no: 'OPD 101 - BHU',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    shift_hours: '09:00 AM - 02:00 PM',
    rating: 4.9,
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    city: 'Varanasi',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'doc-vns-2',
    full_name: 'Dr. Anand Prakash Tripathi',
    department: 'Neurology',
    specialization: 'Stroke & Epilepsy Care',
    qualification: 'MBBS, DM (Neurology)',
    experience_yrs: 14,
    consultation_fee: 750,
    room_no: 'OPD 204 - Heritage',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    shift_hours: '10:00 AM - 03:00 PM',
    rating: 4.8,
    available_days: ['Mon', 'Wed', 'Fri'],
    city: 'Varanasi',
    hospital_name: 'Heritage Hospitals'
  },

  // Lucknow Doctors
  {
    id: 'doc-lko-1',
    full_name: 'Dr. Ananya Roy',
    department: 'Neurology',
    specialization: 'Neuro-Pathology & Brain Surgery',
    qualification: 'MBBS, M.Ch (Neurosurgery) - KGMU',
    experience_yrs: 15,
    consultation_fee: 900,
    room_no: 'OPD 104 - KGMU',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1594824813566-88855ce783d1?auto=format&fit=crop&w=400&q=80',
    shift_hours: '10:00 AM - 04:00 PM',
    rating: 4.9,
    available_days: ['Mon', 'Tue', 'Wed', 'Fri'],
    city: 'Lucknow',
    hospital_name: "King George's Medical University (KGMU)"
  },
  {
    id: 'doc-lko-2',
    full_name: 'Dr. S. K. Srivastava',
    department: 'Cardiology',
    specialization: 'Cardiac Electrophysiology & Angioplasty',
    qualification: 'MD, DM (Cardiology) - Medanta',
    experience_yrs: 22,
    consultation_fee: 1200,
    room_no: 'Medanta Tower A - OPD 301',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    shift_hours: '09:00 AM - 03:00 PM',
    rating: 5.0,
    available_days: ['Mon', 'Tue', 'Thu', 'Sat'],
    city: 'Lucknow',
    hospital_name: 'Medanta Super Speciality Hospital'
  },

  // Kanpur Doctors
  {
    id: 'doc-knp-1',
    full_name: 'Dr. Vikramaditya Verma',
    department: 'Orthopedics',
    specialization: 'Joint Replacement & Knee Arthroscopy',
    qualification: 'MS (Ortho) - GSVM Kanpur',
    experience_yrs: 16,
    consultation_fee: 750,
    room_no: 'OPD 202 - LLL Hospital',
    status: 'In Consultation',
    avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    shift_hours: '09:00 AM - 01:00 PM',
    rating: 4.7,
    available_days: ['Mon', 'Tue', 'Thu', 'Sat'],
    city: 'Kanpur',
    hospital_name: 'GSVM Medical College & LLL Hospital'
  },
  {
    id: 'doc-knp-2',
    full_name: 'Dr. Rita Saxena',
    department: 'Oncology',
    specialization: 'Radiation & Surgical Oncology',
    qualification: 'MD, DM (Onco) - Regency',
    experience_yrs: 13,
    consultation_fee: 1000,
    room_no: 'Regency Cancer Wing - OPD 12',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=400&q=80',
    shift_hours: '11:00 AM - 04:00 PM',
    rating: 4.8,
    available_days: ['Mon', 'Wed', 'Fri'],
    city: 'Kanpur',
    hospital_name: 'Regency Hospital (Rawatpur)'
  },

  // Gorakhpur Doctors
  {
    id: 'doc-gkp-1',
    full_name: 'Dr. Arvind Patel',
    department: 'General Medicine',
    specialization: 'Internal Medicine & Tropical Diseases',
    qualification: 'MBBS, MD (Medicine) - AIIMS GKP',
    experience_yrs: 20,
    consultation_fee: 500,
    room_no: 'OPD Block A - AIIMS',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    shift_hours: '08:30 AM - 02:30 PM',
    rating: 4.9,
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    city: 'Gorakhpur',
    hospital_name: 'AIIMS Gorakhpur'
  },
  {
    id: 'doc-gkp-2',
    full_name: 'Dr. Priya Sundaram',
    department: 'Pediatrics',
    specialization: 'Child Care & Neonatal Critical Care',
    qualification: 'MD (Pediatrics), DCH - BRD',
    experience_yrs: 11,
    consultation_fee: 600,
    room_no: 'OPD 108 - BRD Medical',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    shift_hours: '11:00 AM - 05:00 PM',
    rating: 4.8,
    available_days: ['Tue', 'Wed', 'Fri', 'Sat'],
    city: 'Gorakhpur',
    hospital_name: 'BRD Medical College & Hospital'
  },

  // Allahabad (Prayagraj) Doctors
  {
    id: 'doc-ald-1',
    full_name: 'Dr. Sanjay Gupta',
    department: 'Emergency',
    specialization: 'Trauma & Emergency Care Specialist',
    qualification: 'MD (Emergency Med), MEM - MLN',
    experience_yrs: 17,
    consultation_fee: 850,
    room_no: 'SRN Emergency Wing 1',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    shift_hours: '24/7 Shift Rotation',
    rating: 4.9,
    available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    city: 'Allahabad (Prayagraj)',
    hospital_name: 'MLN Medical College & SRN Hospital'
  },
  {
    id: 'doc-ald-2',
    full_name: 'Dr. Sneha Kulkarni',
    department: 'Gynecology',
    specialization: 'Maternal-Fetal Medicine & Laparoscopy',
    qualification: 'MS (OB-GYN), DGO - Nazareth',
    experience_yrs: 12,
    consultation_fee: 700,
    room_no: 'OPD 106 - Nazareth',
    status: 'Available',
    avatar_url: 'https://images.unsplash.com/photo-1594824813566-88855ce783d1?auto=format&fit=crop&w=400&q=80',
    shift_hours: '10:00 AM - 03:00 PM',
    rating: 4.8,
    available_days: ['Mon', 'Wed', 'Thu', 'Sat'],
    city: 'Allahabad (Prayagraj)',
    hospital_name: 'Nazareth Hospital'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  // --- PATIENTS ASSIGNED TO DR. ANIVESH PRATAP SINGH (Cardiology & Blood Testing) ---
  {
    id: 'pat-101',
    full_name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 98765 43210',
    age: 34,
    gender: 'Male',
    blood_group: 'O+',
    address: 'B-12 Jawahar Nagar, Varanasi',
    medical_history: 'Essential Hypertension, Hyperlipidemia',
    room_no: 'Room 204',
    required_test: 'Blood Test (Lipid Profile & Troponin-I)',
    created_at: '2026-08-01'
  },
  {
    id: 'pat-105',
    full_name: 'Vikramaditya Rastogi',
    email: 'vikram.rastogi@example.com',
    phone: '+91 98234 11223',
    age: 58,
    gender: 'Male',
    blood_group: 'B+',
    address: 'C-44 Sigra, Varanasi',
    medical_history: 'Coronary Artery Disease, Post-PTCA',
    room_no: 'Room 102',
    icu_bed: 'ICU Bed-4',
    required_test: 'Cardiac Biomarkers & CBC Blood Count',
    created_at: '2026-08-02'
  },
  {
    id: 'pat-106',
    full_name: 'Priya Agrawal',
    email: 'priya.agrawal@example.com',
    phone: '+91 97890 22334',
    age: 42,
    gender: 'Female',
    blood_group: 'A+',
    address: 'Flat 301, Ganga Heights, Varanasi',
    medical_history: 'Palpitations, Mitral Valve Prolapse (Mild)',
    room_no: 'Room 208',
    required_test: 'Lipid Profile & 2D Echocardiogram',
    created_at: '2026-08-04'
  },
  {
    id: 'pat-107',
    full_name: 'Harish Chandra Varma',
    email: 'harish.varma@example.com',
    phone: '+91 96541 33445',
    age: 63,
    gender: 'Male',
    blood_group: 'AB+',
    address: '42 Durgakund, Varanasi',
    medical_history: 'Ischemic Heart Disease, Type 2 Diabetes',
    room_no: 'Room 312',
    required_test: 'Serum Electrolytes & HbA1c Blood Test',
    created_at: '2026-08-05'
  },

  // --- PATIENTS ASSIGNED TO DR. DEEPANSHU SINGH (Neurology & CT Scan Reading) ---
  {
    id: 'pat-104',
    full_name: 'Sunita Bose',
    email: 'sunita.bose@example.com',
    phone: '+91 96543 21098',
    age: 45,
    gender: 'Female',
    blood_group: 'AB+',
    address: '14 Tagore Town, Varanasi',
    medical_history: 'Chronic Migraine, Occasional Vertigo',
    room_no: 'Room 105',
    icu_bed: 'ICU Bed-2',
    required_test: 'Brain CT Scan with Contrast',
    created_at: '2026-08-06'
  },
  {
    id: 'pat-108',
    full_name: 'Alok Nath Mishra',
    email: 'alok.mishra@example.com',
    phone: '+91 99123 44556',
    age: 51,
    gender: 'Male',
    blood_group: 'O+',
    address: 'Lane 7, Assi Ghat, Varanasi',
    medical_history: 'Transient Ischemic Attack (TIA), Carotid Stenosis',
    room_no: 'Room 214',
    required_test: 'Non-Contrast Head CT Scan',
    created_at: '2026-08-07'
  },
  {
    id: 'pat-109',
    full_name: 'Kavita Sundaram',
    email: 'kavita.sundaram@example.com',
    phone: '+91 98345 55667',
    age: 38,
    gender: 'Female',
    blood_group: 'B+',
    address: 'B-18 Mahmoorganj, Varanasi',
    medical_history: 'Cervical Radiculopathy, Peripheral Neuropathy',
    room_no: 'Room 302',
    required_test: 'Cervical Spine CT Scan & NCS',
    created_at: '2026-08-08'
  },
  {
    id: 'pat-110',
    full_name: 'Devendra Pathak',
    email: 'devendra.p@example.com',
    phone: '+91 97456 66778',
    age: 29,
    gender: 'Male',
    blood_group: 'A+',
    address: 'Sector 5, Shivpur, Varanasi',
    medical_history: 'Focal Seizure Disorder, Post-Concussion Syndrome',
    room_no: 'Room 108',
    required_test: 'Brain CT Scan & EEG',
    created_at: '2026-08-09'
  },

  // --- PATIENTS ASSIGNED TO DR. RAHUL SINGH (Eye Care / Eye Specialist & X-Ray) ---
  {
    id: 'pat-102',
    full_name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    phone: '+91 98123 45678',
    age: 28,
    gender: 'Female',
    blood_group: 'A+',
    address: 'Flat 202, Surya Enclave, Varanasi',
    medical_history: 'Refractive Error (Myopia), Dry Eye Syndrome',
    room_no: 'Room 305',
    required_test: 'Slit Lamp Bio-microscopy & Tonometry',
    created_at: '2026-08-03'
  },
  {
    id: 'pat-103',
    full_name: 'Rohan Deshmukh',
    email: 'rohan.d@example.com',
    phone: '+91 97654 32109',
    age: 52,
    gender: 'Male',
    blood_group: 'B+',
    address: 'Green Park Extension, Varanasi',
    medical_history: 'Diabetic Eye Changes & Chest Discomfort',
    room_no: 'Room 220',
    required_test: 'Fundus Photography & Digital Chest X-Ray',
    created_at: '2026-08-05'
  },
  {
    id: 'pat-111',
    full_name: 'Shanti Devi',
    email: 'shanti.devi@example.com',
    phone: '+91 96123 77889',
    age: 67,
    gender: 'Female',
    blood_group: 'O-',
    address: 'Vill. Ramnagar, Varanasi',
    medical_history: 'Mature Senile Cataract (Right Eye), Osteoarthritis',
    room_no: 'Room 118',
    required_test: 'Ocular Biometry & Chest X-Ray (Pre-Op)',
    created_at: '2026-08-07'
  },
  {
    id: 'pat-112',
    full_name: 'Manoj Kumar Tiwari',
    email: 'manoj.tiwari@example.com',
    phone: '+91 95234 88990',
    age: 41,
    gender: 'Male',
    blood_group: 'AB-',
    address: 'Kashi Vidyapeeth Road, Varanasi',
    medical_history: 'Corneal Abrasion, Facial Trauma Post-MVA',
    room_no: 'Room 205',
    required_test: 'Fluorescein Staining & Facial Bone X-Ray',
    created_at: '2026-08-08'
  }
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-101-1',
    account_owner_id: 'pat-101',
    name: 'Rahul Mehta',
    age: 42,
    health_issue: 'Cardiology',
    relationship: 'Brother',
    gender: 'Male',
    blood_group: 'O+',
    status: 'Active',
    created_at: '2026-08-10'
  },
  {
    id: 'fam-101-2',
    account_owner_id: 'pat-101',
    name: 'Priya Mehta',
    age: 12,
    health_issue: 'Eye Care',
    relationship: 'Daughter',
    gender: 'Female',
    blood_group: 'B+',
    status: 'Active',
    created_at: '2026-08-12'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  // --- APPOINTMENTS FOR DR. ANIVESH PRATAP SINGH (Cardiology & Blood Testing) ---
  {
    id: 'apt-crd-101',
    patient_id: 'pat-101',
    doctor_id: 'doc-anivesh',
    patient_name: 'Aarav Mehta',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    department: 'Cardiology',
    appointment_date: '2026-08-12',
    time_slot: '10:00 AM',
    reason: 'Cardiology consultation & BP stabilization',
    status: 'In-Progress',
    token_number: 'TK-101',
    consultation_type: 'In-Person',
    room_no: 'Room 204',
    required_test: 'Blood Test (Lipid & Troponin) + ECG',
    created_at: '2026-08-10'
  },
  {
    id: 'apt-crd-102',
    patient_id: 'pat-105',
    doctor_id: 'doc-anivesh',
    patient_name: 'Vikramaditya Rastogi',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    department: 'Cardiology',
    appointment_date: '2026-08-12',
    time_slot: '11:30 AM',
    reason: 'Post-Angiography Critical Cardiac Review',
    status: 'Upcoming',
    token_number: 'TK-102',
    consultation_type: 'In-Person',
    room_no: 'Room 102',
    icu_bed: 'ICU Bed-4',
    required_test: 'Cardiac Biomarkers & CBC Blood Count',
    created_at: '2026-08-11'
  },
  {
    id: 'apt-crd-103',
    patient_id: 'pat-106',
    doctor_id: 'doc-anivesh',
    patient_name: 'Priya Agrawal',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    department: 'Cardiology',
    appointment_date: '2026-08-13',
    time_slot: '09:15 AM',
    reason: 'Palpitations & Fasting Lipid Profile Analysis',
    status: 'Upcoming',
    token_number: 'TK-103',
    consultation_type: 'In-Person',
    room_no: 'Room 208',
    required_test: 'Lipid Profile & 2D Echocardiogram',
    created_at: '2026-08-11'
  },
  {
    id: 'apt-crd-104',
    patient_id: 'pat-107',
    doctor_id: 'doc-anivesh',
    patient_name: 'Harish Chandra Varma',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    department: 'Cardiology',
    appointment_date: '2026-08-10',
    time_slot: '02:00 PM',
    reason: 'Post-Stent Follow-Up & Electrolyte Monitoring',
    status: 'Completed',
    token_number: 'TK-095',
    consultation_type: 'In-Person',
    room_no: 'Room 312',
    required_test: 'Serum Electrolytes & Blood Sugar',
    created_at: '2026-08-09'
  },

  // --- APPOINTMENTS FOR DR. DEEPANSHU SINGH (Neurology & CT Scan Reading) ---
  {
    id: 'apt-neu-201',
    patient_id: 'pat-104',
    doctor_id: 'doc-deepanshu',
    patient_name: 'Sunita Bose',
    doctor_name: 'Dr. Deepanshu Singh',
    department: 'Neurology',
    appointment_date: '2026-08-12',
    time_slot: '10:30 AM',
    reason: 'Chronic Migraine & Acute Dizziness Diagnostic Review',
    status: 'In-Progress',
    token_number: 'TK-201',
    consultation_type: 'In-Person',
    room_no: 'Room 105',
    icu_bed: 'ICU Bed-2',
    required_test: 'Brain CT Scan with Contrast',
    created_at: '2026-08-10'
  },
  {
    id: 'apt-neu-202',
    patient_id: 'pat-108',
    doctor_id: 'doc-deepanshu',
    patient_name: 'Alok Nath Mishra',
    doctor_name: 'Dr. Deepanshu Singh',
    department: 'Neurology',
    appointment_date: '2026-08-12',
    time_slot: '12:00 PM',
    reason: 'Transient Ischemic Attack CT Scan Evaluation',
    status: 'Upcoming',
    token_number: 'TK-202',
    consultation_type: 'In-Person',
    room_no: 'Room 214',
    required_test: 'Non-Contrast Head CT Scan',
    created_at: '2026-08-11'
  },
  {
    id: 'apt-neu-203',
    patient_id: 'pat-109',
    doctor_id: 'doc-deepanshu',
    patient_name: 'Kavita Sundaram',
    doctor_name: 'Dr. Deepanshu Singh',
    department: 'Neurology',
    appointment_date: '2026-08-13',
    time_slot: '11:00 AM',
    reason: 'Cervical spine neuropathy & CT review',
    status: 'Upcoming',
    token_number: 'TK-203',
    consultation_type: 'In-Person',
    room_no: 'Room 302',
    required_test: 'Cervical Spine CT Scan & NCS',
    created_at: '2026-08-11'
  },
  {
    id: 'apt-neu-204',
    patient_id: 'pat-110',
    doctor_id: 'doc-deepanshu',
    patient_name: 'Devendra Pathak',
    doctor_name: 'Dr. Deepanshu Singh',
    department: 'Neurology',
    appointment_date: '2026-08-09',
    time_slot: '03:30 PM',
    reason: 'Post-Trauma Head CT Scan & Seizure Workup',
    status: 'Completed',
    token_number: 'TK-188',
    consultation_type: 'In-Person',
    room_no: 'Room 108',
    required_test: 'Brain CT Scan & EEG',
    created_at: '2026-08-08'
  },

  // --- APPOINTMENTS FOR DR. RAHUL SINGH (Eye Care / Eye Specialist & X-Ray) ---
  {
    id: 'apt-eye-301',
    patient_id: 'pat-102',
    doctor_id: 'doc-rahul',
    patient_name: 'Meera Iyer',
    doctor_name: 'Dr. Rahul Singh',
    department: 'General Medicine',
    appointment_date: '2026-08-12',
    time_slot: '09:30 AM',
    reason: 'Eye Care & Visual Acuity Assessment',
    status: 'In-Progress',
    token_number: 'TK-301',
    consultation_type: 'In-Person',
    room_no: 'Room 305',
    required_test: 'Slit Lamp Bio-microscopy & Tonometry',
    created_at: '2026-08-10'
  },
  {
    id: 'apt-eye-302',
    patient_id: 'pat-103',
    doctor_id: 'doc-rahul',
    patient_name: 'Rohan Deshmukh',
    doctor_name: 'Dr. Rahul Singh',
    department: 'General Medicine',
    appointment_date: '2026-08-12',
    time_slot: '11:15 AM',
    reason: 'Diabetic Eye Screening & Chest X-Ray Review',
    status: 'Upcoming',
    token_number: 'TK-302',
    consultation_type: 'In-Person',
    room_no: 'Room 220',
    required_test: 'Fundus Photography & Digital Chest X-Ray',
    created_at: '2026-08-11'
  },
  {
    id: 'apt-eye-303',
    patient_id: 'pat-111',
    doctor_id: 'doc-rahul',
    patient_name: 'Shanti Devi',
    doctor_name: 'Dr. Rahul Singh',
    department: 'General Medicine',
    appointment_date: '2026-08-13',
    time_slot: '10:00 AM',
    reason: 'Pre-Operative Cataract & Digital X-Ray Check',
    status: 'Upcoming',
    token_number: 'TK-303',
    consultation_type: 'In-Person',
    room_no: 'Room 118',
    required_test: 'Ocular Biometry & Chest X-Ray (Pre-Op)',
    created_at: '2026-08-11'
  },
  {
    id: 'apt-eye-304',
    patient_id: 'pat-112',
    doctor_id: 'doc-rahul',
    patient_name: 'Manoj Kumar Tiwari',
    doctor_name: 'Dr. Rahul Singh',
    department: 'General Medicine',
    appointment_date: '2026-08-08',
    time_slot: '01:30 PM',
    reason: 'Corneal Abrasion & Facial X-Ray Assessment',
    status: 'Completed',
    token_number: 'TK-270',
    consultation_type: 'In-Person',
    room_no: 'Room 205',
    required_test: 'Fluorescein Staining & Facial Bone X-Ray',
    created_at: '2026-08-07'
  }
];

export const INITIAL_TOKENS: Token[] = [
  {
    id: 'tok-101',
    appointment_id: 'apt-501',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    doctor_id: 'doc-1',
    doctor_name: 'Dr. Rajesh Sharma',
    department: 'Cardiology',
    token_number: 'TK-101',
    queue_position: 1,
    status: 'Serving',
    estimated_time_mins: 0,
    room_no: 'OPD 101',
    created_at: '2026-08-12T09:30:00'
  },
  {
    id: 'tok-102',
    appointment_id: 'apt-502',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    doctor_id: 'doc-5',
    doctor_name: 'Dr. Arvind Patel',
    department: 'General Medicine',
    token_number: 'TK-102',
    queue_position: 2,
    status: 'Waiting',
    estimated_time_mins: 15,
    room_no: 'OPD 102',
    created_at: '2026-08-12T09:40:00'
  },
  {
    id: 'tok-103',
    appointment_id: 'apt-503',
    patient_id: 'pat-103',
    patient_name: 'Rohan Deshmukh',
    doctor_id: 'doc-3',
    doctor_name: 'Dr. Vikramaditya Verma',
    department: 'Orthopedics',
    token_number: 'TK-103',
    queue_position: 3,
    status: 'Waiting',
    estimated_time_mins: 30,
    room_no: 'OPD 202',
    created_at: '2026-08-12T10:00:00'
  }
];

export const INITIAL_BEDS: Bed[] = [
  // Varanasi
  { id: 'b-vns-1', ward_name: 'ICU', bed_number: 'BHU-ICU-01', bed_type: 'ICU Ventilator', status: 'Occupied', price_per_day: 4500, patient_id: 'pat-103', patient_name: 'Rohan Deshmukh', assigned_date: '2026-08-10', city: 'Varanasi', hospital_name: 'Sir Sunderlal Hospital (IMS BHU)' },
  { id: 'b-vns-2', ward_name: 'ICU', bed_number: 'BHU-ICU-02', bed_type: 'ICU Ventilator', status: 'Available', price_per_day: 4500, city: 'Varanasi', hospital_name: 'Sir Sunderlal Hospital (IMS BHU)' },
  { id: 'b-vns-3', ward_name: 'Emergency', bed_number: 'HER-EMG-01', bed_type: 'Oxygen', status: 'Available', price_per_day: 2800, city: 'Varanasi', hospital_name: 'Heritage Hospitals' },
  { id: 'b-vns-4', ward_name: 'General Male', bed_number: 'HER-GM-101', bed_type: 'Standard', status: 'Available', price_per_day: 1500, city: 'Varanasi', hospital_name: 'Heritage Hospitals' },
  { id: 'b-vns-5', ward_name: 'ICU', bed_number: 'APO-ICU-01', bed_type: 'ICU Ventilator', status: 'Available', price_per_day: 5500, city: 'Varanasi', hospital_name: 'Apex Super Speciality Hospital' },

  // Lucknow
  { id: 'b-lko-1', ward_name: 'ICU', bed_number: 'KGMU-ICU-01', bed_type: 'ICU Ventilator', status: 'Available', price_per_day: 3500, city: 'Lucknow', hospital_name: "King George's Medical University (KGMU)" },
  { id: 'b-lko-2', ward_name: 'ICU', bed_number: 'MED-ICU-02', bed_type: 'ICU Ventilator', status: 'Available', price_per_day: 6500, city: 'Lucknow', hospital_name: 'Medanta Super Speciality Hospital' },
  { id: 'b-lko-3', ward_name: 'Emergency', bed_number: 'KGMU-EMG-01', bed_type: 'Oxygen', status: 'Occupied', price_per_day: 2500, patient_id: 'pat-101', patient_name: 'Aarav Mehta', assigned_date: '2026-08-11', city: 'Lucknow', hospital_name: "King George's Medical University (KGMU)" },
  { id: 'b-lko-4', ward_name: 'Deluxe Private Suite', bed_number: 'MED-STE-501', bed_type: 'Private Luxury', status: 'Available', price_per_day: 8000, city: 'Lucknow', hospital_name: 'Medanta Super Speciality Hospital' },
  { id: 'b-lko-5', ward_name: 'Pediatric Ward', bed_number: 'SGPGI-PED-01', bed_type: 'Standard', status: 'Available', price_per_day: 2000, city: 'Lucknow', hospital_name: 'Sanjay Gandhi Postgraduate Institute (SGPGI)' },

  // Kanpur
  { id: 'b-knp-1', ward_name: 'ICU', bed_number: 'GSVM-ICU-01', bed_type: 'ICU Ventilator', status: 'Available', price_per_day: 3200, city: 'Kanpur', hospital_name: 'GSVM Medical College & LLL Hospital' },
  { id: 'b-knp-2', ward_name: 'ICU', bed_number: 'REG-ICU-01', bed_type: 'ICU Ventilator', status: 'Occupied', price_per_day: 5200, patient_id: 'pat-104', patient_name: 'Sunita Bose', assigned_date: '2026-08-08', city: 'Kanpur', hospital_name: 'Regency Hospital (Rawatpur)' },
  { id: 'b-knp-3', ward_name: 'Emergency', bed_number: 'GSVM-EMG-02', bed_type: 'Oxygen', status: 'Available', price_per_day: 2000, city: 'Kanpur', hospital_name: 'GSVM Medical College & LLL Hospital' },

  // Gorakhpur
  { id: 'b-gkp-1', ward_name: 'ICU', bed_number: 'BRD-ICU-01', bed_type: 'ICU Ventilator', status: 'Available', price_per_day: 3000, city: 'Gorakhpur', hospital_name: 'BRD Medical College & Hospital' },
  { id: 'b-gkp-2', ward_name: 'ICU', bed_number: 'AIIMS-ICU-01', bed_type: 'ICU Ventilator', status: 'Available', price_per_day: 4000, city: 'Gorakhpur', hospital_name: 'AIIMS Gorakhpur' },
  { id: 'b-gkp-3', ward_name: 'Emergency', bed_number: 'BRD-EMG-01', bed_type: 'Oxygen', status: 'Available', price_per_day: 1800, city: 'Gorakhpur', hospital_name: 'BRD Medical College & Hospital' },
  { id: 'b-gkp-4', ward_name: 'Pediatric Ward', bed_number: 'BRD-PED-101', bed_type: 'Standard', status: 'Available', price_per_day: 1500, city: 'Gorakhpur', hospital_name: 'BRD Medical College & Hospital' },

  // Allahabad (Prayagraj)
  { id: 'b-ald-1', ward_name: 'ICU', bed_number: 'SRN-ICU-01', bed_type: 'ICU Ventilator', status: 'Available', price_per_day: 3200, city: 'Allahabad (Prayagraj)', hospital_name: 'MLN Medical College & SRN Hospital' },
  { id: 'b-ald-2', ward_name: 'ICU', bed_number: 'NAZ-ICU-01', bed_type: 'ICU Ventilator', status: 'Available', price_per_day: 4500, city: 'Allahabad (Prayagraj)', hospital_name: 'Nazareth Hospital' },
  { id: 'b-ald-3', ward_name: 'Emergency', bed_number: 'SRN-EMG-01', bed_type: 'Oxygen', status: 'Occupied', price_per_day: 2200, patient_id: 'pat-102', patient_name: 'Meera Iyer', assigned_date: '2026-08-11', city: 'Allahabad (Prayagraj)', hospital_name: 'MLN Medical College & SRN Hospital' },
  { id: 'b-ald-4', ward_name: 'General Female', bed_number: 'NAZ-GF-201', bed_type: 'Standard', status: 'Available', price_per_day: 1400, city: 'Allahabad (Prayagraj)', hospital_name: 'Nazareth Hospital' }
];

export const INITIAL_LAB_REPORTS: LabReport[] = [
  {
    id: 'TEST-801',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    doctor_name: 'Dr. Rajesh Sharma',
    test_name: 'Complete Lipid Profile & ECG',
    test_category: 'Cardiology',
    sample_collection_date: '2026-08-11 08:30 AM',
    expected_report_date: '2026-08-11 04:00 PM',
    test_date: '2026-08-11',
    status: 'Report Ready',
    result_summary: 'Total Cholesterol: 195 mg/dL (Normal). Sinus rhythm with mild elevation.',
    normal_range: 'Cholesterol < 200 mg/dL',
    findings: 'Heart rhythm normal. Normal sinus rhythm. Serum lipid levels within desired limits.',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    parameters: [
      { parameter_name: 'Total Cholesterol', result_value: '195', unit: 'mg/dL', reference_range: '120 - 200', is_abnormal: false },
      { parameter_name: 'Triglycerides', result_value: '142', unit: 'mg/dL', reference_range: '< 150', is_abnormal: false },
      { parameter_name: 'HDL Cholesterol (Good)', result_value: '48', unit: 'mg/dL', reference_range: '> 40', is_abnormal: false },
      { parameter_name: 'LDL Cholesterol (Bad)', result_value: '118', unit: 'mg/dL', reference_range: '< 130', is_abnormal: false },
      { parameter_name: 'VLDL Cholesterol', result_value: '29', unit: 'mg/dL', reference_range: '10 - 30', is_abnormal: false }
    ],
    created_at: '2026-08-11'
  },
  {
    id: 'TEST-802',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    doctor_name: 'Dr. Arvind Patel',
    test_name: 'Complete Blood Count (CBC) & HbA1c',
    test_category: 'Pathology',
    sample_collection_date: '2026-08-12 09:00 AM',
    expected_report_date: '2026-08-12 06:00 PM',
    test_date: '2026-08-12',
    status: 'Processing',
    result_summary: 'Sample received at Central Pathology Lab. Automated cell counter analysis underway.',
    normal_range: 'Hb: 13.0 - 17.5 g/dL',
    findings: 'Automated centrifugation completed. Analyzer run queued.',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    parameters: [
      { parameter_name: 'Hemoglobin (Hb)', result_value: '14.2', unit: 'g/dL', reference_range: '13.0 - 17.5', is_abnormal: false },
      { parameter_name: 'Total Leukocyte Count (TLC)', result_value: '7,800', unit: '/cumm', reference_range: '4,000 - 11,000', is_abnormal: false },
      { parameter_name: 'Platelet Count', result_value: '2.4', unit: 'Lakhs/cumm', reference_range: '1.5 - 4.5', is_abnormal: false }
    ],
    created_at: '2026-08-12'
  },
  {
    id: 'TEST-803',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    doctor_name: 'Dr. Arvind Patel',
    test_name: 'Dengue NS1 Antigen & Platelet Count',
    test_category: 'Microbiology',
    sample_collection_date: '2026-08-12 10:15 AM',
    expected_report_date: '2026-08-12 05:30 PM',
    test_date: '2026-08-12',
    status: 'Sample Collected',
    result_summary: 'Venous blood sample drawn at collection counter 3. Transit to lab.',
    normal_range: 'NS1 Antigen: Negative',
    findings: 'Sample logged in barcode system. Transported under 4°C cold chain.',
    hospital_name: 'BRD Medical College & Hospital',
    parameters: [
      { parameter_name: 'Dengue NS1 Antigen', result_value: 'Pending Analysis', unit: 'ELISA Index', reference_range: 'Negative (< 0.9)', is_abnormal: false }
    ],
    created_at: '2026-08-12'
  },
  {
    id: 'TEST-804',
    patient_id: 'pat-103',
    patient_name: 'Rohan Deshmukh',
    doctor_name: 'Dr. Vikramaditya Verma',
    test_name: 'Knee Joint Digital X-Ray (AP & Lateral)',
    test_category: 'Radiology',
    sample_collection_date: '2026-08-12 11:00 AM (Scheduled)',
    expected_report_date: '2026-08-12 07:00 PM',
    test_date: '2026-08-12',
    status: 'Sample Pending',
    result_summary: 'Token issued for X-Ray Room #4. Patient requested to report at radiology desk.',
    normal_range: 'Intact cortical bone alignment',
    findings: 'Awaiting patient arrival in radiology waiting lounge.',
    hospital_name: 'Heritage Hospitals',
    parameters: [],
    created_at: '2026-08-12'
  },
  {
    id: 'TEST-805',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    doctor_name: 'Dr. Rajesh Sharma',
    test_name: 'Liver Function Test (LFT) & Kidney Function (KFT)',
    test_category: 'Biochemistry',
    sample_collection_date: '2026-08-10 08:00 AM',
    expected_report_date: '2026-08-10 03:00 PM',
    test_date: '2026-08-10',
    status: 'Report Delivered',
    result_summary: 'Serum Bilirubin: 0.9 mg/dL. Serum Creatinine: 0.95 mg/dL. All parameters normal.',
    normal_range: 'Bilirubin: 0.2 - 1.2 mg/dL, Creatinine: 0.7 - 1.3 mg/dL',
    findings: 'Hepatic and Renal biochemistry panels unremarkable.',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    parameters: [
      { parameter_name: 'Serum Bilirubin Total', result_value: '0.9', unit: 'mg/dL', reference_range: '0.2 - 1.2', is_abnormal: false },
      { parameter_name: 'SGOT (AST)', result_value: '28', unit: 'U/L', reference_range: '5 - 40', is_abnormal: false },
      { parameter_name: 'SGPT (ALT)', result_value: '31', unit: 'U/L', reference_range: '7 - 56', is_abnormal: false },
      { parameter_name: 'Blood Urea Nitrogen (BUN)', result_value: '14', unit: 'mg/dL', reference_range: '7 - 20', is_abnormal: false },
      { parameter_name: 'Serum Creatinine', result_value: '0.95', unit: 'mg/dL', reference_range: '0.7 - 1.3', is_abnormal: false }
    ],
    created_at: '2026-08-10'
  },
  {
    id: 'TEST-806',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    doctor_name: 'Dr. Ananya Roy',
    test_name: 'Brain MRI Scan with Contrast',
    test_category: 'Radiology',
    sample_collection_date: '2026-08-09 02:30 PM',
    expected_report_date: '2026-08-09 07:00 PM',
    test_date: '2026-08-09',
    status: 'Report Delivered',
    result_summary: 'No focal brain lesion or vascular acute infarction identified.',
    normal_range: 'Unremarkable brain parenchyma',
    findings: 'Features suggestive of vascular tension headache. Medication advised.',
    hospital_name: 'Regency Hospital (Rawatpur)',
    parameters: [],
    created_at: '2026-08-09'
  },
  {
    id: 'TEST-807',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    doctor_name: 'Dr. Arvind Patel',
    test_name: 'Thyroid Profile (T3, T4, TSH)',
    test_category: 'Endocrinology',
    sample_collection_date: '2026-08-08 09:00 AM',
    expected_report_date: '2026-08-08 05:00 PM',
    test_date: '2026-08-08',
    status: 'Cancelled',
    result_summary: 'Test order cancelled upon doctor consultation review.',
    normal_range: 'TSH: 0.4 - 4.2 µIU/mL',
    findings: 'Order cancelled due to duplicate test requisition.',
    hospital_name: 'BRD Medical College & Hospital',
    parameters: [],
    created_at: '2026-08-08'
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bill-901',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    appointment_id: 'apt-501',
    invoice_number: 'INV-2026-0801',
    date: '2026-08-10',
    items: [
      { description: 'Cardiology OPD Consultation', quantity: 1, unit_price: 800, total: 800 },
      { description: '12-Lead Electrocardiogram (ECG)', quantity: 1, unit_price: 500, total: 500 },
      { description: 'Lipid Profile Blood Test', quantity: 1, unit_price: 700, total: 700 }
    ],
    subtotal: 2000,
    tax: 100,
    discount: 100,
    net_amount: 2000,
    payment_status: 'Paid',
    payment_method: 'UPI',
    created_at: '2026-08-10'
  },
  {
    id: 'bill-902',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    appointment_id: 'apt-502',
    invoice_number: 'INV-2026-0802',
    date: '2026-08-11',
    items: [
      { description: 'General Physician Consultation', quantity: 1, unit_price: 500, total: 500 },
      { description: 'CBC & Fever Panel Test', quantity: 1, unit_price: 850, total: 850 }
    ],
    subtotal: 1350,
    tax: 68,
    discount: 0,
    net_amount: 1418,
    payment_status: 'Unpaid',
    created_at: '2026-08-11'
  },
  {
    id: 'bill-903',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    appointment_id: 'apt-504',
    invoice_number: 'INV-2026-0803',
    date: '2026-08-09',
    items: [
      { description: 'Neurology Specialist Consultation', quantity: 1, unit_price: 900, total: 900 },
      { description: 'Brain MRI Scan', quantity: 1, unit_price: 4500, total: 4500 },
      { description: 'Deluxe Private Suite (1 Day)', quantity: 1, unit_price: 6500, total: 6500 }
    ],
    subtotal: 11900,
    tax: 595,
    discount: 500,
    net_amount: 11995,
    payment_status: 'Paid',
    payment_method: 'Insurance',
    created_at: '2026-08-09'
  }
];

export const INITIAL_AMBULANCES: Ambulance[] = [
  { 
    id: 'amb-101', 
    vehicle_no: 'UP 65 AB 1008', 
    type: 'ICU Ventilator', 
    status: 'Available / Standby', 
    driver_name: 'Ramesh Kumar', 
    driver_phone: '+91 98111 22233', 
    location: 'BHU Trauma Center Bay', 
    city: 'Varanasi', 
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    lat: 25.2677,
    lng: 82.9913,
    speed_kmh: 0,
    eta_mins: 0,
    destination_address: 'Standby at BHU Trauma Bay',
    gps_signal: 'Strong 5G',
    last_updated: 'Just now'
  },
  { 
    id: 'amb-102', 
    vehicle_no: 'UP 65 AB 1009', 
    type: 'Advanced Life Support (ALS)', 
    status: 'On Emergency Duty', 
    driver_name: 'Suresh Yadav', 
    driver_phone: '+91 98111 22234', 
    location: 'En-route Lanka Circle', 
    city: 'Varanasi', 
    hospital_name: 'Heritage Hospitals',
    lat: 25.2812,
    lng: 82.9845,
    speed_kmh: 58,
    eta_mins: 8,
    destination_address: 'Heritage Emergency Bay, Lanka',
    patient_name: 'Amitabh Mishra (Cardiac Emergency)',
    gps_signal: 'Strong 5G',
    last_updated: '2 secs ago'
  },
  { 
    id: 'amb-103', 
    vehicle_no: 'UP 32 BK 2010', 
    type: 'ICU Ventilator', 
    status: 'Available / Standby', 
    driver_name: 'Vikas Sharma', 
    driver_phone: '+91 98111 22235', 
    location: 'KGMU Trauma Bay 1', 
    city: 'Lucknow', 
    hospital_name: "King George's Medical University (KGMU)",
    lat: 26.8687,
    lng: 80.9168,
    speed_kmh: 0,
    eta_mins: 0,
    destination_address: 'KGMU Emergency Standby',
    gps_signal: 'Strong 5G',
    last_updated: 'Just now'
  },
  { 
    id: 'amb-104', 
    vehicle_no: 'UP 32 BK 2011', 
    type: 'Advanced Life Support (ALS)', 
    status: 'On Emergency Duty', 
    driver_name: 'Manoj Singh', 
    driver_phone: '+91 98111 22236', 
    location: 'Medanta Emergency Portico', 
    city: 'Lucknow', 
    hospital_name: 'Medanta Super Speciality Hospital',
    lat: 26.7606,
    lng: 80.9925,
    speed_kmh: 64,
    eta_mins: 12,
    destination_address: 'Pickup: Gomti Nagar Phase 2, Lucknow',
    patient_name: 'Dr. S. K. Verma',
    gps_signal: 'Strong 5G',
    last_updated: '1 sec ago'
  },
  { 
    id: 'amb-105', 
    vehicle_no: 'UP 78 CD 3012', 
    type: 'Basic Life Support (BLS)', 
    status: 'Available / Standby', 
    driver_name: 'Anil Gupta', 
    driver_phone: '+91 98111 22237', 
    location: 'GSVM LLL Gate 2', 
    city: 'Kanpur', 
    hospital_name: 'GSVM Medical College & LLL Hospital',
    lat: 26.4716,
    lng: 80.3204,
    speed_kmh: 0,
    eta_mins: 0,
    destination_address: 'GSVM Gate 2 Bay',
    gps_signal: 'Moderate 4G',
    last_updated: 'Just now'
  },
  { 
    id: 'amb-106', 
    vehicle_no: 'UP 78 CD 3013', 
    type: 'ICU Ventilator', 
    status: 'On Emergency Duty', 
    driver_name: 'Deepak Verma', 
    driver_phone: '+91 98111 22238', 
    location: 'Transfer from Rawatpur', 
    city: 'Kanpur', 
    hospital_name: 'Regency Hospital (Rawatpur)',
    lat: 26.4850,
    lng: 80.3020,
    speed_kmh: 52,
    eta_mins: 6,
    destination_address: 'Regency Trauma ICU, Rawatpur',
    patient_name: 'Priya Sharma (Severe Respiratory Distress)',
    gps_signal: 'Strong 5G',
    last_updated: '4 secs ago'
  },
  { 
    id: 'amb-107', 
    vehicle_no: 'UP 53 EF 4014', 
    type: 'Neonatal Transport', 
    status: 'Available / Standby', 
    driver_name: 'Rajesh Mishra', 
    driver_phone: '+91 98111 22239', 
    location: 'BRD NICU Garage', 
    city: 'Gorakhpur', 
    hospital_name: 'BRD Medical College & Hospital',
    lat: 26.7820,
    lng: 83.3810,
    speed_kmh: 0,
    eta_mins: 0,
    destination_address: 'BRD NICU Standby',
    gps_signal: 'Strong 5G',
    last_updated: 'Just now'
  },
  { 
    id: 'amb-108', 
    vehicle_no: 'UP 53 EF 4015', 
    type: 'Advanced Life Support (ALS)', 
    status: 'On Emergency Duty', 
    driver_name: 'Brijesh Pandey', 
    driver_phone: '+91 98111 22240', 
    location: 'AIIMS Gorakhpur Gate 1', 
    city: 'Gorakhpur', 
    hospital_name: 'AIIMS Gorakhpur',
    lat: 26.7323,
    lng: 83.4287,
    speed_kmh: 60,
    eta_mins: 15,
    destination_address: 'Pickup: Deoria Highway Toll Plaza',
    patient_name: 'Accident Emergency - Patient #402',
    gps_signal: 'Strong 5G',
    last_updated: 'Just now'
  },
  { 
    id: 'amb-109', 
    vehicle_no: 'UP 70 GH 5016', 
    type: 'ICU Ventilator', 
    status: 'Available / Standby', 
    driver_name: 'Shivam Kesarwani', 
    driver_phone: '+91 98111 22241', 
    location: 'SRN Hospital Emergency Gate', 
    city: 'Allahabad (Prayagraj)', 
    hospital_name: 'MLN Medical College & SRN Hospital',
    lat: 25.4358,
    lng: 81.8463,
    speed_kmh: 0,
    eta_mins: 0,
    destination_address: 'SRN Emergency Gate',
    gps_signal: 'Strong 5G',
    last_updated: 'Just now'
  },
  { 
    id: 'amb-110', 
    vehicle_no: 'UP 70 GH 5017', 
    type: 'Basic Life Support (BLS)', 
    status: 'Available / Standby', 
    driver_name: 'Alok Tripathi', 
    driver_phone: '+91 98111 22242', 
    location: 'Civil Lines Standby Bay', 
    city: 'Allahabad (Prayagraj)', 
    hospital_name: 'Nazareth Hospital',
    lat: 25.4520,
    lng: 81.8320,
    speed_kmh: 0,
    eta_mins: 0,
    destination_address: 'Civil Lines Emergency Dock',
    gps_signal: 'Moderate 4G',
    last_updated: 'Just now'
  }
];

export const INITIAL_BLOOD_STOCK: BloodStock[] = [
  { group: 'A+', units_available: 28, plasma_units: 14, platelet_units: 8, status: 'Adequate' },
  { group: 'A-', units_available: 12, plasma_units: 6, platelet_units: 4, status: 'Adequate' },
  { group: 'B+', units_available: 34, plasma_units: 18, platelet_units: 12, status: 'Adequate' },
  { group: 'B-', units_available: 9, plasma_units: 5, platelet_units: 3, status: 'Low Stock' },
  { group: 'O+', units_available: 42, plasma_units: 22, platelet_units: 15, status: 'Adequate' },
  { group: 'O-', units_available: 6, plasma_units: 3, platelet_units: 2, status: 'Critical' },
  { group: 'AB+', units_available: 18, plasma_units: 10, platelet_units: 6, status: 'Adequate' },
  { group: 'AB-', units_available: 5, plasma_units: 2, platelet_units: 1, status: 'Critical' }
];

export const INITIAL_MEDICINES: Medicine[] = [
  { id: 'med-101', name: 'Paracetamol 650mg (Dolo)', category: 'Analgesic & Pain', dosage_form: 'Tablet', stock_quantity: 1450, price_per_unit: 3.5, requires_prescription: false, expiry_date: '2027-11', status: 'In Stock' },
  { id: 'med-102', name: 'Amoxicillin & Potassium Clavulanate 625mg', category: 'Antibiotic', dosage_form: 'Tablet', stock_quantity: 420, price_per_unit: 22.0, requires_prescription: true, expiry_date: '2027-06', status: 'In Stock' },
  { id: 'med-103', name: 'Atorvastatin 10mg (Lipitor)', category: 'Cardiac & BP', dosage_form: 'Tablet', stock_quantity: 680, price_per_unit: 14.0, requires_prescription: true, expiry_date: '2028-02', status: 'In Stock' },
  { id: 'med-104', name: 'Metformin 500mg Sustained Release', category: 'Diabetes Care', dosage_form: 'Tablet', stock_quantity: 920, price_per_unit: 6.0, requires_prescription: true, expiry_date: '2027-09', status: 'In Stock' },
  { id: 'med-105', name: 'Pantoprazole 40mg (Pan-40)', category: 'Gastro Care', dosage_form: 'Tablet', stock_quantity: 1100, price_per_unit: 9.5, requires_prescription: false, expiry_date: '2027-12', status: 'In Stock' },
  { id: 'med-106', name: 'Azithromycin 500mg', category: 'Antibiotic', dosage_form: 'Tablet', stock_quantity: 310, price_per_unit: 24.0, requires_prescription: true, expiry_date: '2027-04', status: 'In Stock' },
  { id: 'med-107', name: 'Salbutamol Inhaler 100mcg', category: 'Respiratory', dosage_form: 'Inhaler', stock_quantity: 115, price_per_unit: 180.0, requires_prescription: true, expiry_date: '2028-01', status: 'In Stock' },
  { id: 'med-108', name: 'Insulin Human Suspended Injection (10ml)', category: 'Diabetes Care', dosage_form: 'Injection / Vial', stock_quantity: 45, price_per_unit: 340.0, requires_prescription: true, expiry_date: '2026-12', status: 'Low Stock' },
  { id: 'med-109', name: 'Aspirin 75mg Dispersible', category: 'Cardiac & BP', dosage_form: 'Tablet', stock_quantity: 1500, price_per_unit: 2.5, requires_prescription: true, expiry_date: '2028-05', status: 'In Stock' },
  { id: 'med-110', name: 'Adrenaline / Epinephrine Injection 1mg/ml', category: 'Emergency & Critical', dosage_form: 'Injection / Vial', stock_quantity: 85, price_per_unit: 65.0, requires_prescription: true, expiry_date: '2027-03', status: 'In Stock' },
  { id: 'med-111', name: 'Cetirizine 10mg Anti-Allergic', category: 'Analgesic & Pain', dosage_form: 'Tablet', stock_quantity: 880, price_per_unit: 4.0, requires_prescription: false, expiry_date: '2028-08', status: 'In Stock' },
  { id: 'med-112', name: 'Ceftriaxone 1g IV Injection', category: 'Antibiotic', dosage_form: 'Injection / Vial', stock_quantity: 190, price_per_unit: 95.0, requires_prescription: true, expiry_date: '2027-05', status: 'In Stock' }
];

// --- INITIAL ICU MODULE DATA ---
export const INITIAL_ICU_BEDS: IcuBedRecord[] = [
  {
    id: 'icu-b-101',
    bed_number: 'MICU-Bed-01',
    icu_type: 'Medical ICU (MICU)',
    status: 'Occupied',
    patient_id: 'pat-103',
    patient_name: 'Rohan Deshmukh',
    attending_doctor_id: 'doc-vns-1',
    attending_doctor_name: 'Dr. Rajesh Sharma',
    assigned_nurse_id: 'nurse-101',
    assigned_nurse_name: 'Sister Anjali Verma',
    admission_datetime: '2026-08-11T14:30',
    expected_discharge_date: '2026-08-15',
    isolation_required: true,
    ventilator_id: 'VENT-01',
    oxygen_equipment_id: 'O2-PIPE-01',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    city: 'Varanasi'
  },
  {
    id: 'icu-b-102',
    bed_number: 'MICU-Bed-02',
    icu_type: 'Medical ICU (MICU)',
    status: 'Available',
    isolation_required: false,
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    city: 'Varanasi'
  },
  {
    id: 'icu-b-103',
    bed_number: 'CCU-Bed-01',
    icu_type: 'Cardiac Care Unit (CCU)',
    status: 'Occupied',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    attending_doctor_id: 'doc-lko-2',
    attending_doctor_name: 'Dr. S. K. Srivastava',
    assigned_nurse_id: 'nurse-102',
    assigned_nurse_name: 'Sister Kavita Singh',
    admission_datetime: '2026-08-12T08:15',
    expected_discharge_date: '2026-08-16',
    isolation_required: false,
    ventilator_id: 'VENT-02',
    oxygen_equipment_id: 'O2-PIPE-02',
    hospital_name: 'Medanta Super Speciality Hospital',
    city: 'Lucknow'
  },
  {
    id: 'icu-b-104',
    bed_number: 'CCU-Bed-02',
    icu_type: 'Cardiac Care Unit (CCU)',
    status: 'Reserved',
    attending_doctor_name: 'Dr. S. K. Srivastava',
    admission_datetime: '2026-08-13T10:00 (Reserved for Emergency Transfer)',
    isolation_required: false,
    hospital_name: 'Medanta Super Speciality Hospital',
    city: 'Lucknow'
  },
  {
    id: 'icu-b-105',
    bed_number: 'SICU-Bed-01',
    icu_type: 'Surgical ICU (SICU)',
    status: 'Occupied',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    attending_doctor_id: 'doc-knp-1',
    attending_doctor_name: 'Dr. Vikramaditya Verma',
    assigned_nurse_id: 'nurse-103',
    assigned_nurse_name: 'Nurse Sunil Yadav',
    admission_datetime: '2026-08-10T19:00',
    expected_discharge_date: '2026-08-14',
    isolation_required: false,
    ventilator_id: 'VENT-03',
    oxygen_equipment_id: 'O2-CYL-04',
    hospital_name: 'Regency Hospital (Rawatpur)',
    city: 'Kanpur'
  },
  {
    id: 'icu-b-106',
    bed_number: 'PICU-Bed-01',
    icu_type: 'Pediatric ICU (PICU)',
    status: 'Cleaning',
    isolation_required: false,
    hospital_name: 'BRD Medical College & Hospital',
    city: 'Gorakhpur'
  },
  {
    id: 'icu-b-107',
    bed_number: 'NICU-Bed-01',
    icu_type: 'Neonatal ICU (NICU)',
    status: 'Available',
    isolation_required: true,
    hospital_name: 'BRD Medical College & Hospital',
    city: 'Gorakhpur'
  },
  {
    id: 'icu-b-108',
    bed_number: 'TICU-Bed-01',
    icu_type: 'Trauma ICU (TICU)',
    status: 'Available',
    isolation_required: false,
    hospital_name: 'MLN Medical College & SRN Hospital',
    city: 'Allahabad (Prayagraj)'
  }
];

export const INITIAL_ICU_PATIENTS: IcuPatientRecord[] = [
  {
    id: 'icu-p-101',
    patient_id: 'pat-103',
    patient_name: 'Rohan Deshmukh',
    age: 52,
    gender: 'Male',
    blood_group: 'B+',
    bed_id: 'icu-b-101',
    bed_number: 'MICU-Bed-01',
    attending_doctor_id: 'doc-vns-1',
    attending_doctor_name: 'Dr. Rajesh Sharma',
    assigned_nurse_id: 'nurse-101',
    assigned_nurse_name: 'Sister Anjali Verma',
    admission_datetime: '2026-08-11T14:30',
    diagnosis_notes: 'Acute Respiratory Failure secondary to Severe Pneumonitis. On mechanical ventilation support P-SIMV mode.',
    allergies: 'Penicillin, Dust Mites',
    current_medications: 'IV Ceftriaxone 1g BD, Inj Hydrocortisone 100mg TID, Nebulization Duolin+Budecort 6 hourly, Inj Pantoprazole 40mg',
    medical_history: 'Type 2 Diabetes Mellitus (10 yrs), Hypertension',
    emergency_contact_name: 'Suresh Deshmukh (Brother)',
    emergency_contact_phone: '+91 97654 99887',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    city: 'Varanasi',
    status: 'Critical'
  },
  {
    id: 'icu-p-102',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    age: 34,
    gender: 'Male',
    blood_group: 'O+',
    bed_id: 'icu-b-103',
    bed_number: 'CCU-Bed-01',
    attending_doctor_id: 'doc-lko-2',
    attending_doctor_name: 'Dr. S. K. Srivastava',
    assigned_nurse_id: 'nurse-102',
    assigned_nurse_name: 'Sister Kavita Singh',
    admission_datetime: '2026-08-12T08:15',
    diagnosis_notes: 'Acute Anterior Wall Myocardial Infarction. Post Percutaneous Coronary Intervention (PCI) with DES to LAD.',
    allergies: 'No known drug allergies (NKDA)',
    current_medications: 'Tab Aspirin 75mg OD, Tab Clopidogrel 75mg OD, Inj Heparin infusion 1000 IU/hr, Tab Atorvastatin 80mg HS',
    medical_history: 'Dyslipidemia, Family history of CAD',
    emergency_contact_name: 'Priya Mehta (Wife)',
    emergency_contact_phone: '+91 98765 11223',
    hospital_name: 'Medanta Super Speciality Hospital',
    city: 'Lucknow',
    status: 'Stable'
  },
  {
    id: 'icu-p-103',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    age: 45,
    gender: 'Female',
    blood_group: 'AB+',
    bed_id: 'icu-b-105',
    bed_number: 'SICU-Bed-01',
    attending_doctor_id: 'doc-knp-1',
    attending_doctor_name: 'Dr. Vikramaditya Verma',
    assigned_nurse_id: 'nurse-103',
    assigned_nurse_name: 'Nurse Sunil Yadav',
    admission_datetime: '2026-08-10T19:00',
    diagnosis_notes: 'Post-Op Day 2 Exploratory Laparotomy for Perforated Appendix with Localized Peritonitis.',
    allergies: 'Sulfa Drugs',
    current_medications: 'Inj Metronidazole 500mg TID, IV Paracetamol 1g QID, Inj Tramadol 50mg PRN, IV Fluid NS @ 80ml/hr',
    medical_history: 'Hypothyroidism',
    emergency_contact_name: 'Amit Bose (Husband)',
    emergency_contact_phone: '+91 96543 88776',
    hospital_name: 'Regency Hospital (Rawatpur)',
    city: 'Kanpur',
    status: 'Guarded'
  }
];

export const INITIAL_ICU_VITALS: IcuVitalsRecord[] = [
  {
    id: 'vit-101',
    patient_id: 'pat-103',
    patient_name: 'Rohan Deshmukh',
    bed_number: 'MICU-Bed-01',
    recorded_at: '2026-08-13T01:00:00',
    recorded_by_name: 'Sister Anjali Verma',
    recorded_by_role: 'Nurse',
    heart_rate: 104,
    systolic_bp: 138,
    diastolic_bp: 88,
    temperature_f: 100.4,
    spo2_percent: 92,
    respiratory_rate: 24,
    notes: 'Patient restless. Suctioning performed. FiO2 adjusted to 50%.'
  },
  {
    id: 'vit-102',
    patient_id: 'pat-103',
    patient_name: 'Rohan Deshmukh',
    bed_number: 'MICU-Bed-01',
    recorded_at: '2026-08-12T20:00:00',
    recorded_by_name: 'Dr. Rajesh Sharma',
    recorded_by_role: 'Doctor',
    heart_rate: 112,
    systolic_bp: 145,
    diastolic_bp: 92,
    temperature_f: 101.2,
    spo2_percent: 89,
    respiratory_rate: 28,
    notes: 'Severe hypoxia noted on room air before ventilator setup.'
  },
  {
    id: 'vit-103',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    bed_number: 'CCU-Bed-01',
    recorded_at: '2026-08-13T00:30:00',
    recorded_by_name: 'Sister Kavita Singh',
    recorded_by_role: 'Nurse',
    heart_rate: 74,
    systolic_bp: 122,
    diastolic_bp: 78,
    temperature_f: 98.4,
    spo2_percent: 98,
    respiratory_rate: 16,
    notes: 'Hemodynamically stable. No fresh chest discomfort reported.'
  },
  {
    id: 'vit-104',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    bed_number: 'SICU-Bed-01',
    recorded_at: '2026-08-13T01:15:00',
    recorded_by_name: 'Nurse Sunil Yadav',
    recorded_by_role: 'Nurse',
    heart_rate: 82,
    systolic_bp: 118,
    diastolic_bp: 76,
    temperature_f: 99.1,
    spo2_percent: 96,
    respiratory_rate: 18,
    notes: 'Surgical drain output 40ml serosanguinous. Abdominal pain score 3/10.'
  }
];

export const INITIAL_ICU_TIMELINES: IcuTimelineEvent[] = [
  {
    id: 'timeline-1',
    patient_id: 'pat-103',
    event_type: 'Admission',
    title: 'Admitted to Medical ICU',
    description: 'Patient received from ER in acute dyspnea with SpO2 88%. Emergency intubation performed.',
    timestamp: '2026-08-11 02:30 PM',
    authorized_user_name: 'Dr. Rajesh Sharma',
    authorized_user_role: 'Consultant Intensivist'
  },
  {
    id: 'timeline-2',
    patient_id: 'pat-103',
    event_type: 'Bed Assigned',
    title: 'Allocated MICU-Bed-01',
    description: 'Isolation protocols enabled. Connected Servo Ventilator (VENT-01) and Central O2 pipeline.',
    timestamp: '2026-08-11 02:45 PM',
    authorized_user_name: 'Sister Anjali Verma',
    authorized_user_role: 'Head ICU Nurse'
  },
  {
    id: 'timeline-3',
    patient_id: 'pat-103',
    event_type: 'Doctor Round',
    title: 'Evening Intensivist Round',
    description: 'Chest X-Ray reviewed: Bilateral lower zone infiltrates. ABG showed mild respiratory acidosis. Antibiotics upgraded.',
    timestamp: '2026-08-11 07:00 PM',
    authorized_user_name: 'Dr. Rajesh Sharma',
    authorized_user_role: 'Senior Intensivist'
  },
  {
    id: 'timeline-4',
    patient_id: 'pat-103',
    event_type: 'Vitals Recorded',
    title: 'Midnight Vitals Logged',
    description: 'SpO2 stable at 92% on FiO2 50%. Temp 100.4°F. Tepid sponging administered.',
    timestamp: '2026-08-13 01:00 AM',
    authorized_user_name: 'Sister Anjali Verma',
    authorized_user_role: 'Staff Nurse'
  },

  {
    id: 'timeline-5',
    patient_id: 'pat-101',
    event_type: 'Admission',
    title: 'Emergency Admission to CCU',
    description: 'Patient transferred post primary PCI. LAD stent deployed successfully without complications.',
    timestamp: '2026-08-12 08:15 AM',
    authorized_user_name: 'Dr. S. K. Srivastava',
    authorized_user_role: 'Chief Cardiologist'
  },
  {
    id: 'timeline-6',
    patient_id: 'pat-101',
    event_type: 'Vitals Recorded',
    title: 'Post-PCI Vitals Check',
    description: 'BP 122/78 mmHg, HR 74 bpm. Femoral sheath puncture site clean and dry. Sheath removal scheduled.',
    timestamp: '2026-08-13 00:30 AM',
    authorized_user_name: 'Sister Kavita Singh',
    authorized_user_role: 'CCU Nurse'
  }
];

export const INITIAL_ICU_EQUIPMENT: IcuEquipmentRecord[] = [
  {
    id: 'eq-1',
    equipment_code: 'VENT-01',
    equipment_type: 'Servo Ventilator',
    status: 'In Use',
    current_location_bed: 'MICU-Bed-01',
    assigned_patient_id: 'pat-103',
    assigned_patient_name: 'Rohan Deshmukh',
    maintenance_status: 'Good',
    last_service_date: '2026-07-15',
    next_service_date: '2026-09-15'
  },
  {
    id: 'eq-2',
    equipment_code: 'VENT-02',
    equipment_type: 'Servo Ventilator',
    status: 'In Use',
    current_location_bed: 'CCU-Bed-01',
    assigned_patient_id: 'pat-101',
    assigned_patient_name: 'Aarav Mehta',
    maintenance_status: 'Good',
    last_service_date: '2026-07-20',
    next_service_date: '2026-09-20'
  },
  {
    id: 'eq-3',
    equipment_code: 'VENT-03',
    equipment_type: 'Servo Ventilator',
    status: 'In Use',
    current_location_bed: 'SICU-Bed-01',
    assigned_patient_id: 'pat-104',
    assigned_patient_name: 'Sunita Bose',
    maintenance_status: 'Service Due',
    last_service_date: '2026-05-10',
    next_service_date: '2026-08-10'
  },
  {
    id: 'eq-4',
    equipment_code: 'VENT-04',
    equipment_type: 'Servo Ventilator',
    status: 'Available',
    current_location_bed: 'ICU Central Store',
    maintenance_status: 'Good',
    last_service_date: '2026-08-01',
    next_service_date: '2026-10-01'
  },
  {
    id: 'eq-5',
    equipment_code: 'DEFIB-01',
    equipment_type: 'Biphasic Defibrillator',
    status: 'Available',
    current_location_bed: 'MICU Crash Cart',
    maintenance_status: 'Good',
    last_service_date: '2026-08-02',
    next_service_date: '2026-11-02'
  },
  {
    id: 'eq-6',
    equipment_code: 'HFNC-01',
    equipment_type: 'HFNC Oxygenation',
    status: 'Maintenance',
    current_location_bed: 'Bio-Medical Workshop',
    maintenance_status: 'Under Calibration',
    last_service_date: '2026-08-11',
    next_service_date: '2026-08-14'
  }
];

export const INITIAL_ICU_OXYGEN: IcuOxygenSupportRecord[] = [
  {
    id: 'o2-1',
    equipment_code: 'O2-PIPE-01',
    type: 'Central Liquid O2 Pipeline',
    availability: 'In Use',
    assigned_bed: 'MICU-Bed-01',
    assigned_patient_name: 'Rohan Deshmukh',
    flow_rate_lpm: 12,
    status: 'Operational',
    inspection_notes: 'Central line pressure steady at 4.2 bar. Flowmeter calibrated.'
  },
  {
    id: 'o2-2',
    equipment_code: 'O2-PIPE-02',
    type: 'Central Liquid O2 Pipeline',
    availability: 'In Use',
    assigned_bed: 'CCU-Bed-01',
    assigned_patient_name: 'Aarav Mehta',
    flow_rate_lpm: 4,
    status: 'Operational',
    inspection_notes: 'Nasal cannula delivery active. Pipeline pressure normal.'
  },
  {
    id: 'o2-3',
    equipment_code: 'O2-CONC-01',
    type: 'High-Flow Concentrator 10L',
    availability: 'Standby',
    assigned_bed: 'ICU Emergency Bay',
    status: 'Operational',
    inspection_notes: 'O2 purity output verified at 94.8%. High efficiency filter clean.'
  },
  {
    id: 'o2-4',
    equipment_code: 'O2-CYL-04',
    type: 'O2 Cylinder Bank (Type D)',
    availability: 'In Use',
    assigned_bed: 'SICU-Bed-01',
    assigned_patient_name: 'Sunita Bose',
    flow_rate_lpm: 6,
    status: 'Refill Required',
    inspection_notes: 'Pressure gauge at 400 PSI. Scheduled for replacement cylinder.'
  }
];

export const INITIAL_ICU_STAFF: IcuStaffAssignment[] = [
  {
    id: 'staff-1',
    staff_name: 'Dr. Rajesh Sharma',
    role: 'Doctor',
    shift: 'Morning (07:00 - 15:00)',
    specialization: 'Senior Intensivist & Pulmonologist',
    assigned_beds: ['MICU-Bed-01', 'MICU-Bed-02'],
    status: 'On Duty',
    contact_phone: '+91 98765 40011'
  },
  {
    id: 'staff-2',
    staff_name: 'Dr. S. K. Srivastava',
    role: 'Doctor',
    shift: 'Morning (07:00 - 15:00)',
    specialization: 'Interventional Cardiologist',
    assigned_beds: ['CCU-Bed-01', 'CCU-Bed-02'],
    status: 'On Duty',
    contact_phone: '+91 98765 40022'
  },
  {
    id: 'staff-3',
    staff_name: 'Sister Anjali Verma',
    role: 'Nurse',
    shift: 'Morning (07:00 - 15:00)',
    assigned_beds: ['MICU-Bed-01'],
    status: 'On Duty',
    contact_phone: '+91 98765 40033'
  },
  {
    id: 'staff-4',
    staff_name: 'Sister Kavita Singh',
    role: 'Nurse',
    shift: 'Morning (07:00 - 15:00)',
    assigned_beds: ['CCU-Bed-01'],
    status: 'On Duty',
    contact_phone: '+91 98765 40044'
  },
  {
    id: 'staff-5',
    staff_name: 'Nurse Sunil Yadav',
    role: 'Nurse',
    shift: 'Night (23:00 - 07:00)',
    assigned_beds: ['SICU-Bed-01'],
    status: 'On Duty',
    contact_phone: '+91 98765 40055'
  }
];

export const INITIAL_ICU_ALERTS: IcuAlertRecord[] = [
  {
    id: 'alert-1',
    type: 'Equipment Maintenance Due',
    message: 'Ventilator VENT-03 (SICU-Bed-01) calibration service overdue by 3 days.',
    priority: 'Critical',
    timestamp: '2026-08-13 01:00 AM',
    bed_number: 'SICU-Bed-01',
    patient_name: 'Sunita Bose',
    is_resolved: false
  },
  {
    id: 'alert-2',
    type: 'Overdue Monitoring',
    message: 'Vitals recording overdue for MICU-Bed-01 (Rohan Deshmukh). Last logged 3 hours ago.',
    priority: 'Medium',
    timestamp: '2026-08-13 01:15 AM',
    bed_number: 'MICU-Bed-01',
    patient_name: 'Rohan Deshmukh',
    is_resolved: false
  },
  {
    id: 'alert-3',
    type: 'Missing Documentation',
    message: 'Post-op anesthesia clearance note missing for SICU-Bed-01 patient profile.',
    priority: 'Low',
    timestamp: '2026-08-12 11:30 PM',
    bed_number: 'SICU-Bed-01',
    patient_name: 'Sunita Bose',
    is_resolved: false
  }
];

export const INITIAL_ICU_TRANSFERS: IcuTransferDischargeLog[] = [
  {
    id: 'trf-1',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    transfer_type: 'ICU -> General Ward',
    from_bed: 'MICU-Bed-04',
    to_bed_or_dept: 'General Female Ward Bed 12',
    datetime: '2026-08-10 11:00 AM',
    authorized_staff: 'Dr. Arvind Patel',
    transfer_notes: 'Patient hemodynamically stable post 48-hr asthma stabilization. Shifted to step-down ward.'
  }
];

export const INITIAL_ICU_AUDIT_LOGS: IcuAuditLog[] = [
  {
    id: 'aud-1',
    action: 'Vitals Recorded',
    user_id: 'usr-nurse-101',
    user_name: 'Sister Anjali Verma',
    user_role: 'Nurse',
    timestamp: '2026-08-13 01:00 AM',
    details: 'Recorded vitals for Rohan Deshmukh (MICU-Bed-01): HR 104, BP 138/88, SpO2 92%.'
  },
  {
    id: 'aud-2',
    action: 'Patient Admission',
    user_id: 'usr-doc-vns-1',
    user_name: 'Dr. Rajesh Sharma',
    user_role: 'Doctor',
    timestamp: '2026-08-11 02:30 PM',
    details: 'Admitted Rohan Deshmukh to Medical ICU with diagnosis of Acute Respiratory Failure.'
  }
];

// --- 1. OPHTHALMOLOGY MOCK DATA ---
export const INITIAL_EYE_RECORDS: EyeRecord[] = [
  {
    id: 'eye-rec-1',
    patient_id: 'pat-101',
    patient_name: 'Rahul Sharma',
    doctor_id: 'doc-vns-5',
    doctor_name: 'Dr. Vivek Malhotra',
    visit_date: '2026-08-10',
    visual_acuity_od: '6/18',
    visual_acuity_os: '6/9',
    iop_od_mmHg: 16,
    iop_os_mmHg: 15,
    refraction_od: '+1.75 DS / -0.50 DC x 180',
    refraction_os: '+0.75 DS',
    fundus_notes_od: 'Immature Senile Cataract Grade II present. Retinal vessels normal.',
    fundus_notes_os: 'Clear lens, normal optic disc, C/D ratio 0.3.',
    slit_lamp_notes: 'Bilateral mild pterygium present on nasal conjunctiva. OD nuclear sclerosis.',
    doctor_notes: 'Advised Phacoemulsification with Foldable Monofocal IOL for Right Eye.',
    surgery_scheduled: true,
    surgery_id: 'eye-surg-1',
    status: 'Surgery Scheduled',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-10 10:30 AM'
  },
  {
    id: 'eye-rec-2',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    doctor_id: 'doc-vns-5',
    doctor_name: 'Dr. Vivek Malhotra',
    visit_date: '2026-08-11',
    visual_acuity_od: '6/6',
    visual_acuity_os: '6/6',
    iop_od_mmHg: 22,
    iop_os_mmHg: 24,
    refraction_od: 'Emmetropic',
    refraction_os: 'Emmetropic',
    fundus_notes_od: 'Increased cup-to-disc ratio (0.6 OD, 0.65 OS) with neuroretinal rim thinning.',
    fundus_notes_os: 'Cup-to-disc ratio 0.65, early glaucomatous cupping.',
    slit_lamp_notes: 'Open anterior chamber angle on Gonioscopy.',
    doctor_notes: 'Primary Open Angle Glaucoma suspected. Started Timolol 0.5% eye drops BD.',
    surgery_scheduled: false,
    status: 'Completed',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-11 11:15 AM'
  }
];

export const INITIAL_EYE_SURGERIES: EyeSurgeryRecord[] = [
  {
    id: 'eye-surg-1',
    patient_id: 'pat-101',
    patient_name: 'Rahul Sharma',
    doctor_id: 'doc-vns-5',
    doctor_name: 'Dr. Vivek Malhotra',
    eye: 'Right Eye (OD)',
    procedure_name: 'Cataract Phacoemulsification with Foldable Monofocal IOL',
    scheduled_date: '2026-08-15',
    scheduled_time: '10:00 AM',
    ot_allocation: 'OT-3 Eye Care Suite',
    status: 'Scheduled',
    pre_op_checklist: {
      consent_signed: true,
      pupil_dilated: true,
      biometry_completed: true,
      bp_sugar_cleared: true
    },
    post_op_notes: 'Antibiotic-steroid eye drops prescribed QID.',
    follow_up_date: '2026-08-16',
    created_at: '2026-08-10 11:00 AM'
  }
];

// --- 2. OXYGEN MANAGEMENT MOCK DATA ---
export const INITIAL_OXYGEN_CYLINDERS: OxygenCylinderRecord[] = [
  {
    id: 'cyl-101',
    cylinder_code: 'O2-CYL-101',
    oxygen_type: 'Medical Oxygen Gas (D-Type)',
    status: 'In Use',
    capacity_liters: 7000,
    current_pressure_bar: 135,
    current_location: 'Medical ICU Bed 01',
    assigned_department: 'ICU',
    assigned_patient_id: 'pat-101',
    assigned_patient_name: 'Rahul Sharma',
    assigned_bed: 'MICU-Bed-01',
    supplier_name: 'Inox Air Products India Ltd',
    supplier_contact: '+91 542 2501199',
    refill_status: 'Full',
    last_inspection_date: '2026-08-12',
    next_maintenance_date: '2026-09-12',
    movement_history: [
      { timestamp: '2026-08-12 08:00 AM', from_location: 'Central Oxygen Depot', to_location: 'Medical ICU Bed 01', action_by: 'Staff Nurse Anjali', action_type: 'Assigned to Bed' }
    ],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'cyl-102',
    cylinder_code: 'O2-CYL-102',
    oxygen_type: 'Medical Oxygen Gas (D-Type)',
    status: 'In Use',
    capacity_liters: 7000,
    current_pressure_bar: 90,
    current_location: 'Surgical ICU Bed 01',
    assigned_department: 'ICU',
    assigned_patient_id: 'pat-103',
    assigned_patient_name: 'Sunita Bose',
    assigned_bed: 'SICU-Bed-01',
    supplier_name: 'Inox Air Products India Ltd',
    supplier_contact: '+91 542 2501199',
    refill_status: 'Full',
    last_inspection_date: '2026-08-11',
    next_maintenance_date: '2026-09-11',
    movement_history: [
      { timestamp: '2026-08-11 02:00 PM', from_location: 'Central Oxygen Depot', to_location: 'Surgical ICU Bed 01', action_by: 'Technician Rajesh', action_type: 'Assigned to Bed' }
    ],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'cyl-103',
    cylinder_code: 'O2-CYL-103',
    oxygen_type: 'Liquid Oxygen Cylinder',
    status: 'Available',
    capacity_liters: 10000,
    current_pressure_bar: 150,
    current_location: 'Central Oxygen Depot',
    assigned_department: 'Central Store',
    supplier_name: 'Linde India Medical Gases',
    supplier_contact: '+91 542 2509988',
    refill_status: 'Full',
    last_inspection_date: '2026-08-10',
    next_maintenance_date: '2026-10-10',
    movement_history: [],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'cyl-104',
    cylinder_code: 'O2-CYL-104',
    oxygen_type: 'High-Pressure B-Type',
    status: 'Empty',
    capacity_liters: 1500,
    current_pressure_bar: 10,
    current_location: 'Emergency Bay 03',
    assigned_department: 'Emergency',
    supplier_name: 'Inox Air Products India Ltd',
    supplier_contact: '+91 542 2501199',
    refill_status: 'Refill Required',
    last_inspection_date: '2026-08-01',
    next_maintenance_date: '2026-08-20',
    movement_history: [
      { timestamp: '2026-08-12 11:30 PM', from_location: 'Emergency Bay 03', to_location: 'Refill Transit Area', action_by: 'Ward Boy Vikas', action_type: 'Marked Empty' }
    ],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'cyl-105',
    cylinder_code: 'O2-CONC-01',
    oxygen_type: 'Portable Concentrator Unit',
    status: 'Available',
    capacity_liters: 10,
    current_pressure_bar: 100,
    current_location: 'General Ward Block B',
    assigned_department: 'General Ward',
    supplier_name: 'Philips Healthcare',
    supplier_contact: '+91 1800 102 2269',
    refill_status: 'Full',
    last_inspection_date: '2026-08-05',
    next_maintenance_date: '2026-11-05',
    movement_history: [],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  }
];

// --- 3. X-RAY DEPARTMENT MOCK DATA ---
export const INITIAL_XRAY_RECORDS: XRayRecord[] = [
  {
    id: 'xray-101',
    patient_id: 'pat-101',
    patient_name: 'Rahul Sharma',
    doctor_id: 'doc-vns-1',
    doctor_name: 'Dr. Rajesh Sharma',
    procedure_name: 'Chest X-Ray PA View',
    body_part: 'Chest / Lungs',
    machine_id: 'xray-mach-01',
    machine_name: 'Allengers 500mA Digital X-Ray System',
    technician_name: 'Radiology Tech Suresh Kumar',
    radiologist_name: 'Dr. Priya Saxena (MD Radiology)',
    requested_date: '2026-08-12',
    scheduled_datetime: '2026-08-12 09:30 AM',
    status: 'Verified',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    radiologist_findings: 'Bilateral lung fields clear. Costophrenic angles sharp. Cardiothoracic ratio within normal limits (< 50%). No active parenchymal lesion seen.',
    impression: 'Normal Chest Radiograph.',
    is_urgent: false,
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-12 09:00 AM'
  },
  {
    id: 'xray-102',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    doctor_id: 'doc-vns-1',
    doctor_name: 'Dr. Rajesh Sharma',
    procedure_name: 'Lumbar Spine AP & Lateral View',
    body_part: 'Lumbosacral Spine',
    machine_id: 'xray-mach-01',
    machine_name: 'Allengers 500mA Digital X-Ray System',
    technician_name: 'Radiology Tech Suresh Kumar',
    requested_date: '2026-08-13',
    scheduled_datetime: '2026-08-13 11:00 AM',
    status: 'Scan Completed',
    image_url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
    is_urgent: true,
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-13 10:15 AM'
  }
];

// --- 4. MRI CENTER MOCK DATA ---
export const INITIAL_MRI_RECORDS: MriRecord[] = [
  {
    id: 'mri-101',
    patient_id: 'pat-101',
    patient_name: 'Rahul Sharma',
    doctor_id: 'doc-vns-2',
    doctor_name: 'Dr. Sunita Verma',
    body_region: 'Brain MRI 3 Tesla with MRA',
    machine_id: 'mri-mach-3t',
    machine_name: 'Siemens Magnetom Vida 3T MRI',
    technician_name: 'MRI Tech Amit Pandey',
    radiologist_name: 'Dr. Priya Saxena (MD Radiology)',
    requested_date: '2026-08-10',
    scheduled_datetime: '2026-08-11 02:00 PM',
    preparation_checklist: {
      metal_implants_checked: true,
      pacemaker_checked: true,
      contrast_consent_signed: true,
      renal_creatinine_ok: true
    },
    status: 'Verified',
    image_url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    findings: 'No focal acute cerebral infarction or intracranial hemorrhage. Ventricles and sulci normal for age. Major intracranial cerebral arteries show normal flow void.',
    previous_mri_comparison: 'Compared with MRI dated 2025-06-12; no new ischemic focus.',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-10 04:00 PM'
  }
];

// --- 5. CT SCAN DEPARTMENT MOCK DATA ---
export const INITIAL_CT_SCAN_RECORDS: CtScanRecord[] = [
  {
    id: 'ct-101',
    patient_id: 'pat-103',
    patient_name: 'Sunita Bose',
    doctor_id: 'doc-vns-1',
    doctor_name: 'Dr. Rajesh Sharma',
    scan_type: 'HRCT Thorax (High-Resolution Chest CT)',
    body_region: 'Thorax / Lungs',
    machine_id: 'ct-mach-128',
    machine_name: 'GE Revolution 128-Slice CT Scanner',
    technician_name: 'CT Tech Deepa Rani',
    radiologist_name: 'Dr. Priya Saxena (MD Radiology)',
    requested_date: '2026-08-11',
    scheduled_datetime: '2026-08-11 05:00 PM',
    safety_checklist: {
      contrast_allergy_checked: true,
      serum_creatinine_verified: true,
      fasting_npo_status_ok: true
    },
    status: 'Verified',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    findings: 'Ground glass opacities in peripheral lower lobes bilateral. Severity score 8/25. No pneumothorax or pleural effusion.',
    previous_ct_comparison: 'First CT scan baseline evaluation.',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-11 03:00 PM'
  }
];

// --- 6. CARDIOLOGY DEPARTMENT MOCK DATA ---
export const INITIAL_CARDIOLOGY_RECORDS: CardiologyRecord[] = [
  {
    id: 'card-101',
    patient_id: 'pat-101',
    patient_name: 'Rahul Sharma',
    cardiologist_id: 'doc-vns-1',
    cardiologist_name: 'Dr. Rajesh Sharma (DM Cardiology)',
    visit_type: '2D Echocardiogram',
    cardiac_history: 'Essential Hypertension 5 yrs, Type-2 Diabetes Mellitus.',
    ecg_findings: 'Normal Sinus Rhythm, HR 72/min, No acute ST-T wave changes.',
    echo_ef_percent: 60,
    echo_findings: 'Normal LV size & systolic function (EF 60%). No regional wall motion abnormality (RWMA). Normal valvular flow parameters.',
    procedure_type: 'Transthoracic 2D Echo Color Doppler',
    status: 'Report Ready',
    next_follow_up: '2026-11-10',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-09 11:00 AM'
  }
];

// --- 7. PATHOLOGY DEPARTMENT MOCK DATA ---
export const INITIAL_PATHOLOGY_RECORDS: PathologyTestRecord[] = [
  {
    id: 'path-101',
    sample_id: 'SAMP-2026-101',
    patient_id: 'pat-101',
    patient_name: 'Rahul Sharma',
    doctor_name: 'Dr. Rajesh Sharma',
    test_category: 'Hematology',
    test_name: 'Complete Blood Count (CBC)',
    technician_name: 'Lab Tech Ramesh Gupta',
    verifier_doctor_name: 'Dr. Alok Nath (MD Pathology)',
    sample_type: 'Blood',
    sample_collection_datetime: '2026-08-12 08:00 AM',
    lab_received_datetime: '2026-08-12 08:30 AM',
    status: 'Delivered',
    test_parameters: [
      { parameter_name: 'Hemoglobin (Hb)', result_value: '14.2', unit: 'g/dL', reference_range: '13.0 - 17.0', is_abnormal: false },
      { parameter_name: 'Total Leukocyte Count (TLC)', result_value: '8,500', unit: '/cu mm', reference_range: '4,000 - 11,000', is_abnormal: false },
      { parameter_name: 'Platelet Count', result_value: '2,40,000', unit: '/cu mm', reference_range: '1,50,000 - 4,50,000', is_abnormal: false },
      { parameter_name: 'RBC Count', result_value: '4.8', unit: 'millions/cu mm', reference_range: '4.5 - 5.5', is_abnormal: false }
    ],
    summary_findings: 'Hemogram within normal limits.',
    timestamp_logs: [
      { status: 'Ordered', timestamp: '2026-08-12 07:30 AM', updated_by: 'Dr. Rajesh Sharma' },
      { status: 'Sample Collected', timestamp: '2026-08-12 08:00 AM', updated_by: 'Phlebotomist Suman' },
      { status: 'Lab Received', timestamp: '2026-08-12 08:30 AM', updated_by: 'Ramesh Gupta' },
      { status: 'Report Ready', timestamp: '2026-08-12 10:30 AM', updated_by: 'Dr. Alok Nath' }
    ],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-12 07:30 AM'
  },
  {
    id: 'path-102',
    sample_id: 'SAMP-2026-102',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    doctor_name: 'Dr. Sunita Verma',
    test_category: 'Biochemistry',
    test_name: 'Liver Function Test (LFT) & Kidney Function (KFT)',
    technician_name: 'Lab Tech Ramesh Gupta',
    verifier_doctor_name: 'Dr. Alok Nath (MD Pathology)',
    sample_type: 'Serum',
    sample_collection_datetime: '2026-08-13 07:00 AM',
    lab_received_datetime: '2026-08-13 07:45 AM',
    status: 'Processing',
    test_parameters: [
      { parameter_name: 'Serum Creatinine', result_value: '0.9', unit: 'mg/dL', reference_range: '0.6 - 1.2', is_abnormal: false },
      { parameter_name: 'Blood Urea Nitrogen (BUN)', result_value: '14', unit: 'mg/dL', reference_range: '7 - 20', is_abnormal: false },
      { parameter_name: 'Serum Bilirubin Total', result_value: '1.8', unit: 'mg/dL', reference_range: '0.2 - 1.2', is_abnormal: true }
    ],
    summary_findings: 'Mild elevation in Total Bilirubin noted.',
    timestamp_logs: [
      { status: 'Ordered', timestamp: '2026-08-12 08:00 PM', updated_by: 'Dr. Sunita Verma' },
      { status: 'Sample Collected', timestamp: '2026-08-13 07:00 AM', updated_by: 'Phlebotomist Suman' },
      { status: 'Processing', timestamp: '2026-08-13 08:15 AM', updated_by: 'Ramesh Gupta' }
    ],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-12 08:00 PM'
  }
];

// --- 8. OPERATION THEATRE MOCK DATA ---
export const INITIAL_OT_ROOMS: OtRoom[] = [
  {
    id: 'ot-rm-1',
    ot_number: 'OT-1 Major Surgical',
    department: 'General Surgery & Laparoscopy',
    status: 'In Surgery',
    current_surgery_id: 'surg-201',
    current_patient_name: 'Vikram Singh',
    sanitization_status: 'Sterilized',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'ot-rm-2',
    ot_number: 'OT-2 Cardiac Suite',
    department: 'Cardiothoracic Surgery',
    status: 'Available',
    sanitization_status: 'Sterilized',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'ot-rm-3',
    ot_number: 'OT-3 Eye Care Suite',
    department: 'Ophthalmology',
    status: 'Available',
    sanitization_status: 'Sterilized',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'ot-rm-4',
    ot_number: 'OT-4 Emergency OT',
    department: 'Trauma & Emergency',
    status: 'Available',
    sanitization_status: 'Sterilized',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  }
];

export const INITIAL_SURGERIES: SurgeryScheduleRecord[] = [
  {
    id: 'surg-201',
    ot_id: 'ot-rm-1',
    ot_number: 'OT-1 Major Surgical',
    patient_id: 'pat-104',
    patient_name: 'Vikram Singh',
    surgery_type: 'Laparoscopic Cholecystectomy',
    lead_surgeon_id: 'doc-vns-3',
    lead_surgeon_name: 'Dr. Manoj Tripathi (MS Surgery)',
    anesthetist_name: 'Dr. Rekha Srivastava (MD Anesthesia)',
    nursing_team: ['OT Nurse Priya', 'OT Nurse Rohit'],
    scheduled_date: '2026-08-13',
    scheduled_time_slot: '09:00 AM - 11:30 AM',
    required_equipment: ['Stryker Laparoscopy Tower', 'Harmonic Scalpel', 'Anesthesia Workstation'],
    pre_op_checklist: {
      fasting_npo_verified: true,
      blood_units_reserved: true,
      surgical_consent_signed: true,
      anesthesia_clearance_done: true
    },
    status: 'In Surgery',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    created_at: '2026-08-12 04:00 PM'
  }
];

// --- 9. BLOOD BANK MOCK DATA ---
export const INITIAL_BLOOD_UNITS: BloodBankUnitRecord[] = [
  { id: 'bld-unit-1', blood_unit_id: 'BLD-A+-101', blood_group: 'A+', component_type: 'Packed RBC', donor_name: 'Anil Kumar', collection_date: '2026-08-01', expiry_date: '2026-09-05', storage_location: 'Refrig-A1', status: 'Available' },
  { id: 'bld-unit-2', blood_unit_id: 'BLD-B+-102', blood_group: 'B+', component_type: 'Packed RBC', donor_name: 'Pooja Tiwari', collection_date: '2026-08-05', expiry_date: '2026-09-09', storage_location: 'Refrig-A2', status: 'Available' },
  { id: 'bld-unit-3', blood_unit_id: 'BLD-O+-103', blood_group: 'O+', component_type: 'Packed RBC', donor_name: 'Siddharth Rao', collection_date: '2026-08-10', expiry_date: '2026-09-14', storage_location: 'Refrig-A3', status: 'Reserved', reserved_for_patient_id: 'pat-101', reserved_for_patient_name: 'Rahul Sharma' },
  { id: 'bld-unit-4', blood_unit_id: 'BLD-O--104', blood_group: 'O-', component_type: 'Whole Blood', donor_name: 'Universal Donor Voluntary', collection_date: '2026-08-11', expiry_date: '2026-09-15', storage_location: 'Refrig-Emergency', status: 'Available' },
  { id: 'bld-unit-5', blood_unit_id: 'BLD-AB+-105', blood_group: 'AB+', component_type: 'Fresh Frozen Plasma (FFP)', donor_name: 'Gaurav Mishra', collection_date: '2026-07-20', expiry_date: '2026-08-20', storage_location: 'Deep-Freezer-01', status: 'Available' },
  { id: 'bld-unit-6', blood_unit_id: 'BLD-B--106', blood_group: 'B-', component_type: 'Packed RBC', donor_name: 'Nisha Singh', collection_date: '2026-08-02', expiry_date: '2026-09-06', storage_location: 'Refrig-B1', status: 'Available' }
];

export const INITIAL_BLOOD_REQUESTS: BloodRequestRecord[] = [
  {
    id: 'bld-req-1',
    patient_id: 'pat-101',
    patient_name: 'Rahul Sharma',
    blood_group: 'O+',
    component_type: 'Packed RBC',
    units_requested: 2,
    urgency: 'Routine',
    requesting_doctor: 'Dr. Rajesh Sharma',
    cross_match_status: 'Matched & Compatible',
    status: 'Cross-Matched',
    created_at: '2026-08-12 02:00 PM',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  }
];

// --- 10. MEDICAL EQUIPMENT MOCK DATA ---
export const INITIAL_MEDICAL_EQUIPMENT: MedicalEquipmentRecord[] = [
  {
    id: 'eq-1',
    equipment_code: 'EQ-MRI-3T',
    name: 'Siemens Magnetom Vida 3T MRI Scanner',
    category: 'MRI',
    manufacturer: 'Siemens Healthineers',
    model: 'Magnetom Vida 3T',
    serial_number: 'SN-MRI-99812',
    department: 'Radiology / MRI Center',
    current_location: 'Radiology Block G-01',
    status: 'Operational',
    purchase_date: '2024-01-15',
    warranty_expiry: '2029-01-15',
    last_maintenance_date: '2026-07-01',
    next_maintenance_date: '2026-10-01',
    calibration_status: 'Valid',
    responsible_person: 'Er. Sandeep Yadav (Biomedical Lead)',
    maintenance_history: [
      { id: 'm-1', date: '2026-07-01', type: 'Routine Inspection', notes: 'Cryogen helium level checked at 98%. Gradient coil calibration complete.', performed_by: 'Siemens Field Engineer' }
    ],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'eq-2',
    equipment_code: 'EQ-CT-128',
    name: 'GE Revolution 128-Slice CT Scanner',
    category: 'CT Scan',
    manufacturer: 'GE Healthcare',
    model: 'Revolution EVO 128',
    serial_number: 'SN-CT-44210',
    department: 'Radiology / CT Department',
    current_location: 'Radiology Block G-02',
    status: 'Operational',
    purchase_date: '2023-06-10',
    warranty_expiry: '2028-06-10',
    last_maintenance_date: '2026-06-15',
    next_maintenance_date: '2026-09-15',
    calibration_status: 'Valid',
    responsible_person: 'Er. Sandeep Yadav (Biomedical Lead)',
    maintenance_history: [],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'eq-3',
    equipment_code: 'EQ-VENT-03',
    name: 'Hamilton-C6 High-End ICU Ventilator',
    category: 'Ventilator',
    manufacturer: 'Hamilton Medical',
    model: 'C6-Advanced',
    serial_number: 'SN-VENT-8821',
    department: 'ICU',
    current_location: 'Medical ICU Bed 01',
    status: 'In Use',
    purchase_date: '2025-02-10',
    warranty_expiry: '2028-02-10',
    last_maintenance_date: '2026-05-10',
    next_maintenance_date: '2026-08-10',
    calibration_status: 'Calibration Due',
    responsible_person: 'Bio-Med Engg Vikas Kumar',
    maintenance_history: [],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'eq-4',
    equipment_code: 'EQ-XRAY-500',
    name: 'Allengers 500mA Fixed Digital Radiography System',
    category: 'X-Ray',
    manufacturer: 'Allengers Medical Systems',
    model: 'Mars 50',
    serial_number: 'SN-XR-11029',
    department: 'X-Ray Department',
    current_location: 'X-Ray Room 1',
    status: 'Operational',
    purchase_date: '2022-11-20',
    warranty_expiry: '2026-11-20',
    last_maintenance_date: '2026-04-10',
    next_maintenance_date: '2026-10-10',
    calibration_status: 'Valid',
    responsible_person: 'Radiology Tech Suresh Kumar',
    maintenance_history: [],
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  }
];

export const INITIAL_MODULE_AUDIT_LOGS: ModuleAuditLog[] = [
  {
    id: 'mod-aud-1',
    user_name: 'Dr. Vivek Malhotra',
    user_role: 'Doctor',
    action: 'Eye Consultation Recorded',
    module: 'Eye Care',
    timestamp: '2026-08-10 10:30 AM',
    details: 'Scheduled cataract phacoemulsification for Rahul Sharma (Right Eye).'
  },
  {
    id: 'mod-aud-2',
    user_name: 'Dr. Priya Saxena',
    user_role: 'Radiologist',
    action: 'X-Ray Report Verified',
    module: 'X-Ray',
    timestamp: '2026-08-12 10:00 AM',
    details: 'Verified Chest X-Ray PA View for Rahul Sharma.'
  }
];

export const INITIAL_CRISIS_RECOMMENDATIONS: import('../types').CrisisRecommendation[] = [
  {
    id: 'crisis-rec-1',
    title: 'Emergency department workload unusually high hai.',
    severity: 'Critical',
    category: 'Workload',
    department: 'Emergency & Trauma Ward',
    triggeredMetric: 'ER Patient Influx: 28 Critical Arrivals/hr (Threshold: >15)',
    recommendationText: 'Additional staff allocation consider karein.',
    resourceWarningText: 'Current resources critically low hain.',
    suggestedAction: {
      type: 'STAFF_ALLOCATION',
      description: 'Deploy 4 backup ER physicians & 6 trauma nurses from General Medicine ward to Emergency.',
      payloadSummary: 'Reallocate 10 medical staff & open 2 overflow trauma bays.'
    },
    status: 'Pending Approval',
    createdAt: '2026-08-13 02:45 AM'
  },
  {
    id: 'crisis-rec-2',
    title: 'Oxygen manifold supply pressure dropping in ICU Ward A.',
    severity: 'High',
    category: 'Resource Scarcity',
    department: 'Intensive Care Unit (ICU)',
    triggeredMetric: 'Liquid Medical Oxygen (LMO) Tank Level: 18% (Critical < 25%)',
    recommendationText: 'Emergency oxygen cylinder dispatch approve karein.',
    resourceWarningText: 'Current resources critically low hain.',
    suggestedAction: {
      type: 'OXYGEN_DISPATCH',
      description: 'Dispatch 15 high-pressure B-type oxygen cylinders from central store to ICU Ward A manifold.',
      payloadSummary: 'Dispatch 15 Oxygen Cylinders & alert supplier for emergency LMO refill.'
    },
    status: 'Pending Approval',
    createdAt: '2026-08-13 02:50 AM'
  },
  {
    id: 'crisis-rec-3',
    title: 'OPD Token Queue bottleneck in Cardiology Department.',
    severity: 'Moderate',
    category: 'Capacity',
    department: 'Cardiology OPD',
    triggeredMetric: 'Average Wait Time: 48 mins (Threshold > 30 mins)',
    recommendationText: 'Open overflow consulting room & assign assistant doctor.',
    resourceWarningText: 'Cardiology OPD queue length exceeds 25 patients.',
    suggestedAction: {
      type: 'QUEUE_BALANCING',
      description: 'Activate OPD Room 108 B for Dr. Sneha Gupta to split token queue workload.',
      payloadSummary: 'Open OPD Room 108 B & rebalance tokens #15-30.'
    },
    status: 'Pending Approval',
    createdAt: '2026-08-13 03:00 AM'
  }
];

export const INITIAL_CRISIS_LOGS: import('../types').CrisisCommanderLog[] = [
  {
    id: 'crisis-log-101',
    recommendationId: 'crisis-rec-0',
    title: 'Blood Bank O Negative stock shortage mitigation',
    actionTaken: 'Authorized Emergency Blood Drive & Inter-hospital Transfer',
    authorizedBy: 'Chief Medical Officer (Admin)',
    timestamp: '2026-08-12 08:15 PM',
    executionStatus: 'Success',
    auditDetails: 'Transfer of 6 O-ve units from BRD Medical College Gorakhpur completed.'
  }
];

// --- DOCTOR DASHBOARD & CLINICAL RECORDS INITIAL DATA ---
export const INITIAL_PRESCRIPTIONS: DoctorPrescription[] = [
  {
    id: 'rx-901',
    prescription_number: 'RX-2026-8812',
    appointment_id: 'apt-501',
    doctor_id: 'doc-vns-1',
    doctor_name: 'Dr. Rajesh Sharma',
    doctor_specialization: 'Interventional Cardiology & Heart Surgery',
    doctor_qualification: 'MD, DM (Cardiology), FACC',
    doctor_room_no: 'OPD 101 - BHU',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    patient_age: 34,
    patient_gender: 'Male',
    patient_blood_group: 'O+',
    recorded_condition: 'Essential Stage 1 Hypertension with Mild Dyslipidemia',
    chief_complaint: 'Occasional morning dizziness and elevated BP readings at home (145/92 mmHg).',
    clinical_notes: 'Cardiovascular examination normal S1 S2 heard, no murmurs. ECG shows sinus rhythm with no ischemic changes. Advised salt restriction and regular BP logging.',
    medicines: [
      {
        id: 'med-rx-1',
        name: 'Telmisartan 40mg',
        dosage: '40 mg',
        frequency: 'Once Daily (Morning)',
        duration: '30 Days',
        route: 'Oral',
        instructions: 'Take in the morning after breakfast with plain water.',
        additional_notes: 'Monitor BP weekly'
      },
      {
        id: 'med-rx-2',
        name: 'Atorvastatin 10mg',
        dosage: '10 mg',
        frequency: 'Once Daily (Night)',
        duration: '30 Days',
        route: 'Oral',
        instructions: 'Take at bedtime after dinner.',
        additional_notes: 'Lipid profile recheck in 4 weeks'
      },
      {
        id: 'med-rx-3',
        name: 'Aspirin (Ecosprin) 75mg',
        dosage: '75 mg',
        frequency: 'Once Daily (Post Lunch)',
        duration: '30 Days',
        route: 'Oral',
        instructions: 'Take after major meal.',
        additional_notes: 'Do not take on empty stomach'
      }
    ],
    advice_instructions: 'Low sodium diet (<2g/day). 30 mins brisk walking 5 days/week. Re-evaluate blood pressure in 2 weeks.',
    follow_up_date: '2026-08-28',
    status: 'Finalized',
    created_at: '2026-08-12',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'rx-902',
    prescription_number: 'RX-2026-7945',
    appointment_id: 'apt-504',
    doctor_id: 'doc-lko-1',
    doctor_name: 'Dr. Ananya Roy',
    doctor_specialization: 'Neuro-Pathology & Brain Surgery',
    doctor_qualification: 'MBBS, M.Ch (Neurosurgery) - KGMU',
    doctor_room_no: 'OPD 104 - KGMU',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    patient_age: 45,
    patient_gender: 'Female',
    patient_blood_group: 'AB+',
    recorded_condition: 'Migraine without Aura with Cervicogenic Component',
    chief_complaint: 'Recurrent throbbing unilateral headaches associated with photophobia and nausea for 3 months.',
    clinical_notes: 'Fundus examination normal. No focal neurological deficits. Neck paraspinal muscle spasm noted.',
    medicines: [
      {
        id: 'med-rx-4',
        name: 'Naproxen 500mg + Domperidone 10mg',
        dosage: '1 Tablet',
        frequency: 'SOS / As Needed (During Headache)',
        duration: '10 Days',
        route: 'Oral',
        instructions: 'Take immediately at the onset of severe headache.',
        additional_notes: 'Maximum 2 tablets in 24 hours'
      },
      {
        id: 'med-rx-5',
        name: 'Flunarizine 10mg',
        dosage: '10 mg',
        frequency: 'Once Daily (Bedtime)',
        duration: '45 Days',
        route: 'Oral',
        instructions: 'Take at night before sleep.',
        additional_notes: 'Prophylaxis for migraine'
      }
    ],
    advice_instructions: 'Maintain headache trigger diary. Avoid bright screen exposure late night. Adequate hydration.',
    follow_up_date: '2026-08-25',
    status: 'Finalized',
    created_at: '2026-08-10',
    hospital_name: "King George's Medical University (KGMU)"
  }
];

export const INITIAL_CLINICAL_NOTES: DoctorClinicalNote[] = [
  {
    id: 'note-101',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    doctor_id: 'doc-vns-1',
    doctor_name: 'Dr. Rajesh Sharma',
    chief_complaint: 'Elevated BP readings on self-monitoring & mild palpitation on climbing stairs',
    symptoms: ['Mild Dizziness', 'Occasional Palpitation', 'Tension Headache in evening'],
    clinical_notes: 'Patient was relaxed during examination. Pulse 78 bpm regular. BP in right arm seated: 142/90 mmHg. Heart sounds distinct. Chest clear bilaterally.',
    assessment: 'Primary Essential Hypertension (Grade 1). Good compliance with lifestyle modification needed.',
    recorded_condition: 'Essential Hypertension',
    relevant_medical_history: 'Family history of CAD (Father had MI at age 62). Non-smoker, occasional alcohol.',
    allergies: 'No known drug allergies (NKDA)',
    follow_up_notes: 'Check 2-week ambulatory BP chart. If BP > 140/90 persistently, adjust ARB dosage.',
    follow_up_date: '2026-08-28',
    created_at: '2026-08-12 10:45 AM'
  },
  {
    id: 'note-102',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    doctor_id: 'doc-lko-1',
    doctor_name: 'Dr. Ananya Roy',
    chief_complaint: 'Hemi-cranial throbbing headache lasting 6 to 12 hours with nausea',
    symptoms: ['Unilateral Throbbing Pain', 'Photophobia', 'Nausea', 'Neck Stiffness'],
    clinical_notes: 'Cranial nerve exam intact (II to XII). Visual acuity preserved. Triggered by irregular sleep and high-stress work.',
    assessment: 'Migraine with Tension Component. Initiated Flunarizine prophylaxis.',
    recorded_condition: 'Chronic Migraine',
    relevant_medical_history: 'Treated for allergic sinusitis 2 years ago.',
    allergies: 'Sulfa drugs (causes mild rash)',
    follow_up_notes: 'Review headache diary in 2 weeks.',
    follow_up_date: '2026-08-25',
    created_at: '2026-08-10 02:30 PM'
  }
];

export const INITIAL_DOCTOR_NOTIFICATIONS: DoctorNotification[] = [
  {
    id: 'notif-doc-1',
    doctor_id: 'doc-anivesh',
    type: 'patient_checked_in',
    title: 'Patient Checked In at OPD',
    message: 'Aarav Mehta (TK-101) has checked in and is waiting in OPD Room 204.',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    appointment_id: 'apt-crd-101',
    timestamp: '10:02 AM',
    read: false,
    priority: 'Normal'
  },
  {
    id: 'notif-doc-2',
    doctor_id: 'doc-anivesh',
    type: 'report_ready',
    title: 'Cardiology 2D Echo Report Ready',
    message: 'New 2D Echocardiogram & Troponin-I report for Vikramaditya Rastogi is verified.',
    patient_id: 'pat-105',
    patient_name: 'Vikramaditya Rastogi',
    report_id: 'cardio-rec-1',
    timestamp: '09:45 AM',
    read: false,
    priority: 'High'
  },
  {
    id: 'notif-doc-3',
    doctor_id: 'doc-deepanshu',
    type: 'report_ready',
    title: 'Head CT Scan Contrast Verified',
    message: 'Brain CT with Contrast scan for Sunita Bose is verified by Radiology.',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    timestamp: '10:15 AM',
    read: false,
    priority: 'High'
  },
  {
    id: 'notif-doc-4',
    doctor_id: 'doc-rahul',
    type: 'patient_checked_in',
    title: 'Patient Checked In for Eye Evaluation',
    message: 'Meera Iyer (TK-301) is ready for Slit Lamp exam in Room 305.',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    appointment_id: 'apt-eye-301',
    timestamp: '09:28 AM',
    read: false,
    priority: 'Normal'
  }
];

export const INITIAL_FOLLOW_UPS: DoctorFollowUp[] = [
  {
    id: 'fup-101',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    patient_age: 34,
    patient_gender: 'Male',
    patient_phone: '+91 98765 43210',
    patient_blood_group: 'O+',
    doctor_id: 'doc-anivesh',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    previous_consultation_date: '2026-08-12',
    follow_up_date: '2026-08-28',
    recorded_condition: 'Essential Hypertension & Dyslipidemia',
    status: 'Upcoming',
    previous_prescription_summary: 'Telmisartan 40mg + Atorvastatin 10mg',
    notes: 'Bring 2-week daily BP record chart & fasting lipid profile.'
  },
  {
    id: 'fup-102',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    patient_age: 45,
    patient_gender: 'Female',
    patient_phone: '+91 96543 21098',
    patient_blood_group: 'AB+',
    doctor_id: 'doc-deepanshu',
    doctor_name: 'Dr. Deepanshu Singh',
    previous_consultation_date: '2026-08-12',
    follow_up_date: '2026-08-26',
    recorded_condition: 'Chronic Migraine & Neurological Workup',
    status: 'Upcoming',
    previous_prescription_summary: 'Flunarizine 10mg nocte + Brain CT Review',
    notes: 'Evaluate post-scan medication response.'
  },
  {
    id: 'fup-103',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    patient_age: 28,
    patient_gender: 'Female',
    patient_phone: '+91 98123 45678',
    patient_blood_group: 'A+',
    doctor_id: 'doc-rahul',
    doctor_name: 'Dr. Rahul Singh',
    previous_consultation_date: '2026-08-12',
    follow_up_date: '2026-08-25',
    recorded_condition: 'Refractive Error & Dry Eye Syndrome',
    status: 'Upcoming',
    previous_prescription_summary: 'Carboxymethylcellulose 0.5% drops + Visual Field test',
    notes: 'Evaluate intraocular pressure stability.'
  }
];

export const INITIAL_DOCTOR_ACTIVITY_LOGS: DoctorActivityLog[] = [
  {
    id: 'act-101',
    doctor_id: 'doc-anivesh',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    action: 'Doctor created prescription',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    details: 'Initiated Cardiology consultation in Room 204',
    timestamp: '10:05 AM — Today'
  },
  {
    id: 'act-102',
    doctor_id: 'doc-deepanshu',
    doctor_name: 'Dr. Deepanshu Singh',
    action: 'Doctor reviewed report',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    details: 'Reviewed Brain CT Scan with Contrast and vital stats in Room 105',
    timestamp: '10:30 AM — Today'
  },
  {
    id: 'act-103',
    doctor_id: 'doc-rahul',
    doctor_name: 'Dr. Rahul Singh',
    action: 'Doctor updated clinical notes',
    patient_id: 'pat-102',
    patient_name: 'Meera Iyer',
    details: 'Completed Tonometry and Slit Lamp assessment in Room 305',
    timestamp: '09:45 AM — Today'
  }
];

export const INITIAL_DOCTOR_REQUESTS: DoctorResourceRequest[] = [
  {
    id: 'req-001',
    doctor_id: 'doc-anivesh',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    patient_id: 'pat-105',
    patient_name: 'Vikramaditya Rastogi',
    request_type: 'ICU Bed',
    room_type: 'Cardiac ICU (CICU)',
    room_no: 'ICU Ward A',
    bed_number: 'ICU Bed-4',
    reason: 'Post-PTCA observation & continuous cardiac telemetry monitoring required.',
    priority: 'Critical',
    request_time: '2026-08-12 09:30 AM',
    status: 'Allocated',
    admin_notes: 'Allocated Bed-4 with multi-para monitor and backup defibrillator.',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'req-002',
    doctor_id: 'doc-anivesh',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    patient_id: 'pat-101',
    patient_name: 'Aarav Mehta',
    request_type: 'Room',
    room_type: 'Private Deluxe Room',
    room_no: 'Room 204',
    reason: '24-hour ambulatory BP stabilization and lipid monitoring observation.',
    priority: 'Routine',
    request_time: '2026-08-12 10:10 AM',
    status: 'Approved',
    admin_notes: 'Room 204 assigned on 2nd Floor Cardiology Wing.',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'req-003',
    doctor_id: 'doc-deepanshu',
    doctor_name: 'Dr. Deepanshu Singh',
    patient_id: 'pat-104',
    patient_name: 'Sunita Bose',
    request_type: 'Oxygen Support',
    room_type: 'Neuro Step-Down Ward',
    room_no: 'Room 105',
    bed_number: 'Bed 2',
    reason: 'Supplemental High-Flow nasal cannula (4 L/min) during acute migraine vertigo episode.',
    priority: 'Urgent',
    request_time: '2026-08-12 10:20 AM',
    status: 'Approved',
    admin_notes: 'Oxygen concentrator connected to wall manifold.',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  },
  {
    id: 'req-004',
    doctor_id: 'doc-rahul',
    doctor_name: 'Dr. Rahul Singh',
    patient_id: 'pat-111',
    patient_name: 'Shanti Devi',
    request_type: 'Room',
    room_type: 'Day Care Surgery Recovery Room',
    room_no: 'Room 118',
    reason: 'Pre-operative preparation and dilation recovery for cataract surgery.',
    priority: 'Routine',
    request_time: '2026-08-12 11:00 AM',
    status: 'Pending',
    admin_notes: 'Queued for afternoon schedule.',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
  }
];

export const INITIAL_CONSULTATION_FEES: ConsultationFeeRecord[] = [
  {
    id: 'fee-001',
    doctor_id: 'doc-anivesh',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    department: 'Cardiology',
    consultation_type: 'In-Person OPD',
    fee: 800,
    effective_date: '2026-01-01',
    status: 'Active',
    last_updated: '2026-08-10'
  },
  {
    id: 'fee-002',
    doctor_id: 'doc-anivesh',
    doctor_name: 'Dr. Anivesh Pratap Singh',
    department: 'Cardiology',
    consultation_type: 'Tele-Consultation',
    fee: 600,
    effective_date: '2026-01-01',
    status: 'Active',
    last_updated: '2026-08-10'
  },
  {
    id: 'fee-003',
    doctor_id: 'doc-deepanshu',
    doctor_name: 'Dr. Deepanshu Singh',
    department: 'Neurology',
    consultation_type: 'In-Person OPD',
    fee: 850,
    effective_date: '2026-01-01',
    status: 'Active',
    last_updated: '2026-08-10'
  },
  {
    id: 'fee-004',
    doctor_id: 'doc-deepanshu',
    doctor_name: 'Dr. Deepanshu Singh',
    department: 'Neurology',
    consultation_type: 'Tele-Consultation',
    fee: 650,
    effective_date: '2026-01-01',
    status: 'Active',
    last_updated: '2026-08-10'
  },
  {
    id: 'fee-005',
    doctor_id: 'doc-rahul',
    doctor_name: 'Dr. Rahul Singh',
    department: 'General Medicine',
    consultation_type: 'In-Person OPD',
    fee: 700,
    effective_date: '2026-01-01',
    status: 'Active',
    last_updated: '2026-08-10'
  },
  {
    id: 'fee-006',
    doctor_id: 'doc-rahul',
    doctor_name: 'Dr. Rahul Singh',
    department: 'General Medicine',
    consultation_type: 'Tele-Consultation',
    fee: 500,
    effective_date: '2026-01-01',
    status: 'Active',
    last_updated: '2026-08-10'
  }
];

export const INITIAL_MEDICAL_SUPPLIES: MedicalSupplyItem[] = [
  {
    id: 'sup-001',
    item_name: 'Inj. Ceftriaxone 1g (Antibiotic)',
    category: 'Injections',
    total_quantity: 450,
    available_quantity: 380,
    in_use_quantity: 70,
    min_threshold: 100,
    unit: 'Vials',
    status: 'Available',
    location: 'Central Pharmacy & ICU Stock',
    last_updated: '2026-08-14'
  },
  {
    id: 'sup-002',
    item_name: 'Inj. Enoxaparin 40mg/0.4ml (Anti-Coagulant)',
    category: 'Injections',
    total_quantity: 200,
    available_quantity: 145,
    in_use_quantity: 55,
    min_threshold: 50,
    unit: 'PFS Syringes',
    status: 'Available',
    location: 'Cath Lab & Cardiac ICU',
    last_updated: '2026-08-14'
  },
  {
    id: 'sup-003',
    item_name: 'Inj. Regular Insulin 100 IU/ml (R-DNA)',
    category: 'Injections',
    total_quantity: 120,
    available_quantity: 28,
    in_use_quantity: 92,
    min_threshold: 35,
    unit: 'Vials',
    status: 'Low Stock',
    location: 'Endocrinology & Emergency Refrigerator',
    last_updated: '2026-08-14'
  },
  {
    id: 'sup-004',
    item_name: 'Inj. Propofol 1% 20ml (Anesthesia Induction)',
    category: 'Injections',
    total_quantity: 80,
    available_quantity: 15,
    in_use_quantity: 65,
    min_threshold: 25,
    unit: 'Ampoules',
    status: 'Low Stock',
    location: 'Major OT & Trauma ICU',
    last_updated: '2026-08-14'
  },
  {
    id: 'sup-005',
    item_name: 'D-Type High Capacity Medical Oxygen Cylinders (46.7L)',
    category: 'Oxygen Cylinders',
    total_quantity: 60,
    available_quantity: 42,
    in_use_quantity: 18,
    min_threshold: 15,
    unit: 'Cylinders',
    status: 'Available',
    location: 'Oxygen Manifold Bank A',
    last_updated: '2026-08-15'
  },
  {
    id: 'sup-006',
    item_name: 'Liquid Medical Oxygen (LMO) Storage Tank (20,000L)',
    category: 'Oxygen Cylinders',
    total_quantity: 20000,
    available_quantity: 17400,
    in_use_quantity: 2600,
    min_threshold: 5000,
    unit: 'Liters',
    status: 'Available',
    location: 'Central Cryogenic Plant',
    last_updated: '2026-08-15'
  },
  {
    id: 'sup-007',
    item_name: 'High-Flow Nasal Cannula (HFNC) Circuits',
    category: 'ICU Consumables',
    total_quantity: 90,
    available_quantity: 62,
    in_use_quantity: 28,
    min_threshold: 20,
    unit: 'Kits',
    status: 'Available',
    location: 'MICU Equipment Rack 3',
    last_updated: '2026-08-14'
  },
  {
    id: 'sup-008',
    item_name: 'Normal Saline (0.9% NaCl) 500ml IV Infusion',
    category: 'IV Fluids',
    total_quantity: 800,
    available_quantity: 650,
    in_use_quantity: 150,
    min_threshold: 200,
    unit: 'Bottles',
    status: 'Available',
    location: 'Emergency Wing Store',
    last_updated: '2026-08-15'
  }
];

export const INITIAL_SYSTEM_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'aud-001',
    user_id: 'adm-ashif',
    user_name: 'Ashif Ansari',
    user_role: 'Main Admin',
    action: 'Admin System Login',
    module: 'Security & Auth',
    details: 'Authenticated successfully into CheckMed Main Administration Portal via secure session.',
    affected_record: 'Session ID: #SSN-2026-891',
    timestamp: '2026-08-15 08:30:12'
  },
  {
    id: 'aud-002',
    user_id: 'adm-ashif',
    user_name: 'Ashif Ansari',
    user_role: 'Main Admin',
    action: 'Resource Telemetry Check',
    module: 'Medical Equipment & ICU',
    details: 'Verified real-time calibration telemetry on Siemens Magnetom 3T MRI & CT Scanners.',
    affected_record: 'EQ-MRI-01, EQ-CT-01',
    timestamp: '2026-08-15 08:45:00'
  },
  {
    id: 'aud-003',
    user_id: 'adm-ashif',
    user_name: 'Ashif Ansari',
    user_role: 'Hospital Admin',
    action: 'ICU Bed Availability Audit',
    module: 'ICU Bed Management',
    details: 'Reviewed ventilator beds across MICU, SICU, and Cardiac Care units.',
    affected_record: 'ICU Ward A-C',
    timestamp: '2026-08-15 09:00:25'
  },
  {
    id: 'aud-004',
    user_id: 'adm-ashif',
    user_name: 'Ashif Ansari',
    user_role: 'Hospital Admin',
    action: 'Consultation Fee Schedule Review',
    module: 'Hospital Revenue & Fees',
    details: 'Audited specialist OPD consultation tariffs across Cardiology, Neurology, and Ophthalmology.',
    affected_record: 'Tariff Schedule 2026',
    timestamp: '2026-08-15 09:15:40'
  }
];

export const INITIAL_ADMIN_DOCTOR_MESSAGES: AdminDoctorMessage[] = [
  {
    id: 'msg-001',
    conversation_id: 'conv_ashif_doc-anivesh',
    sender_id: 'adm-ashif',
    sender_name: 'Ashif Ansari (Hospital Admin)',
    sender_role: 'admin',
    receiver_id: 'doc-anivesh',
    receiver_name: 'Dr. Anivesh Pratap Singh',
    receiver_role: 'doctor',
    admin_type: 'main',
    category: 'Important Notice',
    message: 'Dr. Anivesh, Cardiac ICU Bed-4 telemetry is linked to your OPD console. New batch of Enoxaparin PFS syringes has arrived in Cath Lab stock.',
    created_at: '2026-08-15 09:20 AM',
    read_at: '2026-08-15 09:25 AM',
    is_read: true
  },
  {
    id: 'msg-002',
    conversation_id: 'conv_ashif_doc-anivesh',
    sender_id: 'doc-anivesh',
    sender_name: 'Dr. Anivesh Pratap Singh',
    sender_role: 'doctor',
    receiver_id: 'adm-ashif',
    receiver_name: 'Ashif Ansari (Hospital Admin)',
    receiver_role: 'admin',
    admin_type: 'main',
    category: 'Operational',
    message: 'Thank you Ashif Ji. Will review the post-PTCA patient in Bed-4 during the 11:30 AM round.',
    created_at: '2026-08-15 09:28 AM',
    is_read: true
  },
  {
    id: 'msg-003',
    conversation_id: 'conv_ashif_doc-deepanshu',
    sender_id: 'adm-ashif',
    sender_name: 'Ashif Ansari (Hospital Admin)',
    sender_role: 'admin',
    receiver_id: 'doc-deepanshu',
    receiver_name: 'Dr. Deepanshu Singh',
    receiver_role: 'doctor',
    admin_type: 'main',
    category: 'Operational',
    message: 'Dr. Deepanshu, 128-Slice CT scanner calibration report is verified. Emergency neuro trauma slots are active for your review.',
    created_at: '2026-08-15 09:35 AM',
    read_at: '2026-08-15 09:40 AM',
    is_read: true
  },
  {
    id: 'msg-004',
    conversation_id: 'conv_ashif_doc-rahul',
    sender_id: 'adm-ashif',
    sender_name: 'Ashif Ansari (Hospital Admin)',
    sender_role: 'admin',
    receiver_id: 'doc-rahul',
    receiver_name: 'Dr. Rahul Singh',
    receiver_role: 'doctor',
    admin_type: 'main',
    category: 'Appointment-related',
    message: 'Dr. Rahul, afternoon cataract phacoemulsification session in OT-3 is cleared. Pre-op pupil dilation checklist is attached.',
    created_at: '2026-08-15 09:50 AM',
    is_read: false
  }
];


