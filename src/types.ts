export type UserRole = 'patient' | 'admin' | 'doctor' | 'staff' | 'guest';

export type AdminType = 'main';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  admin_type: AdminType;
  designation: string;
  qualification?: string;
  avatar_url: string;
  role: 'admin';
}

export interface AdminDoctorMessage {
  id: string;
  conversation_id: string; // e.g. "conv_ashif_doc-anivesh" or "conv_ashif_doc-deepanshu"
  sender_id: string;
  sender_name: string;
  sender_role: 'admin' | 'doctor';
  receiver_id: string;
  receiver_name: string;
  receiver_role: 'admin' | 'doctor';
  admin_type?: AdminType;
  category: 'Text' | 'Important Notice' | 'Appointment-related' | 'Operational' | 'Clinical Consultation' | 'Resource Request' | 'Shift Advisory' | 'Administrative';
  message: string;
  created_at: string;
  read_at?: string;
  is_read: boolean;
}

export interface ConsultationFeeRecord {
  id: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  specialty?: string;
  consultation_type: 'In-Person OPD' | 'Tele-Consultation' | 'Emergency Care' | 'Follow-up';
  fee: number;
  effective_date: string;
  status: 'Active' | 'Under Review' | 'Archived';
  last_updated?: string;
}

export interface MedicalSupplyItem {
  id: string;
  item_name: string;
  sku?: string;
  category: 'Injections' | 'Oxygen Cylinders' | 'ICU Consumables' | 'Surgical Items' | 'PPE & Safety' | 'IV Fluids';
  total_quantity: number;
  available_quantity: number;
  in_use_quantity: number;
  min_threshold: number;
  unit: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock' | 'In Use' | 'Maintenance';
  location: string;
  last_updated: string;
}

export interface SystemAuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  module: string;
  details: string;
  affected_record?: string;
  timestamp: string;
}

export interface AccountRequestRecord {
  id: string;
  role: 'doctor' | 'staff';
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation?: string;
  license_or_emp_id: string;
  specialization?: string;
  qualification?: string;
  employee_id?: string;
  staff_type?: string;
  password_hash?: string;
  doctor_id?: string;
  rejection_reason?: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface StaffMember {
  id: string;
  staff_id_code: string; // e.g. "STF-REC-101"
  full_name: string;
  role: StaffRole;
  department: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  avatar_url?: string;
  created_at: string;
}

// --- 11. AI HOSPITAL CRISIS COMMANDER TYPES ---
export type CrisisSeverity = 'Critical' | 'High' | 'Moderate' | 'Info';

export type CrisisActionType = 
  | 'STAFF_ALLOCATION'
  | 'RESOURCE_REALLOCATION'
  | 'OXYGEN_DISPATCH'
  | 'BED_CONVERSION'
  | 'QUEUE_BALANCING'
  | 'AMBULANCE_REDIRECTION';

export interface CrisisRecommendation {
  id: string;
  title: string; // e.g. "Emergency department workload unusually high hai."
  severity: CrisisSeverity;
  category: 'Workload' | 'Staffing' | 'Resource Scarcity' | 'Capacity' | 'Equipment';
  department: string;
  triggeredMetric: string; // e.g. "Emergency ER Traffic: 28 Patients (Threshold > 15)"
  recommendationText: string; // e.g. "Additional staff allocation consider karein."
  resourceWarningText?: string; // e.g. "Current resources critically low hain."
  suggestedAction: {
    type: CrisisActionType;
    description: string;
    payloadSummary: string;
  };
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Executed';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface CrisisCommanderLog {
  id: string;
  recommendationId: string;
  title: string;
  actionTaken: string;
  authorizedBy: string;
  timestamp: string;
  executionStatus: 'Success' | 'Failed';
  auditDetails: string;
}

export type Department = 
  | 'Cardiology'
  | 'Neurology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'General Medicine'
  | 'Dermatology'
  | 'Oncology'
  | 'ENT'
  | 'Gynecology'
  | 'Emergency';

export type CityName = 'Varanasi' | 'Lucknow' | 'Kanpur' | 'Gorakhpur' | 'Allahabad (Prayagraj)';

export interface HospitalRecord {
  id: string;
  name: string;
  city: CityName;
  address: string;
  contact_number: string;
  emergency_hotline: string;
  icu_beds_available: number;
  total_beds: number;
  blood_bank_status: 'Adequate' | 'Limited' | 'Critical';
  ambulance_count: number;
  departments: Department[];
  rating: number;
  image_url: string;
  is_24_7_emergency: boolean;
  type: 'Government' | 'Super Speciality' | 'Multispeciality' | 'Medical College';
}

export interface Doctor {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  department: Department;
  specialization: string;
  qualification: string;
  graduation?: string;
  services?: string[];
  experience_yrs: number;
  consultation_fee: number;
  room_no: string;
  status: 'Available' | 'In Consultation' | 'On Break' | 'Off Duty';
  avatar_url: string;
  shift_hours: string;
  rating: number;
  available_days: string[];
  city?: CityName;
  hospital_name?: string;
}

export interface Patient {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  contact_number?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  blood_group: string;
  address?: string;
  medical_history?: string;
  room_no?: string;
  icu_bed?: string;
  required_test?: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  account_owner_id: string; // ID of the logged-in primary patient account
  name: string;
  age: number;
  health_issue: string; // e.g. "Cardiology", "Eye Care", "Pediatrics"
  relationship?: 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Son' | 'Daughter' | 'Brother' | 'Sister' | 'Grandparent' | 'Other';
  gender?: 'Male' | 'Female' | 'Other';
  blood_group?: string;
  phone?: string;
  status: 'Active' | 'Archived';
  created_at: string;
  updated_at?: string;
}

export type AppointmentStatus = 'Upcoming' | 'In-Progress' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  patient_name: string;
  patient_phone?: string;
  doctor_name: string;
  department: Department;
  appointment_date: string; // YYYY-MM-DD
  time_slot: string; // e.g. "10:00 AM"
  reason: string;
  status: AppointmentStatus;
  token_number: string;
  consultation_type: 'In-Person' | 'Tele-Consultation';
  room_no?: string;
  icu_bed?: string;
  required_test?: string;
  created_at: string;
}

