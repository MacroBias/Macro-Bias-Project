create schema if not exists extensions;
create extension if not exists citext with schema extensions;

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  email extensions.citext not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email extensions.citext not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.homepage_metrics (
  id uuid primary key default gen_random_uuid(),
  key text not null unique default 'singleton',
  macro_bias_score numeric not null,
  sp500_ytd numeric not null,
  macro_bias_ytd numeric not null,
  ten_year_cagr numeric not null,
  five_year_cagr numeric not null,
  two_year_cagr numeric not null,
  max_drawdown_macro_bias numeric not null,
  max_drawdown_sp500 numeric not null,
  at_a_glance text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  key text not null unique default 'singleton',
  daily_macro_score numeric not null,
  monthly_macro_score numeric not null,
  regime_explanation text not null,
  navigation_guide_text text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.dashboard_metrics
  add column if not exists navigation_guide_text text not null default '';

create table if not exists public.navigation_guides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  body text not null default '',
  file_name text,
  file_path text,
  mime_type text,
  file_size_bytes bigint,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.navigation_guides
  add column if not exists file_name text;

alter table public.navigation_guides
  add column if not exists file_path text;

alter table public.navigation_guides
  add column if not exists mime_type text;

alter table public.navigation_guides
  add column if not exists file_size_bytes bigint;

create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  exposure_type text not null,
  instrument text not null,
  entry_price numeric not null,
  stop_loss numeric not null,
  position_size numeric not null,
  unrealized_pnl numeric not null,
  is_active boolean not null default false,
  is_in_run_progression boolean not null default false,
  run_progression_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.positions
  add column if not exists is_active boolean not null default false;

alter table public.positions
  add column if not exists is_in_run_progression boolean not null default false;

alter table public.positions
  add column if not exists run_progression_order integer;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  exposure_type text not null,
  name text not null,
  isin text not null,
  leverage text not null,
  liquidity text not null,
  factsheet_link text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.performance_yearly (
  id uuid primary key default gen_random_uuid(),
  year integer not null unique,
  macro_bias numeric not null,
  sp500 numeric not null,
  alpha numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.framework_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.access_requests enable row level security;
alter table public.admins enable row level security;
alter table public.homepage_metrics enable row level security;
alter table public.dashboard_metrics enable row level security;
alter table public.navigation_guides enable row level security;
alter table public.positions enable row level security;
alter table public.products enable row level security;
alter table public.performance_yearly enable row level security;
alter table public.framework_sections enable row level security;
alter table public.legal_sections enable row level security;

drop policy if exists "allow_insert_access_requests" on public.access_requests;
drop policy if exists "allow_select_own_access_request" on public.access_requests;
drop policy if exists "allow_admin_select_access_requests" on public.access_requests;
drop policy if exists "allow_admins_self_select" on public.admins;
drop policy if exists "allow_admin_select_homepage_metrics" on public.homepage_metrics;
drop policy if exists "allow_admin_insert_homepage_metrics" on public.homepage_metrics;
drop policy if exists "allow_admin_update_homepage_metrics" on public.homepage_metrics;
drop policy if exists "allow_admin_select_dashboard_metrics" on public.dashboard_metrics;
drop policy if exists "allow_admin_insert_dashboard_metrics" on public.dashboard_metrics;
drop policy if exists "allow_admin_update_dashboard_metrics" on public.dashboard_metrics;
drop policy if exists "allow_admin_select_navigation_guides" on public.navigation_guides;
drop policy if exists "allow_admin_insert_navigation_guides" on public.navigation_guides;
drop policy if exists "allow_admin_update_navigation_guides" on public.navigation_guides;
drop policy if exists "allow_admin_delete_navigation_guides" on public.navigation_guides;
drop policy if exists "allow_admin_select_positions" on public.positions;
drop policy if exists "allow_admin_insert_positions" on public.positions;
drop policy if exists "allow_admin_update_positions" on public.positions;
drop policy if exists "allow_admin_delete_positions" on public.positions;
drop policy if exists "allow_admin_select_products" on public.products;
drop policy if exists "allow_admin_insert_products" on public.products;
drop policy if exists "allow_admin_update_products" on public.products;
drop policy if exists "allow_admin_delete_products" on public.products;
drop policy if exists "allow_admin_select_performance_yearly" on public.performance_yearly;
drop policy if exists "allow_admin_insert_performance_yearly" on public.performance_yearly;
drop policy if exists "allow_admin_update_performance_yearly" on public.performance_yearly;
drop policy if exists "allow_admin_delete_performance_yearly" on public.performance_yearly;
drop policy if exists "allow_admin_select_framework_sections" on public.framework_sections;
drop policy if exists "allow_admin_insert_framework_sections" on public.framework_sections;
drop policy if exists "allow_admin_update_framework_sections" on public.framework_sections;
drop policy if exists "allow_admin_delete_framework_sections" on public.framework_sections;
drop policy if exists "allow_admin_select_legal_sections" on public.legal_sections;
drop policy if exists "allow_admin_insert_legal_sections" on public.legal_sections;
drop policy if exists "allow_admin_update_legal_sections" on public.legal_sections;
drop policy if exists "allow_admin_delete_legal_sections" on public.legal_sections;

create policy "allow_insert_access_requests" on public.access_requests
  for insert
  to anon, authenticated
  with check (
    auth.role() = 'anon'
    or email = (auth.jwt() ->> 'email')
  );

create policy "allow_select_own_access_request" on public.access_requests
  for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));

