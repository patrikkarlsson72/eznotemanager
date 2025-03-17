# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within EzNoteManager, please send an email to [your-email]. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Measures in Place

1. **Environment Variables**: All sensitive data is stored in environment variables
2. **Firebase Security Rules**: Strict access control rules are in place
3. **Content Security Policy**: Implemented to prevent XSS attacks
4. **Dependency Monitoring**: Regular security updates via Dependabot
5. **Data Encryption**: End-to-end encryption for sensitive data
6. **Input Validation**: All user inputs are validated and sanitized
7. **Regular Updates**: Dependencies are regularly updated to patch security vulnerabilities

## Best Practices for Users

1. Never share your encryption keys
2. Use strong passwords
3. Enable two-factor authentication when available
4. Keep your access tokens secure
5. Report any suspicious activity immediately 