export type TokenStatus = 'Waiting' | 'Serving' | 'Completed' | 'Skipped' | 'Cancelled';

export type QueuePace = 'fast' | 'normal' | 'slow';

export interface DoctorQueueSpeed {
  doctorId: string;
  doctorName: string;
  department: Department;
  minsPerPatient: number; // e.g. 3, 5, 8
  pace: QueuePace;
  lastUpdated: string;
}

export interface QueueToastNotification {
  id: string;
  tokenId: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: Department;
  roomNo: string;
  queuePosition: number;
  estimatedWaitMins: number;
  processingSpeedMinsPerPatient: number;
  queuePace: QueuePace;
  type: 'approaching' | 'now_serving' | 'speed_change' | 'position_update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Token {
  id: string;
  appointment_id?: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  department: Department;
  token_number: string;
  queue_position: number;
  status: TokenStatus;
  estimated_time_mins: number;
  room_no: string;
  created_at: string;
}

export type WardType = 'ICU' | 'Emergency' | 'General Male' | 'General Female' | 'Pediatric Ward' | 'Deluxe Private Suite';
export type BedStatus = 'Available' | 'Occupied' | 'Reserved' | 'Maintenance' | 'Under Maintenance';

export interface Bed {
  id: string;
  ward_name: WardType;
  bed_number: string;
  bed_type: 'Standard' | 'ICU Ventilator' | 'Oxygen' | 'Private Luxury';
  status: BedStatus;
  price_per_day: number;
  patient_id?: string;
  patient_name?: string;
  assigned_date?: string;
  city?: CityName;
  hospital_name?: string;
}

export type LabReportStatus = 
  | 'Sample Pending'
  | 'Sample Collected'
  | 'Processing'
  | 'Report Ready'
  | 'Report Delivered'
  | 'Cancelled';

export interface TestParameter {
  parameter_name: string;
  result_value: string;
  unit: string;
  reference_range: string;
  is_abnormal?: boolean;
}