create policy "allow_admin_select_access_requests" on public.access_requests
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admins_self_select" on public.admins
  for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));

create policy "allow_admin_select_homepage_metrics" on public.homepage_metrics
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_insert_homepage_metrics" on public.homepage_metrics
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_update_homepage_metrics" on public.homepage_metrics
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_select_dashboard_metrics" on public.dashboard_metrics
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_insert_dashboard_metrics" on public.dashboard_metrics
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_update_dashboard_metrics" on public.dashboard_metrics
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_select_navigation_guides" on public.navigation_guides
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_insert_navigation_guides" on public.navigation_guides
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_update_navigation_guides" on public.navigation_guides
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_delete_navigation_guides" on public.navigation_guides
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_select_positions" on public.positions
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_insert_positions" on public.positions
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_update_positions" on public.positions
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_delete_positions" on public.positions
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_select_products" on public.products
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_insert_products" on public.products
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_update_products" on public.products
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_delete_products" on public.products
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_select_performance_yearly" on public.performance_yearly
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_insert_performance_yearly" on public.performance_yearly
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_update_performance_yearly" on public.performance_yearly
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_delete_performance_yearly" on public.performance_yearly
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_select_framework_sections" on public.framework_sections
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_insert_framework_sections" on public.framework_sections
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_update_framework_sections" on public.framework_sections
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_delete_framework_sections" on public.framework_sections
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_select_legal_sections" on public.legal_sections
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_insert_legal_sections" on public.legal_sections
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_update_legal_sections" on public.legal_sections
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

create policy "allow_admin_delete_legal_sections" on public.legal_sections
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admins
      where admins.email = (auth.jwt() ->> 'email')
    )
  );

insert into public.admins (email)
values ('karim.88279@gmail.com')
on conflict (email) do nothing;

insert into public.homepage_metrics (
  key,
  macro_bias_score,
  sp500_ytd,
  macro_bias_ytd,
  ten_year_cagr,
  five_year_cagr,
  two_year_cagr,
  max_drawdown_macro_bias,
  max_drawdown_sp500,
  at_a_glance
)
values (
  'singleton',
  0.73,
  15.3,
  27.8,
  18.4,
  22.1,
  31.2,
  -18.7,
  -33.9,
  'Current macro conditions favor equity exposure. Liquidity conditions are supportive, volatility is contained, and economic indicators suggest continued growth momentum. Consider maintaining or increasing leveraged long positions according to your risk parameters.'
)
on conflict (key) do nothing;

insert into public.dashboard_metrics (
  key,
  daily_macro_score,
  monthly_macro_score,
  regime_explanation,
  navigation_guide_text
)
values (
  'singleton',
  0.68,
  0.71,
  'Current macro conditions favor equity exposure. Liquidity conditions are supportive, volatility is contained, and economic indicators suggest continued growth momentum. Consider maintaining or increasing leveraged long positions according to your risk parameters.',
  'Use this section to explain how users should read the dashboard, navigate categories, and apply the data to positioning decisions.'
)
on conflict (key) do nothing;

insert into public.navigation_guides (
  title,
  description,
  body,
  sort_order
)
values (
  'Operational Dashboard Navigation Guide',
  'How to navigate and interpret the Operational Dashboard.',
  'Use this page to explain each dashboard section, how to read the data, and how users should apply the insights in their decision process.',
  1
)
on conflict do nothing;

