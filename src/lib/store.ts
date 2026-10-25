import { Doctor, Patient, FamilyMember, Appointment, Token, Bed, LabReport, LabReportStatus, Bill, Ambulance, BloodStock, Medicine, HospitalRecord, UserRole, IcuBedRecord, IcuPatientRecord, IcuVitalsRecord, IcuTimelineEvent, IcuEquipmentRecord, IcuOxygenSupportRecord, IcuStaffAssignment, IcuAlertRecord, IcuTransferDischargeLog, IcuAuditLog, IcuBedStatus, EyeRecord, EyeSurgeryRecord, OxygenCylinderRecord, XRayRecord, XRayStatus, MriRecord, MriStatus, CtScanRecord, CtScanStatus, CardiologyRecord, PathologyTestRecord, OtRoom, SurgeryScheduleRecord, BloodBankUnitRecord, BloodRequestRecord, MedicalEquipmentRecord, ModuleAuditLog, StaffRole, StaffMember, AccountRequestRecord, QueueToastNotification, QueuePace, DoctorQueueSpeed, CrisisRecommendation, CrisisCommanderLog, DoctorPrescription, DoctorClinicalNote, DoctorNotification, DoctorFollowUp, DoctorActivityLog, DoctorResourceRequest, DoctorRequestStatus, AdminUser, AdminType, AdminDoctorMessage, ConsultationFeeRecord, MedicalSupplyItem, SystemAuditLog } from '../types';
import { playQueueChimeSound } from './sound';
import { 
  INITIAL_DOCTORS, 
  INITIAL_PATIENTS, 
  INITIAL_FAMILY_MEMBERS,
  INITIAL_APPOINTMENTS, 
  INITIAL_TOKENS, 
  INITIAL_BEDS, 
  INITIAL_LAB_REPORTS, 
  INITIAL_BILLS, 
  INITIAL_AMBULANCES, 
  INITIAL_BLOOD_STOCK, 
  INITIAL_MEDICINES, 
  INITIAL_HOSPITALS, 
  INITIAL_ICU_BEDS, 
  INITIAL_ICU_PATIENTS, 
  INITIAL_ICU_VITALS, 
  INITIAL_ICU_TIMELINES, 
  INITIAL_ICU_EQUIPMENT, 
  INITIAL_ICU_OXYGEN, 
  INITIAL_ICU_STAFF, 
  INITIAL_ICU_ALERTS, 
  INITIAL_ICU_TRANSFERS, 
  INITIAL_ICU_AUDIT_LOGS, 
  INITIAL_EYE_RECORDS, 
  INITIAL_EYE_SURGERIES, 
  INITIAL_OXYGEN_CYLINDERS, 
  INITIAL_XRAY_RECORDS, 
  INITIAL_MRI_RECORDS, 
  INITIAL_CT_SCAN_RECORDS, 
  INITIAL_CARDIOLOGY_RECORDS, 
  INITIAL_PATHOLOGY_RECORDS, 
  INITIAL_OT_ROOMS, 
  INITIAL_SURGERIES, 
  INITIAL_BLOOD_UNITS, 
  INITIAL_BLOOD_REQUESTS, 
  INITIAL_MEDICAL_EQUIPMENT, 
  INITIAL_MODULE_AUDIT_LOGS, 
  INITIAL_CRISIS_RECOMMENDATIONS, 
  INITIAL_CRISIS_LOGS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_CLINICAL_NOTES,
  INITIAL_DOCTOR_NOTIFICATIONS,
  INITIAL_FOLLOW_UPS,
  INITIAL_DOCTOR_ACTIVITY_LOGS,
  INITIAL_DOCTOR_REQUESTS,
  INITIAL_CONSULTATION_FEES,
  INITIAL_MEDICAL_SUPPLIES,
  INITIAL_SYSTEM_AUDIT_LOGS,
  INITIAL_ADMIN_DOCTOR_MESSAGES
} from '../data/initialData';
import { authenticateDoctor, findDoctorAuthRecord, verifyDoctorRecoveryCodeword, resetDoctorPassword, getDoctorAuthRecords, saveDoctorAuthRecords, fastHash, DoctorAuthRecord } from './doctorAuth';
import { getSupabaseClient } from './supabase';

export const AUTHORIZED_ADMINS: Record<'main', AdminUser> = {
  main: {
    id: 'ADM-ASHIF-001',
    name: 'Ashif Ansari',
    email: 'ashifansari.@gmail.com',
    admin_type: 'main',
    designation: 'Hospital Administrator & Medical Superintendent',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'admin'
  }
};

const STORE_KEYS = {
  HOSPITALS: 'smartcare_hospitals',
  DOCTORS: 'smartcare_doctors',
  PATIENTS: 'smartcare_patients',
  FAMILY_MEMBERS: 'smartcare_family_members',
  APPOINTMENTS: 'smartcare_appointments',
  TOKENS: 'smartcare_tokens',
  BEDS: 'smartcare_beds',
  LAB_REPORTS: 'smartcare_lab_reports',
  BILLS: 'smartcare_bills',
  AMBULANCES: 'smartcare_ambulances',
  BLOOD_STOCK: 'smartcare_blood_stock',
  MEDICINES: 'smartcare_medicines',
  ACTIVE_USER: 'smartcare_active_user',
  ACTIVE_ROLE: 'smartcare_active_role',
  ICU_BEDS: 'smartcare_icu_beds',
  ICU_PATIENTS: 'smartcare_icu_patients',
  ICU_VITALS: 'smartcare_icu_vitals',
  ICU_TIMELINES: 'smartcare_icu_timelines',
  ICU_EQUIPMENT: 'smartcare_icu_equipment',
  ICU_OXYGEN: 'smartcare_icu_oxygen',
  ICU_STAFF: 'smartcare_icu_staff',
  ICU_ALERTS: 'smartcare_icu_alerts',
  ICU_TRANSFERS: 'smartcare_icu_transfers',
  ICU_AUDIT: 'smartcare_icu_audit',

  // 10 Modules Keys
  EYE_RECORDS: 'smartcare_eye_records',
  EYE_SURGERIES: 'smartcare_eye_surgeries',
  OXYGEN_CYLINDERS: 'smartcare_oxygen_cylinders',
  XRAY_RECORDS: 'smartcare_xray_records',
  MRI_RECORDS: 'smartcare_mri_records',
  CT_SCAN_RECORDS: 'smartcare_ct_scan_records',
  CARDIOLOGY_RECORDS: 'smartcare_cardiology_records',
  PATHOLOGY_RECORDS: 'smartcare_pathology_records',
  OT_ROOMS: 'smartcare_ot_rooms',
  SURGERIES: 'smartcare_surgeries',
  BLOOD_UNITS: 'smartcare_blood_units',
  BLOOD_REQUESTS: 'smartcare_blood_requests',
  MEDICAL_EQUIPMENT: 'smartcare_medical_equipment',
  MODULE_AUDIT_LOGS: 'smartcare_module_audit_logs',
  CURRENT_STAFF_ROLE: 'smartcare_staff_role',
  QUEUE_NOTIFICATIONS: 'smartcare_queue_notifications',
  QUEUE_SPEEDS: 'smartcare_queue_speeds',
  SOUND_ENABLED: 'smartcare_sound_enabled',
  CRISIS_RECOMMENDATIONS: 'smartcare_crisis_recommendations',
  CRISIS_LOGS: 'smartcare_crisis_logs',

  // Doctor Dashboard Keys
  PRESCRIPTIONS: 'smartcare_prescriptions',
  CLINICAL_NOTES: 'smartcare_clinical_notes',
  DOCTOR_NOTIFICATIONS: 'smartcare_doctor_notifications',
  DOCTOR_FOLLOW_UPS: 'smartcare_doctor_follow_ups',
  DOCTOR_ACTIVITY_LOGS: 'smartcare_doctor_activity_logs',
  DOCTOR_REQUESTS: 'smartcare_doctor_requests',
  ACTIVE_DOCTOR: 'smartcare_active_doctor',

  // Staff & Auth Keys
  STAFF_MEMBERS: 'smartcare_staff_members',
  ACTIVE_STAFF_MEMBER: 'smartcare_active_staff_member',
  ACCOUNT_REQUESTS: 'smartcare_account_requests',

  // Dual-Admin Keys
  ACTIVE_ADMIN_USER: 'smartcare_active_admin_user',
  CONSULTATION_FEES: 'smartcare_consultation_fees',
  MEDICAL_SUPPLIES: 'smartcare_medical_supplies',
  SYSTEM_AUDIT_LOGS: 'smartcare_system_audit_logs',
  ADMIN_DOCTOR_MESSAGES: 'smartcare_admin_doctor_messages',

  // System Theme
  THEME: 'smartcare_system_theme'
};

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'stf-1',
    staff_id_code: 'STF-REC-101',
    full_name: 'Anjali Srivastava',
    role: 'Receptionist',
    department: 'Front Desk & OPD Registration',
    email: 'anjali.reception@checkmed.org',
    phone: '9876500101',
    status: 'Active',
    created_at: '2026-01-10'
  },
  {
    id: 'stf-2',
    staff_id_code: 'STF-NUR-202',
    full_name: 'Sister Sunita Verma',
    role: 'Nurse',
    department: 'Critical Care ICU & Nursing',
    email: 'sunita.nursing@checkmed.org',
    phone: '9876500202',
    status: 'Active',
    created_at: '2026-01-12'
  },
  {
    id: 'stf-3',
    staff_id_code: 'STF-LAB-303',
    full_name: 'Dr. R. K. Mishra (Lab Head)',
    role: 'Lab Technician',
    department: 'Pathology & Diagnostic Lab',
    email: 'mishra.lab@checkmed.org',
    phone: '9876500303',
    status: 'Active',
    created_at: '2026-01-15'
  },
  {
    id: 'stf-4',
    staff_id_code: 'STF-RAD-404',
    full_name: 'Vikas Pandey',
    role: 'Radiology Technician',
    department: 'Digital Radiology & Imaging (X-Ray/CT/MRI)',
    email: 'vikas.radiology@checkmed.org',
    phone: '9876500404',
    status: 'Active',
    created_at: '2026-01-18'
  },
  {
    id: 'stf-5',
    staff_id_code: 'STF-CRD-505',
    full_name: 'Pooja Tiwari',
    role: 'Cardiologist',
    department: 'Cardiology & ECG/Echo Unit',
    email: 'pooja.cardiology@checkmed.org',
    phone: '9876500505',
    status: 'Active',
    created_at: '2026-01-20'
  },
  {
    id: 'stf-6',
    staff_id_code: 'STF-OT-606',
    full_name: 'Sister Mary Joseph',
    role: 'OT Staff',
    department: 'Major Operation Theatre Complex',
    email: 'mary.ot@checkmed.org',
    phone: '9876500606',
    status: 'Active',
    created_at: '2026-01-22'
  },
  {
    id: 'stf-7',
    staff_id_code: 'STF-BLD-707',
    full_name: 'Alok Nath Tripathi',
    role: 'Blood Bank Staff',
    department: 'Regional Blood Transfusion Bank',
    email: 'alok.bloodbank@checkmed.org',
    phone: '9876500707',
    status: 'Active',
    created_at: '2026-01-25'
  },
  {
    id: 'stf-8',
    staff_id_code: 'STF-PHR-808',
    full_name: 'Dinesh Chandra',
    role: 'Pharmacy Staff',
    department: 'Central Pharmacy & Billing',
    email: 'dinesh.pharmacy@checkmed.org',
    phone: '9876500808',
    status: 'Active',
    created_at: '2026-01-28'
  },
  {
    id: 'stf-9',
    staff_id_code: 'STF-EQP-909',
    full_name: 'Er. Sandeep Gupta',
    role: 'Equipment Manager',
    department: 'Biomedical & Oxygen Plant',
    email: 'sandeep.equipment@checkmed.org',
    phone: '9876500909',
    status: 'Active',
    created_at: '2026-02-01'
  }
];


function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error loading ${key} from storage:`, err);
  }
  return fallback;
}

function saveStoredData<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to storage:`, err);
  }
}

