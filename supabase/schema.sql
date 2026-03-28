create extension if not exists "uuid-ossp";

create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  ateco_code text,
  sector text,
  employees_range text,
  city text,
  created_at timestamptz default now()
);

create table if not exists emissions_data (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  period text,
  electricity_kwh numeric,
  gas_m3 numeric,
  fleet_km numeric,
  fleet_type text,
  flights_km numeric,
  waste_kg numeric,
  water_m3 numeric,
  scope1_tco2 numeric,
  scope2_tco2 numeric,
  scope3_tco2 numeric,
  total_tco2 numeric,
  created_at timestamptz default now()
);

create table if not exists ai_actions (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  title text,
  description text,
  co2_reduction_tco2 numeric,
  cost_saving_eur numeric,
  difficulty_score integer,
  payback_months integer,
  status text default 'suggested',
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  report_type text,
  content jsonb,
  pdf_url text,
  generated_at timestamptz default now()
);

create table if not exists esg_scores (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  period text,
  environmental_score integer,
  social_score integer,
  governance_score integer,
  total_score integer,
  sector_benchmark integer,
  created_at timestamptz default now()
);
