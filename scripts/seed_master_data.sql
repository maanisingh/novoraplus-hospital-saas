-- Seed Master Data for Hospital SAAS
-- This provides default/initial data for master tables

-- Get a sample org_id (we'll insert global data without org_id for now, organizations can override)

-- 1. Seed Symptoms/Complaints
INSERT INTO symptoms (name, code, category, description) VALUES
('Fever', 'SYM001', 'General', 'Elevated body temperature'),
('Headache', 'SYM002', 'Neurological', 'Pain in head region'),
('Cough', 'SYM003', 'Respiratory', 'Dry or productive cough'),
('Cold', 'SYM004', 'Respiratory', 'Common cold symptoms'),
('Body Pain', 'SYM005', 'General', 'Generalized body aches'),
('Chest Pain', 'SYM006', 'Cardiovascular', 'Pain in chest region'),
('Abdominal Pain', 'SYM007', 'Gastrointestinal', 'Pain in abdomen'),
('Nausea', 'SYM008', 'Gastrointestinal', 'Feeling of sickness'),
('Vomiting', 'SYM009', 'Gastrointestinal', 'Forceful expulsion of stomach contents'),
('Diarrhea', 'SYM010', 'Gastrointestinal', 'Loose watery stools'),
('Constipation', 'SYM011', 'Gastrointestinal', 'Difficulty passing stools'),
('Breathlessness', 'SYM012', 'Respiratory', 'Difficulty breathing'),
('Fatigue', 'SYM013', 'General', 'Extreme tiredness'),
('Dizziness', 'SYM014', 'Neurological', 'Feeling of lightheadedness'),
('Joint Pain', 'SYM015', 'Musculoskeletal', 'Pain in joints'),
('Back Pain', 'SYM016', 'Musculoskeletal', 'Pain in back region'),
('Sore Throat', 'SYM017', 'ENT', 'Pain or irritation in throat'),
('Runny Nose', 'SYM018', 'ENT', 'Nasal discharge'),
('Skin Rash', 'SYM019', 'Dermatological', 'Skin eruption or redness'),
('Swelling', 'SYM020', 'General', 'Abnormal enlargement'),
('Loss of Appetite', 'SYM021', 'General', 'Reduced desire to eat'),
('Weight Loss', 'SYM022', 'General', 'Unintentional weight reduction'),
('Palpitations', 'SYM023', 'Cardiovascular', 'Awareness of heartbeat'),
('Burning Urination', 'SYM024', 'Urological', 'Pain during urination'),
('Frequent Urination', 'SYM025', 'Urological', 'Increased urination frequency')
ON CONFLICT DO NOTHING;

-- 2. Seed Investigations
INSERT INTO investigations (name, code, category, department, normal_range, unit, price) VALUES
-- Hematology
('Complete Blood Count (CBC)', 'INV001', 'Lab', 'Hematology', 'Various', '', 350),
('Hemoglobin', 'INV002', 'Lab', 'Hematology', 'M: 13.5-17.5, F: 12-16', 'g/dL', 100),
('Platelet Count', 'INV003', 'Lab', 'Hematology', '150000-400000', '/cumm', 150),
('ESR', 'INV004', 'Lab', 'Hematology', 'M: 0-15, F: 0-20', 'mm/hr', 100),
('PT/INR', 'INV005', 'Lab', 'Hematology', 'PT: 11-13.5 sec, INR: 0.8-1.2', '', 400),
-- Biochemistry
('Random Blood Sugar', 'INV006', 'Lab', 'Biochemistry', '70-140', 'mg/dL', 80),
('Fasting Blood Sugar', 'INV007', 'Lab', 'Biochemistry', '70-100', 'mg/dL', 80),
('HbA1c', 'INV008', 'Lab', 'Biochemistry', '4-5.6', '%', 500),
('Lipid Profile', 'INV009', 'Lab', 'Biochemistry', 'Various', '', 600),
('Liver Function Test (LFT)', 'INV010', 'Lab', 'Biochemistry', 'Various', '', 700),
('Kidney Function Test (KFT)', 'INV011', 'Lab', 'Biochemistry', 'Various', '', 600),
('Serum Creatinine', 'INV012', 'Lab', 'Biochemistry', '0.7-1.3', 'mg/dL', 150),
('Blood Urea', 'INV013', 'Lab', 'Biochemistry', '15-40', 'mg/dL', 150),
('Serum Uric Acid', 'INV014', 'Lab', 'Biochemistry', 'M: 3.4-7, F: 2.4-6', 'mg/dL', 200),
('Thyroid Profile (T3, T4, TSH)', 'INV015', 'Lab', 'Biochemistry', 'Various', '', 800),
('Serum Electrolytes', 'INV016', 'Lab', 'Biochemistry', 'Na: 136-145, K: 3.5-5', 'mEq/L', 400),
-- Urine
('Urine Routine', 'INV017', 'Lab', 'Pathology', 'Normal', '', 100),
('Urine Culture', 'INV018', 'Lab', 'Microbiology', 'No growth', '', 500),
-- Radiology
('X-Ray Chest PA', 'INV019', 'Radiology', 'Radiology', 'Normal', '', 300),
('X-Ray Spine', 'INV020', 'Radiology', 'Radiology', 'Normal', '', 400),
('Ultrasound Abdomen', 'INV021', 'Radiology', 'Radiology', 'Normal', '', 800),
('CT Scan Head', 'INV022', 'Radiology', 'Radiology', 'Normal', '', 3500),
('CT Scan Chest', 'INV023', 'Radiology', 'Radiology', 'Normal', '', 4000),
('MRI Brain', 'INV024', 'Radiology', 'Radiology', 'Normal', '', 8000),
('ECG', 'INV025', 'Cardiology', 'Cardiology', 'Normal Sinus Rhythm', '', 200),
('2D Echo', 'INV026', 'Cardiology', 'Cardiology', 'Normal', '', 1500),
('TMT', 'INV027', 'Cardiology', 'Cardiology', 'Negative', '', 1200)
ON CONFLICT DO NOTHING;

-- 3. Seed Diagnosis Master
INSERT INTO diagnosis_master (name, code, icd_code, category, description) VALUES
('Acute Upper Respiratory Infection', 'DX001', 'J06.9', 'Respiratory', 'Common cold and related infections'),
('Viral Fever', 'DX002', 'A99', 'Infectious', 'Fever caused by viral infection'),
('Acute Gastroenteritis', 'DX003', 'A09', 'Gastrointestinal', 'Inflammation of stomach and intestines'),
('Urinary Tract Infection', 'DX004', 'N39.0', 'Urological', 'Infection in urinary system'),
('Hypertension', 'DX005', 'I10', 'Cardiovascular', 'High blood pressure'),
('Type 2 Diabetes Mellitus', 'DX006', 'E11', 'Endocrine', 'Diabetes type 2'),
('Bronchial Asthma', 'DX007', 'J45', 'Respiratory', 'Chronic airway inflammation'),
('Acute Pharyngitis', 'DX008', 'J02.9', 'ENT', 'Sore throat infection'),
('Migraine', 'DX009', 'G43', 'Neurological', 'Recurrent headache disorder'),
('Osteoarthritis', 'DX010', 'M15-M19', 'Musculoskeletal', 'Degenerative joint disease'),
('Anemia', 'DX011', 'D64.9', 'Hematological', 'Low hemoglobin'),
('Hypothyroidism', 'DX012', 'E03.9', 'Endocrine', 'Underactive thyroid'),
('Acid Peptic Disease', 'DX013', 'K27', 'Gastrointestinal', 'Gastric/duodenal ulcer'),
('Allergic Rhinitis', 'DX014', 'J30', 'ENT', 'Nasal allergy'),
('Dengue Fever', 'DX015', 'A90', 'Infectious', 'Mosquito-borne viral disease'),
('Pneumonia', 'DX016', 'J18.9', 'Respiratory', 'Lung infection'),
('Coronary Artery Disease', 'DX017', 'I25', 'Cardiovascular', 'Heart artery disease'),
('Chronic Kidney Disease', 'DX018', 'N18', 'Nephrological', 'Progressive kidney damage'),
('Hepatitis', 'DX019', 'K75.9', 'Gastrointestinal', 'Liver inflammation'),
('Depression', 'DX020', 'F32', 'Psychiatric', 'Major depressive disorder')
ON CONFLICT DO NOTHING;

-- 4. Seed Medical History (Past Medical & Surgical)
INSERT INTO medical_history (name, type, category, description) VALUES
-- Past Medical History
('Diabetes Mellitus', 'medical', 'Endocrine', 'History of diabetes'),
('Hypertension', 'medical', 'Cardiovascular', 'History of high blood pressure'),
('Asthma', 'medical', 'Respiratory', 'History of asthma'),
('Heart Disease', 'medical', 'Cardiovascular', 'History of cardiac problems'),
('Thyroid Disorder', 'medical', 'Endocrine', 'History of thyroid issues'),
('Kidney Disease', 'medical', 'Nephrological', 'History of kidney problems'),
('Liver Disease', 'medical', 'Gastrointestinal', 'History of liver problems'),
('Cancer', 'medical', 'Oncology', 'History of malignancy'),
('Tuberculosis', 'medical', 'Infectious', 'History of TB'),
('Epilepsy', 'medical', 'Neurological', 'History of seizures'),
('Stroke', 'medical', 'Neurological', 'History of cerebrovascular accident'),
('Arthritis', 'medical', 'Musculoskeletal', 'History of joint disease'),
('COPD', 'medical', 'Respiratory', 'Chronic obstructive pulmonary disease'),
('HIV/AIDS', 'medical', 'Infectious', 'History of HIV infection'),
('Hepatitis B/C', 'medical', 'Infectious', 'History of viral hepatitis'),
-- Past Surgical History
('Appendectomy', 'surgical', 'General Surgery', 'Appendix removal'),
('Cholecystectomy', 'surgical', 'General Surgery', 'Gallbladder removal'),
('Cesarean Section', 'surgical', 'Obstetrics', 'C-section delivery'),
('Hysterectomy', 'surgical', 'Gynecology', 'Uterus removal'),
('Hernia Repair', 'surgical', 'General Surgery', 'Hernia operation'),
('Coronary Bypass', 'surgical', 'Cardiothoracic', 'CABG surgery'),
('Joint Replacement', 'surgical', 'Orthopedics', 'Hip/Knee replacement'),
('Cataract Surgery', 'surgical', 'Ophthalmology', 'Lens replacement'),
('Tonsillectomy', 'surgical', 'ENT', 'Tonsil removal'),
('Spinal Surgery', 'surgical', 'Neurosurgery', 'Back surgery')
ON CONFLICT DO NOTHING;

-- 5. Seed Lifestyle Options
INSERT INTO lifestyle_options (name, category, description) VALUES
-- Addiction
('None', 'addiction', 'No addiction history'),
('Tobacco - Smoking', 'addiction', 'Cigarette/Bidi smoking'),
('Tobacco - Chewing', 'addiction', 'Gutkha/Pan masala'),
('Alcohol - Occasional', 'addiction', 'Social drinking'),
('Alcohol - Regular', 'addiction', 'Daily alcohol consumption'),
('Alcohol - Heavy', 'addiction', 'Excessive alcohol use'),
('Cannabis', 'addiction', 'Marijuana use'),
('Drugs', 'addiction', 'Substance abuse'),
-- Diet
('Vegetarian', 'diet', 'No meat or fish'),
('Non-Vegetarian', 'diet', 'Includes meat and fish'),
('Eggetarian', 'diet', 'Vegetarian with eggs'),
('Vegan', 'diet', 'No animal products'),
('Mixed', 'diet', 'Variable diet'),
-- Appetite
('Normal', 'appetite', 'Regular appetite'),
('Increased', 'appetite', 'More than normal'),
('Decreased', 'appetite', 'Less than normal'),
('Poor', 'appetite', 'Very low appetite'),
-- Sleep
('Normal (6-8 hrs)', 'sleep', 'Adequate sleep'),
('Disturbed', 'sleep', 'Interrupted sleep'),
('Insomnia', 'sleep', 'Difficulty sleeping'),
('Excessive', 'sleep', 'More than 9 hours'),
('Sleep Apnea', 'sleep', 'Breathing pauses during sleep'),
-- Bladder
('Normal', 'bladder', 'Regular urination'),
('Increased Frequency', 'bladder', 'Polyuria'),
('Decreased Frequency', 'bladder', 'Oliguria'),
('Burning', 'bladder', 'Dysuria'),
('Incontinence', 'bladder', 'Unable to control'),
('Retention', 'bladder', 'Unable to pass'),
-- Bowel
('Normal', 'bowel', 'Regular bowel movements'),
('Constipated', 'bowel', 'Hard/infrequent stools'),
('Loose Motions', 'bowel', 'Frequent loose stools'),
('Irregular', 'bowel', 'Variable pattern'),
('Bleeding', 'bowel', 'Blood in stools')
ON CONFLICT DO NOTHING;

-- 6. Seed User Types
INSERT INTO user_types (name, code, permissions) VALUES
('Super Admin', 'SUPER_ADMIN', '{"all": true}'),
('Hospital Admin', 'HOSPITAL_ADMIN', '{"dashboard": true, "patients": true, "opd": true, "ipd": true, "billing": true, "reports": true, "settings": true}'),
('Doctor', 'DOCTOR', '{"dashboard": true, "patients": true, "opd": true, "ipd": true, "prescriptions": true}'),
('Nurse', 'NURSE', '{"patients": true, "opd": true, "ipd": true, "vitals": true}'),
('Receptionist', 'RECEPTIONIST', '{"patients": true, "appointments": true, "billing": true}'),
('Lab Technician', 'LAB_TECH', '{"lab": true, "reports": true}'),
('Pharmacist', 'PHARMACIST', '{"pharmacy": true, "inventory": true}'),
('Accountant', 'ACCOUNTANT', '{"billing": true, "reports": true, "accounts": true}'),
('Store Manager', 'STORE_MANAGER', '{"inventory": true, "purchase": true}')
ON CONFLICT DO NOTHING;

-- 7. Seed Payment Modes
INSERT INTO payment_modes (name, code, type) VALUES
('Cash', 'CASH', 'cash'),
('Credit Card', 'CREDIT_CARD', 'card'),
('Debit Card', 'DEBIT_CARD', 'card'),
('UPI', 'UPI', 'upi'),
('Google Pay', 'GPAY', 'upi'),
('PhonePe', 'PHONEPE', 'upi'),
('Paytm', 'PAYTM', 'upi'),
('Net Banking', 'NETBANKING', 'bank'),
('Cheque', 'CHEQUE', 'bank'),
('Insurance', 'INSURANCE', 'insurance'),
('Credit', 'CREDIT', 'credit'),
('Hospital Wallet', 'WALLET', 'wallet')
ON CONFLICT DO NOTHING;

-- 8. Seed Service Templates
INSERT INTO service_templates (name, code, department, category, price, tax_percent, description) VALUES
('OPD Consultation - General', 'SVC001', 'OPD', 'Consultation', 300, 0, 'General physician consultation'),
('OPD Consultation - Specialist', 'SVC002', 'OPD', 'Consultation', 500, 0, 'Specialist doctor consultation'),
('Emergency Consultation', 'SVC003', 'Emergency', 'Consultation', 800, 0, 'Emergency department consultation'),
('General Ward - Per Day', 'SVC004', 'IPD', 'Room Charges', 1500, 0, 'General ward bed charges'),
('Semi-Private Room - Per Day', 'SVC005', 'IPD', 'Room Charges', 3000, 0, 'Semi-private room charges'),
('Private Room - Per Day', 'SVC006', 'IPD', 'Room Charges', 5000, 0, 'Private room charges'),
('ICU - Per Day', 'SVC007', 'ICU', 'Room Charges', 15000, 0, 'ICU bed charges'),
('Dressing - Minor', 'SVC008', 'OPD', 'Procedure', 200, 0, 'Minor wound dressing'),
('Dressing - Major', 'SVC009', 'OPD', 'Procedure', 500, 0, 'Major wound dressing'),
('Injection - IV', 'SVC010', 'OPD', 'Procedure', 100, 0, 'Intravenous injection'),
('Injection - IM', 'SVC011', 'OPD', 'Procedure', 50, 0, 'Intramuscular injection'),
('Nebulization', 'SVC012', 'OPD', 'Procedure', 150, 0, 'Respiratory nebulization'),
('Suturing', 'SVC013', 'Emergency', 'Procedure', 500, 0, 'Wound suturing'),
('Catheterization', 'SVC014', 'IPD', 'Procedure', 300, 0, 'Urinary catheter insertion'),
('Nursing Charges - Per Day', 'SVC015', 'IPD', 'Nursing', 500, 0, 'Daily nursing care')
ON CONFLICT DO NOTHING;

-- 9. Seed Certificate Templates
INSERT INTO certificate_templates (name, type, template_content, header_content, footer_content) VALUES
('Medical Certificate', 'medical', 'This is to certify that {{patient_name}}, aged {{age}} years, {{gender}}, was examined on {{date}} and found to be suffering from {{diagnosis}}. The patient is advised rest for {{rest_days}} days from {{from_date}} to {{to_date}}.', '{{hospital_name}}\n{{hospital_address}}', 'This certificate is issued on request.'),
('Fitness Certificate', 'fitness', 'This is to certify that {{patient_name}}, aged {{age}} years, {{gender}}, was examined on {{date}} and found to be medically fit for {{purpose}}.', '{{hospital_name}}\n{{hospital_address}}', 'This certificate is valid for {{validity_days}} days from the date of issue.'),
('Discharge Summary', 'discharge', 'Patient Name: {{patient_name}}\nAge/Sex: {{age}}/{{gender}}\nIP No: {{ip_number}}\nDate of Admission: {{admission_date}}\nDate of Discharge: {{discharge_date}}\n\nDiagnosis: {{diagnosis}}\n\nHistory: {{history}}\n\nExamination: {{examination}}\n\nInvestigations: {{investigations}}\n\nTreatment Given: {{treatment}}\n\nCondition at Discharge: {{condition}}\n\nAdvice at Discharge: {{advice}}', '{{hospital_name}}\n{{hospital_address}}', 'Follow up on: {{followup_date}}'),
('Death Certificate', 'death', 'This is to certify that {{patient_name}}, aged {{age}} years, {{gender}}, son/daughter/spouse of {{relative_name}}, resident of {{address}}, was admitted on {{admission_date}} and expired on {{death_date}} at {{death_time}}.\n\nCause of Death: {{cause_of_death}}', '{{hospital_name}}\n{{hospital_address}}', 'This certificate is issued for official purposes.'),
('Birth Certificate', 'birth', 'This is to certify that a {{gender}} baby was born to {{mother_name}}, wife of {{father_name}}, on {{birth_date}} at {{birth_time}} at {{hospital_name}}.\n\nWeight at Birth: {{weight}} kg\nType of Delivery: {{delivery_type}}', '{{hospital_name}}\n{{hospital_address}}', 'This certificate is issued for official purposes.')
ON CONFLICT DO NOTHING;

-- 10. Seed Medicine Templates
INSERT INTO medicine_templates (name, diagnosis, medicines, advice) VALUES
('Common Cold Treatment', 'Acute Upper Respiratory Infection',
'[{"medicine": "Paracetamol 650mg", "dosage": "1 tablet", "frequency": "TDS", "duration": "3 days", "instructions": "After food"},
{"medicine": "Cetirizine 10mg", "dosage": "1 tablet", "frequency": "OD", "duration": "5 days", "instructions": "At bedtime"},
{"medicine": "Syp Grilinctus", "dosage": "10ml", "frequency": "TDS", "duration": "5 days", "instructions": "After food"}]',
'Rest well. Drink plenty of fluids. Steam inhalation twice daily.'),