export interface LabReport {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id?: string;
  doctor_name: string;
  test_name: string;
  test_category: string;
  sample_collection_date?: string;
  expected_report_date?: string;
  test_date: string;
  status: LabReportStatus;
  result_summary: string;
  normal_range?: string;
  findings?: string;
  parameters?: TestParameter[];
  file_url?: string;
  is_read_by_patient?: boolean;
  hospital_name?: string;
  created_at: string;
}

export interface BillItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  amount?: number;
}

export type PaymentStatus = 'Unpaid' | 'Paid' | 'Partial';
export type PaymentMethod = 'Cash' | 'UPI' | 'Credit Card' | 'Insurance' | 'Net Banking';

export interface Bill {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_id?: string;
  invoice_number: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  net_amount: number;
  amount?: number;
  total_amount?: number;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  created_at: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export interface Ambulance {
  id: string;
  vehicle_no: string;
  vehicle_number?: string;
  type: 'ICU Ventilator' | 'Advanced Life Support (ALS)' | 'Basic Life Support (BLS)' | 'Neonatal Transport';
  status: 'Available / Standby' | 'On Emergency Duty' | 'In Maintenance';
  driver_name: string;
  driver_phone: string;
  location: string;
  city?: CityName;
  hospital_name?: string;
  lat?: number;
  lng?: number;
  speed_kmh?: number;
  eta_mins?: number;
  destination_address?: string;
  patient_name?: string;
  pickup_distance_km?: number;
  pickup_address?: string;
  traffic_condition?: 'Clear Emergency Corridor' | 'Moderate Traffic' | 'Heavy Congestion';
  gps_signal?: 'Strong 5G' | 'Moderate 4G' | 'GPS Lock Low';
  equipment?: string;
  last_updated?: string;
}

export interface BloodStock {
  group: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  units_available: number;
  plasma_units: number;
  platelet_units: number;
  status: 'Adequate' | 'Low Stock' | 'Critical';
}

export interface Medicine {
  id: string;
  name: string;
  category: 'Antibiotic' | 'Analgesic & Pain' | 'Cardiac & BP' | 'Diabetes Care' | 'Gastro Care' | 'Emergency & Critical' | 'Respiratory';
  dosage_form: 'Tablet' | 'Capsule' | 'Injection / Vial' | 'Syrup' | 'Inhaler';
  stock_quantity: number;
  price_per_unit: number;
  requires_prescription: boolean;
  expiry_date: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// --- ICU Management Module Types ---
export type IcuType = 'Medical ICU (MICU)' | 'Surgical ICU (SICU)' | 'Cardiac Care Unit (CCU)' | 'Pediatric ICU (PICU)' | 'Neonatal ICU (NICU)' | 'Trauma ICU (TICU)';
export type IcuBedStatus = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning';
export type IcuPatientStatus = 'Critical' | 'Stable' | 'Guarded' | 'Transferred' | 'Discharged';

export interface IcuBedRecord {
  id: string;
  bed_number: string; // e.g. "MICU-Bed-01"
  icu_type: IcuType;
  status: IcuBedStatus;
  patient_id?: string;
  patient_name?: string;
  attending_doctor_id?: string;
  attending_doctor_name?: string;
  assigned_nurse_id?: string;
  assigned_nurse_name?: string;
  admission_datetime?: string;
  expected_discharge_date?: string;
  isolation_required: boolean;
  ventilator_id?: string;
  oxygen_equipment_id?: string;
  hospital_name?: string;
  city?: CityName;
}

export interface IcuPatientRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  blood_group: string;
  bed_id: string;
  bed_number: string;
  attending_doctor_id: string;
  attending_doctor_name: string;
  assigned_nurse_id: string;
  assigned_nurse_name: string;
  admission_datetime: string;
  diagnosis_notes: string;
  allergies: string;
  current_medications: string;
  medical_history: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  hospital_name?: string;
  city?: CityName;
  status: IcuPatientStatus;
}

export interface IcuVitalsRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  bed_number: string;
  recorded_at: string;
  recorded_by_name: string;
  recorded_by_role: 'Doctor' | 'Nurse' | 'Admin';
  heart_rate: number; // bpm
  systolic_bp: number; // mmHg
  diastolic_bp: number; // mmHg
  temperature_f: number; // °F
  spo2_percent: number; // %
  respiratory_rate: number; // bpm
  notes?: string;
}

