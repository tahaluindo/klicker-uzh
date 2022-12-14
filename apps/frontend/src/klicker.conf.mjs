import convict from 'convict'
import convictValidators from 'convict-format-with-validator'

convict.addFormats(convictValidators)

export default convict({
  api: {
    endpoint: {
      default: 'http://localhost:4000/graphql',
      env: 'API_ENDPOINT',
      format: 'url',
    },
    endpointSSR: {
      default: undefined,
      env: 'API_ENDPOINT_SSR',
      format: 'url',
    },
    endpointWS: {
      default: 'ws://localhost:4000/graphql',
      env: 'API_ENDPOINT_WS',
      format: String,
    },
  },
  app: {
    baseUrl: {
      default: 'http://localhost:3000',
      env: 'APP_BASE_URL',
      format: 'url',
    },
    supportEmail: {
      default: 'klicker.support@uzh.ch',
      env: 'APP_SUPPORT_EMAIL',
      format: String,
    },
    gzip: {
      default: true,
      env: 'APP_GZIP',
      format: Boolean,
    },
    joinUrl: {
      default: undefined,
      env: 'APP_JOIN_URL',
      format: 'url',
    },
    host: {
      default: '0.0.0.0',
      env: 'APP_HOST',
      format: String,
    },
    persistQueries: {
      default: false,
      env: 'APP_PERSIST_QUERIES',
      format: Boolean,
    },
    port: {
      default: 3000,
      env: 'APP_PORT',
      format: 'port',
    },
    trustProxy: {
      default: false,
      env: 'APP_TRUST_PROXY',
      format: Boolean,
    },
    withAai: {
      default: false,
      env: 'APP_WITH_AAI',
      format: Boolean,
    },
  },
  cache: {
    pages: {
      join: {
        default: 10,
        env: 'CACHE_PAGES_JOIN',
        format: 'int',
      },
      landing: {
        default: 600,
        env: 'CACHE_PAGES_LANDING',
        format: 'int',
      },
      qr: {
        default: 300,
        env: 'CACHE_PAGES_QR',
        format: 'int',
      },
    },
    redis: {
      enabled: {
        default: false,
        env: 'CACHE_REDIS_ENABLED',
        format: Boolean,
      },
      host: {
        default: undefined,
        env: 'CACHE_REDIS_HOST',
        format: String,
      },
      password: {
        default: undefined,
        env: 'CACHE_REDIS_PASSWORD',
        format: String,
        sensitive: true,
      },
      port: {
        default: 6379,
        env: 'CACHE_REDIS_PORT',
        format: 'port',
      },
      tls: {
        default: false,
        env: 'CACHE_REDIS_TLS',
        format: 'Boolean',
      },
    },
  },
  env: {
    arg: 'nodeEnv',
    default: 'development',
    env: 'NODE_ENV',
    format: ['production', 'development', 'test'],
  },
  s3: {
    rootDomain: {
      default: undefined,
      env: 'S3_ROOT_DOMAIN',
      format: String,
    },
    rootUrl: {
      default: undefined,
      env: 'S3_ROOT_URL',
      format: 'url',
    },
  },
  security: {
    cors: {
      credentials: {
        default: true,
        env: 'SECURITY_CORS_CREDENTIALS',
        format: 'Boolean',
      },
      origin: {
        default: undefined,
        env: 'SECURITY_CORS_ORIGIN',
        format: Array,
      },
    },
    csp: {
      childSrc: {
        default: ["'self'", 'blob:*', 'forms.clickup.com'],
        env: 'SECURITY_CSP_CHILD_SRC',
        format: Array,
      },
      connectSrc: {
        default: ["'self'", process.env.API_ENDPOINT, process.env.API_ENDPOINT_WS],
        env: 'SECURITY_CSP_CONNECT_SRC',
        format: Array,
      },
      defaultSrc: {
        default: ["'self'"],
        env: 'SECURITY_CSP_DEFAULT_SRC',
        format: Array,
      },
      enabled: {
        default: false,
        env: 'SECURITY_CSP_ENABLED',
        format: Boolean,
      },
      enforce: {
        default: false,
        env: 'SECURITY_CSP_ENFORCE',
        format: Boolean,
      },
      fontSrc: {
        default: ["'self'", 'data:*', 'fonts.gstatic.com'],
        env: 'SECURITY_CSP_FONT_SRC',
        format: Array,
      },
      imgSrc: {
        default: ["'self'", 'data:*', 'blob:*', 'www.switch.ch', 'www.gstatic.com', 'tc-klicker-prod.s3.amazonaws.com'],
        env: 'SECURITY_CSP_IMG_SRC',
        format: Array,
      },
      reportUri: {
        default: undefined,
        env: 'SECURITY_CSP_REPORT_URI',
        format: 'url',
      },
      scriptSrc: {
        default: ["'self'", "'unsafe-inline'", 'blob:*'],
        env: 'SECURITY_CSP_SCRIPT_SRC',
        format: Array,
      },
      styleSrc: {
        default: [
          "'self'",
          "'unsafe-inline'",
          'maxcdn.bootstrapcdn.com',
          'fonts.googleapis.com',
          'cdnjs.cloudflare.com',
        ],
        env: 'SECURITY_CSP_STYLE_SRC',
        format: Array,
      },
      workerSrc: {
        default: ["'self'", 'blob:*'],
        env: 'SECURITY_CSP_WORKER_SRC',
        format: Array,
      },
    },
    expectCt: {
      enabled: {
        default: true,
        env: 'SECURITY_EXPECT_CT_ENABLED',
        format: Boolean,
      },
      enforce: {
        default: false,
        env: 'SECURITY_EXPECT_CT_ENFORCE',
        format: Boolean,
      },
      maxAge: {
        default: 0,
        env: 'SECURITY_EXPECT_CT_MAX_AGE',
        format: 'int',
      },
      reportUri: {
        default: undefined,
        env: 'SECURITY_EXPECT_CT_REPORT_URI',
        format: 'url',
      },
    },
    fingerprinting: {
      default: true,
      env: 'SECURITY_FINGERPRINTING',
      format: Boolean,
    },
    frameguard: {
      action: {
        default: 'sameorigin',
        env: 'SECURITY_FRAMEGUARD_ACTION',
        format: String,
      },
      ancestors: {
        default: ["'none'"],
        env: 'SECURITY_FRAMEGUARD_ANCESTORS',
        format: Array,
      },
      enabled: {
        default: false,
        env: 'SECURITY_FRAMEGUARD_ENABLED',
        format: Boolean,
      },
    },
    hsts: {
      enabled: {
        default: false,
        env: 'SECURITY_HSTS_ENABLED',
        format: Boolean,
      },
      includeSubDomains: {
        default: false,
        env: 'SECURITY_HSTS_INCLUDE_SUBDOMAINS',
        format: Boolean,
      },
      maxAge: {
        default: 0,
        env: 'SECURITY_HSTS_MAX_AGE',
        format: 'nat',
      },
      preload: {
        default: undefined,
        env: 'SECURITY_HSTS_PRELOAD',
        format: Boolean,
      },
    },
    referrerPolicy: {
      default: undefined,
      env: 'SECURITY_REFERRER_POLICY',
      format: String,
    },
  },
  services: {
    chatwoot: {
      baseUrl: {
        default: 'https://app.chatwoot.com',
        env: 'SERVICES_CHATWOOT_BASE_URL',
        format: 'url',
      },
      websiteToken: {
        default: undefined,
        env: 'SERVICES_CHATWOOT_TOKEN',
        format: String,
      },
    },
    happyKit: {
      envKey: {
        default: undefined,
        env: 'NEXT_PUBLIC_HAPPYKIT_FLAGS_ENV_KEY',
        format: String,
        sensitive: true,
      },
      publicKey: {
        default: undefined,
        env: 'NEXT_PUBLIC_HAPPYKIT_ANALYTICS_KEY',
        format: String,
        sensitive: true,
      },
      persistedUsers: {
        default: 'roland.schlaefli@bf.uzh.ch',
        env: 'NEXT_PUBLIC_HAPPYKIT_PERSISTED_USERS',
        format: String,
      },
    },
    googleAnalytics: {
      trackingId: {
        default: undefined,
        env: 'NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID',
        format: String,
        sensitive: true,
      },
    },
    matomo: {
      siteUrl: {
        default: undefined,
        env: 'NEXT_PUBLIC_MATOMO_URL',
        format: 'url',
      },
      siteId: {
        default: undefined,
        env: 'NEXT_PUBLIC_MATOMO_SITE_ID',
        format: Number,
      },
    },
    sentry: {
      enabled: {
        default: false,
        env: 'SENTRY_ENABLED',
        format: Boolean,
      },
      dsn: {
        default: undefined,
        env: 'SENTRY_DSN',
        format: String,
      },
      release: {
        default: undefined,
        env: 'SENTRY_RELEASE',
        format: String,
      },
      debug: {
        default: false,
        env: 'SENTRY_DEBUG',
        format: Boolean,
      },
      sampleRate: {
        default: 0.1,
        env: 'SENTRY_SAMPLE_RATE',
        format: Number,
      },
      env: {
        default: undefined,
        env: 'SENTRY_ENV',
        format: String,
      },
    },
  },
  azure: {
    addResponseEndpoint: {
      default: undefined,
      env: 'AZURE_ADD_RESPONSE_ENDPOINT',
      format: 'url',
    },
  },
})