('Fever Treatment', 'Viral Fever',
'[{"medicine": "Paracetamol 650mg", "dosage": "1 tablet", "frequency": "TDS", "duration": "3 days", "instructions": "When temperature above 100°F"},
{"medicine": "ORS Powder", "dosage": "1 sachet", "frequency": "QID", "duration": "3 days", "instructions": "Dissolve in 1 liter water"}]',
'Complete bed rest. Stay hydrated. Monitor temperature regularly.'),

('Gastritis Treatment', 'Acid Peptic Disease',
'[{"medicine": "Pantoprazole 40mg", "dosage": "1 tablet", "frequency": "BD", "duration": "14 days", "instructions": "Before breakfast and dinner"},
{"medicine": "Domperidone 10mg", "dosage": "1 tablet", "frequency": "TDS", "duration": "7 days", "instructions": "Before food"},
{"medicine": "Antacid Gel", "dosage": "10ml", "frequency": "TDS", "duration": "7 days", "instructions": "After food"}]',
'Avoid spicy and oily food. Eat small frequent meals. Avoid smoking and alcohol.'),

('UTI Treatment', 'Urinary Tract Infection',
'[{"medicine": "Nitrofurantoin 100mg", "dosage": "1 capsule", "frequency": "BD", "duration": "7 days", "instructions": "After food"},
{"medicine": "Paracetamol 650mg", "dosage": "1 tablet", "frequency": "SOS", "duration": "3 days", "instructions": "For pain/fever"}]',
'Drink plenty of water (3-4 liters/day). Complete the antibiotic course.'),