export type IcuTimelineEventType = 
  | 'Admission' 
  | 'Bed Assigned' 
  | 'Vitals Recorded' 
  | 'Doctor Round' 
  | 'Nursing Update' 
  | 'Investigation/Report' 
  | 'Medication Record' 
  | 'Transfer/Discharge';

export interface IcuTimelineEvent {
  id: string;
  patient_id: string;
  event_type: IcuTimelineEventType;
  title: string;
  description: string;
  timestamp: string;
  authorized_user_name: string;
  authorized_user_role: string;
}

export interface IcuEquipmentRecord {
  id: string;
  equipment_code: string; // e.g. "VENT-01", "DEFIB-02"
  equipment_type: 'Servo Ventilator' | 'HFNC Oxygenation' | 'Biphasic Defibrillator' | 'Multi-Para Monitor' | 'Infusion Syringe Pump' | 'Arterial Line Monitor';
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Service';
  current_location_bed: string;
  assigned_patient_id?: string;
  assigned_patient_name?: string;
  maintenance_status: 'Good' | 'Service Due' | 'Under Calibration';
  last_service_date: string;
  next_service_date: string;
}

export interface IcuOxygenSupportRecord {
  id: string;
  equipment_code: string;
  type: 'Central Liquid O2 Pipeline' | 'High-Flow Concentrator 10L' | 'O2 Cylinder Bank (Type D)' | 'BiPAP / CPAP Unit';
  availability: 'Available' | 'In Use' | 'Standby' | 'Low Pressure Alert';
  assigned_bed: string;
  assigned_patient_name?: string;
  flow_rate_lpm?: number;
  status: 'Operational' | 'Refill Required' | 'Inspection Due';
  inspection_notes: string;
}

export interface IcuStaffAssignment {
  id: string;
  staff_name: string;
  role: 'Doctor' | 'Nurse';
  shift: 'Morning (07:00 - 15:00)' | 'Evening (15:00 - 23:00)' | 'Night (23:00 - 07:00)';
  specialization?: string;
  assigned_beds: string[];
  status: 'On Duty' | 'On Round' | 'Off Duty';
  contact_phone: string;
}

export type IcuAlertPriority = 'Critical' | 'Medium' | 'Low';

export interface IcuAlertRecord {
  id: string;
  type: 'Bed Unavailable' | 'Equipment Maintenance Due' | 'Equipment Unavailable' | 'Missing Documentation' | 'Overdue Monitoring';
  message: string;
  priority: IcuAlertPriority;
  timestamp: string;
  bed_number?: string;
  patient_name?: string;
  is_resolved: boolean;
}

export interface IcuTransferDischargeLog {
  id: string;
  patient_id: string;
  patient_name: string;
  transfer_type: 'ICU -> General Ward' | 'ICU -> Other Department' | 'ICU -> Another ICU Bed' | 'ICU -> Discharge';
  from_bed: string;
  to_bed_or_dept: string;
  datetime: string;
  authorized_staff: string;
  transfer_notes: string;
}

export interface IcuAuditLog {
  id: string;
  action: string;
  user_id: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  details: string;
}

// --- STAFF ROLES FOR ADVANCED MODULES ---
export type StaffRole = 
  | 'Admin'
  | 'Doctor'
  | 'Nurse'
  | 'Lab Technician'
  | 'Radiology Technician'
  | 'Radiologist'
  | 'Cardiologist'
  | 'OT Staff'
  | 'Blood Bank Staff'
  | 'Equipment Manager'
  | 'Receptionist'
  | 'Billing Staff'
  | 'Pharmacy Staff';