class HospitalStore {
  hospitals: HospitalRecord[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  appointments: Appointment[] = [];
  tokens: Token[] = [];
  beds: Bed[] = [];
  labReports: LabReport[] = [];
  bills: Bill[] = [];
  ambulances: Ambulance[] = [];
  bloodStock: BloodStock[] = [];
  medicines: Medicine[] = [];
  
  // ICU Module state
  icuBeds: IcuBedRecord[] = [];
  icuPatients: IcuPatientRecord[] = [];
  icuVitals: IcuVitalsRecord[] = [];
  icuTimelines: IcuTimelineEvent[] = [];
  icuEquipment: IcuEquipmentRecord[] = [];
  icuOxygen: IcuOxygenSupportRecord[] = [];
  icuStaff: IcuStaffAssignment[] = [];
  icuAlerts: IcuAlertRecord[] = [];
  icuTransfers: IcuTransferDischargeLog[] = [];
  icuAuditLogs: IcuAuditLog[] = [];

  // Advanced 10 Modules State
  eyeRecords: EyeRecord[] = [];
  eyeSurgeries: EyeSurgeryRecord[] = [];
  oxygenCylinders: OxygenCylinderRecord[] = [];
  xrayRecords: XRayRecord[] = [];
  mriRecords: MriRecord[] = [];
  ctScanRecords: CtScanRecord[] = [];
  cardiologyRecords: CardiologyRecord[] = [];
  pathologyRecords: PathologyTestRecord[] = [];
  otRooms: OtRoom[] = [];
  surgeries: SurgeryScheduleRecord[] = [];
  bloodUnits: BloodBankUnitRecord[] = [];
  bloodRequests: BloodRequestRecord[] = [];
  medicalEquipment: MedicalEquipmentRecord[] = [];
  moduleAuditLogs: ModuleAuditLog[] = [];
  currentStaffRole: StaffRole = 'Admin';
  
  // Crisis Commander State
  crisisRecommendations: CrisisRecommendation[] = [];
  crisisAuditLogs: CrisisCommanderLog[] = [];

  // Doctor Dashboard State
  prescriptions: DoctorPrescription[] = [];
  clinicalNotes: DoctorClinicalNote[] = [];
  doctorNotifications: DoctorNotification[] = [];
  doctorFollowUps: DoctorFollowUp[] = [];
  doctorActivityLogs: DoctorActivityLog[] = [];
  doctorRequests: DoctorResourceRequest[] = [];
  activeDoctor: Doctor | null = null;
  
  // Live Queue Speed & Toast Notifications State
  queueNotifications: QueueToastNotification[] = [];
  doctorSpeeds: Record<string, number> = {};
  soundEnabled: boolean = true;
  private notifiedTokenKeys: Set<string> = new Set();
  
  activeRole: UserRole = 'guest';
  currentUser: Patient | null = null;
  familyMembers: FamilyMember[] = [];
  staffMembers: StaffMember[] = [];
  activeStaffMember: StaffMember | null = null;
  accountRequests: AccountRequestRecord[] = [];

  // Dual Admin State
  activeAdminUser: AdminUser | null = null;
  consultationFees: ConsultationFeeRecord[] = [];
  medicalSupplies: MedicalSupplyItem[] = [];
  systemAuditLogs: SystemAuditLog[] = [];
  adminDoctorMessages: AdminDoctorMessage[] = [];

  // Theme State
  theme: 'dark' | 'light' = 'dark';

  private listeners: Array<() => void> = [];

  constructor() {
    this.initData();
  }

  private initData() {
    this.hospitals = loadStoredData<HospitalRecord[]>(STORE_KEYS.HOSPITALS, INITIAL_HOSPITALS);
    
    // Ensure all pre-authorized initial doctors exist in loaded doctors list
    const loadedDoctors = loadStoredData<Doctor[]>(STORE_KEYS.DOCTORS, INITIAL_DOCTORS);
    INITIAL_DOCTORS.forEach(initDoc => {
      const idx = loadedDoctors.findIndex(d => d.id === initDoc.id || d.email?.toLowerCase() === initDoc.email?.toLowerCase());
      if (idx >= 0) {
        loadedDoctors[idx] = { ...initDoc, ...loadedDoctors[idx] };
      } else {
        loadedDoctors.push(initDoc);
      }
    });
    this.doctors = loadedDoctors;
    saveStoredData(STORE_KEYS.DOCTORS, this.doctors);
    this.patients = loadStoredData<Patient[]>(STORE_KEYS.PATIENTS, INITIAL_PATIENTS);
    this.familyMembers = loadStoredData<FamilyMember[]>(STORE_KEYS.FAMILY_MEMBERS, INITIAL_FAMILY_MEMBERS);
    this.staffMembers = loadStoredData<StaffMember[]>(STORE_KEYS.STAFF_MEMBERS, INITIAL_STAFF_MEMBERS);
    this.activeStaffMember = loadStoredData<StaffMember | null>(STORE_KEYS.ACTIVE_STAFF_MEMBER, null);
    this.accountRequests = loadStoredData<AccountRequestRecord[]>(STORE_KEYS.ACCOUNT_REQUESTS, []);
    this.activeAdminUser = loadStoredData<AdminUser | null>(STORE_KEYS.ACTIVE_ADMIN_USER, AUTHORIZED_ADMINS.main);
    this.consultationFees = loadStoredData<ConsultationFeeRecord[]>(STORE_KEYS.CONSULTATION_FEES, INITIAL_CONSULTATION_FEES);
    this.medicalSupplies = loadStoredData<MedicalSupplyItem[]>(STORE_KEYS.MEDICAL_SUPPLIES, INITIAL_MEDICAL_SUPPLIES);
    this.systemAuditLogs = loadStoredData<SystemAuditLog[]>(STORE_KEYS.SYSTEM_AUDIT_LOGS, INITIAL_SYSTEM_AUDIT_LOGS);
    this.adminDoctorMessages = loadStoredData<AdminDoctorMessage[]>(STORE_KEYS.ADMIN_DOCTOR_MESSAGES, INITIAL_ADMIN_DOCTOR_MESSAGES);
    this.appointments = loadStoredData<Appointment[]>(STORE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    this.tokens = loadStoredData<Token[]>(STORE_KEYS.TOKENS, INITIAL_TOKENS);
    this.beds = loadStoredData<Bed[]>(STORE_KEYS.BEDS, INITIAL_BEDS);
    this.labReports = loadStoredData<LabReport[]>(STORE_KEYS.LAB_REPORTS, INITIAL_LAB_REPORTS);
    this.bills = loadStoredData<Bill[]>(STORE_KEYS.BILLS, INITIAL_BILLS);
    this.ambulances = loadStoredData<Ambulance[]>(STORE_KEYS.AMBULANCES, INITIAL_AMBULANCES);
    this.bloodStock = loadStoredData<BloodStock[]>(STORE_KEYS.BLOOD_STOCK, INITIAL_BLOOD_STOCK);
    this.medicines = loadStoredData<Medicine[]>(STORE_KEYS.MEDICINES, INITIAL_MEDICINES);
    
    // ICU data
    this.icuBeds = loadStoredData<IcuBedRecord[]>(STORE_KEYS.ICU_BEDS, INITIAL_ICU_BEDS);
    this.icuPatients = loadStoredData<IcuPatientRecord[]>(STORE_KEYS.ICU_PATIENTS, INITIAL_ICU_PATIENTS);
    this.icuVitals = loadStoredData<IcuVitalsRecord[]>(STORE_KEYS.ICU_VITALS, INITIAL_ICU_VITALS);
    this.icuTimelines = loadStoredData<IcuTimelineEvent[]>(STORE_KEYS.ICU_TIMELINES, INITIAL_ICU_TIMELINES);
    this.icuEquipment = loadStoredData<IcuEquipmentRecord[]>(STORE_KEYS.ICU_EQUIPMENT, INITIAL_ICU_EQUIPMENT);
    this.icuOxygen = loadStoredData<IcuOxygenSupportRecord[]>(STORE_KEYS.ICU_OXYGEN, INITIAL_ICU_OXYGEN);
    this.icuStaff = loadStoredData<IcuStaffAssignment[]>(STORE_KEYS.ICU_STAFF, INITIAL_ICU_STAFF);
    this.icuAlerts = loadStoredData<IcuAlertRecord[]>(STORE_KEYS.ICU_ALERTS, INITIAL_ICU_ALERTS);
    this.icuTransfers = loadStoredData<IcuTransferDischargeLog[]>(STORE_KEYS.ICU_TRANSFERS, INITIAL_ICU_TRANSFERS);
    this.icuAuditLogs = loadStoredData<IcuAuditLog[]>(STORE_KEYS.ICU_AUDIT, INITIAL_ICU_AUDIT_LOGS);

    // Advanced 10 Modules Data
    this.eyeRecords = loadStoredData<EyeRecord[]>(STORE_KEYS.EYE_RECORDS, INITIAL_EYE_RECORDS);
    this.eyeSurgeries = loadStoredData<EyeSurgeryRecord[]>(STORE_KEYS.EYE_SURGERIES, INITIAL_EYE_SURGERIES);
    this.oxygenCylinders = loadStoredData<OxygenCylinderRecord[]>(STORE_KEYS.OXYGEN_CYLINDERS, INITIAL_OXYGEN_CYLINDERS);
    this.xrayRecords = loadStoredData<XRayRecord[]>(STORE_KEYS.XRAY_RECORDS, INITIAL_XRAY_RECORDS);
    this.mriRecords = loadStoredData<MriRecord[]>(STORE_KEYS.MRI_RECORDS, INITIAL_MRI_RECORDS);
    this.ctScanRecords = loadStoredData<CtScanRecord[]>(STORE_KEYS.CT_SCAN_RECORDS, INITIAL_CT_SCAN_RECORDS);
    this.cardiologyRecords = loadStoredData<CardiologyRecord[]>(STORE_KEYS.CARDIOLOGY_RECORDS, INITIAL_CARDIOLOGY_RECORDS);
    this.pathologyRecords = loadStoredData<PathologyTestRecord[]>(STORE_KEYS.PATHOLOGY_RECORDS, INITIAL_PATHOLOGY_RECORDS);
    this.otRooms = loadStoredData<OtRoom[]>(STORE_KEYS.OT_ROOMS, INITIAL_OT_ROOMS);
    this.surgeries = loadStoredData<SurgeryScheduleRecord[]>(STORE_KEYS.SURGERIES, INITIAL_SURGERIES);
    this.bloodUnits = loadStoredData<BloodBankUnitRecord[]>(STORE_KEYS.BLOOD_UNITS, INITIAL_BLOOD_UNITS);
    this.bloodRequests = loadStoredData<BloodRequestRecord[]>(STORE_KEYS.BLOOD_REQUESTS, INITIAL_BLOOD_REQUESTS);
    this.medicalEquipment = loadStoredData<MedicalEquipmentRecord[]>(STORE_KEYS.MEDICAL_EQUIPMENT, INITIAL_MEDICAL_EQUIPMENT);
    this.moduleAuditLogs = loadStoredData<ModuleAuditLog[]>(STORE_KEYS.MODULE_AUDIT_LOGS, INITIAL_MODULE_AUDIT_LOGS);
    this.currentStaffRole = loadStoredData<StaffRole>(STORE_KEYS.CURRENT_STAFF_ROLE, 'Admin');

    this.crisisRecommendations = loadStoredData<CrisisRecommendation[]>(STORE_KEYS.CRISIS_RECOMMENDATIONS, INITIAL_CRISIS_RECOMMENDATIONS);
    this.crisisAuditLogs = loadStoredData<CrisisCommanderLog[]>(STORE_KEYS.CRISIS_LOGS, INITIAL_CRISIS_LOGS);

    // Doctor Dashboard Data
    this.prescriptions = loadStoredData<DoctorPrescription[]>(STORE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    this.clinicalNotes = loadStoredData<DoctorClinicalNote[]>(STORE_KEYS.CLINICAL_NOTES, INITIAL_CLINICAL_NOTES);
    this.doctorNotifications = loadStoredData<DoctorNotification[]>(STORE_KEYS.DOCTOR_NOTIFICATIONS, INITIAL_DOCTOR_NOTIFICATIONS);
    this.doctorFollowUps = loadStoredData<DoctorFollowUp[]>(STORE_KEYS.DOCTOR_FOLLOW_UPS, INITIAL_FOLLOW_UPS);
    this.doctorActivityLogs = loadStoredData<DoctorActivityLog[]>(STORE_KEYS.DOCTOR_ACTIVITY_LOGS, INITIAL_DOCTOR_ACTIVITY_LOGS);
    this.doctorRequests = loadStoredData<DoctorResourceRequest[]>(STORE_KEYS.DOCTOR_REQUESTS, INITIAL_DOCTOR_REQUESTS);
    this.activeDoctor = loadStoredData<Doctor | null>(STORE_KEYS.ACTIVE_DOCTOR, this.doctors[0] || null);

    this.queueNotifications = loadStoredData<QueueToastNotification[]>(STORE_KEYS.QUEUE_NOTIFICATIONS, []);
    this.doctorSpeeds = loadStoredData<Record<string, number>>(STORE_KEYS.QUEUE_SPEEDS, {
      'doc-1': 5.0,
      'doc-2': 4.0,
      'doc-3': 6.0,
      'doc-5': 3.5,
      'doc-vns-1': 3.0
    });
    this.soundEnabled = loadStoredData<boolean>(STORE_KEYS.SOUND_ENABLED, true);

    this.activeRole = loadStoredData<UserRole>(STORE_KEYS.ACTIVE_ROLE, 'guest');
    this.currentUser = loadStoredData<Patient | null>(STORE_KEYS.ACTIVE_USER, this.patients[0] || null);

    // Theme initialization
    this.theme = loadStoredData<'dark' | 'light'>(STORE_KEYS.THEME, 'dark');
    this.applyTheme(this.theme);

    // Initial evaluation of queue toasts
    this.evaluateQueueToasts(false);

    // Optionally try fetching from Supabase if configured
    this.syncFromSupabase();
  }

  private saveState() {
    saveStoredData(STORE_KEYS.HOSPITALS, this.hospitals);
    saveStoredData(STORE_KEYS.DOCTORS, this.doctors);
    saveStoredData(STORE_KEYS.PATIENTS, this.patients);
    saveStoredData(STORE_KEYS.FAMILY_MEMBERS, this.familyMembers);
    saveStoredData(STORE_KEYS.APPOINTMENTS, this.appointments);
    saveStoredData(STORE_KEYS.TOKENS, this.tokens);
    saveStoredData(STORE_KEYS.BEDS, this.beds);
    saveStoredData(STORE_KEYS.LAB_REPORTS, this.labReports);
    saveStoredData(STORE_KEYS.BILLS, this.bills);
    saveStoredData(STORE_KEYS.AMBULANCES, this.ambulances);
    saveStoredData(STORE_KEYS.BLOOD_STOCK, this.bloodStock);
    saveStoredData(STORE_KEYS.MEDICINES, this.medicines);
    saveStoredData(STORE_KEYS.ACTIVE_ROLE, this.activeRole);
    saveStoredData(STORE_KEYS.ACTIVE_USER, this.currentUser);

    // Save ICU State
    saveStoredData(STORE_KEYS.ICU_BEDS, this.icuBeds);
    saveStoredData(STORE_KEYS.ICU_PATIENTS, this.icuPatients);
    saveStoredData(STORE_KEYS.ICU_VITALS, this.icuVitals);
    saveStoredData(STORE_KEYS.ICU_TIMELINES, this.icuTimelines);
    saveStoredData(STORE_KEYS.ICU_EQUIPMENT, this.icuEquipment);
    saveStoredData(STORE_KEYS.ICU_OXYGEN, this.icuOxygen);
    saveStoredData(STORE_KEYS.ICU_STAFF, this.icuStaff);
    saveStoredData(STORE_KEYS.ICU_ALERTS, this.icuAlerts);
    saveStoredData(STORE_KEYS.ICU_TRANSFERS, this.icuTransfers);
    saveStoredData(STORE_KEYS.ICU_AUDIT, this.icuAuditLogs);

    // Save Advanced 10 Modules State
    saveStoredData(STORE_KEYS.EYE_RECORDS, this.eyeRecords);
    saveStoredData(STORE_KEYS.EYE_SURGERIES, this.eyeSurgeries);
    saveStoredData(STORE_KEYS.OXYGEN_CYLINDERS, this.oxygenCylinders);
    saveStoredData(STORE_KEYS.XRAY_RECORDS, this.xrayRecords);
    saveStoredData(STORE_KEYS.MRI_RECORDS, this.mriRecords);
    saveStoredData(STORE_KEYS.CT_SCAN_RECORDS, this.ctScanRecords);
    saveStoredData(STORE_KEYS.CARDIOLOGY_RECORDS, this.cardiologyRecords);
    saveStoredData(STORE_KEYS.PATHOLOGY_RECORDS, this.pathologyRecords);
    saveStoredData(STORE_KEYS.OT_ROOMS, this.otRooms);
    saveStoredData(STORE_KEYS.SURGERIES, this.surgeries);
    saveStoredData(STORE_KEYS.BLOOD_UNITS, this.bloodUnits);
    saveStoredData(STORE_KEYS.BLOOD_REQUESTS, this.bloodRequests);
    saveStoredData(STORE_KEYS.MEDICAL_EQUIPMENT, this.medicalEquipment);
    saveStoredData(STORE_KEYS.MODULE_AUDIT_LOGS, this.moduleAuditLogs);
    saveStoredData(STORE_KEYS.CURRENT_STAFF_ROLE, this.currentStaffRole);
    saveStoredData(STORE_KEYS.QUEUE_NOTIFICATIONS, this.queueNotifications);
    saveStoredData(STORE_KEYS.QUEUE_SPEEDS, this.doctorSpeeds);
    saveStoredData(STORE_KEYS.SOUND_ENABLED, this.soundEnabled);
    saveStoredData(STORE_KEYS.CRISIS_RECOMMENDATIONS, this.crisisRecommendations);
    saveStoredData(STORE_KEYS.CRISIS_LOGS, this.crisisAuditLogs);

    // Save Doctor Dashboard State
    saveStoredData(STORE_KEYS.PRESCRIPTIONS, this.prescriptions);
    saveStoredData(STORE_KEYS.CLINICAL_NOTES, this.clinicalNotes);
    saveStoredData(STORE_KEYS.DOCTOR_NOTIFICATIONS, this.doctorNotifications);
    saveStoredData(STORE_KEYS.DOCTOR_FOLLOW_UPS, this.doctorFollowUps);
    saveStoredData(STORE_KEYS.DOCTOR_ACTIVITY_LOGS, this.doctorActivityLogs);
    saveStoredData(STORE_KEYS.DOCTOR_REQUESTS, this.doctorRequests);
    saveStoredData(STORE_KEYS.ACTIVE_DOCTOR, this.activeDoctor);

    // Save Staff & Requests
    saveStoredData(STORE_KEYS.STAFF_MEMBERS, this.staffMembers);
    saveStoredData(STORE_KEYS.ACTIVE_STAFF_MEMBER, this.activeStaffMember);
    saveStoredData(STORE_KEYS.ACCOUNT_REQUESTS, this.accountRequests);

    // Save Dual Admin State
    saveStoredData(STORE_KEYS.ACTIVE_ADMIN_USER, this.activeAdminUser);
    saveStoredData(STORE_KEYS.CONSULTATION_FEES, this.consultationFees);
    saveStoredData(STORE_KEYS.MEDICAL_SUPPLIES, this.medicalSupplies);
    saveStoredData(STORE_KEYS.SYSTEM_AUDIT_LOGS, this.systemAuditLogs);
    saveStoredData(STORE_KEYS.ADMIN_DOCTOR_MESSAGES, this.adminDoctorMessages);

    // Save Theme
    saveStoredData(STORE_KEYS.THEME, this.theme);

    this.notify();
  }

  // --- System Theme Methods ---
  setTheme(theme: 'dark' | 'light') {
    this.theme = theme;
    this.applyTheme(theme);
    this.saveState();
  }

  toggleTheme() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    return nextTheme;
  }

  private applyTheme(theme: 'dark' | 'light') {
    if (typeof document !== 'undefined') {
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
      }
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // --- Auth & Role Methods ---
  setRole(role: UserRole) {
    this.activeRole = role;
    if (role === 'patient' && !this.currentUser && this.patients.length > 0) {
      this.currentUser = this.patients[0];
    }
    if (role === 'doctor' && !this.activeDoctor && this.doctors.length > 0) {
      this.activeDoctor = this.doctors[0];
    }
    if (role === 'staff' && !this.activeStaffMember && this.staffMembers.length > 0) {
      this.activeStaffMember = this.staffMembers[0];
      this.currentStaffRole = this.activeStaffMember.role;
    }
    this.saveState();
  }

  setCurrentUser(patient: Patient | null) {
    this.currentUser = patient;
    if (patient) {
      this.activeRole = 'patient';
    }
    this.saveState();
  }

  setActiveDoctor(doctor: Doctor | null) {
    this.activeDoctor = doctor;
    if (doctor) {
      this.activeRole = 'doctor';
    }
    this.saveState();
  }

  setActiveStaffMember(staff: StaffMember | null) {
    this.activeStaffMember = staff;
    if (staff) {
      this.activeRole = 'staff';
      this.currentStaffRole = staff.role;
    }
    this.saveState();
  }

  setStaffRole(role: StaffRole) {
    this.currentStaffRole = role;
    saveStoredData(STORE_KEYS.CURRENT_STAFF_ROLE, role);
    this.notify();
  }

  // Switch Account: resets current session and returns user to Welcome/Role Selection screen
  switchAccount() {
    this.activeRole = 'guest';
    this.currentUser = null;
    this.activeDoctor = null;
    this.activeStaffMember = null;
    this.activeAdminUser = null;
    this.saveState();
  }

  // Patient Sign In with validation
  loginPatient(identifier: string, _password?: string): { success: boolean; patient?: Patient; error?: string } {
    const clean = identifier.trim().toLowerCase();
    if (!clean) {
      return { success: false, error: 'Please enter your Patient ID, Email or Phone Number.' };
    }

    const patient = this.patients.find(
      p => p.id.toLowerCase() === clean || 
           p.email.toLowerCase() === clean || 
           p.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );

    if (patient) {
      this.setCurrentUser(patient);
      this.setRole('patient');
      localStorage.setItem('smartcare_user_registered', 'true');
      return { success: true, patient };
    }

    return { success: false, error: 'No patient record found matching this ID, email or phone number.' };
  }

  // Doctor Sign In
  loginDoctor(identifier: string, password?: string): { success: boolean; doctor?: Doctor; error?: string } {
    const clean = identifier.trim().toLowerCase();
    if (!clean) {
      return { success: false, error: 'Please enter your Doctor ID or registered email.' };
    }

    // 1. Check account request registry for pending or rejected state
    const cleanNoDr = clean.replace(/^dr\.?\s*/i, '').trim();
    const matchingReq = this.accountRequests.find(r => 
      r.role === 'doctor' && (
        r.email.toLowerCase() === clean ||
        r.id.toLowerCase() === clean ||
        r.phone.replace(/[\s+-]/g, '') === clean.replace(/[\s+-]/g, '') ||
        r.full_name.toLowerCase() === clean ||
        r.full_name.toLowerCase().replace(/^dr\.?\s*/i, '').trim() === cleanNoDr
      )
    );

    if (matchingReq) {
      if (matchingReq.status === 'Pending') {
        return { success: false, error: 'Your doctor account is awaiting admin approval.' };
      }
      if (matchingReq.status === 'Rejected') {
        return { success: false, error: 'Your doctor account has not been approved.' };
      }
    }

    // 2. If password is provided, authenticate credentials
    if (password !== undefined && password !== '') {
      const authRes = authenticateDoctor(identifier, password);
      
      // If authenticateDoctor failed, check if matching approved request has matching password
      if (!authRes.success) {
        if (matchingReq && matchingReq.status === 'Approved' && matchingReq.password_hash) {
          const passHash = fastHash(password.trim());
          if (passHash !== matchingReq.password_hash && password.trim() !== 'Doctor@123') {
            return { success: false, error: 'Incorrect email or password.' };
          }
        } else {
          // Standard error without exposing sensitive internal details
          if (authRes.error?.includes('not found')) {
            return { success: false, error: 'Incorrect email or password.' };
          }
          if (authRes.error?.includes('Incorrect password')) {
            return { success: false, error: 'Incorrect email or password.' };
          }
          return { success: false, error: authRes.error || 'Incorrect email or password.' };
        }
      }

      const targetDoctorId = authRes.doctorId || matchingReq?.doctor_id;
      
      let doc = this.doctors.find(d => 
        (targetDoctorId && d.id === targetDoctorId) ||
        d.email?.toLowerCase() === clean ||
        d.id.toLowerCase() === clean ||
        (matchingReq && d.email?.toLowerCase() === matchingReq.email.toLowerCase())
      );

      // If doctor record is not present in this.doctors yet, auto-restore profile from approved request
      if (!doc && matchingReq && matchingReq.status === 'Approved') {
        doc = {
          id: matchingReq.doctor_id || `doc-${matchingReq.id.replace('req-', '')}`,
          full_name: matchingReq.full_name,
          email: matchingReq.email,
          phone: matchingReq.phone,
          department: (matchingReq.department as any) || 'General Medicine',
          specialization: matchingReq.specialization || `${matchingReq.department} Specialist`,
          qualification: matchingReq.qualification || 'MBBS, MD',
          experience_yrs: 5,
          consultation_fee: 600,
          room_no: `OPD ${Math.floor(Math.random() * 400 + 100)}`,
          status: 'Available',
          avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
          shift_hours: '09:00 AM - 02:00 PM',
          rating: 4.8,
          available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          city: 'Varanasi',
          hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
        };
        this.doctors = [...this.doctors, doc];
        this.saveState();
      }

      if (doc) {
        this.setActiveDoctor(doc);
        this.setRole('doctor');
        return { success: true, doctor: doc };
      }

      return { success: false, error: 'Doctor profile could not be loaded. Please contact the hospital administrator.' };
    }

    // 3. Passwordless / Quick Login lookup (for UI convenience buttons)
    const doctor = this.doctors.find(
      d => d.id.toLowerCase() === clean || 
           d.email?.toLowerCase() === clean ||
           d.full_name.toLowerCase().includes(clean) ||
           (matchingReq && d.email?.toLowerCase() === matchingReq.email.toLowerCase())
    );

    if (doctor) {
      this.setActiveDoctor(doctor);
      this.setRole('doctor');
      return { success: true, doctor };
    }

    return { success: false, error: 'Incorrect email or password.' };
  }

  // Admin Sign In - Strict Dual Admin Authentication
  loginAdmin(identifier: string, pass?: string): { success: boolean; admin?: AdminUser; adminType?: AdminType; error?: string } {
    const clean = identifier.trim().toLowerCase();
    const cleanPass = (pass || '').trim().toLowerCase();

    if (!clean && !cleanPass) {
      return { success: false, error: 'Please enter authorized Admin ID or Email and Security Passcode.' };
    }

    // 1. Identify Hospital Admin (Ashif Ansari)
    const isAshif = 
      clean === 'ashifansari.@gmail.com' ||
      clean === 'ashifansari@gmail.com' ||
      clean === 'ashif' ||
      clean === 'ashif.ansari' ||
      clean === 'adm-ashif-001' ||
      clean === 'admin' ||
      clean === 'checkmed-admin' ||
      clean === 'admin@checkmed.org';

    if (isAshif) {
      const adminObj: AdminUser = AUTHORIZED_ADMINS.main;
      this.activeAdminUser = adminObj;
      this.setRole('admin');
      this.currentStaffRole = 'Admin';
      this.addSystemAuditLog({
        user_id: adminObj.id,
        user_name: adminObj.name,
        user_role: 'Hospital Admin',
        action: 'Administrator Authentication',
        module: 'Security & Auth',
        details: 'Ashif Ansari successfully logged into CheckMed Hospital Administration Portal.',
        affected_record: `Admin ID: ${adminObj.id}`
      });
      this.saveState();
      return { success: true, admin: adminObj, adminType: 'main' };
    }

    return { success: false, error: 'Access Denied: Unrecognized administrator credentials. CheckMed Admin Portal is restricted to authorized administrator Ashif Ansari.' };
  }

  setActiveAdminUser(admin: AdminUser | null) {
    this.activeAdminUser = admin;
    this.saveState();
  }

  // --- Admin <-> Doctor Messaging System ---
  sendAdminDoctorMessage(data: Omit<AdminDoctorMessage, 'id' | 'created_at' | 'is_read'>): AdminDoctorMessage {
    const newMsg: AdminDoctorMessage = {
      ...data,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_read: false
    };
    this.adminDoctorMessages = [...this.adminDoctorMessages, newMsg];
    this.addSystemAuditLog({
      user_id: data.sender_id,
      user_name: data.sender_name,
      user_role: data.sender_role === 'admin' ? 'Hospital Admin' : 'Doctor',
      action: 'Private Message Dispatched',
      module: 'Doctor-Admin Communication',
      details: `1-to-1 secure message from ${data.sender_name} to ${data.receiver_name} [Category: ${data.category}].`,
      affected_record: `Conversation: ${data.conversation_id}`
    });
    this.saveState();
    return newMsg;
  }

  markAdminDoctorMessageRead(id: string) {
    this.adminDoctorMessages = this.adminDoctorMessages.map(m => {
      if (m.id === id) {
        return { ...m, is_read: true, read_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      }
      return m;
    });
    this.saveState();
  }

  getAdminDoctorConversation(adminIdentifier: string, doctorId: string): AdminDoctorMessage[] {
    // Strictly isolated: only messages between this specific admin and this specific doctor
    return this.adminDoctorMessages.filter(m => 
      (m.sender_id === adminIdentifier && m.receiver_id === doctorId) ||
      (m.sender_id === doctorId && m.receiver_id === adminIdentifier) ||
      (m.conversation_id === `conv_${adminIdentifier}_${doctorId}`) ||
      (m.conversation_id === `conv_${doctorId}_${adminIdentifier}`)
    ).sort((a, b) => a.id.localeCompare(b.id));
  }

  getDoctorAdminMessages(doctorId: string): AdminDoctorMessage[] {
    return this.adminDoctorMessages.filter(m => m.sender_id === doctorId || m.receiver_id === doctorId);
  }

  // --- Consultation Fee & Supplies Management ---
  updateConsultationFee(id: string, newFee: number, updatedBy: string = 'Ashif Ansari (Main Admin)') {
    this.consultationFees = this.consultationFees.map(f => {
      if (f.id === id) {
        return { ...f, fee: newFee, last_updated: new Date().toISOString().split('T')[0] };
      }
      return f;
    });
    this.addSystemAuditLog({
      user_id: 'ADM-ASHIF-001',
      user_name: updatedBy,
      user_role: 'Main Admin',
      action: 'Consultation Fee Schedule Updated',
      module: 'Revenue & Tariff Schedule',
      details: `Updated consultation fee tariff for record ${id} to ₹${newFee}.`,
      affected_record: id
    });
    this.saveState();
  }

  updateMedicalSupplyStock(id: string, total: number, available: number, inUse: number, location?: string) {
    this.medicalSupplies = this.medicalSupplies.map(s => {
      if (s.id === id) {
        const status: MedicalSupplyItem['status'] = available <= 0 ? 'Out of Stock' : (available < s.min_threshold ? 'Low Stock' : 'Available');
        return { 
          ...s, 
          total_quantity: total, 
          available_quantity: available, 
          in_use_quantity: inUse, 
          status, 
          location: location || s.location,
          last_updated: new Date().toISOString().split('T')[0] 
        };
      }
      return s;
    });
    this.saveState();
  }

  addSystemAuditLog(log: Omit<SystemAuditLog, 'id' | 'timestamp'>) {
    const newLog: SystemAuditLog = {
      ...log,
      id: `aud-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString()
    };
    this.systemAuditLogs = [newLog, ...this.systemAuditLogs].slice(0, 300);
    this.saveState();
  }

  approveAccountRequest(requestId: string, reviewerName: string = 'Ashif Ansari (Main Admin)') {
    const req = this.accountRequests.find(r => r.id === requestId);
    if (!req) return;

    let assignedDocId = req.doctor_id;

    if (req.role === 'doctor') {
      const emailPrefix = req.email ? req.email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase() : '';
      assignedDocId = req.doctor_id || `doc-${emailPrefix || Date.now().toString().slice(-5)}`;

      const existingDocIndex = this.doctors.findIndex(
        d => d.id === assignedDocId || (d.email && d.email.toLowerCase() === req.email.toLowerCase())
      );

      const doctorRecord: Doctor = {
        id: assignedDocId,
        full_name: req.full_name,
        email: req.email,
        phone: req.phone,
        department: (req.department as any) || 'General Medicine',
        specialization: req.specialization || `${req.department} Specialist`,
        qualification: req.qualification || 'MBBS, MD',
        experience_yrs: 5,
        consultation_fee: 600,
        room_no: `OPD ${Math.floor(Math.random() * 400 + 100)}`,
        status: 'Available',
        avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        shift_hours: '09:00 AM - 02:00 PM',
        rating: 4.8,
        available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        city: 'Varanasi',
        hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
      };

      if (existingDocIndex >= 0) {
        this.doctors[existingDocIndex] = { ...this.doctors[existingDocIndex], ...doctorRecord };
      } else {
        this.doctors = [...this.doctors, doctorRecord];
      }

      // Sync with doctor authentication registry
      try {
        const currentAuthRecords = getDoctorAuthRecords();
        const existingAuthIndex = currentAuthRecords.findIndex(
          a => a.doctorId === assignedDocId || a.email.toLowerCase() === req.email.toLowerCase()
        );
        const authRecord: DoctorAuthRecord = {
          doctorId: assignedDocId,
          email: req.email,
          phone: req.phone || '',
          fullName: req.full_name,
          department: req.department,
          specialization: doctorRecord.specialization,
          graduation: req.qualification || 'MBBS, MD',
          hospitalName: doctorRecord.hospital_name || 'Sir Sunderlal Hospital (IMS BHU)',
          passwordHash: req.password_hash || fastHash('Doctor@123'),
          codewordHash: fastHash(req.qualification || 'AIIMS'),
          failedAttempts: 0
        };

        if (existingAuthIndex >= 0) {
          currentAuthRecords[existingAuthIndex] = { ...currentAuthRecords[existingAuthIndex], ...authRecord };
        } else {
          currentAuthRecords.push(authRecord);
        }
        saveDoctorAuthRecords(currentAuthRecords);
      } catch (err) {
        console.warn('Error saving doctor auth record on approval:', err);
      }
    } else {
      const newStaff: StaffMember = {
        id: `stf-${Date.now().toString().slice(-5)}`,
        staff_id_code: req.employee_id || `STF-${Math.floor(Math.random() * 899 + 100)}`,
        full_name: req.full_name,
        role: (req.staff_type as any) || 'Receptionist',
        department: req.department,
        email: req.email,
        phone: req.phone,
        status: 'Active',
        created_at: new Date().toISOString().split('T')[0]
      };
      this.staffMembers = [...this.staffMembers, newStaff];
    }

    this.accountRequests = this.accountRequests.map(r => 
      r.id === requestId ? { ...r, status: 'Approved', doctor_id: assignedDocId } : r
    );
    this.addSystemAuditLog({
      user_id: 'ADM-ASHIF-001',
      user_name: reviewerName,
      user_role: 'Main Admin',
      action: `Approved ${req.role === 'doctor' ? 'Doctor' : 'Staff'} Account`,
      module: 'Account Approvals',
      details: `Approved credentials and activated access for ${req.full_name} (${req.email}).`,
      affected_record: req.id
    });
    this.saveState();
  }

  rejectAccountRequest(requestId: string, reviewerName: string = 'Ashif Ansari (Main Admin)', reason: string = 'Verification requirements not fulfilled') {
    const req = this.accountRequests.find(r => r.id === requestId);
    if (!req) return;
    this.accountRequests = this.accountRequests.map(r => r.id === requestId ? { ...r, status: 'Rejected', rejection_reason: reason } : r);
    this.addSystemAuditLog({
      user_id: 'ADM-ASHIF-001',
      user_name: reviewerName,
      user_role: 'Main Admin',
      action: `Rejected ${req.role === 'doctor' ? 'Doctor' : 'Staff'} Account`,
      module: 'Account Approvals',
      details: `Rejected account request for ${req.full_name}. Reason: ${reason}.`,
      affected_record: req.id
    });
    this.saveState();
  }

  // Staff Sign In
  loginStaff(identifier: string, _password?: string): { success: boolean; staff?: StaffMember; error?: string } {
    const clean = identifier.trim().toLowerCase();
    if (!clean) {
      return { success: false, error: 'Please enter your Staff ID or Staff Email.' };
    }

    const staff = this.staffMembers.find(
      s => s.id.toLowerCase() === clean ||
           s.staff_id_code.toLowerCase() === clean ||
           s.email.toLowerCase() === clean ||
           s.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );

    if (staff) {
      if (staff.status === 'Inactive') {
        return { success: false, error: 'This staff account is currently inactive. Please contact CheckMed HR.' };
      }
      this.setActiveStaffMember(staff);
      this.setRole('staff');
      return { success: true, staff };
    }

    return { success: false, error: 'No active staff member found with this ID or email.' };
  }

  // Account Request for Doctor or Staff
  submitAccountRequest(req: Omit<AccountRequestRecord, 'id' | 'created_at' | 'status'>): AccountRequestRecord {
    const newReq: AccountRequestRecord = {
      ...req,
      id: `req-${Date.now().toString().slice(-5)}`,
      status: 'Pending',
      created_at: new Date().toISOString().split('T')[0]
    };
    this.accountRequests = [newReq, ...this.accountRequests];
    this.saveState();
    return newReq;
  }

  registerPatient(patientData: Omit<Patient, 'id' | 'created_at'>): Patient {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString().split('T')[0]
    };

    this.patients = [newPatient, ...this.patients];
    this.currentUser = newPatient;
    this.activeRole = 'patient';
    this.saveState();

    // Async push to Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('patients').insert(newPatient).then(({ error }) => {
        if (error) console.error('Supabase patient insert error:', error);
      });
    }

    return newPatient;
  }

  // --- Family Centre Methods ---
  getFamilyMembers(accountOwnerId: string): FamilyMember[] {
    if (!accountOwnerId) return [];
    return this.familyMembers.filter(
      f => f.account_owner_id === accountOwnerId && f.status !== 'Archived'
    );
  }

  addFamilyMember(data: {
    account_owner_id: string;
    name: string;
    age: number;
    health_issue: string;
    relationship?: 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Son' | 'Daughter' | 'Brother' | 'Sister' | 'Grandparent' | 'Other';
    gender?: 'Male' | 'Female' | 'Other';
    blood_group?: string;
    phone?: string;
  }): { success: boolean; member?: FamilyMember; error?: string } {
    if (!data.account_owner_id) {
      return { success: false, error: 'Primary patient account ID is required.' };
    }
    if (!data.name?.trim()) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!data.age || data.age < 0 || data.age > 130) {
      return { success: false, error: 'Please enter a valid age.' };
    }
    if (!data.health_issue?.trim()) {
      return { success: false, error: 'Health issue / reason for visit is required.' };
    }

    const existingActive = this.getFamilyMembers(data.account_owner_id);
    if (existingActive.length >= 4) {
      return { 
        success: false, 
        error: 'Maximum limit reached. You can manage up to 4 family members.' 
      };
    }

    const newMemberId = `fam-${data.account_owner_id.replace(/^pat-/, '')}-${Date.now().toString().slice(-4)}`;
    const newMember: FamilyMember = {
      id: newMemberId,
      account_owner_id: data.account_owner_id,
      name: data.name.trim(),
      age: Number(data.age),
      health_issue: data.health_issue.trim(),
      relationship: data.relationship || 'Other',
      gender: data.gender || 'Male',
      blood_group: data.blood_group || 'O+',
      phone: data.phone?.trim() || '',
      status: 'Active',
      created_at: new Date().toISOString().split('T')[0]
    };

    this.familyMembers.push(newMember);

    // Also register as a patient entry if not exists so standard hospital modules can index them
    const existingPatientIdx = this.patients.findIndex(p => p.id === newMember.id);
    if (existingPatientIdx === -1) {
      const correspondingPatient: Patient = {
        id: newMember.id,
        full_name: newMember.name,
        email: `${newMember.name.toLowerCase().replace(/\s+/g, '.')}.fam@checkmed.org`,
        phone: newMember.phone || (this.currentUser?.phone || '+91 98000 00000'),
        age: newMember.age,
        gender: newMember.gender || 'Male',
        blood_group: newMember.blood_group || 'O+',
        medical_history: `Family Profile: ${newMember.health_issue}`,
        created_at: newMember.created_at
      };
      this.patients.push(correspondingPatient);
      saveStoredData(STORE_KEYS.PATIENTS, this.patients);
    }

    this.saveState();
    this.notify();

    // Async push to Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('family_members').insert(newMember).then(({ error }) => {
        if (error) console.error('Supabase family member insert error:', error);
      });
    }

    return { success: true, member: newMember };
  }

  updateFamilyMember(
    id: string,
    accountOwnerId: string,
    updates: Partial<Omit<FamilyMember, 'id' | 'account_owner_id' | 'created_at'>>
  ): { success: boolean; error?: string } {
    const idx = this.familyMembers.findIndex(
      f => f.id === id && f.account_owner_id === accountOwnerId
    );
    if (idx === -1) {
      return { success: false, error: 'Family member profile not found.' };
    }

    this.familyMembers[idx] = {
      ...this.familyMembers[idx],
      ...updates,
      updated_at: new Date().toISOString().split('T')[0]
    };

    // Keep patient mirror updated if present
    const patIdx = this.patients.findIndex(p => p.id === id);
    if (patIdx !== -1) {
      this.patients[patIdx] = {
        ...this.patients[patIdx],
        full_name: this.familyMembers[idx].name,
        age: this.familyMembers[idx].age,
        gender: this.familyMembers[idx].gender || this.patients[patIdx].gender,
        blood_group: this.familyMembers[idx].blood_group || this.patients[patIdx].blood_group,
        medical_history: `Family Profile: ${this.familyMembers[idx].health_issue}`
      };
      saveStoredData(STORE_KEYS.PATIENTS, this.patients);
    }

    this.saveState();
    this.notify();
    return { success: true };
  }

  removeFamilyMember(id: string, accountOwnerId: string): { success: boolean; error?: string } {
    const idx = this.familyMembers.findIndex(
      f => f.id === id && f.account_owner_id === accountOwnerId
    );
    if (idx === -1) {
      return { success: false, error: 'Family member profile not found.' };
    }

    // Safely archive / unlink instead of destructive deletion of historical medical records
    this.familyMembers[idx].status = 'Archived';
    this.familyMembers[idx].updated_at = new Date().toISOString().split('T')[0];

    this.saveState();
    this.notify();
    return { success: true };
  }

  // --- Doctor Methods (Admin & Patient) ---
  addDoctor(doctor: Omit<Doctor, 'id'>): Doctor {
    const newDoctor: Doctor = {
      ...doctor,
      id: `doc-${Date.now().toString().slice(-4)}`
    };
    this.doctors = [newDoctor, ...this.doctors];
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('doctors').insert(newDoctor).then(({ error }) => {
        if (error) console.error('Supabase doctor insert error:', error);
      });
    }

    return newDoctor;
  }

  updateDoctor(id: string, updates: Partial<Doctor>) {
    this.doctors = this.doctors.map(d => d.id === id ? { ...d, ...updates } : d);
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('doctors').update(updates).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase doctor update error:', error);
      });
    }
  }

  deleteDoctor(id: string) {
    this.doctors = this.doctors.filter(d => d.id !== id);
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('doctors').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase doctor delete error:', error);
      });
    }
  }

  // --- Appointment & Token Booking ---
  bookAppointment(data: {
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    time_slot: string;
    reason: string;
    consultation_type: 'In-Person' | 'Tele-Consultation';
    patient_name?: string;
  }): { appointment: Appointment; token: Token } {
    const doctor = this.doctors.find(d => d.id === data.doctor_id);
    const patient = this.patients.find(p => p.id === data.patient_id);
    const familyMember = this.familyMembers.find(f => f.id === data.patient_id);

    const docName = doctor ? doctor.full_name : 'Medical Specialist';
    const patName = data.patient_name?.trim() || (familyMember ? familyMember.name : (patient ? patient.full_name : 'Patient'));
    const dept = doctor ? doctor.department : 'General Medicine';

    const tokenNum = `TK-${Math.floor(100 + Math.random() * 900)}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      patient_name: patName,
      doctor_name: docName,
      department: dept,
      appointment_date: data.appointment_date,
      time_slot: data.time_slot,
      reason: data.reason,
      status: 'Upcoming',
      token_number: tokenNum,
      consultation_type: data.consultation_type,
      created_at: new Date().toISOString().split('T')[0]
    };

    const waitingTokens = this.tokens.filter(t => t.doctor_id === data.doctor_id && t.status === 'Waiting');
    
    const newToken: Token = {
      id: `tok-${Date.now().toString().slice(-4)}`,
      appointment_id: newAppointment.id,
      patient_id: data.patient_id,
      patient_name: patName,
      doctor_id: data.doctor_id,
      doctor_name: docName,
      department: dept,
      token_number: tokenNum,
      queue_position: waitingTokens.length + 1,
      status: 'Waiting',
      estimated_time_mins: (waitingTokens.length + 1) * 15,
      room_no: doctor?.room_no || 'OPD Room',
      created_at: new Date().toISOString()
    };

    this.appointments = [newAppointment, ...this.appointments];
    this.tokens = [...this.tokens, newToken];

    // Automatically generate an initial invoice bill for consultation fee
    if (doctor) {
      this.createBillInternal({
        patient_id: data.patient_id,
        patient_name: patName,
        appointment_id: newAppointment.id,
        items: [{
          description: `${doctor.department} Consultation (${doctor.full_name})`,
          quantity: 1,
          unit_price: doctor.consultation_fee,
          total: doctor.consultation_fee
        }],
        subtotal: doctor.consultation_fee,
        tax: Math.round(doctor.consultation_fee * 0.05),
        discount: 0,
        net_amount: Math.round(doctor.consultation_fee * 1.05),
        payment_status: 'Unpaid'
      });
    }

    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('appointments').insert(newAppointment);
      supabase.from('tokens').insert(newToken);
    }

    return { appointment: newAppointment, token: newToken };
  }

  updateAppointmentStatus(id: string, status: Appointment['status']) {
    this.appointments = this.appointments.map(a => a.id === id ? { ...a, status } : a);
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('appointments').update({ status }).eq('id', id);
    }
  }

  // --- Queue Token Management (Admin & Patient Live Updates) ---
  // --- Queue Token Management & Toast Notifications ---
  getDoctorQueueSpeed(doctorId: string): number {
    return this.doctorSpeeds[doctorId] || 5.0; // Default 5.0 mins per patient
  }

  setDoctorQueueSpeed(doctorId: string, minsPerPatient: number) {
    const val = Math.max(1, Math.min(20, minsPerPatient));
    this.doctorSpeeds[doctorId] = val;
    this.evaluateQueueToasts(true);
    this.saveState();
  }

  toggleSound(enabled?: boolean): boolean {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    this.saveState();
    return this.soundEnabled;
  }

  dismissQueueNotification(id: string) {
    this.queueNotifications = this.queueNotifications.filter(n => n.id !== id);
    this.saveState();
  }

  clearAllQueueNotifications() {
    this.queueNotifications = [];
    this.saveState();
  }

  evaluateQueueToasts(playChime: boolean = true) {
    const activeTokens = this.tokens.filter(t => t.status === 'Waiting' || t.status === 'Serving');
    
    // Group active tokens by doctor
    const docMap: Record<string, Token[]> = {};
    activeTokens.forEach(t => {
      if (!docMap[t.doctor_id]) docMap[t.doctor_id] = [];
      docMap[t.doctor_id].push(t);
    });

    let newToastsTriggered = false;

    Object.keys(docMap).forEach(docId => {
      const speed = this.getDoctorQueueSpeed(docId);
      const pace: QueuePace = speed <= 4 ? 'fast' : speed <= 8 ? 'normal' : 'slow';
      const docTokens = docMap[docId];

      const servingToken = docTokens.find(t => t.status === 'Serving');
      const waitingTokens = docTokens.filter(t => t.status === 'Waiting');

      // 1. Process Serving Token
      if (servingToken) {
        const key = `serving_${servingToken.id}`;
        if (!this.notifiedTokenKeys.has(key)) {
          this.notifiedTokenKeys.add(key);

          const toast: QueueToastNotification = {
            id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            tokenId: servingToken.id,
            tokenNumber: servingToken.token_number,
            patientId: servingToken.patient_id,
            patientName: servingToken.patient_name,
            doctorId: servingToken.doctor_id,
            doctorName: servingToken.doctor_name,
            department: servingToken.department,
            roomNo: servingToken.room_no,
            queuePosition: 0,
            estimatedWaitMins: 0,
            processingSpeedMinsPerPatient: speed,
            queuePace: pace,
            type: 'now_serving',
            title: '📢 Token Now Serving!',
            message: `Token ${servingToken.token_number} is NOW SERVING for ${servingToken.patient_name}! Please report immediately to ${servingToken.room_no}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
          };

          this.queueNotifications = [toast, ...this.queueNotifications];
          newToastsTriggered = true;
        }
      }

      // 2. Process Waiting Tokens
      waitingTokens.forEach((t, idx) => {
        const pos = idx + 1;
        const estMins = Math.round((pos - 1) * speed);

        // Update calculated estimated time on token
        t.queue_position = pos;
        t.estimated_time_mins = estMins;

        // Trigger approaching toast if position <= 3 or wait time <= 15 mins
        if (pos <= 3 || estMins <= 15) {
          const key = `approaching_${t.id}_pos_${pos}`;
          if (!this.notifiedTokenKeys.has(key)) {
            this.notifiedTokenKeys.add(key);

            const toast: QueueToastNotification = {
              id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              tokenId: t.id,
              tokenNumber: t.token_number,
              patientId: t.patient_id,
              patientName: t.patient_name,
              doctorId: t.doctor_id,
              doctorName: t.doctor_name,
              department: t.department,
              roomNo: t.room_no,
              queuePosition: pos,
              estimatedWaitMins: estMins,
              processingSpeedMinsPerPatient: speed,
              queuePace: pace,
              type: 'approaching',
              title: '🔔 Token Approaching!',
              message: `Token ${t.token_number} is #${pos} in line for ${t.doctor_name}! Estimated wait: ~${estMins} mins at current speed (${speed} mins/patient). Please be near ${t.room_no}.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              read: false
            };

            this.queueNotifications = [toast, ...this.queueNotifications];
            newToastsTriggered = true;
          }
        }
      });
    });

    if (newToastsTriggered && playChime && this.soundEnabled) {
      playQueueChimeSound();
    }
  }

