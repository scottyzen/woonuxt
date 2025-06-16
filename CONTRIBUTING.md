# Contributing to WooNuxt

First off — **thank you**! Whether you're fixing a bug, improving docs, adding features, or just giving feedback, you’re helping shape WooNuxt’s future.

This guide explains how to contribute, follow our conventions, and get your pull request merged smoothly.

---

## 🏆 Contributors

Listed in order of contribution — based on GitHub stats. Thank you all:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/scottyzen">
        <img src="https://github.com/scottyzen.png" width="64" height="64" alt="scottyzen" style="border-radius:50%;"/><br/>
        <sub>scottyzen</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/alexookah">
        <img src="https://github.com/alexookah.png" width="64" height="64" alt="alexookah" style="border-radius:50%;"/><br/>
        <sub>alexookah</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/zackha">
        <img src="https://github.com/zackha.png" width="64" height="64" alt="zackha" style="border-radius:50%;"/><br/>
        <sub>zackha</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Zielgestalt">
        <img src="https://github.com/Zielgestalt.png" width="64" height="64" alt="Zielgestalt" style="border-radius:50%;"/><br/>
        <sub>Zielgestalt</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/brunofullstack">
        <img src="https://github.com/brunofullstack.png" width="64" height="64" alt="brunofullstack" style="border-radius:50%;"/><br/>
        <sub>brunofullstack</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/tzhf">
        <img src="https://github.com/tzhf.png" width="64" height="64" alt="tzhf" style="border-radius:50%;"/><br/>
        <sub>tzhf</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/AlMuz">
        <img src="https://github.com/AlMuz.png" width="64" height="64" alt="AlMuz" style="border-radius:50%;"/><br/>
        <sub>AlMuz</sub>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/McRafee">
        <img src="https://github.com/McRafee.png" width="64" height="64" alt="McRafee" style="border-radius:50%;"/><br/>
        <sub>McRafee</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/atinux">
        <img src="https://github.com/atinux.png" width="64" height="64" alt="atinux" style="border-radius:50%;"/><br/>
        <sub>atinux</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/gabrielrbarbosa">
        <img src="https://github.com/gabrielrbarbosa.png" width="64" height="64" alt="gabrielrbarbosa" style="border-radius:50%;"/><br/>
        <sub>gabrielrbarbosa</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/danielroe">
        <img src="https://github.com/danielroe.png" width="64" height="64" alt="danielroe" style="border-radius:50%;"/><br/>
        <sub>danielroe</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/TomCore">
        <img src="https://github.com/TomCore.png" width="64" height="64" alt="TomCore" style="border-radius:50%;"/><br/>
        <sub>TomCore</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/vpashkov">
        <img src="https://github.com/vpashkov.png" width="64" height="64" alt="vpashkov" style="border-radius:50%;"/><br/>
        <sub>vpashkov</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/vernaillen">
        <img src="https://github.com/vernaillen.png" width="64" height="64" alt="vernaillen" style="border-radius:50%;"/><br/>
        <sub>vernaillen</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/arshidkv12">
        <img src="https://github.com/arshidkv12.png" width="64" height="64" alt="arshidkv12" style="border-radius:50%;"/><br/>
        <sub>arshidkv12</sub>
      </a>
    </td>
  </tr>
</table>

👉 [See full contributor graph →](https://github.com/scottyzen/woonuxt/graphs/contributors)

---

## 📦 Looking to Use WooNuxt?

If you're trying to **install and use** WooNuxt in a project, this file is not for you. Please see the [README.md](./README.md) for:

- Installation instructions
- Environment setup
- Usage examples
- Plugin/module details

This guide is for contributors working on the WooNuxt codebase or documentation.

---

## 🛠️ Make Your Changes, Test, Commit, and Push

1. **Fork the repository** on GitHub and clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/woonuxt.git
   cd woonuxt
   ```

2. **Create a new branch** using a meaningful name:

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes** in the appropriate part of the codebase:

   - `woonuxt_base/` — Nuxt 3 frontend

4. **Test your changes locally**:

   ```bash
   cd woonuxt_base
   yarn install
   yarn dev
   ```

   Then:

   - Open your browser and verify that pages load correctly
   - Interact with cart, product views, and checkout
   - Confirm that WPGraphQL queries resolve properly
   - If modifying the plugin, verify it within the WordPress admin

5. **Stage and commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/):

   ```bash
   git add .
   git commit -m "feat: add custom slot to ProductCard component"
   ```

   Common types:

   - `feat:` — a new feature
   - `fix:` — a bug fix
   - `docs:` — documentation-only changes
   - `chore:` — tooling/config updates
   - `style:` — non-functional style changes (spacing, formatting, etc.)

6. **Push your branch to GitHub**:

   ```bash
   git push origin feat/your-feature-name
   ```

7. **Open a Pull Request** targeting the `master` branch. Include:
   - A brief title and description
   - Screenshots or before/after examples (if relevant)
   - Any linked issues or related context

---

## 🐛 Reporting Bugs

To report a bug, open a [GitHub Issue](https://github.com/scottyzen/woonuxt/issues) and include:

- ✅ What you did
- ✅ What you expected to happen
- ✅ What actually happened
- ✅ WooNuxt, Node, PHP, WordPress, and Nuxt versions
- ✅ Screenshots, logs, or network errors if helpful

---

## 🧭 Questions or Help?

If you're not sure where to start:

- Open a thread in [GitHub Discussions](https://github.com/scottyzen/woonuxt/discussions)
- Create an issue for support
- Tweet [@scottyzen](https://twitter.com/scottyzen)

---

Thank you again — WooNuxt gets better because of contributors like you. 💚