// --- 1. OPHTHALMOLOGY / EYE CARE MODULE TYPES ---
export interface EyeRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  visit_date: string;
  visual_acuity_od: string; // Right eye e.g. "6/6", "6/12"
  visual_acuity_os: string; // Left eye e.g. "6/9"
  iop_od_mmHg: number; // Intraocular pressure Right eye
  iop_os_mmHg: number; // Intraocular pressure Left eye
  refraction_od: string; // e.g. "+0.50 DS / -0.25 DC x 90"
  refraction_os: string;
  fundus_notes_od: string;
  fundus_notes_os: string;
  slit_lamp_notes: string;
  doctor_notes: string;
  procedure_records?: string;
  surgery_scheduled?: boolean;
  surgery_id?: string;
  status: 'Consultation' | 'Pre-Op' | 'Surgery Scheduled' | 'Completed';
  report_url?: string;
  hospital_name?: string;
  created_at: string;
}

export interface EyeSurgeryRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  eye: 'Right Eye (OD)' | 'Left Eye (OS)' | 'Both Eyes (OU)';
  procedure_name: string; // e.g., "Cataract Phacoemulsification with Foldable IOL", "LASIK Vision Correction", "Pterygium Excision"
  scheduled_date: string;
  scheduled_time: string;
  ot_allocation: string;
  status: 'Scheduled' | 'Pre-Op' | 'In Surgery' | 'Recovery' | 'Completed';
  pre_op_checklist: {
    consent_signed: boolean;
    pupil_dilated: boolean;
    biometry_completed: boolean;
    bp_sugar_cleared: boolean;
  };
  post_op_notes?: string;
  follow_up_date?: string;
  created_at: string;
}

// --- 2. OXYGEN MANAGEMENT MODULE TYPES ---
export type OxygenCylinderType = 'Medical Oxygen Gas (D-Type)' | 'Liquid Oxygen Cylinder' | 'High-Pressure B-Type' | 'Portable Concentrator Unit';
export type OxygenCylinderStatus = 'Available' | 'Reserved' | 'In Use' | 'Empty' | 'Refill';

export interface OxygenCylinderRecord {
  id: string;
  cylinder_code: string; // e.g. "O2-CYL-101"
  oxygen_type: OxygenCylinderType;
  status: OxygenCylinderStatus;
  capacity_liters: number;
  current_pressure_bar: number;
  current_location: string;
  assigned_department: string;
  assigned_patient_id?: string;
  assigned_patient_name?: string;
  assigned_bed?: string;
  supplier_name: string;
  supplier_contact: string;
  refill_status: 'Full' | 'Refill Required' | 'In-Transit to Supplier';
  last_inspection_date: string;
  next_maintenance_date: string;
  movement_history: {
    timestamp: string;
    from_location: string;
    to_location: string;
    action_by: string;
    action_type: string;
  }[];
  hospital_name?: string;
}

// --- 3. X-RAY DEPARTMENT TYPES ---
export type XRayStatus = 'Requested' | 'Scheduled' | 'Scan Completed' | 'Report Pending' | 'Verified' | 'Delivered' | 'Image Uploaded';

export interface XRayRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  procedure_name: string; // e.g. "Chest X-Ray PA View", "Lumbar Spine AP & Lat", "Knee Joint AP"
  body_part: string;
  view_type?: string;
  radiation_dose_mgy?: number;
  machine_id: string;
  machine_name: string;
  technician_name?: string;
  radiologist_name?: string;
  requested_date: string;
  scheduled_datetime?: string;
  status: XRayStatus;
  image_url?: string;
  radiologist_findings?: string;
  impression?: string;
  is_urgent: boolean;
  hospital_name?: string;
  created_at: string;
}

// --- 4. MRI CENTER TYPES ---
export type MriStatus = 'Requested' | 'Scheduled' | 'Preparation' | 'Scan Completed' | 'Reporting' | 'Verified' | 'Delivered';

export interface MriRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  body_region: string; // e.g. "Brain MRI 3T", "Whole Spine MRI", "Knee Joint MRI with Contrast"
  machine_id: string;
  machine_name: string;
  technician_name?: string;
  radiologist_name?: string;
  requested_date: string;
  scheduled_datetime?: string;
  preparation_checklist: {
    metal_implants_checked: boolean;
    pacemaker_checked: boolean;
    contrast_consent_signed: boolean;
    renal_creatinine_ok: boolean;
  };
  status: MriStatus;
  image_url?: string;
  findings?: string;
  previous_mri_comparison?: string;
  hospital_name?: string;
  created_at: string;
}

