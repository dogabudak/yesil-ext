# Chrome Web Store Submission — YesilDoga Green Score

Copy-paste ready. Fill these fields in the Developer Dashboard listing.
Assets that depend on the extension's *look* (screenshots, promo tile) are deferred — see bottom.

---

## Store listing

### Name
YesilDoga Green Score

### Summary (short description — **132 char max**)
> See the sustainability score of any website you visit — carbon-neutral status, renewable energy %, and greener alternatives.

(129 characters — within limit.)

### Category
Productivity  *(alt: Shopping — pick Productivity unless you position it as a shopping aid)*

### Default language
**Türkçe (Turkey)** — launch locale. Add English (and later German) as additional locales post-launch; the extension UI already supports TR/EN/DE at runtime.

---

### 🇹🇷 Summary (short description — **132 char max**)
> Gezindiğiniz web sitelerinin sürdürülebilirlik skorunu görün: karbon nötr durumu, yenilenebilir enerji ve yeşil alternatifler.

(126 characters — within limit.)

### 🇹🇷 Detailed description (16,000 char max)
```
YesilDoga Green Score, gezindiğiniz web sitelerinin arkasındaki şirketlerin çevresel ayak izini alışveriş yaparken ve okurken anında gösterir.

NE YAPAR
Herhangi bir web sitesini ziyaret edin; YesilDoga alan adının arkasındaki şirketi tanır ve sürdürülebilirlik profilini sade bir pencerede sunar:

• Karbon nötr durumu — net bir evet/hayır rozeti
• Yenilenebilir enerji kullanımı — ilerleme çubuğuyla yüzde olarak
• Şirket bilgileri — sektör, merkez ve ülke
• Sertifikalar — ISO, CE ve diğer çevresel belgeler
• Yeşil alternatifler — bir şirket karbon nötr değilse, aynı alanda karbon nötr seçenekler öneririz
• Çok dilli açıklamalar — Türkçe, İngilizce ve Almanca

NEDEN VAR
Sürdürülebilirlik bilgisi dağınıktır ve tam da önemli olduğu anda — nereden alışveriş yapacağınıza veya hangi hizmeti kullanacağınıza karar verirken — bulunması zordur. YesilDoga bu bilgiyi bir bakış uzağınıza getirir; böylece sayfadan ayrılmadan daha yeşil seçimler yapabilirsiniz.

ÖNCE GİZLİLİK
• Takip yok. Tarama geçmişinizi veya ziyaret ettiğiniz siteleri kaydetmeyiz.
• Eklentinin kendi yerel depolaması dışında çerez yok.
• Kişisel veri toplama yok.
• Eklenti yalnızca o şirketin herkese açık sürdürülebilirlik verilerini bulmak için web sitesinin alan adını API'mize gönderir ve sonuçları hız için 24 saat yerel olarak önbelleğe alır.

GERÇEK AMAÇLARI DESTEKLER
YesilDoga gerçek çevre kampanyalarına bağlıdır — ağaçlandırma, temiz denizler, sürdürülebilir tarım, eğitim ve yardım. Daha fazla bilgi: https://yesildoga.onrender.com

Sorularınız veya eklememizi istediğiniz bir şirket mi var? Bu sayfadaki destek e-postasından bize ulaşın.
```

---

### 🇬🇧 English copy (secondary locale — add after launch)

**Summary (132 char max):**
> See the sustainability score of any website you visit — carbon-neutral status, renewable energy %, and greener alternatives.

