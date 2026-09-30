/**
 * @fileoverview Barrel for the emergent task economy (src/market).
 *
 * Exports all ten market modules. ledger, contracts, bidding, and
 * reputation land from their lanes; this barrel wires them the moment
 * they exist.
 *
 * @module agentos/market
 */

export * from './types.js';
export * from './ledger.js';
export * from './contracts.js';
export * from './bidding.js';
export * from './reputation.js';
export * from './oracle.js';
export * from './verify.js';
export * from './watchdog.js';
export * from './squawk.js';
export * from './petitions.js';