insert into public.positions (
  id,
  exposure_type,
  instrument,
  entry_price,
  stop_loss,
  position_size,
  unrealized_pnl,
  is_active,
  is_in_run_progression,
  run_progression_order
)
values
  (
    'f12d4a2b-19ab-4c6a-b7c1-4f28d4a0b3e1',
    'Long 2x',
    'Amundi Leveraged MSCI USA Daily 2x',
    142.50,
    128.25,
    10000,
    1250.00,
    true,
    true,
    1
  ),
  (
    '4b97d4d2-3f5f-4b18-8d12-c89b9f2d2f90',
    'Long 3x',
    'WisdomTree S&P 500 3x Daily Leveraged',
    85.20,
    72.42,
    15000,
    2340.00,
    false,
    true,
    2
  ),
  (
    'b9a6d2a2-3e74-4b6c-9f41-f7c3b0cdbf17',
    'Short 2x',
    'Xtrackers S&P 500 2x Inverse Daily',
    12.80,
    14.08,
    5000,
    -320.00,
    false,
    false,
    null
  )
on conflict (id) do nothing;

insert into public.products (
  id,
  exposure_type,
  name,
  isin,
  leverage,
  liquidity,
  factsheet_link
)
values
  ('e4b4f8d0-02e6-4b15-81b8-1e6c5369b79d', 'Long', 'Amundi MSCI USA Daily 2x Lev', 'LU1589310359', '2x', 'High', '#'),
  ('4d4e10df-3b7a-42f0-9a74-7bc7b68a8b79', 'Long', 'WisdomTree S&P 500 3x Daily Lev', 'IE00B7Y34M31', '3x', 'High', '#'),
  ('df4b6d88-6c55-4b3c-8a3f-7af3f44d1b1f', 'Long', 'Xtrackers S&P 500 4x Daily Lev', 'IE00BM67HT60', '4x', 'Medium', '#'),
  ('3c2d2c4e-9f2a-4b43-96a5-3f14b7bb0987', 'Long', 'Leverage Shares 5x Long S&P 500', 'IE00BK5BZY66', '5x', 'Low', '#'),
  ('6a10ecb0-5d5f-4e8d-a3e1-cb9af5b9b7b9', 'Long', 'GraniteShares 6x Long S&P 500', 'IE00BFNXW833', '6x', 'Very low liquidity', '#'),
  ('f6d5a5ff-45c3-4d1a-8f4e-2d7b1b45e2c9', 'Short', 'Xtrackers S&P 500 2x Inverse Daily', 'LU0411078636', '2x', 'High', '#'),
  ('96a7f5f4-0b77-4d75-8fd0-8d2b91bc7d34', 'Short', 'WisdomTree S&P 500 3x Short Daily', 'IE00B8K7YY98', '3x', 'Medium', '#'),
  ('f0d13b8d-8f7d-4d7b-8b9b-8fdb8c1d2f21', 'Short', 'Leverage Shares -4x Short S&P 500', 'IE00BK5C3532', '4x', 'Low', '#'),
  ('1a5af3f1-62b1-4c26-9e07-2d00b39b6a63', 'Short', 'GraniteShares -5x Short S&P 500', 'IE00BN7KG879', '5x', 'Very low liquidity', '#'),
  ('0e9b0a8e-7a8b-4a8b-8cf2-8f2cdb7e502e', 'Short', 'GraniteShares -6x Short S&P 500', 'IE00BLR6QB00', '6x', 'Very low liquidity', '#')
on conflict (id) do nothing;

insert into public.performance_yearly (
  year,
  macro_bias,
  sp500,
  alpha
)
values
  (2009, 95.89, 23.45, 72.44),
  (2010, 64.54, 12.78, 51.76),
  (2011, 95.64, 0.00, 95.64),
  (2012, 79.74, 13.41, 66.33),
  (2013, 38.39, 29.60, 8.79),
  (2014, 36.44, 11.39, 25.05),
  (2015, 38.93, -0.73, 39.66),
  (2016, 22.89, 9.54, 13.35),
  (2017, 63.14, 19.42, 43.72),
  (2018, 16.87, -6.24, 23.11),
  (2019, 14.53, 28.88, -14.35),
  (2020, 169.97, 16.26, 153.71),
  (2021, 38.99, 26.89, 12.10),
  (2022, 48.86, -19.44, 68.30),
  (2023, 16.65, 24.23, -7.58),
  (2024, 7.89, 23.31, -15.42),
  (2025, 30.98, 15.13, 15.85)
on conflict (year) do nothing;

