/* Supabase.js v2.51.1 | The Supabase Client library. This is an all-in-one package for your client-side interactions with Supabase. */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createClient: () => createClient
});
module.exports = __toCommonJS(src_exports);

// src/lib/SupabaseClient.ts
var import_realtime_js = require("@supabase/realtime-js");
var import_gotrue_js = require("@supabase/gotrue-js");
var import_postgrest_js = require("@supabase/postgrest-js");
var import_storage_js = require("@supabase/storage-js");
var import_functions_js = require("@supabase/functions-js");
var DEFAULT_GLOBAL_OPTIONS = {
  db: {
    schema: "public"
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "implicit",
    storageKey: import_gotrue_js.DEFAULT_STORAGE_KEY
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
};
var SupabaseClient = class {
  /**
   * Create a new Supabase client.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase "anon" key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.storageKey By default `supabase.auth` uses `localStorage` to store logged in session. You can provide your own key to turn off this storage.
   * @param options.auth.storage A custom session storage implementation. If left null, will default to localStorage.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the session every time it expires. Defaults to "false".
   * @param options.auth.persistSession Set to "true" if you want to automatically save the session. Defaults to "true".
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user. Defaults to "true".
   * @param options.realtime.params The parameters for the realtime connection.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Default headers for all requests.
   */
  constructor(supabaseUrl, supabaseKey, options) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    if (!supabaseUrl)
      throw new Error("supabaseUrl is required.");
    if (!supabaseKey)
      throw new Error("supabaseKey is required.");
    const _supabaseUrl = this.sanitizeUrl(supabaseUrl);
    this.options = {
      ...DEFAULT_GLOBAL_OPTIONS,
      ...options
    };
    this.headers = this.options.global && this.options.global.headers ? this.options.global.headers : {};
    this.auth = this.initializeAuth(_supabaseUrl, supabaseKey, this.options.auth, this.options.global);
    this.realtime = this.initializeRealtime(_supabaseUrl, supabaseKey, this.options.realtime, this.options.global);
    this.fetch = (this.options.global && this.options.global.fetch || fetch).bind(this);
  }
  /**
   * Get a SupabaseQueryBuilder for a specific table.
   * @param relationName The table name to query.
   */
  from(relationName) {
    const url = `${this.supabaseUrl}/rest/v1/`;
    return new import_postgrest_js.PostgrestClient(url, {
      headers: this.headers,
      schema: this.options.db.schema,
      fetch: this.fetch,
      signal: this.options.global?.fetchOptions?.signal,
      ...this.options.db
    }).from(relationName);
  }
  /**
   * Perform a query on a raw SQL.
   *
   * @param query The raw SQL query
   * @param options.head If `true`, `select` will return `null` and the only data returned will be in the count.
   * @param options.count Count algorithm to use to count rows in a table.
   *
   */
  rpc(fn, args, options) {
    const url = `${this.supabaseUrl}/rest/v1/rpc/`;
    return new import_postgrest_js.PostgrestClient(url, {
      headers: this.headers,
      schema: this.options.db.schema,
      fetch: this.fetch,
      signal: this.options.global?.fetchOptions?.signal,
      ...this.options.db
    }).rpc(fn, args, options);
  }
  /**
   * Select a schema to query.
   * @param schema The schema to query.
   */
  schema(schema) {
    return this.from(schema);
  }
  /**
   * Get a SupabaseStorageClient for managing files.
   */
  get storage() {
    return this.initializeStorage(this.supabaseUrl, this.supabaseKey, this.options.global);
  }
  /**
   * Get a SupabaseFunctionsClient for managing edge functions.
   */
  get functions() {
    return this.initializeFunctions(this.supabaseUrl, this.supabaseKey, this.options.global);
  }
  /**
   * @deprecated
   * The PostgREST client has moved to the `from` and `rpc` methods.
   *
   * For example: `supabase.from('profiles').select('*')`
   */
  get postgrest() {
    const url = `${this.supabaseUrl}/rest/v1/`;
    return new import_postgrest_js.PostgrestClient(url, {
      headers: this.headers,
      schema: this.options.db.schema,
      fetch: this.fetch,
      signal: this.options.global?.fetchOptions?.signal,
      ...this.options.db
    });
  }
  sanitizeUrl(url) {
    return url.endsWith("/") ? url.substring(0, url.length - 1) : url;
  }
  initializeAuth(supabaseUrl, supabaseKey, options, globalOptions) {
    const headers = globalOptions && globalOptions.headers ? globalOptions.headers : {};
    return new import_gotrue_js.GoTrueClient({
      url: `${supabaseUrl}/auth/v1`,
      headers: { ...headers, apikey: supabaseKey },
      fetch: globalOptions && globalOptions.fetch,
      detectSessionInUrl: options?.detectSessionInUrl,
      storageKey: options?.storageKey,
      storage: options?.storage,
      autoRefreshToken: options?.autoRefreshToken,
      persistSession: options?.persistSession,
      flowType: options?.flowType
    });
  }
  initializeRealtime(supabaseUrl, supabaseKey, options, globalOptions) {
    return new import_realtime_js.RealtimeClient(`${supabaseUrl}/realtime/v1`, {
      ...options,
      params: { ...options?.params, apikey: supabaseKey },
      headers: globalOptions?.headers
    });
  }
  initializeStorage(supabaseUrl, supabaseKey, globalOptions) {
    return new import_storage_js.StorageClient(`${supabaseUrl}/storage/v1`, {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }, {
      global: {
        fetch: globalOptions?.fetch,
        headers: globalOptions?.headers
      }
    });
  }
  initializeFunctions(supabaseUrl, supabaseKey, globalOptions) {
    return new import_functions_js.FunctionsClient(`${supabaseUrl}/functions/v1`, {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }, {
      global: {
        fetch: globalOptions?.fetch,
        headers: globalOptions?.headers
      }
    });
  }
};
var createClient = (supabaseUrl, supabaseKey, options) => {
  return new SupabaseClient(supabaseUrl, supabaseKey, options);
};
//# sourceMappingURL=index.js.map