('Hypertension Management', 'Hypertension',
'[{"medicine": "Amlodipine 5mg", "dosage": "1 tablet", "frequency": "OD", "duration": "30 days", "instructions": "Morning after breakfast"},
{"medicine": "Telmisartan 40mg", "dosage": "1 tablet", "frequency": "OD", "duration": "30 days", "instructions": "Morning after breakfast"}]',
'Monitor BP regularly. Low salt diet. Regular exercise. Avoid stress.')
ON CONFLICT DO NOTHING;

-- 11. Seed Lab Report Templates
INSERT INTO lab_report_templates (name, test_category, parameters, header_content, footer_content) VALUES
('Complete Blood Count', 'Hematology',
'[{"name": "Hemoglobin", "unit": "g/dL", "normal_range": "M: 13.5-17.5, F: 12-16", "method": ""},
{"name": "Total RBC Count", "unit": "million/cumm", "normal_range": "M: 4.5-5.5, F: 4-5", "method": ""},
{"name": "Total WBC Count", "unit": "/cumm", "normal_range": "4000-11000", "method": ""},
{"name": "Neutrophils", "unit": "%", "normal_range": "40-70", "method": ""},
{"name": "Lymphocytes", "unit": "%", "normal_range": "20-40", "method": ""},
{"name": "Eosinophils", "unit": "%", "normal_range": "1-6", "method": ""},
{"name": "Monocytes", "unit": "%", "normal_range": "2-8", "method": ""},
{"name": "Basophils", "unit": "%", "normal_range": "0-1", "method": ""},
{"name": "Platelet Count", "unit": "/cumm", "normal_range": "150000-400000", "method": ""},
{"name": "PCV/Hematocrit", "unit": "%", "normal_range": "M: 40-54, F: 36-48", "method": ""},
{"name": "MCV", "unit": "fL", "normal_range": "80-100", "method": ""},
{"name": "MCH", "unit": "pg", "normal_range": "27-32", "method": ""},
{"name": "MCHC", "unit": "g/dL", "normal_range": "32-36", "method": ""}]',
'HEMATOLOGY REPORT', 'Sample: EDTA Blood'),