// --- 5. CT SCAN DEPARTMENT TYPES ---
export type CtScanStatus = 'Requested' | 'Scheduled' | 'Scan Completed' | 'Reporting' | 'Verified' | 'Delivered';

export interface CtScanRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  scan_type: string; // e.g. "CT Head Non-Contrast", "HRCT Thorax", "CT Abdomen & Pelvis Triple Phase"
  body_region: string;
  slice_count?: number;
  radiation_dose_dlp?: number;
  machine_id: string;
  machine_name: string;
  technician_name?: string;
  radiologist_name?: string;
  requested_date: string;
  scheduled_datetime?: string;
  safety_checklist: {
    contrast_allergy_checked: boolean;
    serum_creatinine_verified: boolean;
    fasting_npo_status_ok: boolean;
  };
  status: CtScanStatus;
  image_url?: string;
  findings?: string;
  previous_ct_comparison?: string;
  hospital_name?: string;
  created_at: string;
}

// --- 6. CARDIOLOGY DEPARTMENT TYPES ---
export interface CardiologyRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  cardiologist_id: string;
  cardiologist_name: string;
  visit_type: 'OPD Consultation' | 'ECG Evaluation' | '2D Echocardiogram' | 'TMT Stress Test' | 'Holter Monitoring' | 'Cath Lab Procedure' | '2D Echo' | 'ECG' | 'Cardiac Angiography' | 'Cardiac OPD';
  cardiac_history: string; // e.g. "HTN, CAD post stent"
  cardiac_biomarkers?: any;
  treatment_plan?: string;
  ecg_findings?: string; // e.g. "Sinus Rhythm, ST depression in V4-V6"
  echo_ef_percent?: number; // Ejection Fraction %
  echo_findings?: string; // e.g. "Mild LVEF 55%, No RWMA"
  procedure_type?: string;
  report_url?: string;
  status: 'Consultation' | 'Investigation Scheduled' | 'Report Ready' | 'Follow-up Scheduled' | 'Completed';
  next_follow_up?: string;
  hospital_name?: string;
  created_at: string;
}

// --- 7. PATHOLOGY DEPARTMENT TYPES ---
export type PathologyCategory = 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Urine Analysis' | 'Serology' | 'Histopathology';
export type PathologyStatus = 'Ordered' | 'Sample Collected' | 'Lab Received' | 'Processing' | 'Verification' | 'Report Ready' | 'Delivered';

export interface PathologyTestParameter {
  parameter_name: string;
  result_value: string;
  unit: string;
  reference_range: string;
  is_abnormal?: boolean;
}

export interface PathologyTestRecord {
  id: string;
  sample_id: string; // e.g. "SAMP-2026-108"
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  test_category: PathologyCategory;
  test_name: string; // e.g. "Complete Blood Count (CBC)", "Liver Function Test (LFT)", "Thyroid Profile (T3, T4, TSH)"
  technician_name?: string;
  verifier_doctor_name?: string;
  sample_type: 'Blood' | 'Urine' | 'Serum' | 'Sputum' | 'Swab' | 'Tissue Biopsy';
  sample_collection_datetime?: string;
  lab_received_datetime?: string;
  status: PathologyStatus;
  test_parameters: PathologyTestParameter[];
  summary_findings?: string;
  timestamp_logs: {
    status: PathologyStatus;
    timestamp: string;
    updated_by: string;
  }[];
  hospital_name?: string;
  created_at: string;
}

// --- 8. OPERATION THEATRE (OT) MANAGEMENT TYPES ---
export type SurgeryStatus = 'Scheduled' | 'Pre-Op' | 'Ready' | 'In Surgery' | 'Recovery' | 'Completed';

export interface OtRoom {
  id: string;
  ot_number: string; // e.g. "OT-1 Major Surgical", "OT-2 Cardiac Suite", "OT-3 Eye OT", "OT-4 Emergency OT"
  room_name?: string;
  department: string;
  specialty?: string;
  status: 'Available' | 'In Surgery' | 'Under Cleaning / Sterilization' | 'Maintenance';
  current_surgery_id?: string;
  current_patient_name?: string;
  sanitization_status: 'Sterilized' | 'Cleaning Required' | 'In Progress';
  hospital_name?: string;
}

