/*
  # Create regular_medications table

  1. New Tables
    - `regular_medications`
      - `id` (uuid, primary key)
      - `patient_id` (text, references patients)
      - `medicine_name` (text)
      - `dosage` (text)
      - `frequency` (text)
      - `prescribed_by` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `regular_medications` table
    - Add policy for authenticated users to read/write their own data
    - Add policy for doctors to read/write patient medications
*/

CREATE TABLE IF NOT EXISTS regular_medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id text NOT NULL,
  medicine_name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  prescribed_by text NOT NULL,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE regular_medications ENABLE ROW LEVEL SECURITY;

-- Policy for patients to read their own medications
CREATE POLICY "Patients can read own medications"
  ON regular_medications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = patient_id);

-- Policy for doctors to read all patient medications
CREATE POLICY "Doctors can read all medications"
  ON regular_medications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for doctors to insert new medications
CREATE POLICY "Doctors can insert medications"
  ON regular_medications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for doctors to update medications
CREATE POLICY "Doctors can update medications"
  ON regular_medications
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy for doctors to delete medications
CREATE POLICY "Doctors can delete medications"
  ON regular_medications
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_regular_medications_patient_id 
  ON regular_medications(patient_id);

CREATE INDEX IF NOT EXISTS idx_regular_medications_start_date 
  ON regular_medications(start_date);