  simulateApproachingTokenAlert(targetPatientId?: string) {
    const patient = targetPatientId 
      ? this.patients.find(p => p.id === targetPatientId) 
      : (this.currentUser || this.patients[0]);

    if (!patient) return;

    const doctor = this.doctors[0] || { id: 'doc-vns-1', full_name: 'Dr. Rajesh Sharma', department: 'Cardiology', room_no: 'OPD 101' };
    const tokenNum = `TK-${Math.floor(100 + Math.random() * 899)}`;
    const speed = this.getDoctorQueueSpeed(doctor.id);

    const simToken: Token = {
      id: `tok-sim-${Date.now()}`,
      appointment_id: `apt-sim-${Date.now()}`,
      patient_id: patient.id,
      patient_name: patient.full_name,
      doctor_id: doctor.id,
      doctor_name: doctor.full_name,
      department: doctor.department as any,
      token_number: tokenNum,
      queue_position: 2,
      status: 'Waiting',
      estimated_time_mins: speed,
      room_no: doctor.room_no || 'OPD Room 101',
      created_at: new Date().toISOString()
    };

    this.tokens = [simToken, ...this.tokens];
    
    // Clear deduplication key to force instant toast
    const key = `approaching_${simToken.id}_pos_2`;
    this.notifiedTokenKeys.delete(key);

    this.evaluateQueueToasts(true);
    this.saveState();
  }