export interface SurgeryScheduleRecord {
  id: string;
  ot_id: string;
  ot_number: string;
  patient_id: string;
  patient_name: string;
  surgery_type: string; // e.g. "Laparoscopic Cholecystectomy", "CABG Open Heart", "Total Knee Replacement"
  lead_surgeon_id: string;
  lead_surgeon_name: string;
  anesthetist_name: string;
  anesthesia_type?: string;
  nursing_team: string[];
  scheduled_date: string;
  scheduled_time_slot: string; // e.g. "09:00 - 11:30"
  required_equipment: string[];
  pre_op_checklist: {
    fasting_npo_verified: boolean;
    blood_units_reserved: boolean;
    surgical_consent_signed: boolean;
    anesthesia_clearance_done: boolean;
  };
  status: SurgeryStatus;
  recovery_notes?: string;
  hospital_name?: string;
  created_at: string;
}

// --- 9. BLOOD BANK MANAGEMENT TYPES ---
export type BloodGroupType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type BloodComponentType = 'Whole Blood' | 'Packed RBC' | 'Fresh Frozen Plasma (FFP)' | 'Platelet Concentrate';

export interface BloodBankUnitRecord {
  id: string;
  blood_unit_id: string; // e.g. "BLD-O+-108"
  blood_group: BloodGroupType;
  component_type: BloodComponentType;
  donor_id?: string;
  donor_name?: string;
  collection_date: string;
  expiry_date: string;
  storage_location: string; // e.g. "Blood Bank Refrigerator A2"
  status: 'Available' | 'Reserved' | 'Cross-Matched' | 'Issued' | 'Expired';
  reserved_for_patient_id?: string;
  reserved_for_patient_name?: string;
  hospital_name?: string;
}

export interface BloodRequestRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  blood_group: BloodGroupType;
  component_type: BloodComponentType;
  units_requested: number;
  urgency: 'Routine' | 'Emergency' | 'Massive Transfusion Protocol';
  requesting_doctor: string;
  cross_match_status: 'Pending' | 'Matched & Compatible' | 'Incompatible';
  status: 'Pending' | 'Approved' | 'Cross-Matched' | 'Issued' | 'Rejected';
  created_at: string;
  hospital_name?: string;
}

// --- 10. MEDICAL EQUIPMENT MANAGEMENT TYPES ---
export type EquipmentCategory = 
  | 'MRI'
  | 'CT Scan'
  | 'X-Ray'
  | 'Ventilator'
  | 'Ultrasound'
  | 'ECG'
  | 'Patient Monitors'
  | 'Oxygen Equipment'
  | 'Operation Theatre Equipment'
  | 'Laboratory Equipment';

export type MedicalEquipmentStatus = 'Operational' | 'In Use' | 'Reserved' | 'Maintenance' | 'Out of Service';

export interface MedicalEquipmentRecord {
  id: string;
  equipment_code: string; // e.g. "EQ-MRI-01"
  name: string; // e.g. "Siemens Magnetom 3T MRI"
  category: EquipmentCategory;
  manufacturer: string;
  model: string;
  serial_number: string;
  department: string;
  current_location: string;
  status: MedicalEquipmentStatus;
  purchase_date: string;
  warranty_expiry: string;
  last_maintenance_date: string;
  next_maintenance_date: string;
  calibration_status: 'Valid' | 'Calibration Due' | 'Expired';
  responsible_person: string;
  maintenance_history: {
    id: string;
    date: string;
    type: 'Routine Inspection' | 'Emergency Repair' | 'Calibration' | 'Software Upgrade';
    notes: string;
    performed_by: string;
    cost_inr?: number;
  }[];
  hospital_name?: string;
}

// --- SYSTEM-WIDE AUDIT LOG ---
export interface ModuleAuditLog {
  id: string;
  user_name: string;
  user_role: StaffRole;
  action: string;
  module: 
    | 'Eye Care' 
    | 'Oxygen Management' 
    | 'X-Ray' 
    | 'MRI' 
    | 'CT Scan' 
    | 'Cardiology' 
    | 'Pathology' 
    | 'Operation Theatre' 
    | 'Blood Bank' 
    | 'Medical Equipment'
    | 'ICU';
  timestamp: string;
  details: string;
}