**Detailed description:**
```
YesilDoga Green Score shows you the environmental footprint of the companies behind the websites you browse — instantly, as you shop and read.

WHAT IT DOES
Visit any website and YesilDoga identifies the company behind the domain, then surfaces its sustainability profile in a clean overlay:

• Carbon-neutral status — a clear yes/no badge
• Renewable energy usage — shown as a percentage with a progress bar
• Company details — sector, headquarters, and country
• Certifications — ISO, CE, and other environmental credentials
• Greener alternatives — if a company isn't carbon neutral, we suggest carbon-neutral options in the same space
• Multilingual descriptions — available in English, Turkish, and German

WHY IT EXISTS
Sustainability information is scattered and hard to find at the moment it matters — while you're deciding where to shop or which service to use. YesilDoga puts that context one glance away, so you can make greener choices without leaving the page.

PRIVACY FIRST
• No tracking. We do not record your browsing history or the sites you visit.
• No cookies beyond the extension's own local storage.
• No personal data collection.
• The extension only sends a website's domain name to our API to look up that company's public sustainability data, and caches results locally for 24 hours for speed.

SUPPORTING REAL CAUSES
YesilDoga is tied to real environmental campaigns — reforestation, clean seas, sustainable agriculture, education, and charity. Learn more at https://yesildoga.onrender.com

Questions or a company you'd like us to add? Reach us at the support email on this listing.
```

---

## Privacy & practices tab

### Single purpose (required — one sentence)
> This extension displays publicly available sustainability data (carbon-neutral status, renewable energy usage, certifications, and greener alternatives) for the company associated with the website the user is currently viewing.

### Permission justifications
| Permission | Justification |
|---|---|
| `storage` | Cache company sustainability data locally for 24 hours and store the user's selected campaign/preferences, avoiding repeat API calls. |
| `activeTab` | Read the domain of the current tab to look up the associated company. |
| `tabs` | Detect tab navigation and URL changes so the sustainability overlay updates when the user moves to a new site. |
| `host_permissions: <all_urls>` | The extension's core purpose is to work on **any** website the user visits — it must inject the overlay and read the current domain regardless of site. It does not read page content or user data; it only uses the domain to query public company data. |

### Remote code
> **No**, the extension does not use remote code. All logic ships in the package. It only makes data (fetch) requests to its own backend API (`https://yesildoga-api.onrender.com`).

### Data usage disclosures (what you check on the form)
- **Does this extension collect user data?** Yes (technically — the domain of visited sites is sent to the API).
- Data types to declare:
  - **Web history** → the current site's domain is sent to the API for lookup. *(Not stored server-side beyond aggregate failed-lookup analytics; disclose honestly.)*
  - Do **NOT** check: personally identifiable info, financial info, health, location, authentication (unless the Account/login tab ships — see note below).
- Certify: data is **not** sold to third parties, **not** used for unrelated purposes, **not** used for creditworthiness/lending.

> ⚠️ If the login/signup Account tab ships in v1, you must additionally disclose **authentication information** and describe the auth flow. Simpler to hide the Account tab for v1.

### Privacy policy URL
> https://yesildoga.onrender.com/privacy

---

## Additional listing fields
| Field | Value |
|---|---|
| Official website | https://yesildoga.onrender.com |
| Support email | *(set a real, monitored address — e.g. support@yesildoga… or your email)* |
| Support URL | https://yesildoga.onrender.com |

---

## Account & fees
- [ ] One-time **$5** developer registration fee (per Google account, not per extension).
- [ ] Verify a publisher contact email in the dashboard (Google requires this before publishing).

---

## Package (visual-independent — ready now)
- Manifest V3 ✓, version `1.0.0` ✓, icons 16/48/128 present ✓.
- Build a clean ZIP that excludes dev files (`.git`, `.claude`, `CLAUDE.md`, `README.md`, this file).
- See `build-zip.sh` in this folder. Rebuild right before upload so it captures final code.

---

## ⛔ Blockers before you can submit
1. **`config.js` `USER_BASE_URL` = `http://localhost:3020`** — signup/login fails for reviewers. Deploy the user service OR hide the Account tab for v1.
2. **QA pass** — test overlay on 30+ sites, error states, no console errors (MVP_PLAN Step 3).

---

## 🎨 DEFERRED until the look is final
- [ ] **5 screenshots** — 1280×800 (preferred) or 640×400, PNG/JPEG. At least 1 required.
- [ ] **Small promo tile** — 440×280 PNG (required for the store).
- [ ] *(Optional)* Marquee promo tile — 1400×560.
