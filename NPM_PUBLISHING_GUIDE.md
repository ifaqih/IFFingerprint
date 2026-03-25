# 📦 npm Publishing Guide - IFFingerprint

## 🎯 Prerequisites

Sebelum publish ke npm, pastikan:

- ✅ GitHub repository sudah dibuat
- ✅ npm account sudah dibuat (https://www.npmjs.com/signup)
- ✅ Source code sudah final dan tested
- ✅ Build berhasil tanpa errors

---

## 📝 Step-by-Step Publishing

### Step 1: Update package.json

**File sudah diupdate dengan:**
- ✅ Author name & email
- ✅ Repository URL
- ✅ Bugs URL
- ✅ Homepage URL
- ✅ License: MIT
- ✅ Keywords (optimized for search)
- ✅ Engines (Node >= 14)
- ✅ prepublishOnly script (auto build before publish)

**Yang perlu Anda edit:**

```json
{
  "author": "Your Name <your.email@example.com>",  // ← Ganti dengan nama Anda
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/iffingerprint.git"  // ← Ganti YOUR_USERNAME
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/iffingerprint/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/iffingerprint#readme"
}
```

---

### Step 2: Check Package Name Availability

**PENTING:** Check apakah nama `iffingerprint` sudah dipakai:

```bash
npm view iffingerprint
```

**Jika sudah ada:**
- ❌ Name taken, pilih nama lain
- ✅ Solusi: Gunakan scoped package `@yourusername/iffingerprint`

**Check nama alternatif:**
```bash
npm view iffingerprint-lib
npm view iffingerprint-js
npm @yourusername/iffingerprint
```

---

### Step 3: Login ke npm

```bash
npm login
```

**Input:**
- Username: your-npm-username
- Password: your-npm-password
- Email: your.email@example.com

**Success:**
```
Logged in as your-npm-username on https://registry.npmjs.org/.
```

---

### Step 4: Build Library

```bash
npm run build
```

**Verify output:**
```
dist/
├── index.js          ✅
├── index.esm.js      ✅
├── index.d.ts        ✅
├── iffingerprint.js  ✅
└── ...               ✅
```

---

### Step 5: Test Locally (Optional tapi Recommended)

```bash
# Test di local project
npm link

# Di project lain
npm link iffingerprint
```

**Test import:**
```javascript
import { IFFingerprint } from 'iffingerprint';
const fp = new IFFingerprint();
console.log(await fp.get());
```

---

### Step 6: Publish ke npm

**First publish (versi 1.0.0):**
```bash
npm publish --access public
```

**Success:**
```
+ iffingerprint@1.0.0
```

**Update versions (next time):**
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

npm publish
```

---

### Step 7: Verify Publication

**Check di npm:**
```bash
npm view iffingerprint
```

**Buka browser:**
```
https://www.npmjs.com/package/iffingerprint
```

**Test install:**
```bash
# Di folder baru
npm install iffingerprint
```

---

## 🔄 Update Package (Next Versions)

### Semantic Versioning

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─ Bug fixes (backward compatible)
  │     └─────── New features (backward compatible)
  └───────────── Breaking changes
```

**Examples:**
- `1.0.0` → Initial release
- `1.0.1` → Bug fix
- `1.1.0` → New feature (new collector)
- `2.0.0` → Breaking change (API change)

### Publish Update

```bash
# 1. Update version di package.json
npm version patch  # Auto update version

# 2. Build
npm run build

# 3. Publish
npm publish

# 4. Push ke GitHub
git push && git push --tags
```

---

## 📊 Package Health Checklist

### Before Publish

- [ ] ✅ `package.json` complete
- [ ] ✅ `README.md` updated
- [ ] ✅ `LICENSE` file exists
- [ ] ✅ Build successful
- [ ] ✅ TypeScript types included
- [ ] ✅ `.gitignore` configured
- [ ] ✅ Keywords optimized

### After Publish

- [ ] ✅ Package visible on npmjs.com
- [ ] ✅ Install test successful
- [ ] ✅ Import test successful
- [ ] ✅ GitHub repo linked
- [ ] ✅ Version tagged on GitHub

---

## 🎯 npm vs GitHub Integration

### GitHub Repository

```
https://github.com/YOUR_USERNAME/iffingerprint
```

**Contains:**
- ✅ Source code
- ✅ Git history
- ✅ Issues tracker
- ✅ Pull requests
- ✅ Releases

### npm Package

```
https://www.npmjs.com/package/iffingerprint
```

**Contains:**
- ✅ Published package (installable)
- ✅ Version history
- ✅ README (from package.json)
- ✅ Dependencies info
- ✅ Download statistics

### Linking Both

**Di package.json:**
```json
{
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/iffingerprint.git"
  },
  "homepage": "https://github.com/YOUR_USERNAME/iffingerprint#readme",
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/iffingerprint/issues"
  }
}
```

**npm akan otomatis link ke GitHub!**

---

## 📈 npm Package Page Features

Setelah publish, package page akan menampilkan:

### 1. Install Command
```bash
npm install iffingerprint
```

### 2. Package Info
- Version: 1.0.0
- License: MIT
- Dependencies: 0 (zero dependencies!)
- Weekly downloads

### 3. Links
- Homepage (GitHub)
- Repository (GitHub)
- Issues (GitHub Issues)
- Collaborators

### 4. README
Automatically displayed from your README.md!

### 5. Versions
All published versions with dates

---

## 🔒 Scoped Packages (Alternative)

Jika nama `iffingerprint` sudah taken:

### Use Scoped Package

```json
{
  "name": "@yourusername/iffingerprint"
}
```

**Publish:**
```bash
npm publish --access public
```

**Install:**
```bash
npm install @yourusername/iffingerprint
```

**Benefits:**
- ✅ Unique name (your username namespace)
- ✅ Shows ownership
- ✅ Professional

**Drawbacks:**
- ⚠️ Longer package name
- ⚠️ Less discoverable

---

## ⚠️ Common Issues & Solutions

### Issue 1: Name Already Taken

```bash
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/iffingerprint - iffingerprint is already taken
```

**Solution:**
- Use scoped package: `@yourusername/iffingerprint`
- Or choose different name: `iffingerprint-lib`, `iffingerprint-js`

### Issue 2: Not Logged In

```bash
npm ERR! 401 Unauthorized - Please log in first
```

**Solution:**
```bash
npm login
```

### Issue 3: Build Failed

```bash
npm ERR! prepublishOnly script failed
```

**Solution:**
```bash
npm run build  # Fix errors first
npm publish
```

### Issue 4: Missing Files

```bash
npm WARN package.json No README data
```

**Solution:**
- Ensure `README.md` exists
- Ensure `LICENSE` exists
- Check `files` array in package.json

---

## 📊 Publishing Checklist

### Pre-Publish

- [ ] Edit `package.json` (author, repository URLs)
- [ ] Check name availability
- [ ] npm login
- [ ] npm run build
- [ ] Test locally (npm link)
- [ ] Verify all files included

### Publish

- [ ] npm publish --access public
- [ ] Verify on npmjs.com
- [ ] Test npm install

### Post-Publish

- [ ] Push to GitHub
- [ ] Create GitHub release
- [ ] Update README with npm badge
- [ ] Share on social media 🎉

---

## 🎉 Success Metrics

After publishing, track:

### npm Stats
- Weekly downloads
- Total downloads
- Dependents (packages using yours)
- Stars on npm

### GitHub Stats
- Stars ⭐
- Forks 🍴
- Issues 🐛
- Contributors 👥

---

## 📚 Resources

- **npm Documentation:** https://docs.npmjs.com/
- **Publishing Guide:** https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry
- **Semantic Versioning:** https://semver.org/
- **npm Package Quality:** https://npms.io/

---

**Ready to publish?** 🚀

1. Edit package.json dengan nama & username Anda
2. npm login
3. npm publish --access public
4. 🎉 Package live!