// --- DOCTOR DASHBOARD & CLINICAL WORKSPACE TYPES ---
export interface PrescriptionMedicine {
  id?: string;
  name: string;
  dosage: string; // e.g. "500 mg", "1 Tablet", "10 ml"
  frequency: string; // e.g. "1-0-1 (Twice Daily)", "Once Daily (Morning)", "TDS", "SOS / As Needed"
  duration: string; // e.g. "5 Days", "7 Days", "14 Days", "1 Month"
  route: 'Oral' | 'IV Injection' | 'IM Injection' | 'Topical' | 'Inhalation' | 'Eye Drops' | 'Sublingual';
  instructions: string; // e.g. "After meals with warm water", "Before breakfast (Empty stomach)"
  additional_notes?: string;
}

export interface DoctorPrescription {
  id: string;
  prescription_number: string; // e.g. "RX-2026-8941"
  appointment_id?: string;
  doctor_id: string;
  doctor_name: string;
  doctor_specialization: string;
  doctor_qualification?: string;
  doctor_room_no?: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: 'Male' | 'Female' | 'Other';
  patient_blood_group?: string;
  recorded_condition: string; // Diagnosis entered by doctor
  clinical_notes?: string;
  chief_complaint?: string;
  medicines: PrescriptionMedicine[];
  advice_instructions?: string;
  follow_up_date?: string;
  status: 'Draft' | 'Finalized' | 'Cancelled';
  created_at: string;
  hospital_name?: string;
}

export interface DoctorClinicalNote {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  chief_complaint: string;
  symptoms: string[];
  clinical_notes: string;
  assessment: string;
  recorded_condition: string;
  relevant_medical_history?: string;
  allergies?: string;
  follow_up_notes?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface DoctorNotification {
  id: string;
  doctor_id: string;
  type: 'new_appointment' | 'upcoming_appointment' | 'patient_checked_in' | 'report_ready' | 'followup_due' | 'prescription_update' | 'hospital_alert' | 'general' | 'resource_request';
  title: string;
  message: string;
  patient_id?: string;
  patient_name?: string;
  appointment_id?: string;
  report_id?: string;
  timestamp: string;
  read: boolean;
  priority: 'Critical' | 'High' | 'Normal';
}

export interface DoctorFollowUp {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  patient_phone?: string;
  patient_blood_group?: string;
  doctor_id: string;
  doctor_name: string;
  previous_consultation_date: string;
  follow_up_date: string;
  recorded_condition: string;
  status: 'Upcoming' | 'Due Soon' | 'Overdue' | 'Completed';
  previous_prescription_summary?: string;
  notes?: string;
}

export interface DoctorActivityLog {
  id: string;
  doctor_id: string;
  doctor_name: string;
  action: 
    | 'Doctor viewed patient' 
    | 'Doctor created prescription' 
    | 'Doctor updated clinical notes' 
    | 'Doctor reviewed report' 
    | 'Doctor completed consultation' 
    | 'Doctor updated status'
    | 'Requested Room'
    | 'Requested ICU Bed'
    | 'Requested Oxygen Support';
  patient_id?: string;
  patient_name?: string;
  details: string;
  timestamp: string;
}

// --- DOCTOR RESOURCE REQUESTS (Room, ICU Bed, Oxygen) ---
export type DoctorRequestType = 'Room' | 'ICU Bed' | 'Oxygen Support';
export type DoctorRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Allocated';

export interface DoctorResourceRequest {
  id: string;
  doctor_id: string;
  doctor_name: string;
  patient_id: string;
  patient_name: string;
  request_type: DoctorRequestType;
  room_type?: string;
  room_no?: string;
  bed_number?: string;
  reason: string;
  priority: 'Routine' | 'Urgent' | 'Emergency' | 'Critical';
  request_time: string;
  status: DoctorRequestStatus;
  admin_notes?: string;
  hospital_name?: string;
}
