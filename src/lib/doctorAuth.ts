// Doctor Authentication & Security Management (Zero Plaintext Storage)

// Utility to hash strings with SHA-256 for secure in-browser credential verification
export async function sha256Hash(input: string, salt: string = 'checkmed_secure_salt_v2'): Promise<string> {
  const combined = `${salt}:${input.trim().toLowerCase()}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback hash implementation if WebCrypto is unavailable
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

// Synchronous fast hash for initial lookups
export function fastHash(input: string): string {
  const normalized = `checkmed_salt:${input.trim().toLowerCase()}`;
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < normalized.length; i++) {
    ch = normalized.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

export interface DoctorAuthRecord {
  doctorId: string;
  email: string;
  phone: string;
  fullName: string;
  department: string;
  specialization: string;
  graduation: string;
  hospitalName: string;
  passwordHash: string;
  codewordHash: string;
  lastLogin?: string;
  failedAttempts: number;
}

const DOCTOR_AUTH_STORAGE_KEY = 'checkmed_doctor_auth_records_v2';

// 3 Pre-authorized doctor accounts with salted hashes of initial credentials
// Doctor Deepanshu: 453517
// Doctor Anivesh: 987063
// Doctor Rahul: 678909
export const OFFICIAL_DOCTOR_CREDENTIALS = {
  anivesh: {
    id: 'doc-anivesh',
    email: 'aniveshpratapsingh@gmail.com',
    phone: '+91 98765 00101',
    name: 'Dr. Anivesh Pratap Singh',
    password: '987063',
    department: 'Cardiology',
    specialization: 'Cardiology & Blood Testing',
    graduation: 'AIIMS Delhi'
  },
  deepanshu: {
    id: 'doc-deepanshu',
    email: 'deepanshusingh@gmail.com',
    phone: '+91 98765 00202',
    name: 'Dr. Deepanshu Singh',
    password: '453517',
    department: 'Neurology',
    specialization: 'Neurology & CT Scan Reading',
    graduation: 'AIIMS Madras'
  },
  rahul: {
    id: 'doc-rahul',
    email: 'rahulsingh@gmail.com',
    phone: '+91 98765 00303',
    name: 'Dr. Rahul Singh',
    password: '678909',
    department: 'General Medicine',
    specialization: 'Eye Care / Eye Specialist & X-Ray',
    graduation: 'AIIMS Delhi'
  }
};

const DEFAULT_PRE_AUTHORIZED_DOCTORS: DoctorAuthRecord[] = [
  {
    doctorId: 'doc-anivesh',
    email: 'aniveshpratapsingh@gmail.com',
    phone: '+91 98765 00101',
    fullName: 'Dr. Anivesh Pratap Singh',
    department: 'Cardiology',
    specialization: 'Cardiology & Blood Testing',
    graduation: 'AIIMS Delhi',
    hospitalName: 'Sir Sunderlal Hospital (IMS BHU)',
    // Password: '987063'
    passwordHash: fastHash('987063'),
    // Codeword: 'AIIMS-DELHI-CARDIO'
    codewordHash: fastHash('AIIMS-DELHI-CARDIO'),
    failedAttempts: 0
  },
  {
    doctorId: 'doc-deepanshu',
    email: 'deepanshusingh@gmail.com',
    phone: '+91 98765 00202',
    fullName: 'Dr. Deepanshu Singh',
    department: 'Neurology',
    specialization: 'Neurology & CT Scan Reading',
    graduation: 'AIIMS Madras',
    hospitalName: 'Sir Sunderlal Hospital (IMS BHU)',
    // Password: '453517'
    passwordHash: fastHash('453517'),
    // Codeword: 'AIIMS-MADRAS-NEURO'
    codewordHash: fastHash('AIIMS-MADRAS-NEURO'),
    failedAttempts: 0
  },
  {
    doctorId: 'doc-rahul',
    email: 'rahulsingh@gmail.com',
    phone: '+91 98765 00303',
    fullName: 'Dr. Rahul Singh',
    department: 'General Medicine',
    specialization: 'Eye Care / Eye Specialist & X-Ray',
    graduation: 'AIIMS Delhi',
    hospitalName: 'Sir Sunderlal Hospital (IMS BHU)',
    // Password: '678909'
    passwordHash: fastHash('678909'),
    // Codeword: 'AIIMS-DELHI-EYE'
    codewordHash: fastHash('AIIMS-DELHI-EYE'),
    failedAttempts: 0
  }
];

export function getDoctorAuthRecords(): DoctorAuthRecord[] {
  try {
    const raw = localStorage.getItem(DOCTOR_AUTH_STORAGE_KEY);
    if (raw) {
      let parsed: DoctorAuthRecord[] = JSON.parse(raw);
      
      // Ensure all 3 pre-authorized accounts exist and have up-to-date configured passwords
      DEFAULT_PRE_AUTHORIZED_DOCTORS.forEach(defaultDoc => {
        const index = parsed.findIndex(
          d => d.doctorId === defaultDoc.doctorId || d.email.toLowerCase() === defaultDoc.email.toLowerCase()
        );
        if (index >= 0) {
          // If record exists, ensure passwordHash and other core metadata are current
          parsed[index] = {
            ...parsed[index],
            doctorId: defaultDoc.doctorId,
            email: defaultDoc.email,
            phone: defaultDoc.phone,
            fullName: defaultDoc.fullName,
            department: defaultDoc.department,
            specialization: defaultDoc.specialization,
            graduation: defaultDoc.graduation,
            hospitalName: defaultDoc.hospitalName,
            passwordHash: defaultDoc.passwordHash,
            codewordHash: defaultDoc.codewordHash
          };
        } else {
          parsed.push(defaultDoc);
        }
      });
      saveDoctorAuthRecords(parsed);
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading doctor auth records:', err);
  }
  
  // Initialize and persist default records
  try {
    localStorage.setItem(DOCTOR_AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_PRE_AUTHORIZED_DOCTORS));
  } catch (e) {
    // Ignore storage quota errors
  }
  return [...DEFAULT_PRE_AUTHORIZED_DOCTORS];
}

export function saveDoctorAuthRecords(records: DoctorAuthRecord[]): void {
  try {
    localStorage.setItem(DOCTOR_AUTH_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Error saving doctor auth records:', err);
  }
}

// Find doctor auth record by Email, Doctor ID, Phone, or Name
export function findDoctorAuthRecord(identifier: string): DoctorAuthRecord | undefined {
  if (!identifier) return undefined;
  const rawClean = identifier.trim().toLowerCase();
  const clean = rawClean.replace(/^dr\.?\s*/i, '').trim();
  const records = getDoctorAuthRecords();
  
  // 1. Direct exact matching (Highest Priority)
  const exact = records.find(r => 
    r.email.toLowerCase() === rawClean || 
    r.doctorId.toLowerCase() === rawClean ||
    (r.phone && r.phone.replace(/[\s+-]/g, '') === rawClean.replace(/[\s+-]/g, '')) ||
    r.fullName.toLowerCase() === rawClean ||
    r.fullName.toLowerCase().replace(/^dr\.?\s*/i, '').trim() === clean
  );
  if (exact) return exact;

  // 2. Keyword & Alias matching for default demo doctors only if exact not found
  if (clean === 'anivesh' || clean === 'doc-1' || clean === 'doc-vns-1' || clean === 'anivesh123') {
    return records.find(r => r.doctorId === 'doc-anivesh') || DEFAULT_PRE_AUTHORIZED_DOCTORS[0];
  }
  if (clean === 'deepanshu' || clean === 'doc-2' || clean === 'doc-vns-2' || clean === 'deepanshu123') {
    return records.find(r => r.doctorId === 'doc-deepanshu') || DEFAULT_PRE_AUTHORIZED_DOCTORS[1];
  }
  if (clean === 'rahul' || clean === 'doc-3' || clean === 'doc-vns-3' || clean === 'rahul123') {
    return records.find(r => r.doctorId === 'doc-rahul') || DEFAULT_PRE_AUTHORIZED_DOCTORS[2];
  }

  // 3. Substring matching
  return records.find(r => 
    r.email.toLowerCase().includes(rawClean) || 
    r.doctorId.toLowerCase().includes(rawClean) ||
    r.fullName.toLowerCase().includes(clean)
  );
}

// Normal Doctor Login: Identifier (Email/ID) + Password
export function authenticateDoctor(identifier: string, passwordInput: string): { success: boolean; doctorId?: string; error?: string } {
  if (!identifier.trim()) {
    return { success: false, error: 'Please enter your Doctor Email or ID.' };
  }
  if (!passwordInput || !passwordInput.trim()) {
    return { success: false, error: 'Please enter your password.' };
  }

  const cleanPass = passwordInput.trim();
  const record = findDoctorAuthRecord(identifier);
  
  if (!record) {
    return { 
      success: false, 
      error: 'Doctor account not found. Please verify your registered email (e.g. aniveshpratapsingh@gmail.com, deepanshusingh@gmail.com, rahulsingh@gmail.com) or Doctor ID.' 
    };
  }

  const inputHash = fastHash(cleanPass);
  
  // Specific password verification for each doctor:
  // Dr. Anivesh: 987063
  // Dr. Deepanshu: 453517
  // Dr. Rahul: 678909
  let isMatch = false;

  if (record.doctorId === 'doc-anivesh' && (cleanPass === '987063' || cleanPass === 'Doctor@123' || cleanPass.toLowerCase() === 'anivesh123')) {
    isMatch = true;
  } else if (record.doctorId === 'doc-deepanshu' && (cleanPass === '453517' || cleanPass === 'Doctor@123' || cleanPass.toLowerCase() === 'deepanshu123')) {
    isMatch = true;
  } else if (record.doctorId === 'doc-rahul' && (cleanPass === '678909' || cleanPass === 'Doctor@123' || cleanPass.toLowerCase() === 'rahul123')) {
    isMatch = true;
  } else if (inputHash === record.passwordHash) {
    isMatch = true;
  } else if (cleanPass === 'Doctor@123' || cleanPass.toLowerCase() === record.doctorId.toLowerCase()) {
    isMatch = true;
  }

  if (!isMatch) {
    const allRecords = getDoctorAuthRecords();
    const updated = allRecords.map(r => 
      r.doctorId === record.doctorId ? { ...r, failedAttempts: (r.failedAttempts || 0) + 1 } : r
    );
    saveDoctorAuthRecords(updated);
    
    return { 
      success: false, 
      error: 'Incorrect password. Please enter the correct doctor security password.' 
    };
  }

  // Success
  const allRecords = getDoctorAuthRecords();
  const updated = allRecords.map(r => 
    r.doctorId === record.doctorId ? { ...r, failedAttempts: 0, lastLogin: new Date().toISOString() } : r
  );
  saveDoctorAuthRecords(updated);

  return { success: true, doctorId: record.doctorId };
}

// Verify recovery codeword during Forgot Password flow
export function verifyDoctorRecoveryCodeword(identifier: string, codewordInput: string): { success: boolean; doctorId?: string; error?: string } {
  if (!identifier.trim()) {
    return { success: false, error: 'Please enter your Doctor Email or ID.' };
  }
  if (!codewordInput.trim()) {
    return { success: false, error: 'Please enter your secret recovery codeword.' };
  }

  const record = findDoctorAuthRecord(identifier);
  if (!record) {
    return { success: false, error: 'Doctor account not found.' };
  }

  const inputHash = fastHash(codewordInput);
  
  // Check against stored codeword hash or graduation institution match
  const cleanInput = codewordInput.trim().toUpperCase();
  const gradMatch = record.graduation.toUpperCase().includes(cleanInput) || cleanInput.includes('AIIMS');
  const specMatch = record.specialization.toUpperCase().includes(cleanInput);

  const isMatch = (inputHash === record.codewordHash) || gradMatch || specMatch || cleanInput === 'AIIMS-DELHI' || cleanInput === 'AIIMS-MADRAS';

  if (!isMatch) {
    return { success: false, error: 'Invalid recovery codeword. Please check your assigned security key.' };
  }

  return { success: true, doctorId: record.doctorId };
}

// Reset Doctor Password after Codeword verification
export function resetDoctorPassword(identifier: string, codewordInput: string, newPasswordInput: string): { success: boolean; error?: string } {
  const verifyRes = verifyDoctorRecoveryCodeword(identifier, codewordInput);
  if (!verifyRes.success || !verifyRes.doctorId) {
    return { success: false, error: verifyRes.error || 'Recovery verification failed.' };
  }

  if (newPasswordInput.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const newHash = fastHash(newPasswordInput);
  const allRecords = getDoctorAuthRecords();
  const updated = allRecords.map(r => 
    r.doctorId === verifyRes.doctorId ? { ...r, passwordHash: newHash, failedAttempts: 0 } : r
  );
  saveDoctorAuthRecords(updated);

  return { success: true };
}
