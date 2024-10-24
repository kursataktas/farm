import { OutgoingHttpHeaders, SecureServerOptions } from 'node:http2';
import path from 'node:path';
import connect from 'connect';
import sirv, { RequestHandler } from 'sirv';
import { resolveConfig } from '../config/index.js';
import {
  FarmCliOptions,
  ResolvedUserConfig,
  UserConfig
} from '../config/types.js';
import { resolveServerUrls } from '../utils/http.js';
import { printServerUrls } from '../utils/logger.js';
import { knownJavascriptExtensionRE } from '../utils/url.js';
import { httpServer } from './http.js';

export interface PreviewServerOptions {
  headers: OutgoingHttpHeaders;
  host: string;
  port: number;
  strictPort: boolean;
  https: SecureServerOptions;
  distDir: string;
  open: boolean | string;
  cors: boolean;
}

/**
 * Represents a Farm preview server.
 * @class
 */
export class PreviewServer extends httpServer {
  resolvedUserConfig: ResolvedUserConfig;
  previewServerOptions: PreviewServerOptions;
  httpsOptions: SecureServerOptions;

  app: connect.Server;
  serve: RequestHandler;

  /**
   * Creates an instance of PreviewServer.
   * @param {FarmCliOptions & UserConfig} inlineConfig - The inline configuration options.
   */
  constructor(readonly inlineConfig: FarmCliOptions & UserConfig) {
    super();
  }

  /**
   * Creates and initializes the preview server.
   *
   * @returns {Promise<void>} A promise that resolves when the server is ready.
   * @throws {Error} If the server cannot be started.
   */
  async createPreviewServer(): Promise<void> {
    this.resolvedUserConfig = await resolveConfig(
      this.inlineConfig,
      'preview',
      'production',
      'production'
    );

    this.logger = this.resolvedUserConfig.logger;

    await this.#resolveOptions();

    this.app = connect();
    this.httpServer = await this.resolveHttpServer(
      this.previewServerOptions,
      this.app,
      this.httpsOptions
    );

    this.app.use(this.serve);
  }

  /**
   * Resolve preview server options
   *
   * @private
   * @returns {Promise<void>}
   */
  async #resolveOptions(): Promise<void> {
    const {
      preview,
      server,
      compilation: { root, output }
    } = this.resolvedUserConfig;

    const distDir =
      preview?.distDir || path.isAbsolute(output?.path)
        ? output?.path
        : path.resolve(root, output?.path || 'dist');

    const headers = preview?.headers || server?.headers;
    this.serve = sirv(distDir, {
      etag: true,
      ignores: false,
      setHeaders: (res, pathname) => {
        if (knownJavascriptExtensionRE.test(pathname)) {
          res.setHeader('Content-Type', 'text/javascript');
        }
        if (headers) {
          for (const name in headers) {
            res.setHeader(name, headers[name]);
          }
        }
      }
    });

    this.previewServerOptions = {
      headers,
      host: typeof preview.host === 'string' ? preview.host : 'localhost',
      port: preview?.port || 1911,
      strictPort: preview?.strictPort || false,
      https: preview?.https || server?.https,
      distDir,
      open: preview?.open || false,
      cors: preview?.cors || false
    };

    this.httpsOptions = await this.resolveHttpsConfig(
      this.previewServerOptions.https
    );
  }

  /**
   * Start the preview server.
   *
   * @returns {Promise<void>}
   * @throws {Error} If there's an error starting the server.
   */
  async listen(): Promise<void> {
    if (!this.httpServer) {
      this.logger.error(
        'HTTP server is not created yet, this is most likely a farm internal error.'
      );
      return;
    }

    try {
      await this.httpServerStart({
        port: this.previewServerOptions.port,
        strictPort: true,
        host: this.previewServerOptions.host
      });

      this.resolvedUrls = await resolveServerUrls(
        this.httpServer,
        this.resolvedUserConfig,
        'preview'
      );

      printServerUrls(
        this.resolvedUrls,
        this.previewServerOptions.host,
        this.logger
      );
    } catch (error) {
      throw error;
    }
  }

  async close() {
    this.httpServer && this.httpServer.close();
  }
}
