import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isRetryableAxiosError(err: AxiosError): boolean {
  const status = err.response?.status;
  const code = (err.code || '').toUpperCase();

  if (status === 429) return true;
  if (status != null && status >= 500) return true;

  // Common transient network errors
  if (code === 'ECONNRESET') return true;
  if (code === 'ETIMEDOUT') return true;
  if (code === 'EAI_AGAIN') return true;
  if (code === 'ENOTFOUND') return true;
  if (code === 'ECONNABORTED') return true;

  return false;
}

function extractAxiosMessage(err: AxiosError): string | null {
  const status = err.response?.status;
  const data: any = err.response?.data;
  const hinted = typeof data?.desc === 'string' ? data.desc : typeof data?.message === 'string' ? data.message : null;
  if (hinted) return hinted;
  if (typeof status === 'number') return `OpenProvider request failed (HTTP ${status})`;
  return null;
}

const OPENPROVIDER_BASE_URL = (() => {
  const raw = (process.env.OPENPROVIDER_BASE_URL || 'https://api.openprovider.eu/v1beta/').trim();
  return raw.endsWith('/') ? raw : `${raw}/`;
})();

export type OpenProviderResponseCode = number;

export interface OpenProviderApiResponse<TData> {
  code: OpenProviderResponseCode;
  data: TData;
  desc?: string;
  message?: string;
}

export class OpenProviderError extends Error {
  public readonly code?: OpenProviderResponseCode;
  public readonly cause?: unknown;

  constructor(message: string, options?: { code?: OpenProviderResponseCode; cause?: unknown }) {
    super(message);
    this.name = 'OpenProviderError';
    this.code = options?.code;
    this.cause = options?.cause;
  }
}

function normalizeOpenProviderApiErrorMessage(message: string): string {
  const m = (message || '').trim();
  if (!m) return 'OpenProvider request failed';
  if (/an unknown error has occurred/i.test(m)) {
    return 'Domain provider temporarily unavailable. Please retry.';
  }
  return m;
}

function isRetryableOpenProviderApiError(err: OpenProviderError): boolean {
  const msg = (err.message || '').toLowerCase();
  if (msg.includes('temporarily unavailable')) return true;
  if (msg.includes('an unknown error has occurred')) return true;
  // Treat generic server-side failures as retryable.
  if (msg.includes('request failed')) return true;
  return false;
}

// --- Auth ---
export interface AuthLoginRequest {
  username: string;
  password: string;
  ip: string;
}

export interface AuthLoginResponseData {
  token: string;
  reseller_id: number;
}

// --- Domains: Check ---
export type DomainStatus = 'free' | 'active' | 'reserved';

export interface DomainCheckDomainRequest {
  name: string;
  extension: string;
}

export interface DomainCheckRequest {
  domains: DomainCheckDomainRequest[];
  with_price?: boolean;
}

export interface DomainCheckResultPriceReseller {
  currency: string;
  price: number;
}

export interface DomainCheckResultPrice {
  reseller?: DomainCheckResultPriceReseller;
}

export interface DomainCheckResult {
  domain: string;
  status: DomainStatus;
  is_premium: boolean;
  price?: DomainCheckResultPrice;
}

export interface DomainCheckResponseData {
  results: DomainCheckResult[];
}

export interface DomainAvailabilityResult {
  domain: string;
  status: DomainStatus;
  is_premium: boolean;
  price?: {
    currency: string;
    amount: number;
  };
}

// --- Domains: Suggest Name ---
export interface DomainSuggestNameRequest {
  name: string;
  limit?: number;
  tlds?: string[];
}

export type DomainSuggestNameResult =
  | string
  | { domain: string }
  | { name: string; tld: string }
  | { name: string; extension: string };

export interface DomainSuggestNameResponseData {
  results: DomainSuggestNameResult[];
}

export interface DomainSuggestion {
  domain: string;
  tld: string;
}

// --- Customers ---
export interface CustomerName {
  initials: string;
  first_name: string;
  prefix?: string;
  last_name: string;
  full_name?: string;
}

