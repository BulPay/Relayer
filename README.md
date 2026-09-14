# BolPay Relayer

Stellar transaction relayer for BolPay - provides fee sponsorship and escrow operations on the Stellar network.

## Overview

The relayer acts as an intermediary between the BolPay backend and the Stellar blockchain. It handles:

- **Fee Sponsorship**: Allows users to submit transactions without needing XLM for fees
- **Escrow Operations**: Signs and submits escrow-related transactions for Trustless Work integration
- **Transaction Relaying**: Submits signed transactions to the Stellar network
- **Account Management**: Creates and manages Stellar accounts for testing

## Architecture

```
BolPay Backend → Relayer API → Stellar Network
                      ↓
              Fee Sponsorship
              Escrow Signing
              Transaction Submission
```

## Features

- **Fee Sponsorship**: Sponsor transactions so users don't need native XLM
- **Escrow Signing**: Sign escrow XDRs with platform key for Trustless Work
- **Transaction Submission**: Submit signed transactions to Stellar network
- **Account Operations**: Create accounts and check balances
- **API Authentication**: Secured with API key

## Technology Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Framework**: Express.js
- **Blockchain**: Stellar SDK (@stellar/stellar-sdk)
- **Network**: Stellar Testnet (configurable)

## Installation

```bash
cd apps/relayer
bun install
```

## Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Set the required environment variables:

```env
# Stellar Network Configuration
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Relayer Account (Fee Sponsor)
STELLAR_RELAYER_SECRET_KEY=SA...
STELLAR_RELAYER_PUBLIC_KEY=G...

# API Configuration
PORT=3001
API_KEY=your-api-key-here

# Trustless Work Integration
TRUSTLESS_WORK_API_KEY=your-trustless-work-api-key
```

## Running

**Development mode (with hot reload):**

```bash
bun run dev
```

**Production build:**

```bash
bun run build
bun run start
```

The server will start on port 3001 (or the configured PORT).

## API Endpoints

All endpoints require an `X-API-Key` header for authentication.

### Health Check

```
GET /api/health
```

Returns the relayer status.

### Account Operations

**Get Relayer Account Info**
```
GET /api/account
```

Returns the relayer account's public key, balances, and sequence number.

**Get Account Info**
```
GET /api/account/info?publicKey=G...
```

Returns information for any Stellar account.

**Get Account Balances**
```
GET /api/account/balances?publicKey=G...
```

Returns balances for a specific account.

**Check Account Exists**
```
GET /api/account/exists?publicKey=G...
```

Returns whether an account exists on the network.

**Create Account** (testing only)
```
POST /api/account/create
Body: { destination: string, startingBalance: string }
```

Creates a new Stellar account funded by the relayer.

### Transaction Operations

**Sponsor Transaction** (fee sponsorship)
```
POST /api/sponsor
Body: { xdr: string }
```

Sponsors a transaction by adding the relayer as the fee source. Returns the transaction hash.

**Submit Transaction**
```
POST /api/submit
Body: { xdr: string }
```

Submits a signed transaction to the Stellar network. Returns the transaction hash.

### Escrow Operations

**Sign Escrow XDR**
```
POST /api/escrow/sign
Body: { xdr: string }
```

Signs an escrow XDR with the platform key. Returns the signed XDR.

**Sign Funding Transaction**
```
POST /api/escrow/funding/sign
Body: { xdr: string }
```

Signs a transaction for funding an escrow.

**Sign Release Transaction**
```
POST /api/escrow/release/sign
Body: { xdr: string }
```

Signs a transaction for releasing funds from escrow.

**Sign Refund Transaction**
```
POST /api/escrow/refund/sign
Body: { xdr: string }
```

Signs a transaction for refunding escrow funds (dispute resolution).

**Sign Split Transaction**
```
POST /api/escrow/split/sign
Body: { xdr: string }
```

Signs a transaction for splitting escrow funds (mutual dispute resolution).

## Integration with BolPay Backend

The BolPay backend integrates with the relayer by:

1. **Fee Sponsorship**: When users need to submit transactions, the backend sends unsigned XDR to `/api/sponsor`
2. **Escrow Operations**: For Trustless Work escrow flows, the backend sends XDR to appropriate `/api/escrow/*` endpoints
3. **Transaction Submission**: Signed transactions are submitted via `/api/submit`

Example integration:

```typescript
// In BolPay backend
const response = await fetch('http://localhost:3001/api/sponsor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.RELAYER_API_KEY,
  },
  body: JSON.stringify({ xdr: unsignedXdr }),
});

const { txHash } = await response.json();
```

## Security Considerations

- **API Key**: Always use a strong, randomly generated API key
- **Secret Keys**: Never commit secret keys to version control
- **Network Separation**: Use different relayer accounts for testnet and mainnet
- **Rate Limiting**: Consider implementing rate limiting for production use
- **Monitoring**: Monitor transaction failures and relayer account balance

## Fee Sponsorship Explained

Fee sponsorship allows users to interact with the Stellar network without holding XLM for transaction fees. The relayer:

1. Receives an unsigned transaction XDR from BolPay
2. Wraps the transaction with sponsorship operations
3. Signs with the relayer's secret key
4. Submits to the network, paying the fee on behalf of the user

This is critical for user experience, as users only need to hold USDC (the payment asset) rather than XLM.

## Escrow Operations

The relayer handles escrow operations for Trustless Work integration:

- **Funding**: Signs transactions that lock funds in escrow
- **Release**: Signs transactions that release funds to freelancers upon milestone approval
- **Refund**: Signs transactions that return funds to companies in dispute scenarios
- **Split**: Signs transactions that split funds between parties in mutual dispute resolution

All escrow operations are signed with the platform key, which is authorized by Trustless Work.

## Development

**Type checking:**

```bash
bun run typecheck
```

**Building:**

```bash
bun run build
```

## Testing

To test the relayer locally:

1. Set up a Stellar testnet account with XLM
2. Configure the relayer with the testnet account credentials
3. Use the `/api/account/create` endpoint to create test accounts
4. Test fee sponsorship with `/api/sponsor`
5. Test escrow signing with `/api/escrow/sign`

## Troubleshooting

**Transaction fails with "insufficient fee"**: Ensure the relayer account has enough XLM to cover fees.

**Account not found**: Verify the account exists on the network using `/api/account/exists`.

**Invalid XDR**: Ensure the XDR is properly formatted and matches the network (testnet vs mainnet).

**API key authentication fails**: Check that the `X-API-Key` header matches the configured `API_KEY`.

## License

To be defined.