('Lipid Profile', 'Biochemistry',
'[{"name": "Total Cholesterol", "unit": "mg/dL", "normal_range": "<200", "method": "Enzymatic"},
{"name": "Triglycerides", "unit": "mg/dL", "normal_range": "<150", "method": "Enzymatic"},
{"name": "HDL Cholesterol", "unit": "mg/dL", "normal_range": ">40", "method": "Direct"},
{"name": "LDL Cholesterol", "unit": "mg/dL", "normal_range": "<100", "method": "Calculated"},
{"name": "VLDL Cholesterol", "unit": "mg/dL", "normal_range": "<30", "method": "Calculated"},
{"name": "Total/HDL Ratio", "unit": "", "normal_range": "<5", "method": "Calculated"}]',
'BIOCHEMISTRY REPORT - LIPID PROFILE', 'Sample: Serum (Fasting 12 hours)'),

('Liver Function Test', 'Biochemistry',
'[{"name": "Total Bilirubin", "unit": "mg/dL", "normal_range": "0.2-1.2", "method": ""},
{"name": "Direct Bilirubin", "unit": "mg/dL", "normal_range": "0-0.3", "method": ""},
{"name": "Indirect Bilirubin", "unit": "mg/dL", "normal_range": "0.2-0.9", "method": ""},
{"name": "SGOT (AST)", "unit": "U/L", "normal_range": "5-40", "method": ""},
{"name": "SGPT (ALT)", "unit": "U/L", "normal_range": "5-40", "method": ""},
{"name": "Alkaline Phosphatase", "unit": "U/L", "normal_range": "44-147", "method": ""},
{"name": "Total Protein", "unit": "g/dL", "normal_range": "6-8", "method": ""},
{"name": "Albumin", "unit": "g/dL", "normal_range": "3.5-5", "method": ""},
{"name": "Globulin", "unit": "g/dL", "normal_range": "2-3.5", "method": ""},
{"name": "A/G Ratio", "unit": "", "normal_range": "1.2-2.2", "method": ""}]',
'BIOCHEMISTRY REPORT - LIVER FUNCTION TEST', 'Sample: Serum'),