export interface CustomerAddress {
  street: string;
  number: string;
  zipcode: string;
  city: string;
  country: string;
  state?: string;
}

export interface CustomerPhone {
  country_code: string;
  area_code?: string;
  subscriber_number: string;
}

// Maps to `customerCreateCustomerRequest`
export interface CustomerCreateCustomerRequest {
  name: CustomerName;
  address: CustomerAddress;
  phone: CustomerPhone;
  email: string;
}

// Maps to `customerCreateCustomerResponse`
export interface CustomerCreateCustomerResponseData {
  handle: string;
}

export interface CustomerGetCustomerResponseData {
  handle: string;
  email?: string;
  name?: CustomerName;
  address?: CustomerAddress;
  phone?: CustomerPhone;
}

export interface CustomerSearchCustomersResponseData {
  results: CustomerGetCustomerResponseData[];
}

// --- SSL: Approver Emails ---
export interface ApproveremailListApproverEmailsRequest {
  /**
   * Domain/FQDN used to derive approver email addresses (e.g. "example.com").
   * The OpenProvider API expects a domain-like input for this endpoint.
   */
  domain: string;
}

// Maps to `approveremailListApproverEmailsResponse`
export interface ApproveremailListApproverEmailsResponseData {
  results?: string[];
  emails?: string[];
}

// --- Domains: Create ---
export interface DomainCreateDomainDomain {
  name: string;
  extension: string;
}

export interface DomainCreateDomainNameServer {
  name: string;
}

// Maps to `domainCreateDomainRequest`
export interface DomainCreateDomainRequest {
  domain: DomainCreateDomainDomain;
  owner_handle: string;
  admin_handle: string;
  tech_handle: string;
  billing_handle: string;
  period: number;
  name_servers?: DomainCreateDomainNameServer[];
  is_dnssec_enabled?: boolean;
  is_private_whois_enabled?: boolean;
  [key: string]: unknown;
}

export interface DomainCreateDomainResponseData {
  domain?: string;
  order_id?: number | string;
  message?: string;
  [key: string]: unknown;
}

// --- SSL: Orders (Create) ---
// Maps to `orderCreateOrderRequest`
export interface SslOrderCreateOrderRequest {
  product_id: number | string;
  period: number;
  csr: string;
  software_id?: number | string;
  approver_email: string;
  organization_handle: string;
  start_provision: boolean;
}

export interface SslOrderCreateOrderResponseData {
  order_id?: number | string;
  id?: number | string;
  status?: string;
  [key: string]: unknown;
}

// --- DNS: Zones (Create) ---
// Maps to `zoneCreateZoneRequest`
export interface ZoneCreateZoneRequest {
  domain: string;
  type: 'master';
  [key: string]: unknown;
}

export interface ZoneCreateZoneResponseData {
  zone?: string;
  id?: number | string;
  message?: string;
  [key: string]: unknown;
}

// --- Invoices: List ---
export interface InvoiceListInvoice {
  id?: number | string;
  number?: string;
  currency?: string;
  amount?: number;
  status?: string;
  issued_at?: string;
  due_at?: string;
  url?: string;
  [key: string]: unknown;
}

export interface InvoiceListInvoicesResponseData {
  results: InvoiceListInvoice[];
  [key: string]: unknown;
}

// --- Transactions: List ---
export interface TransactionListTransaction {
  id?: number | string;
  created_at?: string;
  currency?: string;
  amount?: number;
  description?: string;
  status?: string;
  [key: string]: unknown;
}

export interface TransactionListTransactionsResponseData {
  results: TransactionListTransaction[];
  [key: string]: unknown;
}

// --- SSL: Products (List) ---
export interface SslProductListProduct {
  id: number | string;
  name?: string;
  description?: string;
  prices?: {
    reseller?: { currency: string; price: number };
  };
  [key: string]: unknown;
}

export interface SslProductListProductsResponseData {
  results: SslProductListProduct[];
  [key: string]: unknown;
}

// --- Domains: List / Update ---
export interface DomainListDomain {
  domain?: string;
  expiration_date?: string;
  is_auto_renew_enabled?: boolean;
  status?: string;
  [key: string]: unknown;
}