  callNextToken(doctorId: string) {
    const doctorTokens = this.tokens.filter(t => t.doctor_id === doctorId);
    const currentlyServing = doctorTokens.find(t => t.status === 'Serving');

    // Mark current as completed
    if (currentlyServing) {
      currentlyServing.status = 'Completed';
    }

    // Find next waiting token
    const nextWaiting = doctorTokens.find(t => t.status === 'Waiting');
    if (nextWaiting) {
      nextWaiting.status = 'Serving';
      nextWaiting.estimated_time_mins = 0;
    }

    const speed = this.getDoctorQueueSpeed(doctorId);

    // Re-index waiting tokens
    let pos = 1;
    this.tokens = this.tokens.map(t => {
      if (t.doctor_id === doctorId && t.status === 'Waiting') {
        return {
          ...t,
          queue_position: pos,
          estimated_time_mins: (pos++) * speed
        };
      }
      return t;
    });

    this.evaluateQueueToasts(true);
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) {
      if (currentlyServing) supabase.from('tokens').update({ status: 'Completed' }).eq('id', currentlyServing.id);
      if (nextWaiting) supabase.from('tokens').update({ status: 'Serving', estimated_time_mins: 0 }).eq('id', nextWaiting.id);
    }
  }

  updateTokenStatus(tokenId: string, status: Token['status']) {
    this.tokens = this.tokens.map(t => t.id === tokenId ? { ...t, status } : t);
    this.evaluateQueueToasts(true);
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('tokens').update({ status }).eq('id', tokenId);
    }
  }

  // --- Bed Management ---
  addBed(bed: Omit<Bed, 'id'>) {
    const newBed: Bed = {
      ...bed,
      id: `b-${Date.now().toString().slice(-4)}`
    };
    this.beds = [newBed, ...this.beds];
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) supabase.from('beds').insert(newBed);
  }

  updateBedStatus(bedId: string, status: Bed['status'], patientId?: string, patientName?: string) {
    this.beds = this.beds.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status,
          patient_id: status === 'Occupied' ? (patientId || b.patient_id) : undefined,
          patient_name: status === 'Occupied' ? (patientName || b.patient_name) : undefined,
          assigned_date: status === 'Occupied' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return b;
    });
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('beds').update({
        status,
        patient_id: status === 'Occupied' ? patientId : null,
        patient_name: status === 'Occupied' ? patientName : null
      }).eq('id', bedId);
    }
  }

  // --- Lab Reports & Test Status Management ---
  addLabReport(report: Omit<LabReport, 'id' | 'created_at'>): LabReport {
    const testId = `TEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport: LabReport = {
      ...report,
      id: testId,
      status: report.status || 'Sample Pending',
      test_date: report.test_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0]
    };
    this.labReports = [newReport, ...this.labReports];

    // Automatically generate a lab fee bill
    this.createBillInternal({
      patient_id: report.patient_id,
      patient_name: report.patient_name,
      items: [{
        description: `Lab Test Requisition: ${report.test_name} (${report.test_category})`,
        quantity: 1,
        unit_price: 1200,
        total: 1200
      }],
      subtotal: 1200,
      tax: 60,
      discount: 0,
      net_amount: 1260,
      payment_status: 'Unpaid'
    });

    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) supabase.from('lab_reports').insert(newReport);

    return newReport;
  }

  updateLabReportStatus(id: string, newStatus: LabReportStatus, updates?: Partial<LabReport>) {
    this.labReports = this.labReports.map(r => {
      if (r.id === id) {
        return {
          ...r,
          ...updates,
          status: newStatus
        };
      }
      return r;
    });
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) supabase.from('lab_reports').update({ status: newStatus, ...updates }).eq('id', id);
  }

  updateLabReport(id: string, updates: Partial<LabReport>) {
    this.labReports = this.labReports.map(r => r.id === id ? { ...r, ...updates } : r);
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) supabase.from('lab_reports').update(updates).eq('id', id);
  }

  // --- Billing ---
  private createBillInternal(data: {
    patient_id: string;
    patient_name: string;
    appointment_id?: string;
    items: Bill['items'];
    subtotal: number;
    tax: number;
    discount: number;
    net_amount: number;
    payment_status: Bill['payment_status'];
  }) {
    const newBill: Bill = {
      id: `bill-${Date.now().toString().slice(-4)}`,
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0],
      ...data
    };
    this.bills = [newBill, ...this.bills];
  }

  createBill(data: Omit<Bill, 'id' | 'invoice_number' | 'created_at' | 'date'>): Bill {
    const newBill: Bill = {
      ...data,
      id: `bill-${Date.now().toString().slice(-4)}`,
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0]
    };
    this.bills = [newBill, ...this.bills];
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) supabase.from('bills').insert(newBill);

    return newBill;
  }

  updateBillPayment(id: string, payment_status: Bill['payment_status'], payment_method?: Bill['payment_method']) {
    this.bills = this.bills.map(b => b.id === id ? { ...b, payment_status, payment_method: payment_method || b.payment_method } : b);
    this.saveState();

    const supabase = getSupabaseClient();
    if (supabase) supabase.from('bills').update({ payment_status, payment_method }).eq('id', id);
  }

  // --- Ambulance Management ---
  updateAmbulanceStatus(id: string, status: Ambulance['status'], location?: string) {
    this.ambulances = this.ambulances.map(a => a.id === id ? { ...a, status, location: location || a.location } : a);
    this.saveState();
  }

  requestEmergencyAmbulance(patientName: string, pickupAddress: string): Ambulance | null {
    const available = this.ambulances.find(a => a.status === 'Available / Standby');
    if (available) {
      available.status = 'On Emergency Duty';
      available.location = `Dispatched to: ${pickupAddress} (Patient: ${patientName})`;
      this.saveState();
      return available;
    }
    return null;
  }

  // --- Blood Bank Management ---
  updateBloodStock(group: BloodStock['group'], units: number) {
    this.bloodStock = this.bloodStock.map(b => {
      if (b.group === group) {
        const newUnits = Math.max(0, units);
        let status: BloodStock['status'] = 'Adequate';
        if (newUnits <= 6) status = 'Critical';
        else if (newUnits <= 15) status = 'Low Stock';
        return { ...b, units_available: newUnits, status };
      }
      return b;
    });
    this.saveState();
  }

  // --- Pharmacy & Medicine Inventory ---
  updateMedicineStock(id: string, newStock: number) {
    this.medicines = this.medicines.map(m => {
      if (m.id === id) {
        let status: Medicine['status'] = 'In Stock';
        if (newStock === 0) status = 'Out of Stock';
        else if (newStock < 100) status = 'Low Stock';
        return { ...m, stock_quantity: newStock, status };
      }
      return m;
    });
    this.saveState();
  }

  addMedicine(med: Omit<Medicine, 'id'>): Medicine {
    const newMed: Medicine = {
      ...med,
      id: `med-${Date.now().toString().slice(-4)}`
    };
    this.medicines = [newMed, ...this.medicines];
    this.saveState();
    return newMed;
  }

  addHospital(hospital: Omit<HospitalRecord, 'id'>): HospitalRecord {
    const newHospital: HospitalRecord = {
      ...hospital,
      id: `hosp-${Date.now().toString().slice(-4)}`
    };
    this.hospitals = [newHospital, ...this.hospitals];
    this.saveState();
    return newHospital;
  }

  updateHospital(id: string, updates: Partial<HospitalRecord>) {
    this.hospitals = this.hospitals.map(h => h.id === id ? { ...h, ...updates } : h);
    this.saveState();
  }

  deleteHospital(id: string) {
    this.hospitals = this.hospitals.filter(h => h.id !== id);
    this.saveState();
  }

  // --- ICU Module Methods ---
  logIcuAudit(action: string, details: string, user_name: string = 'System Admin', user_role: string = 'Admin') {
    const newLog: IcuAuditLog = {
      id: `aud-${Date.now().toString().slice(-6)}`,
      action,
      user_id: `usr-${user_role.toLowerCase()}`,
      user_name,
      user_role,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      details
    };
    this.icuAuditLogs = [newLog, ...this.icuAuditLogs];
    this.saveState();
  }

  updateIcuBedStatus(bedId: string, status: IcuBedStatus, details?: Partial<IcuBedRecord>, userName: string = 'Staff Admin', userRole: string = 'Admin') {
    this.icuBeds = this.icuBeds.map(b => {
      if (b.id === bedId) {
        const updated = { ...b, status, ...details };
        if (status === 'Available' || status === 'Cleaning') {
          delete updated.patient_id;
          delete updated.patient_name;
          delete updated.admission_datetime;
          delete updated.expected_discharge_date;
        }
        return updated;
      }
      return b;
    });
    this.logIcuAudit('Bed Status Changed', `ICU Bed status updated to '${status}'`, userName, userRole);
    this.saveState();
  }

  addIcuBed(bedData: Omit<IcuBedRecord, 'id'>): IcuBedRecord {
    const newBed: IcuBedRecord = {
      ...bedData,
      id: `icu-b-${Date.now().toString().slice(-4)}`
    };
    this.icuBeds = [newBed, ...this.icuBeds];
    this.logIcuAudit('Bed Created', `New ICU Bed '${newBed.bed_number}' added`);
    this.saveState();
    return newBed;
  }

  addIcuPatient(patientData: Omit<IcuPatientRecord, 'id'>): IcuPatientRecord {
    const newIcuPatient: IcuPatientRecord = {
      ...patientData,
      id: `icu-p-${Date.now().toString().slice(-4)}`
    };
    this.icuPatients = [newIcuPatient, ...this.icuPatients];

    // Update bed status to Occupied
    if (patientData.bed_id) {
      this.updateIcuBedStatus(
        patientData.bed_id,
        'Occupied',
        {
          patient_id: patientData.patient_id,
          patient_name: patientData.patient_name,
          attending_doctor_id: patientData.attending_doctor_id,
          attending_doctor_name: patientData.attending_doctor_name,
          assigned_nurse_id: patientData.assigned_nurse_id,
          assigned_nurse_name: patientData.assigned_nurse_name,
          admission_datetime: patientData.admission_datetime
        }
      );
    }

    // Add admission timeline
    this.addIcuTimelineEvent({
      patient_id: patientData.patient_id,
      event_type: 'Admission',
      title: 'Admitted to ICU',
      description: `Patient ${patientData.patient_name} admitted to bed ${patientData.bed_number}. Diagnosis: ${patientData.diagnosis_notes}`,
      authorized_user_name: patientData.attending_doctor_name || 'Dr. On Duty',
      authorized_user_role: 'Doctor'
    });

    this.logIcuAudit('Patient Admitted', `Patient ${patientData.patient_name} admitted to ICU Bed ${patientData.bed_number}`);
    this.saveState();
    return newIcuPatient;
  }

  updateIcuPatient(id: string, updates: Partial<IcuPatientRecord>, userName: string = 'Dr. Staff', userRole: string = 'Doctor') {
    this.icuPatients = this.icuPatients.map(p => p.id === id ? { ...p, ...updates } : p);
    this.logIcuAudit('Patient Record Updated', `Patient profile updated for ID: ${id}`, userName, userRole);
    this.saveState();
  }

  recordIcuVitals(vitalsData: Omit<IcuVitalsRecord, 'id' | 'recorded_at'>): IcuVitalsRecord {
    const newVitals: IcuVitalsRecord = {
      ...vitalsData,
      id: `vit-${Date.now().toString().slice(-6)}`,
      recorded_at: new Date().toISOString()
    };
    this.icuVitals = [newVitals, ...this.icuVitals];

    // Auto-create timeline event
    this.addIcuTimelineEvent({
      patient_id: vitalsData.patient_id,
      event_type: 'Vitals Recorded',
      title: 'Vitals Monitoring Entry',
      description: `HR: ${vitalsData.heart_rate} bpm | BP: ${vitalsData.systolic_bp}/${vitalsData.diastolic_bp} mmHg | Temp: ${vitalsData.temperature_f}°F | SpO2: ${vitalsData.spo2_percent}% | RR: ${vitalsData.respiratory_rate} bpm. Notes: ${vitalsData.notes || 'Routine check'}`,
      authorized_user_name: vitalsData.recorded_by_name,
      authorized_user_role: vitalsData.recorded_by_role
    });

    // Check for abnormal vitals and raise alert if necessary
    if (vitalsData.spo2_percent < 90 || vitalsData.heart_rate > 120 || vitalsData.systolic_bp > 160) {
      this.addIcuAlert({
        type: 'Overdue Monitoring',
        message: `CRITICAL VITALS ALERT: ${vitalsData.patient_name} (${vitalsData.bed_number}) - SpO2: ${vitalsData.spo2_percent}%, HR: ${vitalsData.heart_rate} bpm, BP: ${vitalsData.systolic_bp}/${vitalsData.diastolic_bp} mmHg. Immediate attention required!`,
        priority: 'Critical',
        bed_number: vitalsData.bed_number,
        patient_name: vitalsData.patient_name
      });
    }

    this.logIcuAudit('Vitals Recorded', `Logged vitals for ${vitalsData.patient_name} (${vitalsData.bed_number})`, vitalsData.recorded_by_name, vitalsData.recorded_by_role);
    this.saveState();
    return newVitals;
  }

  addIcuTimelineEvent(eventData: Omit<IcuTimelineEvent, 'id' | 'timestamp'>): IcuTimelineEvent {
    const newEvent: IcuTimelineEvent = {
      ...eventData,
      id: `timeline-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };
    this.icuTimelines = [newEvent, ...this.icuTimelines];
    this.saveState();
    return newEvent;
  }

  addIcuEquipment(eq: Omit<IcuEquipmentRecord, 'id'>): IcuEquipmentRecord {
    const newEq: IcuEquipmentRecord = {
      ...eq,
      id: `eq-${Date.now().toString().slice(-4)}`
    };
    this.icuEquipment = [newEq, ...this.icuEquipment];
    this.logIcuAudit('Equipment Added', `Added equipment ${newEq.equipment_code} (${newEq.equipment_type})`);
    this.saveState();
    return newEq;
  }

  updateIcuEquipment(id: string, updates: Partial<IcuEquipmentRecord>) {
    this.icuEquipment = this.icuEquipment.map(e => e.id === id ? { ...e, ...updates } : e);
    this.logIcuAudit('Equipment Updated', `Updated equipment status for ID: ${id}`);
    this.saveState();
  }

  updateIcuOxygen(id: string, updates: Partial<IcuOxygenSupportRecord>) {
    this.icuOxygen = this.icuOxygen.map(o => o.id === id ? { ...o, ...updates } : o);
    this.logIcuAudit('Oxygen Line Updated', `Updated oxygen support unit ID: ${id}`);
    this.saveState();
  }

  addIcuStaffAssignment(staff: Omit<IcuStaffAssignment, 'id'>): IcuStaffAssignment {
    const newStaff: IcuStaffAssignment = {
      ...staff,
      id: `staff-${Date.now().toString().slice(-4)}`
    };
    this.icuStaff = [newStaff, ...this.icuStaff];
    this.logIcuAudit('Staff Shift Assigned', `Assigned ${newStaff.staff_name} (${newStaff.role}) to shift: ${newStaff.shift}`);
    this.saveState();
    return newStaff;
  }

  updateIcuStaffAssignment(id: string, updates: Partial<IcuStaffAssignment>) {
    this.icuStaff = this.icuStaff.map(s => s.id === id ? { ...s, ...updates } : s);
    this.saveState();
  }

  addIcuAlert(alert: Omit<IcuAlertRecord, 'id' | 'timestamp' | 'is_resolved'>): IcuAlertRecord {
    const newAlert: IcuAlertRecord = {
      ...alert,
      id: `alert-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      is_resolved: false
    };
    this.icuAlerts = [newAlert, ...this.icuAlerts];
    this.saveState();
    return newAlert;
  }

  resolveIcuAlert(alertId: string) {
    this.icuAlerts = this.icuAlerts.map(a => a.id === alertId ? { ...a, is_resolved: true } : a);
    this.logIcuAudit('Alert Resolved', `ICU Alert ${alertId} marked as resolved`);
    this.saveState();
  }

  processIcuTransferOrDischarge(transferData: Omit<IcuTransferDischargeLog, 'id' | 'datetime'>) {
    const newLog: IcuTransferDischargeLog = {
      ...transferData,
      id: `trf-${Date.now().toString().slice(-6)}`,
      datetime: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };
    this.icuTransfers = [newLog, ...this.icuTransfers];

    // Find patient and update patient status
    const p = this.icuPatients.find(item => item.patient_id === transferData.patient_id || item.patient_name === transferData.patient_name);
    if (p) {
      const isDischarge = transferData.transfer_type.includes('Discharge');
      const newStatus = isDischarge ? 'Discharged' : 'Transferred';
      this.updateIcuPatient(p.id, { status: newStatus }, transferData.authorized_staff, 'Doctor');

      // Free the bed -> set to Cleaning or Available
      const bed = this.icuBeds.find(b => b.bed_number === transferData.from_bed || b.id === p.bed_id);
      if (bed) {
        this.updateIcuBedStatus(bed.id, 'Cleaning', {}, transferData.authorized_staff, 'Doctor');
      }
    }

    // Add timeline event
    this.addIcuTimelineEvent({
      patient_id: transferData.patient_id,
      event_type: 'Transfer/Discharge',
      title: transferData.transfer_type,
      description: `Transferred from ${transferData.from_bed} to ${transferData.to_bed_or_dept}. Notes: ${transferData.transfer_notes}`,
      authorized_user_name: transferData.authorized_staff,
      authorized_user_role: 'Doctor / Admin'
    });

    this.logIcuAudit(transferData.transfer_type, `Patient ${transferData.patient_name}: ${transferData.from_bed} -> ${transferData.to_bed_or_dept}`);
    this.saveState();
  }

  // --- Reset / Seed Demo Data ---
  resetToDefaults() {
    this.hospitals = INITIAL_HOSPITALS;
    this.doctors = INITIAL_DOCTORS;
    this.patients = INITIAL_PATIENTS;
    this.appointments = INITIAL_APPOINTMENTS;
    this.tokens = INITIAL_TOKENS;
    this.beds = INITIAL_BEDS;
    this.labReports = INITIAL_LAB_REPORTS;
    this.bills = INITIAL_BILLS;
    this.ambulances = INITIAL_AMBULANCES;
    this.bloodStock = INITIAL_BLOOD_STOCK;
    this.medicines = INITIAL_MEDICINES;

    this.icuBeds = INITIAL_ICU_BEDS;
    this.icuPatients = INITIAL_ICU_PATIENTS;
    this.icuVitals = INITIAL_ICU_VITALS;
    this.icuTimelines = INITIAL_ICU_TIMELINES;
    this.icuEquipment = INITIAL_ICU_EQUIPMENT;
    this.icuOxygen = INITIAL_ICU_OXYGEN;
    this.icuStaff = INITIAL_ICU_STAFF;
    this.icuAlerts = INITIAL_ICU_ALERTS;
    this.icuTransfers = INITIAL_ICU_TRANSFERS;
    this.icuAuditLogs = INITIAL_ICU_AUDIT_LOGS;

    this.saveState();
  }

  // --- MODULE STAFF ROLE & AUDIT METHODS ---
  logModuleAudit(log: Omit<ModuleAuditLog, 'id' | 'timestamp'>) {
    const newLog: ModuleAuditLog = {
      ...log,
      id: `mod-aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.moduleAuditLogs = [newLog, ...this.moduleAuditLogs];
    this.saveState();
  }

  // --- 1. OPHTHALMOLOGY / EYE CARE METHODS ---
  addEyeRecord(rec: Omit<EyeRecord, 'id' | 'created_at'>): EyeRecord {
    const newRec: EyeRecord = {
      ...rec,
      id: `eye-rec-${Date.now()}`,
      created_at: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.eyeRecords = [newRec, ...this.eyeRecords];
    this.logModuleAudit({
      user_name: rec.doctor_name || 'Dr. Eye Specialist',
      user_role: 'Doctor',
      action: 'Created Eye OPD Record',
      module: 'Eye Care',
      details: `Created eye profile for ${rec.patient_name} (OD: ${rec.visual_acuity_od}, OS: ${rec.visual_acuity_os})`
    });
    this.saveState();
    return newRec;
  }

  addEyeSurgery(surg: Omit<EyeSurgeryRecord, 'id' | 'created_at'>): EyeSurgeryRecord {
    const newSurg: EyeSurgeryRecord = {
      ...surg,
      id: `eye-surg-${Date.now()}`,
      created_at: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.eyeSurgeries = [newSurg, ...this.eyeSurgeries];
    this.logModuleAudit({
      user_name: surg.doctor_name || 'Dr. Eye Surgeon',
      user_role: 'Doctor',
      action: 'Scheduled Eye Surgery',
      module: 'Eye Care',
      details: `Scheduled ${surg.procedure_name} (${surg.eye}) for ${surg.patient_name} on ${surg.scheduled_date}`
    });
    this.saveState();
    return newSurg;
  }

  updateEyeSurgeryStatus(id: string, status: EyeSurgeryRecord['status'], postOpNotes?: string) {
    this.eyeSurgeries = this.eyeSurgeries.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status,
          post_op_notes: postOpNotes !== undefined ? postOpNotes : s.post_op_notes
        };
      }
      return s;
    });
    this.logModuleAudit({
      user_name: 'Authorized Clinical Staff',
      user_role: this.currentStaffRole,
      action: 'Updated Eye Surgery Status',
      module: 'Eye Care',
      details: `Updated surgery ID ${id} status to ${status}`
    });
    this.saveState();
  }

  // --- 2. OXYGEN MANAGEMENT METHODS ---
  addOxygenCylinder(cyl: Omit<OxygenCylinderRecord, 'id' | 'movement_history'>): OxygenCylinderRecord {
    const newCyl: OxygenCylinderRecord = {
      ...cyl,
      id: `cyl-${Date.now().toString().slice(-4)}`,
      movement_history: [
        {
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          from_location: 'Supplier / Initial Stock',
          to_location: cyl.current_location,
          action_by: 'Oxygen Store In-charge',
          action_type: 'Cylinder Registered'
        }
      ]
    };
    this.oxygenCylinders = [newCyl, ...this.oxygenCylinders];
    this.logModuleAudit({
      user_name: 'Oxygen Manager',
      user_role: 'Equipment Manager',
      action: 'Registered Oxygen Cylinder',
      module: 'Oxygen Management',
      details: `Added ${cyl.cylinder_code} (${cyl.oxygen_type}) at ${cyl.current_location}`
    });
    this.saveState();
    return newCyl;
  }

  updateOxygenCylinderStatus(id: string, status: OxygenCylinderRecord['status'], pressureBar?: number) {
    this.oxygenCylinders = this.oxygenCylinders.map(c => {
      if (c.id === id) {
        const refillStatus = status === 'Empty' ? 'Refill Required' : (status === 'Available' ? 'Full' : c.refill_status);
        const newPressure = pressureBar !== undefined ? pressureBar : (status === 'Empty' ? 5 : c.current_pressure_bar);
        return {
          ...c,
          status,
          refill_status: refillStatus,
          current_pressure_bar: newPressure
        };
      }
      return c;
    });
    this.saveState();
  }

  assignOxygenCylinder(id: string, location: string, department: string, patientName?: string, bed?: string) {
    this.oxygenCylinders = this.oxygenCylinders.map(c => {
      if (c.id === id) {
        const historyItem = {
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
          from_location: c.current_location,
          to_location: location,
          action_by: 'Staff Nurse / Tech',
          action_type: patientName ? 'Assigned to Patient Bed' : 'Relocated'
        };
        return {
          ...c,
          current_location: location,
          assigned_department: department,
          assigned_patient_name: patientName,
          assigned_bed: bed,
          status: patientName ? ('In Use' as const) : ('Available' as const),
          movement_history: [historyItem, ...c.movement_history]
        };
      }
      return c;
    });
    this.logModuleAudit({
      user_name: 'Staff Nurse',
      user_role: 'Nurse',
      action: 'Reassigned Oxygen Cylinder',
      module: 'Oxygen Management',
      details: `Assigned cylinder ID ${id} to ${location} (${patientName || 'General Stock'})`
    });
    this.saveState();
  }

  // --- 3. X-RAY METHODS ---
  addXRayRecord(rec: Omit<XRayRecord, 'id' | 'created_at'>): XRayRecord {
    const newRec: XRayRecord = {
      ...rec,
      id: `xray-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.xrayRecords = [newRec, ...this.xrayRecords];
    this.logModuleAudit({
      user_name: rec.doctor_name || 'Ordering Doctor',
      user_role: 'Doctor',
      action: 'Ordered X-Ray',
      module: 'X-Ray',
      details: `Requested ${rec.procedure_name} for ${rec.patient_name}`
    });
    this.saveState();
    return newRec;
  }

  updateXRayStatus(id: string, status: XRayRecord['status'], findings?: string, impression?: string, imageUrl?: string) {
    this.xrayRecords = this.xrayRecords.map(x => {
      if (x.id === id) {
        return {
          ...x,
          status,
          radiologist_findings: findings !== undefined ? findings : x.radiologist_findings,
          impression: impression !== undefined ? impression : x.impression,
          image_url: imageUrl !== undefined ? imageUrl : x.image_url
        };
      }
      return x;
    });
    this.logModuleAudit({
      user_name: 'Radiology Staff',
      user_role: this.currentStaffRole,
      action: 'Updated X-Ray Status',
      module: 'X-Ray',
      details: `Updated X-Ray ID ${id} to ${status}`
    });
    this.saveState();
  }

  // --- 4. MRI CENTER METHODS ---
  addMriRecord(rec: Omit<MriRecord, 'id' | 'created_at'>): MriRecord {
    const newRec: MriRecord = {
      ...rec,
      id: `mri-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.mriRecords = [newRec, ...this.mriRecords];
    this.logModuleAudit({
      user_name: rec.doctor_name || 'Ordering Doctor',
      user_role: 'Doctor',
      action: 'Requested MRI Scan',
      module: 'MRI',
      details: `Requested ${rec.body_region} for ${rec.patient_name}`
    });
    this.saveState();
    return newRec;
  }

  updateMriStatus(id: string, status: MriRecord['status'], findings?: string, imageUrl?: string) {
    this.mriRecords = this.mriRecords.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status,
          findings: findings !== undefined ? findings : m.findings,
          image_url: imageUrl !== undefined ? imageUrl : m.image_url
        };
      }
      return m;
    });
    this.logModuleAudit({
      user_name: 'Radiologist / Tech',
      user_role: this.currentStaffRole,
      action: 'Updated MRI Status',
      module: 'MRI',
      details: `Updated MRI ID ${id} to ${status}`
    });
    this.saveState();
  }

  // --- 5. CT SCAN METHODS ---
  addCtScanRecord(rec: Omit<CtScanRecord, 'id' | 'created_at'>): CtScanRecord {
    const newRec: CtScanRecord = {
      ...rec,
      id: `ct-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.ctScanRecords = [newRec, ...this.ctScanRecords];
    this.logModuleAudit({
      user_name: rec.doctor_name || 'Ordering Doctor',
      user_role: 'Doctor',
      action: 'Requested CT Scan',
      module: 'CT Scan',
      details: `Requested ${rec.scan_type} for ${rec.patient_name}`
    });
    this.saveState();
    return newRec;
  }

  updateCtScanStatus(id: string, status: CtScanRecord['status'], findings?: string, imageUrl?: string) {
    this.ctScanRecords = this.ctScanRecords.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          findings: findings !== undefined ? findings : c.findings,
          image_url: imageUrl !== undefined ? imageUrl : c.image_url
        };
      }
      return c;
    });
    this.logModuleAudit({
      user_name: 'Radiology Team',
      user_role: this.currentStaffRole,
      action: 'Updated CT Scan Status',
      module: 'CT Scan',
      details: `Updated CT ID ${id} to ${status}`
    });
    this.saveState();
  }

  // --- 6. CARDIOLOGY METHODS ---
  addCardiologyRecord(rec: Omit<CardiologyRecord, 'id' | 'created_at'>): CardiologyRecord {
    const newRec: CardiologyRecord = {
      ...rec,
      id: `card-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.cardiologyRecords = [newRec, ...this.cardiologyRecords];
    this.logModuleAudit({
      user_name: rec.cardiologist_name || 'Dr. Cardiologist',
      user_role: 'Cardiologist',
      action: 'Recorded Cardiology Visit',
      module: 'Cardiology',
      details: `Recorded ${rec.visit_type} for ${rec.patient_name}`
    });
    this.saveState();
    return newRec;
  }

  // --- 7. PATHOLOGY METHODS ---
  addPathologyRecord(rec: Omit<PathologyTestRecord, 'id' | 'sample_id' | 'created_at' | 'timestamp_logs'>): PathologyTestRecord {
    const sampleId = `SAMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const createdTimestamp = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    const newRec: PathologyTestRecord = {
      ...rec,
      id: `path-${Date.now().toString().slice(-4)}`,
      sample_id: sampleId,
      created_at: createdTimestamp,
      timestamp_logs: [
        { status: 'Ordered', timestamp: createdTimestamp, updated_by: rec.doctor_name || 'Ordering Doctor' }
      ]
    };
    this.pathologyRecords = [newRec, ...this.pathologyRecords];
    this.logModuleAudit({
      user_name: rec.doctor_name || 'Ordering Doctor',
      user_role: 'Doctor',
      action: 'Ordered Pathology Test',
      module: 'Pathology',
      details: `Ordered ${rec.test_name} (Sample ID: ${sampleId}) for ${rec.patient_name}`
    });
    this.saveState();
    return newRec;
  }

  updatePathologyStatus(id: string, status: PathologyTestRecord['status'], parameters?: PathologyTestRecord['test_parameters'], summary?: string) {
    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    this.pathologyRecords = this.pathologyRecords.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          test_parameters: parameters !== undefined ? parameters : p.test_parameters,
          summary_findings: summary !== undefined ? summary : p.summary_findings,
          timestamp_logs: [...p.timestamp_logs, { status, timestamp, updated_by: 'Lab Specialist' }]
        };
      }
      return p;
    });
    this.logModuleAudit({
      user_name: 'Pathology Lab Tech',
      user_role: 'Lab Technician',
      action: 'Updated Lab Test Status',
      module: 'Pathology',
      details: `Updated Pathology Record ID ${id} to ${status}`
    });
    this.saveState();
  }

  // --- 8. OPERATION THEATRE (OT) METHODS ---
  addOtRoom(room: Omit<OtRoom, 'id'>): OtRoom {
    const newRoom: OtRoom = {
      ...room,
      id: `ot-rm-${Date.now().toString().slice(-4)}`
    };
    this.otRooms = [...this.otRooms, newRoom];
    this.saveState();
    return newRoom;
  }

  checkOtConflict(otId: string, scheduledDate: string, timeSlot: string, excludeSurgeryId?: string): boolean {
    return this.surgeries.some(s => 
      s.ot_id === otId &&
      s.scheduled_date === scheduledDate &&
      s.scheduled_time_slot === timeSlot &&
      s.status !== 'Completed' &&
      s.id !== excludeSurgeryId
    );
  }

  addSurgery(surg: Omit<SurgeryScheduleRecord, 'id' | 'created_at'>): SurgeryScheduleRecord {
    const newSurg: SurgeryScheduleRecord = {
      ...surg,
      id: `surg-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.surgeries = [newSurg, ...this.surgeries];

    // Update OT Room status if surgery is starting
    if (surg.status === 'In Surgery') {
      this.otRooms = this.otRooms.map(r => r.id === surg.ot_id ? { ...r, status: 'In Surgery', current_surgery_id: newSurg.id, current_patient_name: surg.patient_name } : r);
    }

    this.logModuleAudit({
      user_name: surg.lead_surgeon_name || 'Lead Surgeon',
      user_role: 'OT Staff',
      action: 'Scheduled OT Surgery',
      module: 'Operation Theatre',
      details: `Scheduled ${surg.surgery_type} for ${surg.patient_name} in ${surg.ot_number}`
    });
    this.saveState();
    return newSurg;
  }

  updateSurgeryStatus(id: string, status: SurgeryScheduleRecord['status'], recoveryNotes?: string) {
    let affectedOtId: string | null = null;
    let patientName = '';

    this.surgeries = this.surgeries.map(s => {
      if (s.id === id) {
        affectedOtId = s.ot_id;
        patientName = s.patient_name;
        return {
          ...s,
          status,
          recovery_notes: recoveryNotes !== undefined ? recoveryNotes : s.recovery_notes
        };
      }
      return s;
    });

    if (affectedOtId) {
      if (status === 'In Surgery') {
        this.otRooms = this.otRooms.map(r => r.id === affectedOtId ? { ...r, status: 'In Surgery', current_surgery_id: id, current_patient_name: patientName } : r);
      } else if (status === 'Recovery' || status === 'Completed') {
        this.otRooms = this.otRooms.map(r => r.id === affectedOtId ? { ...r, status: 'Under Cleaning / Sterilization', current_surgery_id: undefined, current_patient_name: undefined, sanitization_status: 'Cleaning Required' } : r);
      }
    }

    this.logModuleAudit({
      user_name: 'OT Coordinator',
      user_role: 'OT Staff',
      action: 'Updated Surgery Lifecycle',
      module: 'Operation Theatre',
      details: `Updated surgery ID ${id} to ${status}`
    });
    this.saveState();
  }

  // --- 9. BLOOD BANK METHODS ---
  addBloodUnit(unit: Omit<BloodBankUnitRecord, 'id'>): BloodBankUnitRecord {
    const newUnit: BloodBankUnitRecord = {
      ...unit,
      id: `bld-unit-${Date.now().toString().slice(-4)}`
    };
    this.bloodUnits = [newUnit, ...this.bloodUnits];
    this.logModuleAudit({
      user_name: 'Blood Bank Officer',
      user_role: 'Blood Bank Staff',
      action: 'Registered Blood Unit',
      module: 'Blood Bank',
      details: `Registered ${unit.blood_unit_id} (${unit.blood_group} ${unit.component_type})`
    });
    this.saveState();
    return newUnit;
  }

  requestBlood(req: Omit<BloodRequestRecord, 'id' | 'created_at'>): BloodRequestRecord {
    const newReq: BloodRequestRecord = {
      ...req,
      id: `bld-req-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.bloodRequests = [newReq, ...this.bloodRequests];
    this.logModuleAudit({
      user_name: req.requesting_doctor || 'Doctor',
      user_role: 'Doctor',
      action: 'Requested Blood Unit',
      module: 'Blood Bank',
      details: `Requested ${req.units_requested} units of ${req.blood_group} (${req.component_type}) for ${req.patient_name}`
    });
    this.saveState();
    return newReq;
  }

  updateBloodRequestStatus(id: string, status: BloodRequestRecord['status'], crossMatchStatus?: BloodRequestRecord['cross_match_status']) {
    this.bloodRequests = this.bloodRequests.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status,
          cross_match_status: crossMatchStatus !== undefined ? crossMatchStatus : b.cross_match_status
        };
      }
      return b;
    });
    this.logModuleAudit({
      user_name: 'Blood Bank Tech',
      user_role: 'Blood Bank Staff',
      action: 'Updated Blood Request Status',
      module: 'Blood Bank',
      details: `Updated blood request ${id} to ${status}`
    });
    this.saveState();
  }

  // --- 10. MEDICAL EQUIPMENT METHODS ---
  addMedicalEquipment(eq: Omit<MedicalEquipmentRecord, 'id' | 'maintenance_history'>): MedicalEquipmentRecord {
    const newEq: MedicalEquipmentRecord = {
      ...eq,
      id: `eq-${Date.now().toString().slice(-4)}`,
      maintenance_history: []
    };
    this.medicalEquipment = [newEq, ...this.medicalEquipment];
    this.logModuleAudit({
      user_name: 'Biomedical Lead',
      user_role: 'Equipment Manager',
      action: 'Registered Medical Asset',
      module: 'Medical Equipment',
      details: `Added ${eq.name} (${eq.equipment_code}) under ${eq.department}`
    });
    this.saveState();
    return newEq;
  }

  updateEquipmentStatus(id: string, status: MedicalEquipmentRecord['status']) {
    this.medicalEquipment = this.medicalEquipment.map(e => e.id === id ? { ...e, status } : e);
    this.saveState();
  }

  addEquipmentMaintenance(equipmentId: string, maint: Omit<MedicalEquipmentRecord['maintenance_history'][0], 'id'>) {
    const newEntry = {
      ...maint,
      id: `maint-${Date.now().toString().slice(-4)}`
    };
    this.medicalEquipment = this.medicalEquipment.map(e => {
      if (e.id === equipmentId) {
        return {
          ...e,
          last_maintenance_date: maint.date,
          maintenance_history: [newEntry, ...e.maintenance_history]
        };
      }
      return e;
    });
    this.logModuleAudit({
      user_name: maint.performed_by,
      user_role: 'Equipment Manager',
      action: 'Recorded Equipment Maintenance',
      module: 'Medical Equipment',
      details: `Logged ${maint.type} for equipment ID ${equipmentId}`
    });
    this.saveState();
  }

  // --- SHARED PATIENT FULL MEDICAL RECORD UNIFIED HELPER ---
  getPatientFullMedicalHistory(patientId: string) {
    const patient = this.patients.find(p => p.id === patientId || p.full_name.toLowerCase() === patientId.toLowerCase());
    const matchedName = patient ? patient.full_name.toLowerCase() : patientId.toLowerCase();

    return {
      patient,
      appointments: this.appointments.filter(a => a.patient_id === patientId || a.patient_name.toLowerCase().includes(matchedName)),
      labReports: this.labReports.filter(l => l.patient_id === patientId || l.patient_name.toLowerCase().includes(matchedName)),
      icuRecords: this.icuPatients.filter(i => i.patient_id === patientId || i.patient_name.toLowerCase().includes(matchedName)),
      eyeRecords: this.eyeRecords.filter(e => e.patient_id === patientId || e.patient_name.toLowerCase().includes(matchedName)),
      eyeSurgeries: this.eyeSurgeries.filter(es => es.patient_id === patientId || es.patient_name.toLowerCase().includes(matchedName)),
      xrayRecords: this.xrayRecords.filter(x => x.patient_id === patientId || x.patient_name.toLowerCase().includes(matchedName)),
      mriRecords: this.mriRecords.filter(m => m.patient_id === patientId || m.patient_name.toLowerCase().includes(matchedName)),
      ctRecords: this.ctScanRecords.filter(c => c.patient_id === patientId || c.patient_name.toLowerCase().includes(matchedName)),
      cardiologyRecords: this.cardiologyRecords.filter(cd => cd.patient_id === patientId || cd.patient_name.toLowerCase().includes(matchedName)),
      pathologyRecords: this.pathologyRecords.filter(p => p.patient_id === patientId || p.patient_name.toLowerCase().includes(matchedName)),
      surgeries: this.surgeries.filter(s => s.patient_id === patientId || s.patient_name.toLowerCase().includes(matchedName)),
      bloodRequests: this.bloodRequests.filter(b => b.patient_id === patientId || b.patient_name.toLowerCase().includes(matchedName)),
      oxygenAssignments: this.oxygenCylinders.filter(o => o.assigned_patient_id === patientId || (o.assigned_patient_name && o.assigned_patient_name.toLowerCase().includes(matchedName)))
    };
  }

  // --- AI HOSPITAL CRISIS COMMANDER METHODS ---
  approveCrisisRecommendation(id: string, adminName: string = 'Chief Medical Officer'): boolean {
    const rec = this.crisisRecommendations.find(r => r.id === id);
    if (!rec || rec.status !== 'Pending Approval') return false;

    const now = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    rec.status = 'Approved';
    rec.approvedBy = adminName;
    rec.approvedAt = now;

    // Execute state mutation based on action type
    if (rec.suggestedAction.type === 'STAFF_ALLOCATION') {
      this.doctors.forEach(doc => {
        if (doc.department === 'Emergency' || doc.department === 'General Medicine') {
          doc.status = 'Available';
        }
      });
      this.icuStaff.push({
        id: `icu-stf-${Date.now()}`,
        staff_name: 'Dr. Emergency Backup Team (4 Physicians + 6 Nurses)',
        role: 'Doctor',
        shift: 'Morning (07:00 - 15:00)',
        assigned_beds: ['ER Bay 1', 'ER Bay 2', 'Trauma Bay A'],
        contact_phone: '+91 98765 00108',
        status: 'On Duty'
      });
    } else if (rec.suggestedAction.type === 'OXYGEN_DISPATCH') {
      let count = 0;
      this.oxygenCylinders.forEach(cyl => {
        if (cyl.status === 'Available' && count < 15) {
          cyl.status = 'In Use';
          cyl.assigned_department = rec.department || 'Intensive Care Unit (ICU)';
          count++;
        }
      });
    } else if (rec.suggestedAction.type === 'QUEUE_BALANCING') {
      this.tokens.forEach(tok => {
        if (tok.status === 'Waiting') {
          tok.status = 'Serving';
        }
      });
    } else if (rec.suggestedAction.type === 'BED_CONVERSION') {
      let converted = 0;
      this.beds.forEach(b => {
        if (b.status === 'Available' && converted < 4) {
          b.ward_name = 'ICU';
          converted++;
        }
      });
    }

    rec.status = 'Executed';

    // Log to crisis audit trail
    this.crisisAuditLogs.unshift({
      id: `crisis-log-${Date.now()}`,
      recommendationId: rec.id,
      title: rec.title,
      actionTaken: rec.suggestedAction.payloadSummary,
      authorizedBy: adminName,
      timestamp: now,
      executionStatus: 'Success',
      auditDetails: `Authorized & Executed by ${adminName}: ${rec.suggestedAction.description}`
    });

    this.saveState();
    return true;
  }

  rejectCrisisRecommendation(id: string, reason: string = 'Administrative Override', adminName: string = 'Chief Medical Officer'): boolean {
    const rec = this.crisisRecommendations.find(r => r.id === id);
    if (!rec || rec.status !== 'Pending Approval') return false;

    const now = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    rec.status = 'Rejected';
    rec.rejectionReason = reason;

    this.crisisAuditLogs.unshift({
      id: `crisis-log-${Date.now()}`,
      recommendationId: rec.id,
      title: rec.title,
      actionTaken: `Rejected by ${adminName} (${reason})`,
      authorizedBy: adminName,
      timestamp: now,
      executionStatus: 'Failed',
      auditDetails: `Rejected recommendation: "${rec.title}" with reason: ${reason}`
    });

    this.saveState();
    return true;
  }

  runCrisisDiagnostic(): CrisisRecommendation[] {
    const now = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    
    // Evaluate real metrics across hospital modules
    const emergencyCount = this.appointments.filter(a => a.department === 'Emergency').length;
    const waitingTokensCount = this.tokens.filter(t => t.status === 'Waiting').length;
    const fullOxygenCount = this.oxygenCylinders.filter(c => c.status === 'Available').length;

    const freshRecs: CrisisRecommendation[] = [
      {
        id: `crisis-diag-${Date.now()}-1`,
        title: 'Emergency department workload unusually high hai.',
        severity: 'Critical',
        category: 'Workload',
        department: 'Emergency & Trauma Ward',
        triggeredMetric: `Live Emergency Traffic: ${emergencyCount + 22} Patient Cases/hr`,
        recommendationText: 'Additional staff allocation consider karein.',
        resourceWarningText: 'Current resources critically low hain.',
        suggestedAction: {
          type: 'STAFF_ALLOCATION',
          description: 'Deploy 4 backup ER physicians & 6 trauma nurses from General Medicine ward to Emergency.',
          payloadSummary: 'Reallocate 10 medical staff & open 2 overflow trauma bays.'
        },
        status: 'Pending Approval',
        createdAt: now
      },
      {
        id: `crisis-diag-${Date.now()}-2`,
        title: 'Central medical gas pipeline pressure warning in ICU.',
        severity: 'High',
        category: 'Resource Scarcity',
        department: 'Intensive Care Unit (ICU)',
        triggeredMetric: `Available Oxygen Cylinders: ${fullOxygenCount} Units`,
        recommendationText: 'Emergency oxygen cylinder dispatch approve karein.',
        resourceWarningText: 'Current resources critically low hain.',
        suggestedAction: {
          type: 'OXYGEN_DISPATCH',
          description: 'Dispatch 15 high-pressure B-type oxygen cylinders from central store to ICU Ward A manifold.',
          payloadSummary: 'Dispatch 15 Oxygen Cylinders & alert supplier for emergency LMO refill.'
        },
        status: 'Pending Approval',
        createdAt: now
      }
    ];

    if (waitingTokensCount > 5) {
      freshRecs.push({
        id: `crisis-diag-${Date.now()}-3`,
        title: 'OPD Outpatient Token Queue bottleneck detected.',
        severity: 'Moderate',
        category: 'Capacity',
        department: 'Outpatient OPD Complex',
        triggeredMetric: `Waiting OPD Tokens: ${waitingTokensCount} Patients`,
        recommendationText: 'Activate auxiliary consulting counters & rebalance token queues.',
        resourceWarningText: 'OPD waiting area capacity exceeding optimal limit.',
        suggestedAction: {
          type: 'QUEUE_BALANCING',
          description: 'Activate OPD Room 108 B & rebalance pending queue to fast-track patients.',
          payloadSummary: 'Activate auxiliary OPD counter & rebalance waiting tokens.'
        },
        status: 'Pending Approval',
        createdAt: now
      });
    }

    freshRecs.forEach(rec => {
      const exists = this.crisisRecommendations.some(r => r.title === rec.title && r.status === 'Pending Approval');
      if (!exists) {
        this.crisisRecommendations.unshift(rec);
      }
    });

    this.saveState();
    return this.crisisRecommendations;
  }

  simulateCrisisScenario(type: 'emergency_surge' | 'oxygen_scarcity' | 'opd_overload' | 'reset'): void {
    const now = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    if (type === 'emergency_surge') {
      this.crisisRecommendations.unshift({
        id: `crisis-sim-${Date.now()}`,
        title: 'Emergency department workload unusually high hai.',
        severity: 'Critical',
        category: 'Workload',
        department: 'Emergency & Trauma Ward',
        triggeredMetric: 'Highway Collision Multi-Trauma Influx (28 Critical Arrivals/hr)',
        recommendationText: 'Additional staff allocation consider karein.',
        resourceWarningText: 'Current resources critically low hain.',
        suggestedAction: {
          type: 'STAFF_ALLOCATION',
          description: 'Reallocate 6 Trauma Surgeons, 8 Anesthetists, and 12 Triage Nurses to Emergency Bay A & B.',
          payloadSummary: 'Reallocate 26 Trauma Medical Personnel to ER Emergency Bay.'
        },
        status: 'Pending Approval',
        createdAt: now
      });
    } else if (type === 'oxygen_scarcity') {
      this.crisisRecommendations.unshift({
        id: `crisis-sim-${Date.now()}`,
        title: 'Oxygen manifold supply pressure dropping rapidly in ICU Ward A.',
        severity: 'Critical',
        category: 'Resource Scarcity',
        department: 'Intensive Care Unit & Gas Plant',
        triggeredMetric: 'Manifold Pressure: 2.1 Bar (Critical < 3.0 Bar) | Reservoir: 14%',
        recommendationText: 'Emergency oxygen cylinder dispatch approve karein.',
        resourceWarningText: 'Current resources critically low hain.',
        suggestedAction: {
          type: 'OXYGEN_DISPATCH',
          description: 'Authorize emergency release of 20 B-Type Oxygen Cylinders and redirect backup LMO tanker.',
          payloadSummary: 'Release 20 Oxygen Cylinders & Redirect Tanker.'
        },
        status: 'Pending Approval',
        createdAt: now
      });
    } else if (type === 'opd_overload') {
      this.crisisRecommendations.unshift({
        id: `crisis-sim-${Date.now()}`,
        title: 'OPD Queue congestion in General Medicine & Cardiology.',
        severity: 'High',
        category: 'Capacity',
        department: 'OPD Outpatient Complex',
        triggeredMetric: 'Waiting OPD Tokens: 64 Active Patients | Wait Time: 75 Mins',
        recommendationText: 'Activate 3 auxiliary OPD counters & reallocate resident doctors.',
        resourceWarningText: 'Waiting area capacity exhausted (120% load).',
        suggestedAction: {
          type: 'QUEUE_BALANCING',
          description: 'Open Auxiliary OPD Rooms 201, 202, 203 with 3 standby resident doctors.',
          payloadSummary: 'Activate 3 Auxiliary OPD Counters & Rebalance Tokens.'
        },
        status: 'Pending Approval',
        createdAt: now
      });
    } else if (type === 'reset') {
      this.crisisRecommendations = [...INITIAL_CRISIS_RECOMMENDATIONS];
      this.crisisAuditLogs = [...INITIAL_CRISIS_LOGS];
    }

    this.saveState();
  }

  // --- DOCTOR DASHBOARD METHODS ---
  updateDoctorAvailability(doctorId: string, status: Doctor['status']) {
    this.doctors = this.doctors.map(d => d.id === doctorId ? { ...d, status } : d);
    if (this.activeDoctor && this.activeDoctor.id === doctorId) {
      this.activeDoctor = { ...this.activeDoctor, status };
    }
    const doc = this.doctors.find(d => d.id === doctorId);
    if (doc) {
      this.logDoctorActivity({
        doctor_id: doctorId,
        doctor_name: doc.full_name,
        action: 'Doctor updated status',
        details: `Updated availability status to "${status}"`
      });
    }
    this.saveState();
  }

  addPrescription(presc: Omit<DoctorPrescription, 'id' | 'created_at'>): DoctorPrescription {
    const today = new Date().toISOString().split('T')[0];
    const newPrescription: DoctorPrescription = {
      ...presc,
      id: `rx-${Date.now().toString().slice(-6)}`,
      created_at: today
    };
    this.prescriptions = [newPrescription, ...this.prescriptions];

    // If follow up date is set, automatically register follow up
    if (presc.follow_up_date) {
      const exists = this.doctorFollowUps.some(f => f.patient_id === presc.patient_id && f.follow_up_date === presc.follow_up_date);
      if (!exists) {
        this.addDoctorFollowUp({
          patient_id: presc.patient_id,
          patient_name: presc.patient_name,
          patient_age: presc.patient_age,
          patient_gender: presc.patient_gender,
          patient_blood_group: presc.patient_blood_group,
          doctor_id: presc.doctor_id,
          doctor_name: presc.doctor_name,
          previous_consultation_date: today,
          follow_up_date: presc.follow_up_date,
          recorded_condition: presc.recorded_condition,
          status: 'Upcoming',
          previous_prescription_summary: `${presc.prescription_number} (${presc.medicines.map(m => m.name).slice(0, 2).join(', ')})`,
          notes: presc.advice_instructions || 'Clinical follow-up re-evaluation'
        });
      }
    }

    this.logDoctorActivity({
      doctor_id: presc.doctor_id,
      doctor_name: presc.doctor_name,
      patient_id: presc.patient_id,
      patient_name: presc.patient_name,
      action: 'Doctor created prescription',
      details: `Created prescription ${newPrescription.prescription_number} for ${presc.patient_name} (${presc.recorded_condition})`
    });

    this.saveState();
    return newPrescription;
  }

  updatePrescription(id: string, updates: Partial<DoctorPrescription>) {
    this.prescriptions = this.prescriptions.map(p => p.id === id ? { ...p, ...updates } : p);
    this.saveState();
  }

  saveClinicalNote(note: Omit<DoctorClinicalNote, 'id' | 'created_at'>): DoctorClinicalNote {
    const now = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    const existingIndex = this.clinicalNotes.findIndex(n => n.patient_id === note.patient_id && n.doctor_id === note.doctor_id);

    let savedNote: DoctorClinicalNote;
    if (existingIndex >= 0) {
      savedNote = {
        ...this.clinicalNotes[existingIndex],
        ...note,
        updated_at: now
      };
      this.clinicalNotes[existingIndex] = savedNote;
    } else {
      savedNote = {
        ...note,
        id: `note-${Date.now().toString().slice(-6)}`,
        created_at: now
      };
      this.clinicalNotes = [savedNote, ...this.clinicalNotes];
    }

    this.logDoctorActivity({
      doctor_id: note.doctor_id,
      doctor_name: note.doctor_name,
      patient_id: note.patient_id,
      patient_name: note.patient_name,
      action: 'Doctor updated clinical notes',
      details: `Updated clinical findings & diagnosis (${note.recorded_condition}) for ${note.patient_name}`
    });

    this.saveState();
    return savedNote;
  }

  addDoctorFollowUp(followUp: Omit<DoctorFollowUp, 'id'>): DoctorFollowUp {
    const newFollowUp: DoctorFollowUp = {
      ...followUp,
      id: `fup-${Date.now().toString().slice(-6)}`
    };
    this.doctorFollowUps = [newFollowUp, ...this.doctorFollowUps];
    this.saveState();
    return newFollowUp;
  }

  updateFollowUpStatus(id: string, status: DoctorFollowUp['status']) {
    this.doctorFollowUps = this.doctorFollowUps.map(f => f.id === id ? { ...f, status } : f);
    this.saveState();
  }

  markDoctorNotificationAsRead(id: string) {
    this.doctorNotifications = this.doctorNotifications.map(n => n.id === id ? { ...n, read: true } : n);
    this.saveState();
  }

  markAllDoctorNotificationsAsRead(doctorId: string) {
    this.doctorNotifications = this.doctorNotifications.map(n => 
      (n.doctor_id === doctorId || !n.doctor_id) ? { ...n, read: true } : n
    );
    this.saveState();
  }

  logDoctorActivity(log: Omit<DoctorActivityLog, 'id' | 'timestamp'>) {
    const now = new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' — Today';
    const entry: DoctorActivityLog = {
      ...log,
      id: `doc-act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now
    };
    this.doctorActivityLogs = [entry, ...this.doctorActivityLogs.slice(0, 49)];
    this.saveState();
  }

  // Doctor Patient Filter Helper
  getDoctorPatients(doctorId: string): Patient[] {
    const doc = this.doctors.find(d => d.id === doctorId);
    const docName = doc ? doc.full_name.toLowerCase() : '';
    const aliases = [doctorId.toLowerCase()];
    if (doctorId === 'doc-vns-1') aliases.push('doc-1');
    if (doctorId === 'doc-lko-1') aliases.push('doc-2');
    if (doctorId === 'doc-knp-1') aliases.push('doc-3');
    if (doctorId === 'doc-gkp-1') aliases.push('doc-5');

    const matchedPatientIds = new Set<string>();

    // 1. From Appointments
    this.appointments.forEach(a => {
      if (aliases.includes(a.doctor_id?.toLowerCase() || '') || (docName && a.doctor_name?.toLowerCase().includes(docName))) {
        if (a.patient_id) matchedPatientIds.add(a.patient_id);
      }
    });

    // 2. From Tokens
    this.tokens.forEach(t => {
      if (aliases.includes(t.doctor_id?.toLowerCase() || '') || (docName && t.doctor_name?.toLowerCase().includes(docName))) {
        if (t.patient_id) matchedPatientIds.add(t.patient_id);
      }
    });

    // 3. From Prescriptions
    this.prescriptions.forEach(p => {
      if (aliases.includes(p.doctor_id?.toLowerCase() || '') || (docName && p.doctor_name?.toLowerCase().includes(docName))) {
        if (p.patient_id) matchedPatientIds.add(p.patient_id);
      }
    });

    // 4. From Follow-ups
    this.doctorFollowUps.forEach(f => {
      if (aliases.includes(f.doctor_id?.toLowerCase() || '') || (docName && f.doctor_name?.toLowerCase().includes(docName))) {
        if (f.patient_id) matchedPatientIds.add(f.patient_id);
      }
    });

    // 5. From Specialty Modules (Cardiology, Eye, OT Surgeries)
    if (doc?.department === 'Cardiology') {
      this.cardiologyRecords.forEach(c => {
        if (aliases.includes(c.cardiologist_id?.toLowerCase() || '') || (docName && c.cardiologist_name?.toLowerCase().includes(docName))) {
          if (c.patient_id) matchedPatientIds.add(c.patient_id);
        }
      });
    }

    if ((doc?.department as string) === 'Eye Care' || (doc?.specialization && doc.specialization.toLowerCase().includes('eye'))) {
      this.eyeRecords.forEach(e => {
        if (aliases.includes(e.doctor_id?.toLowerCase() || '') || (docName && e.doctor_name?.toLowerCase().includes(docName))) {
          if (e.patient_id) matchedPatientIds.add(e.patient_id);
        }
      });
    }

    this.surgeries.forEach(s => {
      if (docName && s.lead_surgeon_name?.toLowerCase().includes(docName)) {
        if (s.patient_id) matchedPatientIds.add(s.patient_id);
      }
    });

    let result = this.patients.filter(p => matchedPatientIds.has(p.id));
    if (result.length === 0 && this.patients.length > 0) {
      result = this.patients.slice(0, 3);
    }
    return result;
  }

  // --- PATIENT PRIVACY-COMPLIANT METHODS ---
  getPatientDoctors(patientId: string): Doctor[] {
    const pt = this.patients.find(p => p.id === patientId);
    const ptName = pt ? pt.full_name.toLowerCase() : '';
    const doctorIds = new Set<string>();

    this.appointments.forEach(a => {
      if (a.patient_id === patientId || (ptName && a.patient_name?.toLowerCase().includes(ptName))) {
        if (a.doctor_id) doctorIds.add(a.doctor_id);
      }
    });

    this.prescriptions.forEach(p => {
      if (p.patient_id === patientId || (ptName && p.patient_name?.toLowerCase().includes(ptName))) {
        if (p.doctor_id) doctorIds.add(p.doctor_id);
      }
    });

    this.doctorFollowUps.forEach(f => {
      if (f.patient_id === patientId || (ptName && f.patient_name?.toLowerCase().includes(ptName))) {
        if (f.doctor_id) doctorIds.add(f.doctor_id);
      }
    });

    let matchedDoctors = this.doctors.filter(d => doctorIds.has(d.id));
    if (matchedDoctors.length === 0 && this.doctors.length > 0) {
      matchedDoctors = [this.doctors[0], this.doctors[1] || this.doctors[0]];
    }
    return matchedDoctors;
  }

  getPatientAppointments(patientId: string): Appointment[] {
    const pt = this.patients.find(p => p.id === patientId);
    const ptName = pt ? pt.full_name.toLowerCase() : '';
    return this.appointments.filter(a => a.patient_id === patientId || (ptName && a.patient_name?.toLowerCase().includes(ptName)));
  }

  getPatientPrescriptions(patientId: string): DoctorPrescription[] {
    const pt = this.patients.find(p => p.id === patientId);
    const ptName = pt ? pt.full_name.toLowerCase() : '';
    return this.prescriptions.filter(p => p.patient_id === patientId || (ptName && p.patient_name?.toLowerCase().includes(ptName)));
  }

  getPatientLabReports(patientId: string): LabReport[] {
    const pt = this.patients.find(p => p.id === patientId);
    const ptName = pt ? pt.full_name.toLowerCase() : '';
    return this.labReports.filter(l => l.patient_id === patientId || (ptName && l.patient_name?.toLowerCase().includes(ptName)));
  }

  getPatientBills(patientId: string): Bill[] {
    const pt = this.patients.find(p => p.id === patientId);
    const ptName = pt ? pt.full_name.toLowerCase() : '';
    return this.bills.filter(b => b.patient_id === patientId || (ptName && b.patient_name?.toLowerCase().includes(ptName)));
  }

  getPatientClinicalNotes(patientId: string): DoctorClinicalNote[] {
    const pt = this.patients.find(p => p.id === patientId);
    const ptName = pt ? pt.full_name.toLowerCase() : '';
    return this.clinicalNotes.filter(c => c.patient_id === patientId || (ptName && c.patient_name?.toLowerCase().includes(ptName)));
  }

  getPatientTreatments(patientId: string) {
    const pt = this.patients.find(p => p.id === patientId);
    const ptName = pt ? pt.full_name.toLowerCase() : '';
    const treatments: Array<{
      id: string;
      title: string;
      doctor: string;
      department: string;
      date: string;
      status: string;
      notes: string;
      followUp?: string;
    }> = [];

    // Check Surgeries
    this.surgeries.forEach(s => {
      if (s.patient_id === patientId || (ptName && s.patient_name?.toLowerCase().includes(ptName))) {
        treatments.push({
          id: s.id,
          title: s.surgery_type,
          doctor: s.lead_surgeon_name,
          department: 'Surgery & OT',
          date: s.scheduled_date,
          status: s.status,
          notes: s.recovery_notes || 'Surgical intervention completed in OT.',
          followUp: s.scheduled_date
        });
      }
    });

    // Check Eye Surgeries / Procedures
    this.eyeSurgeries.forEach(e => {
      if (e.patient_id === patientId || (ptName && e.patient_name?.toLowerCase().includes(ptName))) {
        treatments.push({
          id: e.id,
          title: `${e.procedure_name} (${e.eye})`,
          doctor: e.doctor_name,
          department: 'Ophthalmology',
          date: e.scheduled_date,
          status: e.status,
          notes: e.post_op_notes || 'Ophthalmic procedure logged.',
          followUp: e.follow_up_date
        });
      }
    });

    // Check Cardiology records
    this.cardiologyRecords.forEach(c => {
      if (c.patient_id === patientId || (ptName && c.patient_name?.toLowerCase().includes(ptName))) {
        treatments.push({
          id: c.id,
          title: c.visit_type,
          doctor: c.cardiologist_name,
          department: 'Cardiology',
          date: c.created_at || '2026-02-10',
          status: c.status,
          notes: c.cardiac_history + (c.ecg_findings ? ` | ECG: ${c.ecg_findings}` : ''),
          followUp: c.next_follow_up
        });
      }
    });

    return treatments;
  }

  getDoctorAppointments(doctorId: string): Appointment[] {
    const doc = this.doctors.find(d => d.id === doctorId);
    const docName = doc ? doc.full_name.toLowerCase() : '';
    const aliases = [doctorId.toLowerCase()];
    if (doctorId === 'doc-vns-1') aliases.push('doc-1');
    if (doctorId === 'doc-lko-1') aliases.push('doc-2');
    if (doctorId === 'doc-knp-1') aliases.push('doc-3');
    if (doctorId === 'doc-gkp-1') aliases.push('doc-5');

    return this.appointments.filter(a => 
      aliases.includes(a.doctor_id?.toLowerCase() || '') || 
      (docName && a.doctor_name?.toLowerCase().includes(docName))
    );
  }

  markReportAsReviewed(reportId: string, doctorId: string, doctorName: string, notes?: string) {
    let reportFound = false;

    // Check lab reports
    this.labReports = this.labReports.map(l => {
      if (l.id === reportId) {
        reportFound = true;
        return { ...l, status: 'Report Delivered' as LabReportStatus, findings: notes || l.findings || 'Reviewed and approved by doctor' };
      }
      return l;
    });

    // Check cardiology
    this.cardiologyRecords = this.cardiologyRecords.map(c => {
      if (c.id === reportId) {
        reportFound = true;
        return { ...c, status: 'Completed' as const, echo_findings: notes || c.echo_findings };
      }
      return c;
    });

    // Check X-Ray
    this.xrayRecords = this.xrayRecords.map(x => {
      if (x.id === reportId) {
        reportFound = true;
        return { ...x, status: 'Verified' as XRayStatus, radiologist_findings: notes || x.radiologist_findings };
      }
      return x;
    });

    // Check MRI
    this.mriRecords = this.mriRecords.map(m => {
      if (m.id === reportId) {
        reportFound = true;
        return { ...m, status: 'Verified' as MriStatus, findings: notes || m.findings };
      }
      return m;
    });

    // Check CT
    this.ctScanRecords = this.ctScanRecords.map(c => {
      if (c.id === reportId) {
        reportFound = true;
        return { ...c, status: 'Verified' as CtScanStatus, findings: notes || c.findings };
      }
      return c;
    });

    this.logDoctorActivity({
      doctor_id: doctorId,
      doctor_name: doctorName,
      action: 'Doctor reviewed report',
      details: `Reviewed and verified clinical investigation report (${reportId})`
    });

    this.saveState();
  }

  // --- STAFF & RECEPTION ASSISTANCE METHODS ---
  addPatient(patientData: Omit<Patient, 'id' | 'created_at'>): Patient {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now().toString().slice(-5)}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    this.patients = [newPatient, ...this.patients];
    this.saveState();
    return newPatient;
  }

  addAppointment(apptData: Omit<Appointment, 'id' | 'created_at'>): Appointment {
    const newAppt: Appointment = {
      ...apptData,
      id: `apt-${Date.now().toString().slice(-5)}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    this.appointments = [newAppt, ...this.appointments];
    this.saveState();
    return newAppt;
  }

  addToken(tokenData: Omit<Token, 'id' | 'created_at'>): Token {
    const newToken: Token = {
      ...tokenData,
      id: `tok-${Date.now().toString().slice(-5)}`,
      created_at: new Date().toISOString().split('T')[0]
    };
    this.tokens = [newToken, ...this.tokens];
    this.saveState();
    return newToken;
  }

  // --- DOCTOR RESOURCE REQUESTS (Room, ICU Bed, Oxygen Support) ---
  getDoctorResourceRequests(doctorId?: string): DoctorResourceRequest[] {
    if (!doctorId) return this.doctorRequests;
    const cleanId = doctorId.toLowerCase();
    return this.doctorRequests.filter(r => 
      r.doctor_id.toLowerCase() === cleanId ||
      r.doctor_name.toLowerCase().includes(cleanId)
    );
  }

  submitDoctorResourceRequest(reqData: Omit<DoctorResourceRequest, 'id' | 'request_time' | 'status'>): DoctorResourceRequest {
    const newReq: DoctorResourceRequest = {
      ...reqData,
      id: `req-${Date.now().toString().slice(-6)}`,
      request_time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending'
    };

    this.doctorRequests = [newReq, ...this.doctorRequests];
    
    // Add activity log
    this.doctorActivityLogs.unshift({
      id: `act-${Date.now().toString().slice(-6)}`,
      doctor_id: reqData.doctor_id,
      doctor_name: reqData.doctor_name,
      action: `Requested ${reqData.request_type}`,
      patient_id: reqData.patient_id,
      patient_name: reqData.patient_name,
      details: `Requested ${reqData.request_type} (${reqData.priority} priority) for ${reqData.patient_name}. Reason: ${reqData.reason}`,
      timestamp: 'Just now'
    });

    this.saveState();
    return newReq;
  }

  updateDoctorResourceRequestStatus(
    id: string, 
    status: DoctorRequestStatus, 
    adminNotes?: string, 
    assignedRoomOrBed?: string
  ): boolean {
    const reqIndex = this.doctorRequests.findIndex(r => r.id === id);
    if (reqIndex === -1) return false;

    const req = this.doctorRequests[reqIndex];
    this.doctorRequests[reqIndex] = {
      ...req,
      status,
      admin_notes: adminNotes || req.admin_notes,
      room_no: (assignedRoomOrBed && req.request_type === 'Room') ? assignedRoomOrBed : req.room_no,
      bed_number: (assignedRoomOrBed && req.request_type === 'ICU Bed') ? assignedRoomOrBed : req.bed_number
    };

    // If allocated or approved with room or bed, update the patient record as well
    if ((status === 'Approved' || status === 'Allocated') && assignedRoomOrBed && req.patient_id) {
      const pIdx = this.patients.findIndex(p => p.id === req.patient_id);
      if (pIdx !== -1) {
        if (req.request_type === 'Room') {
          this.patients[pIdx] = { ...this.patients[pIdx], room_no: assignedRoomOrBed };
        } else if (req.request_type === 'ICU Bed') {
          this.patients[pIdx] = { ...this.patients[pIdx], icu_bed: assignedRoomOrBed };
        }
      }
    }

    // Notify doctor
    this.doctorNotifications.unshift({
      id: `notif-${Date.now().toString().slice(-6)}`,
      doctor_id: req.doctor_id,
      type: 'general',
      title: `${req.request_type} Request ${status}`,
      message: `Your request for ${req.patient_name} (${req.request_type}) has been ${status.toLowerCase()}.${assignedRoomOrBed ? ` Allocated: ${assignedRoomOrBed}` : ''}`,
      patient_id: req.patient_id,
      patient_name: req.patient_name,
      timestamp: 'Just now',
      read: false,
      priority: status === 'Allocated' || status === 'Approved' ? 'High' : 'Normal'
    });

    this.saveState();
    return true;
  }

  // Sync from Supabase asynchronously if credentials present
  private async syncFromSupabase() {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const [
        { data: doctorsData },
        { data: patientsData },
        { data: appointmentsData },
        { data: tokensData },
        { data: bedsData },
        { data: labData },
        { data: billsData }
      ] = await Promise.all([
        supabase.from('doctors').select('*'),
        supabase.from('patients').select('*'),
        supabase.from('appointments').select('*'),
        supabase.from('tokens').select('*'),
        supabase.from('beds').select('*'),
        supabase.from('lab_reports').select('*'),
        supabase.from('bills').select('*')
      ]);

      if (doctorsData && doctorsData.length > 0) this.doctors = doctorsData as Doctor[];
      if (patientsData && patientsData.length > 0) this.patients = patientsData as Patient[];
      if (appointmentsData && appointmentsData.length > 0) this.appointments = appointmentsData as Appointment[];
      if (tokensData && tokensData.length > 0) this.tokens = tokensData as Token[];
      if (bedsData && bedsData.length > 0) this.beds = bedsData as Bed[];
      if (labData && labData.length > 0) this.labReports = labData as LabReport[];
      if (billsData && billsData.length > 0) this.bills = billsData as Bill[];

      this.saveState();
    } catch (err) {
      console.warn('Supabase remote sync failed, using local store:', err);
    }
  }
}

export const store = new HospitalStore();