('Kidney Function Test', 'Biochemistry',
'[{"name": "Blood Urea", "unit": "mg/dL", "normal_range": "15-40", "method": ""},
{"name": "Serum Creatinine", "unit": "mg/dL", "normal_range": "0.7-1.3", "method": ""},
{"name": "BUN", "unit": "mg/dL", "normal_range": "7-20", "method": ""},
{"name": "Serum Uric Acid", "unit": "mg/dL", "normal_range": "M: 3.4-7, F: 2.4-6", "method": ""},
{"name": "eGFR", "unit": "mL/min/1.73m²", "normal_range": ">90", "method": "Calculated"}]',
'BIOCHEMISTRY REPORT - KIDNEY FUNCTION TEST', 'Sample: Serum'),

('Thyroid Profile', 'Biochemistry',
'[{"name": "T3 (Triiodothyronine)", "unit": "ng/dL", "normal_range": "80-200", "method": "CLIA"},
{"name": "T4 (Thyroxine)", "unit": "µg/dL", "normal_range": "4.5-12", "method": "CLIA"},
{"name": "TSH", "unit": "µIU/mL", "normal_range": "0.4-4.0", "method": "CLIA"}]',
'BIOCHEMISTRY REPORT - THYROID PROFILE', 'Sample: Serum')
ON CONFLICT DO NOTHING;