insert into public.framework_sections (
  slug,
  title,
  body,
  sort_order
)
values
  (
    'what-is',
    'What is Macro Bias',
    'Macro Bias is a systematic macro regime overlay designed to provide actionable signals for portfolio exposure management. The framework synthesizes multiple data streams including macroeconomic indicators, liquidity conditions, and volatility regimes to classify market environments.\n\nThe core output is a regime classification (Risk-On, Neutral, or Risk-Off) accompanied by a continuous score ranging from -1 to +1. This allows for both discrete regime-based decisions and more granular position sizing.\n\nThe methodology is designed for investors who seek to reduce drawdowns while participating in market upside, particularly those comfortable with leveraged exposure during favorable conditions.',
    1
  ),
  (
    'what-not',
    'What Macro Bias is Not',
    '- Not a trading system or specific trade recommendation service\n- Not investment advice or financial guidance\n- Not a guaranteed system for avoiding all market losses\n- Not suitable for all investors or risk profiles\n- Not a substitute for professional financial advice',
    2
  ),
  (
    'core-inputs',
    'Core Inputs',
    '### Macro Environment\nEconomic growth indicators, inflation dynamics, central bank policy signals, and cross-asset correlations inform the broader economic context.\n\n### Liquidity Conditions\nCentral bank balance sheets, credit spreads, funding market stress indicators, and cross-border capital flows drive liquidity assessment.\n\n### Volatility Regime\nImplied vs realized volatility, term structure dynamics, correlation regimes, and tail risk indicators determine market stress levels.',
    3
  ),
  (
    'why-no-futures',
    'Why We Avoid Futures',
    'A key design decision is the preference for leveraged ETFs/ETPs over futures contracts. This stems from a fundamental difference in cost structure that has significant implications for long-term compounding.\n\n**Futures/Perpetuals Cost Structure**\nTime-based financing costs accumulate continuously. The longer you hold, the more you pay, regardless of how often you adjust positions. This is particularly punitive for regime-following strategies that may hold positions for extended periods.\n\n**Leveraged ETF/ETP Cost Structure**\nDecision-based costs that primarily manifest during rebalancing. If you hold through a regime without changes, your cost is minimal. This aligns better with our methodology.\n\n| Instrument Type        | Illustrative Annual Cost | Cost Driver                     |\n| ---------------------- | ------------------------ | ------------------------------- |\n| Futures / Perpetuals   | 20-35% p.a.             | Time-based (exposure × time)    |\n| Leveraged ETFs/ETPs    | 2-4% p.a.               | Decision-based (rebalancing events) |\n\nNote: Costs are illustrative and vary by market conditions, specific instruments, and broker arrangements.',
    4
  ),
  (
    'update-frequency',
    'Update Frequency',
    '- **Daily Score**: Updated at market close each trading day based on intraday data.\n- **Weekly Review**: Full model recalibration and regime assessment every weekend.\n- **Regime Change Alerts**: Immediate notification when regime classification changes.\n- **Monthly Reports**: Comprehensive performance and attribution analysis.',
    5
  )
on conflict (slug) do nothing;

insert into public.legal_sections (
  slug,
  title,
  body,
  sort_order
)
values
  (
    'research-only-disclaimer',
    'Research-Only Disclaimer',
    'Macro Bias is a research and educational platform. All content, data, analyses, regime classifications, and performance metrics presented on this platform are for informational and research purposes only. The platform is designed to illustrate systematic approaches to macro regime analysis and should not be construed as a complete investment program or strategy.',
    1
  ),
  (
    'no-investment-advice',
    'No Investment Advice',
    'Nothing on this platform constitutes investment advice, a recommendation to buy or sell any security, or an offer or solicitation to invest in any fund, product, or strategy.\n\nUsers should:\n\n- Consult with qualified financial advisors before making any investment decisions\n- Conduct their own due diligence on any investment or strategy\n- Consider their own financial situation, risk tolerance, and investment objectives\n- Understand that leveraged products carry significant risks including potential loss of principal',
    2
  ),
  (
    'backtest-limitations',
    'Backtest Limitations',
    '**Important:** All performance data shown on this platform is backtested and hypothetical. Backtested performance has inherent limitations:\n\n- It is prepared with the benefit of hindsight\n- It may not reflect the impact of material market factors\n- Actual trading would have resulted in different outcomes due to slippage, fees, and execution timing\n- Past performance is not indicative of future results',
    3
  ),
  (
    'data-sources',
    'Data Sources',
    'Data used in our analyses and displays comes from various third-party sources believed to be reliable. However, we make no representations or warranties as to the accuracy, completeness, or timeliness of such information.\n\nData providers include:\n\n- Major financial data vendors for market prices\n- Central bank publications for monetary data\n- Government statistical agencies for economic data',
    4
  ),
  (
    'conflicts-of-interest',
    'Conflicts of Interest',
    'Users should be aware that the operators of this platform, their affiliates, and related parties may:\n\n- Hold positions in securities mentioned or analyzed on the platform\n- Trade in the same direction as or against regime signals\n- Have financial interests in products or instruments discussed\n- Receive compensation from third parties related to content',
    5
  )
on conflict (slug) do nothing;