export interface DomainListDomainsResponseData {
  results: DomainListDomain[];
  [key: string]: unknown;
}

export interface DomainUpdateDomainRequest {
  is_auto_renew_enabled?: boolean;
  [key: string]: unknown;
}

export interface DomainUpdateDomainResponseData {
  message?: string;
  [key: string]: unknown;
}

// --- Licenses: Plesk (Create / List) ---
export interface PleskLicenseCreateRequest {
  domain_name: string;
  period: number;
  items: string[];
  [key: string]: unknown;
}

export interface PleskLicense {
  id?: number | string;
  domain_name?: string;
  activation_code?: string;
  expiration_date?: string;
  status?: string;
  items?: string[];
  [key: string]: unknown;
}

export interface PleskLicenseCreateResponseData {
  activation_code?: string;
  license?: PleskLicense;
  [key: string]: unknown;
}

export interface PleskLicenseListResponseData {
  results?: PleskLicense[];
  [key: string]: unknown;
}

class OpenProviderClient {
  private readonly client: AxiosInstance;
  private token: string | null = null;
  private resellerId: number | null = null;
  private loginInFlight: Promise<void> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: OPENPROVIDER_BASE_URL,
      timeout: 30_000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (!this.token) return config;
      if (config.headers && typeof (config.headers as any).set === 'function') {
        (config.headers as any).set('Authorization', `Bearer ${this.token}`);
      } else {
        (config.headers as any) = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  public getResellerId(): number | null {
    return this.resellerId;
  }

  private getEnvCredentials(): { username: string; password: string } {
    const username = process.env.OPENPROVIDER_USERNAME;
    const password = process.env.OPENPROVIDER_PASSWORD;
    if (!username || !password) {
      throw new OpenProviderError(
        'Missing OpenProvider credentials. Set OPENPROVIDER_USERNAME and OPENPROVIDER_PASSWORD in the runtime environment.',
      );
    }
    return { username, password };
  }

  private async post<TRequest, TResponseData>(
    path: string,
    body: TRequest,
  ): Promise<TResponseData> {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.client.post<OpenProviderApiResponse<TResponseData>>(path, body);
        if (response.data.code !== 0) {
          throw new OpenProviderError(
            normalizeOpenProviderApiErrorMessage(
              response.data.desc || response.data.message || `OpenProvider API error (code ${response.data.code})`,
            ),
            { code: response.data.code },
          );
        }
        return response.data.data;
      } catch (err) {
        if (err instanceof OpenProviderError) {
          const retryable = isRetryableOpenProviderApiError(err);
          if (retryable && attempt < maxAttempts) {
            const backoff = 250 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 200);
            await sleep(backoff);
            continue;
          }
          throw err;
        }
        const axiosErr = err as AxiosError;

        // Token can expire; clear and re-login once on 401/403 (but never for auth/login itself).
        const status = axiosErr.response?.status;
        if ((status === 401 || status === 403) && path !== 'auth/login') {
          this.token = null;
          this.resellerId = null;
          try {
            await this.login();
            continue;
          } catch {
            // fall through to error/ retry
          }
        }

        const retryable = isRetryableAxiosError(axiosErr);
        if (retryable && attempt < maxAttempts) {
          const backoff = 250 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 200);
          await sleep(backoff);
          continue;
        }