-- 12. Seed some common ICD Codes
INSERT INTO icd_codes (code, name, category, chapter) VALUES
('A00-B99', 'Certain infectious and parasitic diseases', 'Infectious', 'I'),
('A09', 'Infectious gastroenteritis and colitis', 'Infectious', 'I'),
('A90', 'Dengue fever', 'Infectious', 'I'),
('A99', 'Unspecified viral hemorrhagic fever', 'Infectious', 'I'),
('E10', 'Type 1 diabetes mellitus', 'Endocrine', 'IV'),
('E11', 'Type 2 diabetes mellitus', 'Endocrine', 'IV'),
('E03.9', 'Hypothyroidism, unspecified', 'Endocrine', 'IV'),
('F32', 'Depressive episode', 'Mental', 'V'),
('G43', 'Migraine', 'Nervous', 'VI'),
('I10', 'Essential (primary) hypertension', 'Circulatory', 'IX'),
('I25', 'Chronic ischaemic heart disease', 'Circulatory', 'IX'),
('J02.9', 'Acute pharyngitis, unspecified', 'Respiratory', 'X'),
('J06.9', 'Acute upper respiratory infection', 'Respiratory', 'X'),
('J18.9', 'Pneumonia, unspecified organism', 'Respiratory', 'X'),
('J30', 'Vasomotor and allergic rhinitis', 'Respiratory', 'X'),
('J45', 'Asthma', 'Respiratory', 'X'),
('K27', 'Peptic ulcer, site unspecified', 'Digestive', 'XI'),
('K75.9', 'Inflammatory liver disease', 'Digestive', 'XI'),
('M15-M19', 'Osteoarthritis', 'Musculoskeletal', 'XIII'),
('N18', 'Chronic kidney disease', 'Genitourinary', 'XIV'),
('N39.0', 'Urinary tract infection', 'Genitourinary', 'XIV'),
('D64.9', 'Anaemia, unspecified', 'Blood', 'III')
ON CONFLICT DO NOTHING;

-- 13. Seed TPA Codes (sample)
INSERT INTO tpa_codes (code, name, tpa_name, category, rate) VALUES
('TPA001', 'OPD Consultation', 'Generic', 'OPD', 300),
('TPA002', 'IPD General Ward', 'Generic', 'IPD', 1500),
('TPA003', 'ICU Charges', 'Generic', 'ICU', 15000),
('TPA004', 'X-Ray', 'Generic', 'Radiology', 300),
('TPA005', 'USG Abdomen', 'Generic', 'Radiology', 800),
('TPA006', 'CT Scan', 'Generic', 'Radiology', 4000),
('TPA007', 'MRI', 'Generic', 'Radiology', 8000),
('TPA008', 'CBC', 'Generic', 'Lab', 350),
('TPA009', 'LFT', 'Generic', 'Lab', 700),
('TPA010', 'KFT', 'Generic', 'Lab', 600)
ON CONFLICT DO NOTHING;
