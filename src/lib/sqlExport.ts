export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- CHECKMED HOSPITAL MANAGEMENT SYSTEM — PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Run this script in your Supabase SQL Editor to provision tables, triggers, and
-- strict Row Level Security (RLS) policies enforcing 4 distinct roles:
-- 1. PATIENT  2. DOCTOR  3. ADMIN  4. STAFF

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & ROLE MAPPING TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin', 'staff')),
  staff_role TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. PATIENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  medical_history TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. DOCTORS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience_yrs INT NOT NULL DEFAULT 5,
  consultation_fee NUMERIC NOT NULL DEFAULT 500,
  room_no TEXT NOT NULL,
  status TEXT DEFAULT 'Available',
  avatar_url TEXT,
  shift_hours TEXT NOT NULL DEFAULT '09:00 AM - 05:00 PM',
  rating NUMERIC DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. STAFF MEMBERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  staff_id_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  shift TEXT NOT NULL DEFAULT 'Day Shift (08:00 AM - 04:00 PM)',
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. APPOINTMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  department TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'Upcoming',
  token_number TEXT NOT NULL,
  consultation_type TEXT DEFAULT 'In-Person',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. TOKENS TABLE (LIVE OPD QUEUE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  department TEXT NOT NULL,
  token_number TEXT NOT NULL,
  queue_position INT NOT NULL,
  status TEXT DEFAULT 'Waiting',
  estimated_time_mins INT DEFAULT 15,
  room_no TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. PRESCRIPTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  prescription_number TEXT NOT NULL UNIQUE,
  patient_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  patient_age INT NOT NULL,
  patient_gender TEXT NOT NULL,
  patient_blood_group TEXT NOT NULL,
  recorded_condition TEXT NOT NULL,
  medicines JSONB NOT NULL DEFAULT '[]'::jsonb,
  advice_instructions TEXT,
  follow_up_date DATE,
  status TEXT DEFAULT 'Active',
  created_at DATE DEFAULT CURRENT_DATE
);

-- ------------------------------------------------------------------------------
-- 8. CLINICAL NOTES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  chief_complaint TEXT NOT NULL,
  clinical_diagnosis TEXT NOT NULL,
  examination_notes TEXT,
  recorded_condition TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. LAB & DIAGNOSTIC REPORTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lab_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  test_name TEXT NOT NULL,
  test_category TEXT NOT NULL,
  test_date DATE NOT NULL,
  status TEXT DEFAULT 'Sample Pending',
  parameters JSONB DEFAULT '[]'::jsonb,
  result_summary TEXT,
  normal_range TEXT,
  findings TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. BILLS & INVOICES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  tax NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  net_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'Unpaid',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. HOSPITAL BEDS & ICU TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_name TEXT NOT NULL,
  bed_number TEXT NOT NULL UNIQUE,
  bed_type TEXT NOT NULL,
  status TEXT DEFAULT 'Available',
  price_per_day NUMERIC NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  patient_name TEXT,
  assigned_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) ENFORCEMENT
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_doctor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'doctor');
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'staff');
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins full profile control" ON public.profiles
  FOR ALL USING (public.is_admin());

-- 2. Patients Data Isolation Policies (Patient A cannot see Patient B)
CREATE POLICY "Patients can view own records" ON public.patients
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin() OR public.is_doctor() OR public.is_staff());

CREATE POLICY "Patients can create own profile" ON public.patients
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin() OR public.is_staff());

CREATE POLICY "Patients can update own profile" ON public.patients
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin() OR public.is_staff());

-- 3. Appointments Policies
CREATE POLICY "Patients view own appointments" ON public.appointments
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()) OR
    public.is_admin() OR public.is_staff()
  );

CREATE POLICY "Create appointments" ON public.appointments
  FOR INSERT WITH CHECK (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    public.is_admin() OR public.is_staff()
  );

CREATE POLICY "Update appointments" ON public.appointments
  FOR UPDATE USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()) OR
    public.is_admin() OR public.is_staff()
  );

-- 4. Prescriptions Policies (Doctor writes, Patient reads own, Patient cannot edit)
CREATE POLICY "Patients view own prescriptions" ON public.prescriptions
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()) OR
    public.is_admin() OR public.is_staff()
  );

CREATE POLICY "Doctors write prescriptions" ON public.prescriptions
  FOR INSERT WITH CHECK (public.is_doctor() OR public.is_admin());

CREATE POLICY "Doctors update own prescriptions" ON public.prescriptions
  FOR UPDATE USING (public.is_doctor() OR public.is_admin());

-- 5. Clinical Notes Policies (Doctor writes & views, Patient views authorized)
CREATE POLICY "Clinical notes view policy" ON public.clinical_notes
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "Doctors write clinical notes" ON public.clinical_notes
  FOR INSERT WITH CHECK (public.is_doctor() OR public.is_admin());

CREATE POLICY "Doctors update clinical notes" ON public.clinical_notes
  FOR UPDATE USING (public.is_doctor() OR public.is_admin());

-- 6. Lab Reports Policies (Patient reads own, Staff & Doctor edit)
CREATE POLICY "Patients view own lab reports" ON public.lab_reports
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    public.is_doctor() OR public.is_admin() OR public.is_staff()
  );

CREATE POLICY "Staff create lab reports" ON public.lab_reports
  FOR INSERT WITH CHECK (public.is_staff() OR public.is_admin() OR public.is_doctor());

CREATE POLICY "Staff and Doctors update lab reports" ON public.lab_reports
  FOR UPDATE USING (public.is_staff() OR public.is_doctor() OR public.is_admin());

-- 7. Bills Policies (Patient reads own, Staff & Admin manage)
CREATE POLICY "Patients view own bills" ON public.bills
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    public.is_admin() OR public.is_staff()
  );

CREATE POLICY "Staff and Admins manage bills" ON public.bills
  FOR ALL USING (public.is_admin() OR public.is_staff());

-- 8. Public Read for Doctors, Beds and Queue (Transparency for OPD)
CREATE POLICY "Public Read Doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Public Read Beds" ON public.beds FOR SELECT USING (true);
CREATE POLICY "Public Read Tokens" ON public.tokens FOR SELECT USING (true);
CREATE POLICY "Staff Manage Beds and Tokens" ON public.beds FOR ALL USING (public.is_admin() OR public.is_staff());
CREATE POLICY "Staff Manage Tokens" ON public.tokens FOR ALL USING (public.is_admin() OR public.is_staff());
`;