        throw new OpenProviderError(
          normalizeOpenProviderApiErrorMessage(extractAxiosMessage(axiosErr) || 'OpenProvider request failed'),
          {
          cause: axiosErr,
          },
        );
      }
    }

    throw new OpenProviderError('OpenProvider request failed');
  }

	private async get<TResponseData>(
		path: string,
		params?: Record<string, unknown>,
	): Promise<TResponseData> {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.client.get<OpenProviderApiResponse<TResponseData>>(path, {
          params,
        });
        if (response.data.code !== 0) {
          throw new OpenProviderError(
            normalizeOpenProviderApiErrorMessage(
              response.data.desc || response.data.message || `OpenProvider API error (code ${response.data.code})`,
            ),
            { code: response.data.code },
          );
        }
        return response.data.data;
      } catch (err) {
        if (err instanceof OpenProviderError) {
          const retryable = isRetryableOpenProviderApiError(err);
          if (retryable && attempt < maxAttempts) {
            const backoff = 250 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 200);
            await sleep(backoff);
            continue;
          }
          throw err;
        }
        const axiosErr = err as AxiosError;

        const status = axiosErr.response?.status;
        if ((status === 401 || status === 403) && path !== 'auth/login') {
          this.token = null;
          this.resellerId = null;
          try {
            await this.login();
            continue;
          } catch {
            // fall through
          }
        }

        const retryable = isRetryableAxiosError(axiosErr);
        if (retryable && attempt < maxAttempts) {
          const backoff = 250 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 200);
          await sleep(backoff);
          continue;
        }

        throw new OpenProviderError(
          normalizeOpenProviderApiErrorMessage(extractAxiosMessage(axiosErr) || 'OpenProvider request failed'),
          {
          cause: axiosErr,
          },
        );
      }
    }

    throw new OpenProviderError('OpenProvider request failed');
	}

  private async ensureLoggedIn(): Promise<void> {
    if (this.token) return;
    if (this.loginInFlight) return this.loginInFlight;
    this.loginInFlight = this.login().finally(() => {
      this.loginInFlight = null;
    });
    return this.loginInFlight;
  }

  /**
   * Authenticates using /v1beta/auth/login.
   * Reads credentials from OPENPROVIDER_USERNAME / OPENPROVIDER_PASSWORD.
   */
  public async login(): Promise<void> {
    const { username, password } = this.getEnvCredentials();
    const data = await this.post<AuthLoginRequest, AuthLoginResponseData>('auth/login', {
      username,
      password,
      ip: '0.0.0.0',
    });
    this.token = data.token;
    this.resellerId = data.reseller_id;
  }

  public async checkDomains(domains: DomainCheckDomainRequest[], withPrice?: boolean): Promise<DomainAvailabilityResult[]>;
  public async checkDomains(name: string, tlds: string[], withPrice?: boolean): Promise<DomainAvailabilityResult[]>;
  /**
   * Checks availability via /v1beta/domains/check.
   *
   * Supported call forms:
   * - checkDomains([{name, extension}], withPrice?)
   * - checkDomains('mybrand', ['com','ai'], withPrice?)
   */
  public async checkDomains(
    arg1: string | DomainCheckDomainRequest[],
    arg2: string[] | boolean | undefined,
    arg3?: boolean,
  ): Promise<DomainAvailabilityResult[]> {
    await this.ensureLoggedIn();

    const domains: DomainCheckDomainRequest[] = Array.isArray(arg1)
      ? arg1
      : (arg2 as string[]).map((tld) => ({ name: arg1, extension: tld }));
    const with_price = typeof arg2 === 'boolean' ? arg2 : arg3;

    const data = await this.post<DomainCheckRequest, DomainCheckResponseData>('domains/check', {
      domains,
      with_price: with_price ?? true,
    });

    return (data.results ?? []).map((r) => {
      const resellerPrice = r.price?.reseller;
      return {
        domain: r.domain,
        status: r.status,
        is_premium: r.is_premium,
        price: resellerPrice
          ? {
            currency: resellerPrice.currency,
            amount: resellerPrice.price,
          }
          : undefined,
      };
    });
  }

  /**
   * Suggests domains via /v1beta/domains/suggest-name.
   */
  public async suggestNames(name: string, limit?: number, tlds?: string[]): Promise<DomainSuggestion[]>;
  public async suggestNames(params: DomainSuggestNameRequest): Promise<DomainSuggestion[]>;
  public async suggestNames(
    arg1: string | DomainSuggestNameRequest,
    arg2?: number,
    arg3?: string[],
  ): Promise<DomainSuggestion[]> {
    await this.ensureLoggedIn();

    const params: DomainSuggestNameRequest =
      typeof arg1 === 'string'
        ? {
          name: arg1,
          limit: arg2,
          tlds: arg3,
        }
        : arg1;

    const data = await this.post<DomainSuggestNameRequest, DomainSuggestNameResponseData>(
      'domains/suggest-name',
      {
        name: params.name,
        limit: params.limit,
        tlds: params.tlds,
      },
    );

    return (data.results ?? [])
      .map((item): DomainSuggestion | null => {
        if (typeof item === 'string') {
          const tld = item.includes('.') ? item.split('.').pop() ?? '' : '';
          return tld ? { domain: item, tld } : null;
        }
        if ('domain' in item && typeof item.domain === 'string') {
          const tld = item.domain.includes('.') ? item.domain.split('.').pop() ?? '' : '';
          return tld ? { domain: item.domain, tld } : null;
        }
        if ('name' in item && typeof item.name === 'string') {
          const ext =
            'tld' in item && typeof (item as any).tld === 'string'
              ? (item as any).tld
              : 'extension' in item && typeof (item as any).extension === 'string'
                ? (item as any).extension
                : '';
          return ext ? { domain: `${item.name}.${ext}`, tld: ext } : null;
        }
        return null;
      })
      .filter((x): x is DomainSuggestion => Boolean(x));
  }

  /**
   * Creates a customer handle via POST /v1beta/customers.
   * Returns the newly created `handle` (e.g., "XX123456-XX").
   */
  public async createCustomer(request: CustomerCreateCustomerRequest): Promise<string> {
    await this.ensureLoggedIn();
    const data = await this.post<CustomerCreateCustomerRequest, CustomerCreateCustomerResponseData>(
      'customers',
      request,
    );
    if (!data?.handle) {
      throw new OpenProviderError('Customer creation succeeded but no handle was returned');
    }
    return data.handle;
  }

  /**
   * Retrieves a customer by handle via GET /v1beta/customers/{handle}.
   */
  public async getCustomer(handle: string): Promise<CustomerGetCustomerResponseData> {
    await this.ensureLoggedIn();
    const encodedHandle = encodeURIComponent(handle);
    return this.get<CustomerGetCustomerResponseData>(`customers/${encodedHandle}`);
  }

  /**
   * Searches customers via GET /v1beta/customers?email_pattern=...
   * Useful to locate an existing handle before creating a duplicate.
   */
  public async searchCustomers(emailPattern: string): Promise<CustomerGetCustomerResponseData[]> {
    await this.ensureLoggedIn();
    const data = await this.get<CustomerSearchCustomersResponseData>('customers', {
      email_pattern: emailPattern,
    });
    return data?.results ?? [];
  }

  /**
   * Lists SSL approver emails via GET /v1beta/ssl/approver-emails.
   * Returns a flat list of email strings.
   */
  public async getSslApproverEmails(domain: string): Promise<string[]> {
    await this.ensureLoggedIn();
    const data = await this.get<ApproveremailListApproverEmailsResponseData>('ssl/approver-emails', {
      domain,
    });
    return data.results ?? data.emails ?? [];
  }

  /**
   * Registers a domain via POST /v1beta/domains.
   * Automatically provisions a DNS zone via POST /v1beta/dns/zones after successful registration.
   */
  public async createDomain(request: DomainCreateDomainRequest): Promise<DomainCreateDomainResponseData>;
  public async createDomain(
    request: DomainCreateDomainRequest,
    options?: { provisionDnsZone?: boolean },
  ): Promise<DomainCreateDomainResponseData>;
  public async createDomain(
    request: DomainCreateDomainRequest,
    options?: { provisionDnsZone?: boolean },
  ): Promise<DomainCreateDomainResponseData> {
    return this.createDomainWithDns(request, { provisionDnsZone: options?.provisionDnsZone ?? true });
  }

  public async createDomainWithDns(
    request: DomainCreateDomainRequest,
    options?: { provisionDnsZone?: boolean },
  ): Promise<DomainCreateDomainResponseData> {
    await this.ensureLoggedIn();
    const data = await this.post<DomainCreateDomainRequest, DomainCreateDomainResponseData>('domains', request);

    const provision = options?.provisionDnsZone ?? true;
    if (provision) {
      const fqdn = `${request.domain.name}.${request.domain.extension}`;
      await this.createDnsZone({ domain: fqdn, type: 'master' });
    }

    return data;
  }

  /**
   * Creates an SSL order via POST /v1beta/ssl/orders.
   * Always sets start_provision: true for immediate CA validation.
   */
  public async createSslOrder(
    request: Omit<SslOrderCreateOrderRequest, 'start_provision'>,
  ): Promise<SslOrderCreateOrderResponseData> {
    await this.ensureLoggedIn();
    return this.post<SslOrderCreateOrderRequest, SslOrderCreateOrderResponseData>('ssl/orders', {
      ...request,
      start_provision: true,
    });
  }

  /**
   * Creates a DNS zone via POST /v1beta/dns/zones.
   */
  public async createDnsZone(request: ZoneCreateZoneRequest): Promise<ZoneCreateZoneResponseData> {
    await this.ensureLoggedIn();
    return this.post<ZoneCreateZoneRequest, ZoneCreateZoneResponseData>('dns/zones', request);
  }

  /**
   * Lists invoices via GET /v1beta/invoices.
   */
  public async listInvoices(): Promise<InvoiceListInvoice[]> {
    await this.ensureLoggedIn();
    const data = await this.get<InvoiceListInvoicesResponseData>('invoices');
    return data?.results ?? [];
  }

  /**
   * Lists transactions via GET /v1beta/transactions.
   */
  public async listTransactions(): Promise<TransactionListTransaction[]> {
    await this.ensureLoggedIn();
    const data = await this.get<TransactionListTransactionsResponseData>('transactions');
    return data?.results ?? [];
  }

  /**
   * Lists SSL products via GET /v1beta/ssl/products.
   */
  public async listSslProducts(): Promise<SslProductListProduct[]> {
    await this.ensureLoggedIn();
    const data = await this.get<SslProductListProductsResponseData>('ssl/products');
    return data?.results ?? [];
  }

  /**
   * Lists domains via GET /v1beta/domains.
   */
  public async listDomains(): Promise<DomainListDomain[]> {
    await this.ensureLoggedIn();
    const data = await this.get<DomainListDomainsResponseData>('domains');
    return data?.results ?? [];
  }

  /**
   * Updates a domain via PATCH /v1beta/domains/{domain}.
   * Note: path may differ depending on OpenProvider API; adjust if your account expects a different route.
   */
  public async updateDomain(domain: string, patch: DomainUpdateDomainRequest): Promise<DomainUpdateDomainResponseData> {
    await this.ensureLoggedIn();
    const encoded = encodeURIComponent(domain);
    return this.client
      .patch<OpenProviderApiResponse<DomainUpdateDomainResponseData>>(`domains/${encoded}`, patch)
      .then((res) => {
        if (res.data.code !== 0) {
          throw new OpenProviderError(
            res.data.desc || res.data.message || `OpenProvider API error (code ${res.data.code})`,
            { code: res.data.code },
          );
        }
        return res.data.data;
      });
  }

  /**
   * Creates a Plesk license via POST /v1beta/licenses/plesk.
   * Common usage: { domain_name, period: 1, items: ['PLESK-12-VPS-WEB-HOST-1M'] }
   */
  public async createPleskLicense(request: PleskLicenseCreateRequest): Promise<PleskLicenseCreateResponseData> {
    await this.ensureLoggedIn();
    return this.post<PleskLicenseCreateRequest, PleskLicenseCreateResponseData>('licenses/plesk', request);
  }

  /**
   * Lists Plesk licenses via GET /v1beta/licenses/plesk.
   * Params are passed through as querystring (if supported by your account).
   */
  public async listPleskLicenses(params?: Record<string, unknown>): Promise<PleskLicense[]> {
    await this.ensureLoggedIn();
    const data = await this.get<PleskLicenseListResponseData>('licenses/plesk', params);
    return data?.results ?? [];
  }
}

export const opClient = new OpenProviderClient();
