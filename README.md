<br />
<p align="center">
  <a href="https://www.coffup.tech">
        <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://www.coffup.tech/logo.png">
      <source media="(prefers-color-scheme: light)" srcset="https://www.coffup.tech/logo.png">
      <img alt="Requin Logo" width="300" src="https://www.coffup.tech/logo.png">
    </picture>
  </a>

  <h1 align="center">Requin SDK for JS</h1>

  <!-- <p align="center">
    <a href="https://supabase.com/docs/guides/getting-started">Guides</a>
    ·
    <a href="https://supabase.com/docs/reference/javascript/introduction">Reference Docs</a>
  </p> -->
</p>

<div align="center">

[![Build](https://github.com/supabase/supabase-js/workflows/CI/badge.svg)](https://github.com/supabase/supabase-js/actions?query=branch%3Amaster)
[![Package](https://img.shields.io/npm/v/@supabase/supabase-js)](https://www.npmjs.com/package/@supabase/postgrest-js)
[![License: MIT](https://img.shields.io/npm/l/@supabase/supabase-js)](#license)
[![pkg.pr.new](https://pkg.pr.new/badge/supabase/supabase-js)](https://pkg.pr.new/~/supabase/supabase-js)

</div>

## 📦 Libraries

This monorepo contains the complete suite of Supabase JavaScript SDK:

| Library                             | Description                         |
| ----------------------------------- | ----------------------------------- |
| **[@requin/core](./packages/core)** | Main SDK                            |
| **[@requin/mcp](./packages/mcp)**   | MCP server for interacting with LLM |
| **[@requin/sdk](./packages/sdk)**   | SDK for Requin Agent                |

## Support Policy

This section outlines the scope of support for various runtime environments in Supabase JavaScript client.

### Node.js

We only support Node.js versions that are in **Active LTS** or **Maintenance** status as defined by the [official Node.js release schedule](https://nodejs.org/en/about/previous-releases#release-schedule). This means we support versions that are currently receiving long-term support and critical bug fixes.

When a Node.js version reaches end-of-life and is no longer in Active LTS or Maintenance status, Supabase will drop it in a **minor release**, and **this won't be considered a breaking change**.

> ⚠️ **Node.js 18 Deprecation Notice**
>
> Node.js 18 reached end-of-life on April 30, 2025. As announced in [our deprecation notice](https://github.com/orgs/supabase/discussions/37217), support for Node.js 18 was dropped in version `2.79.0`.
>
> Please upgrade to nodejs >= 22 to use this packages

> ⚠️ **Node.js 20 Deprecation Notice**
>
> Node.js 20 reached end-of-life on April 30, 2026. As announced in [our deprecation notice](https://github.com/orgs/supabase/discussions/45715), support for Node.js 20 was dropped in version `2.110.0`.
>
> Please upgrade to nodejs >= 22 to use this packages

## 🚀 Quick Start

### Installation

```bash
npm install @requin/sdk
```

Read more in each package's README file.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and add tests
4. **Run tests** (`pnpm nx affected --target=test`)
5. **Commit your changes** (`pnpm commit`)
6. **Push to your branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow [conventional commits](https://www.conventionalcommits.org/) for commit messages
- Add tests for new functionality
- Update documentation for API changes
- Run `pnpm nx format` before committing
- Ensure all tests pass with `pnpm nx affected --target=test`

## 🧪 Testing

Testing varies per package. See the top-level [TESTING.md](docs/TESTING.md) for an overview and links to package-specific guides.

## 📚 Documentation

### API Documentation

- **[SDK](./packages/sdk)** - SDK for connect to Requin AI Agent

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.coffup.tech](https://docs.coffup.tech/)
- **Community**: [GitHub Discussions](https://github.com/thanhdat2508/requin-sdk/discussions)

<div align="center">

**[Website](https://www.coffup.tech) • [Documentation](https://docs.coffup.tech/)**

</div>
