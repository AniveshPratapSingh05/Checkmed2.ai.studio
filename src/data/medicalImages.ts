// Centralized Medical Department & Service Images for Hospital Management System

export interface MedicalDepartmentVisual {
  id: string;
  name: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  badge: string;
  stats: { label: string; value: string }[];
  equipmentList: string[];
  departmentLead?: string;
  contactEmergency?: string;
}

export const MEDICAL_DEPARTMENT_IMAGES: Record<string, MedicalDepartmentVisual> = {
  cardiology: {
    id: 'cardiology',
    name: 'Cardiology',
    category: 'Heart & Vascular Care',
    title: 'Advanced Interventional Cardiology & Cath Lab',
    description: 'Comprehensive 24/7 cardiac monitoring, 2D echocardiography, coronary angiography, electrophysiology, and intensive cardiac care unit (CICU).',
    imageUrl: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    badge: '24/7 Primary Angioplasty & Cath Lab',
    stats: [
      { label: 'Echocardiograms', value: '42+ Today' },
      { label: 'Cath Lab Status', value: 'Active / Sterile' },
      { label: 'Troponin-I TAT', value: '18 Mins' },
      { label: 'Cardiac ICU Beds', value: '12 Occupied / 4 Free' }
    ],
    equipmentList: [
      'GE Innova Digital Cath Lab',
      'Philips EPIQ 7C 2D/3D Echo System',
      'Schiller Cardiovit 12-Lead ECG',
      'Biphasic Defibrillator & Pacing Manifold'
    ],
    departmentLead: 'Dr. Anivesh Pratap Singh (MD, AIIMS Delhi)',
    contactEmergency: 'Ext: 2101 / +91 542 2307510'
  },

  xray: {
    id: 'xray',
    name: 'Digital X-Ray & Fluoroscopy',
    category: 'Diagnostic Radiology',
    title: 'High-Frequency Digital Radiography (DR) Suite',
    description: 'Ultra-low radiation flat-panel digital radiography for chest, skeletal, abdominal, and trauma imaging with instant PACS cloud archiving.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    badge: 'Ultra-Low Dose Flat Panel DR',
    stats: [
      { label: 'Daily X-Ray Scans', value: '85+ Completed' },
      { label: 'Report Delivery', value: '< 15 Mins' },
      { label: 'PACS Resolution', value: '4K Diagnostic' },
      { label: 'Radiation Level', value: 'AERB Certified Safe' }
    ],
    equipmentList: [
      'Siemens Multix Impact Digital X-Ray',
      'Fujifilm FDR Smart X DR Detector',
      'Mobile C-Arm Fluoroscopy Unit',
      'DICOM 3.0 High-Speed PACS Server'
    ],
    departmentLead: 'Dr. Rahul Singh (MS, AIIMS Delhi)',
    contactEmergency: 'Ext: 2202 / +91 542 2307520'
  },

  mri: {
    id: 'mri',
    name: 'Magnetic Resonance Imaging (MRI)',
    category: 'Neuro & Musculoskeletal Imaging',
    title: '3.0 Tesla Silent High-Field MRI Scanner',
    description: 'Deep neuro-cranial, spine, musculoskeletal, and vascular diffusion imaging with whisper-quiet bore technology and multi-channel coil arrays.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    badge: '3.0 Tesla Superconducting Magnet',
    stats: [
      { label: 'Active 3T MRI Scans', value: '18 Today' },
      { label: 'Bore Diameter', value: '70 cm Wide Bore' },
      { label: 'Neuro Diffusion TAT', value: '45 Mins' },
      { label: 'Helium Level', value: '98.4% Optimal' }
    ],
    equipmentList: [
      'Siemens Magnetom Vida 3T MRI',
      'BioMatrix Sensor Coil Suite',
      'MRI-Safe Non-Magnetic Anesthesia Cart',
      'AI Deep Resolve Image Reconstruction Engine'
    ],
    departmentLead: 'Dr. Deepanshu Singh (DM Neurology, AIIMS Madras)',
    contactEmergency: 'Ext: 2303 / +91 542 2307530'
  },

  ctscan: {
    id: 'ctscan',
    name: 'Computed Tomography (CT Scan)',
    category: 'Ultra-Fast Cross-Sectional Imaging',
    title: '128-Slice Dual-Source Helical CT Scanner',
    description: 'Sub-second whole-body trauma imaging, coronary CT angiogram, neuro perfusion, and chest HRCT with AI iterative dose reduction.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    badge: '128-Slice Sub-Second Helical CT',
    stats: [
      { label: 'Trauma Scans', value: '34 Completed' },
      { label: 'Rotation Speed', value: '0.28 sec / 360°' },
      { label: 'Dose Modulation', value: 'CARE Dose4D -60%' },
      { label: 'Contrast Injector', value: 'Dual Head Auto' }
    ],
    equipmentList: [
      'GE Revolution EVO 128-Slice CT',
      'Medrad Stellant Dual Contrast Injector',
      'AI Stroke Neuro Perfusion Module',
      '3D Multiplanar PACS Workstation'
    ],
    departmentLead: 'Dr. Deepanshu Singh (DM Neurology, AIIMS Madras)',
    contactEmergency: 'Ext: 2404 / +91 542 2307540'
  },

  eyecare: {
    id: 'eyecare',
    name: 'Eye Care / Ophthalmology',
    category: 'Ocular Diagnostics & Micro-Surgery',
    title: 'Advanced Ophthalmology & Corneal Diagnostic Suite',
    description: 'Precision slit lamp bio-microscopy, fundus photography, non-contact tonometry, optical coherence tomography (OCT), and micro-incision phaco cataract surgery.',
    imageUrl: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    badge: 'Precision Ocular Microsurgery Wing',
    stats: [
      { label: 'OPD Eye Checkups', value: '48 Today' },
      { label: 'Phaco Cataracts', value: '8 Scheduled' },
      { label: 'OCT Retina Scans', value: '16 Ready' },
      { label: 'Sterility Index', value: '100% Class 100' }
    ],
    equipmentList: [
      'Carl Zeiss Slit Lamp Bio-Microscope',
      'Topcon 3D OCT-1 Maestro Retina Scanner',
      'Alcon Centurion Phacoemulsification System',
      'Canon Digital Non-Mydriatic Fundus Camera'
    ],
    departmentLead: 'Dr. Rahul Singh (MS Ophthalmology, AIIMS Delhi)',
    contactEmergency: 'Ext: 2505 / +91 542 2307550'
  },

  pathology: {
    id: 'pathology',
    name: 'Pathology & Diagnostic Laboratory',
    category: 'Clinical Biochemistry & Hematology',
    title: 'Fully Automated Robotic Pathology Lab (NABL Certified)',
    description: 'Automated 5-part hematology counters, clinical biochemistry analyzers, immunoassays, microbiology cultures, and rapid coagulation profiling.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    badge: 'NABL Accredited & Barcode Automated',
    stats: [
      { label: 'Samples Processed', value: '420+ Today' },
      { label: 'CBC Blood Count TAT', value: '12 Mins' },
      { label: 'Critical Alert Speed', value: '< 5 Mins' },
      { label: 'Quality Control (QC)', value: 'Bi-Level Passed' }
    ],
    equipmentList: [
      'Roche Cobas 6000 Integrated Clinical Chemistry Analyzer',
      'Sysmex XN-1000 5-Part Hematology Counter',
      'Bio-Rad D-10 HbA1c HPLC System',
      'BioMérieux VITEK 2 Automated Microbiology'
    ],
    departmentLead: 'Dr. R. K. Mishra (Lab Head)',
    contactEmergency: 'Ext: 2606 / +91 542 2307560'
  },

  operationtheatre: {
    id: 'operationtheatre',
    name: 'Operation Theatre Complex (OT)',
    category: 'Surgical Care & Anesthesia',
    title: 'Modular Laminar Airflow Operation Theatre Complex',
    description: 'HEPA-filtered modular surgical suites equipped with LED surgical lights, precision anesthesia workstations, laparoscopic towers, and real-time hemodynamic monitors.',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    badge: 'ISO Class 5 Laminar Airflow Suites',
    stats: [
      { label: 'Active OT Suites', value: '4 Major / 2 Minor' },
      { label: 'Surgeries Today', value: '14 Performed' },
      { label: 'Air Changes/hr', value: '28 ACH (Ultra-Clean)' },
      { label: 'PACU Recovery Beds', value: '8 Equipped' }
    ],
    equipmentList: [
      'Dräger Perseus A500 Anesthesia Workstation',
      'Karl Storz 4K Ultra-HD Laparoscopy Tower',
      'Maquet Meera Mobile Surgical Table',
      'Trumpf Medical LED Dual Surgical Lighting'
    ],
    departmentLead: 'Dr. Vivek Malhotra / Sister Mary Joseph (OT Head)',
    contactEmergency: 'Ext: 2707 / +91 542 2307570'
  },

  bloodbank: {
    id: 'bloodbank',
    name: 'Blood Bank & Transfusion Center',
    category: 'Hematology & Component Separation',
    title: '24/7 Regional Blood Transfusion & Cryo-Storage Center',
    description: 'Component separation for Packed Red Blood Cells (PRBC), Platelet Concentrates (SDP/RDP), Fresh Frozen Plasma (FFP), and Cryoprecipitate with NAT testing.',
    imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    badge: 'Nucleic Acid Amplification (NAT) Tested',
    stats: [
      { label: 'Total Units in Stock', value: '248 Units' },
      { label: 'O Negative Emergency', value: '14 Units Ready' },
      { label: 'Platelet Agitators', value: '100% Operational' },
      { label: 'Cross-Match Time', value: '25 Mins' }
    ],
    equipmentList: [
      'Thermo Fisher Cryofuge Blood Component Centrifuge',
      'Helmer Plasma Deep Freezer (-80°C)',
      'Haemonetics MCS+ Apheresis Cell Separator',
      'Ortho Workmate Automated Gel Card Cross-Match'
    ],
    departmentLead: 'Dr. Alok Nath Tripathi (Transfusion Medicine)',
    contactEmergency: 'Ext: 2808 / +91 542 2307580'
  },

  oxygenmanagement: {
    id: 'oxygenmanagement',
    name: 'Oxygen Management & Gas Plant',
    category: 'Biomedical Life Support Infrastructure',
    title: 'Cryogenic Liquid Medical Oxygen (LMO) Plant & Manifold',
    description: 'Continuous 10,000L Liquid Medical Oxygen tank supply, 2x50 automatic gas manifold backup, high-flow nasal cannula (HFNC) stations, and digital pressure telemetry.',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    badge: '10,000L LMO Tank + 2x50 Manifold Grid',
    stats: [
      { label: 'LMO Tank Reservoir', value: '88% (8,800 L)' },
      { label: 'Pipeline Pressure', value: '4.2 Bar (Stable)' },
      { label: 'Backup B-Type Cylinders', value: '124 Ready' },
      { label: 'Auto-Switchover', value: '0.00s Instant' }
    ],
    equipmentList: [
      'Cryogenic 10,000L LMO Vacuum Insulated Storage',
      'BeaconMedaes Fully Automated 2x50 Gas Manifold',
      'AirSep PSA Oxygen Generator Concentrator Plant',
      'IoT Digital Line Pressure Alarm & Telemetry Sensors'
    ],
    departmentLead: 'Er. Sandeep Gupta (Biomedical Lead)',
    contactEmergency: 'Ext: 2909 / +91 542 2307590'
  },

  medicalequipment: {
    id: 'medicalequipment',
    name: 'Biomedical & ICU Equipment Hub',
    category: 'Life Support & Diagnostic Devices',
    title: 'Central Hospital Medical Equipment & Telemetry Hub',
    description: 'Centralized inventory and maintenance tracking for ICU mechanical ventilators, multi-para vital signs monitors, syringe infusion pumps, and portable defibrillators.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    badge: 'Preventive Maintenance & Calibration 100%',
    stats: [
      { label: 'Active Ventilators', value: '38 Operational' },
      { label: 'Defibrillators', value: '16 Ready' },
      { label: 'Infusion Pumps', value: '72 Deployed' },
      { label: 'Calibration Index', value: '99.8% Passed' }
    ],
    equipmentList: [
      'Hamilton-C6 High-End ICU Ventilators',
      'Mindray BeneVision N17 Multi-Para Monitors',
      'B. Braun Perfusor Space Syringe Pumps',
      'Zoll R-Series ALS Clinical Defibrillators'
    ],
    departmentLead: 'Er. Sandeep Gupta (Biomedical Engineering)',
    contactEmergency: 'Ext: 3010 / +91 542 2307600'
  }
};
