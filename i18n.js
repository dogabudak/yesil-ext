// Runtime i18n for the YesilDoga extension UI.
// Language is user-adjustable and persisted in chrome.storage.local.
// Default language is Turkish ('tr'). Shared by popup.js and content.js.
const I18N = {
  DEFAULT_LANG: 'tr',
  SUPPORTED: ['tr', 'en', 'de'],
  STORAGE_KEY: 'ui_language',
  _lang: 'tr',

  MESSAGES: {
    tr: {
      tab_score: 'Skor',
      tab_campaigns: 'Kampanyalar',
      tab_account: 'Hesap',
      loading_text: 'Sürdürülebilirlik verileri kontrol ediliyor...',
      label_sector: 'Sektör',
      label_headquarters: 'Merkez',
      label_origin: 'Köken Ülkesi',
      label_parent: 'Ana Şirket',
      section_sustainability: 'Sürdürülebilirlik',
      meter_carbon_neutral: 'Karbon Nötr',
      meter_renewable: 'Yenilenebilir Enerji',
      section_certifications: 'Sertifikalar',
      section_about: 'Hakkında',
      section_alternatives: '🌱 Yeşil Alternatifler',
      alternatives_subtitle: 'Bu karbon nötr seçenekleri değerlendirin:',
      no_data_title: 'Veri Bulunamadı',
      no_data_text: 'Bu web sitesi için henüz sürdürülebilirlik bilgimiz yok.',
      error_title: 'Yüklenemedi',
      error_text: 'Sürdürülebilirlik verileri alınamadı. Lütfen daha sonra tekrar deneyin.',
      campaigns_desc: 'Aşağıdaki kampanyalardan birini seçerek tarayıcı etkinliğinizle bu amaçlardan birini desteklersiniz.',
      auth_signin_title: 'Giriş Yap',
      auth_subtitle: 'Verilerinizi cihazlar arasında eşitleyin ve premium özelliklerin kilidini açın',
      ph_username: 'Kullanıcı adı',
      ph_password: 'Şifre',
      ph_confirm_password: 'Şifreyi onayla',
      btn_signin: 'Giriş Yap',
      btn_create_account: 'Hesap Oluştur',
      divider_or: 'veya',
      badge_coming_soon: 'Yakında',
      link_create_account: 'Hesap oluştur',
      link_back_to_login: 'Girişe dön',
      profile_default_name: 'Kullanıcı',
      detail_account_type: 'Hesap Türü:',
      value_free: 'Ücretsiz',
      detail_login_method: 'Giriş Yöntemi:',
      value_email: 'E-posta',
      provider_username_password: 'Kullanıcı adı/Şifre',
      detail_member_since: 'Üyelik Tarihi:',
      btn_logout: 'Çıkış Yap',
      privacy_policy: 'Gizlilik Politikası',
      badge_carbon_neutral: 'Karbon Nötr',
      badge_not_carbon_neutral: 'Karbon Nötr Değil',
      value_yes: 'Evet',
      value_no: 'Hayır',
      na: 'Yok',
      btn_visit: 'Ziyaret Et',
      data_updated: 'Veri güncellendi',
      err_passwords_no_match: 'Şifreler eşleşmiyor',
      err_login_failed: 'Giriş başarısız. Lütfen tekrar deneyin.',
      err_signup_failed: 'Kayıt başarısız. Lütfen tekrar deneyin.',
      internal_browser_page: 'Tarayıcı iç sayfası',
      help_title: '💡 Gelişmemize yardımcı olun',
      help_text: 'Bu şirketin sürdürülebilirlik uygulamaları hakkında bilgiye sahipseniz, veritabanımıza katkıda bulunmayı düşünün.',
      always_on_enabled: 'Her zaman açık mod etkin',
      lang_label: 'Dil'
    },
    en: {
      tab_score: 'Score',
      tab_campaigns: 'Campaigns',
      tab_account: 'Account',
      loading_text: 'Checking sustainability data...',
      label_sector: 'Sector',
      label_headquarters: 'Headquarters',
      label_origin: 'Country of Origin',
      label_parent: 'Parent Company',
      section_sustainability: 'Sustainability',
      meter_carbon_neutral: 'Carbon Neutral',
      meter_renewable: 'Renewable Energy',
      section_certifications: 'Certifications',
      section_about: 'About',
      section_alternatives: '🌱 Green Alternatives',
      alternatives_subtitle: 'Consider these carbon-neutral options:',
      no_data_title: 'No Data Available',
      no_data_text: "We don't have sustainability information for this website yet.",
      error_title: 'Unable to Load',
      error_text: 'Could not retrieve sustainability data. Please try again later.',
      campaigns_desc: 'By selecting one of these campaigns, your browser activity will support one of the causes below.',
      auth_signin_title: 'Sign In',
      auth_subtitle: 'Sync your data across devices and unlock premium features',
      ph_username: 'Username',
      ph_password: 'Password',
      ph_confirm_password: 'Confirm Password',
      btn_signin: 'Sign In',
      btn_create_account: 'Create Account',
      divider_or: 'or',
      badge_coming_soon: 'Coming Soon',
      link_create_account: 'Create account',
      link_back_to_login: 'Back to login',
      profile_default_name: 'User',
      detail_account_type: 'Account Type:',
      value_free: 'Free',
      detail_login_method: 'Login Method:',
      value_email: 'Email',
      provider_username_password: 'Username/Password',
      detail_member_since: 'Member Since:',
      btn_logout: 'Logout',
      privacy_policy: 'Privacy Policy',
      badge_carbon_neutral: 'Carbon Neutral',
      badge_not_carbon_neutral: 'Not Carbon Neutral',
      value_yes: 'Yes',
      value_no: 'No',
      na: 'N/A',
      btn_visit: 'Visit',
      data_updated: 'Data updated',
      err_passwords_no_match: 'Passwords do not match',
      err_login_failed: 'Login failed. Please try again.',
      err_signup_failed: 'Signup failed. Please try again.',
      internal_browser_page: 'Internal browser page',
      help_title: '💡 Help us improve',
      help_text: "If you know about this company's sustainability practices, consider contributing to our database.",
      always_on_enabled: 'Always-on mode is enabled',
      lang_label: 'Language'
    },
    de: {
      tab_score: 'Score',
      tab_campaigns: 'Kampagnen',
      tab_account: 'Konto',
      loading_text: 'Nachhaltigkeitsdaten werden geprüft...',
      label_sector: 'Branche',
      label_headquarters: 'Hauptsitz',
      label_origin: 'Herkunftsland',
      label_parent: 'Muttergesellschaft',
      section_sustainability: 'Nachhaltigkeit',
      meter_carbon_neutral: 'Klimaneutral',
      meter_renewable: 'Erneuerbare Energie',
      section_certifications: 'Zertifizierungen',
      section_about: 'Über',
      section_alternatives: '🌱 Grüne Alternativen',
      alternatives_subtitle: 'Erwägen Sie diese klimaneutralen Optionen:',
      no_data_title: 'Keine Daten verfügbar',
      no_data_text: 'Für diese Website liegen uns noch keine Nachhaltigkeitsdaten vor.',
      error_title: 'Laden fehlgeschlagen',
      error_text: 'Nachhaltigkeitsdaten konnten nicht abgerufen werden. Bitte versuchen Sie es später erneut.',
      campaigns_desc: 'Wenn Sie eine dieser Kampagnen auswählen, unterstützt Ihre Browser-Aktivität eines der folgenden Anliegen.',
      auth_signin_title: 'Anmelden',
      auth_subtitle: 'Synchronisieren Sie Ihre Daten geräteübergreifend und schalten Sie Premium-Funktionen frei',
      ph_username: 'Benutzername',
      ph_password: 'Passwort',
      ph_confirm_password: 'Passwort bestätigen',
      btn_signin: 'Anmelden',
      btn_create_account: 'Konto erstellen',
      divider_or: 'oder',
      badge_coming_soon: 'Demnächst',
      link_create_account: 'Konto erstellen',
      link_back_to_login: 'Zurück zur Anmeldung',
      profile_default_name: 'Benutzer',
      detail_account_type: 'Kontotyp:',
      value_free: 'Kostenlos',
      detail_login_method: 'Anmeldemethode:',
      value_email: 'E-Mail',
      provider_username_password: 'Benutzername/Passwort',
      detail_member_since: 'Mitglied seit:',
      btn_logout: 'Abmelden',
      privacy_policy: 'Datenschutzerklärung',
      badge_carbon_neutral: 'Klimaneutral',
      badge_not_carbon_neutral: 'Nicht klimaneutral',
      value_yes: 'Ja',
      value_no: 'Nein',
      na: 'N/V',
      btn_visit: 'Besuchen',
      data_updated: 'Daten aktualisiert',
      err_passwords_no_match: 'Passwörter stimmen nicht überein',
      err_login_failed: 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      err_signup_failed: 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      internal_browser_page: 'Interne Browserseite',
      help_title: '💡 Helfen Sie uns, besser zu werden',
      help_text: 'Wenn Sie die Nachhaltigkeitspraktiken dieses Unternehmens kennen, tragen Sie zu unserer Datenbank bei.',
      always_on_enabled: 'Immer-an-Modus ist aktiviert',
      lang_label: 'Sprache'
    }
  },

  getLang() {
    return this._lang;
  },

  setLang(lang) {
    this._lang = this.SUPPORTED.includes(lang) ? lang : this.DEFAULT_LANG;
    return this._lang;
  },

  // Translate a key using the active language, falling back to Turkish, then the key itself.
  t(key) {
    const active = this.MESSAGES[this._lang] || {};
    if (active[key] != null) return active[key];
    const fallback = this.MESSAGES[this.DEFAULT_LANG] || {};
    return fallback[key] != null ? fallback[key] : key;
  },

  // Load the stored language preference (defaults to Turkish).
  async load() {
    try {
      const r = await chrome.storage.local.get([this.STORAGE_KEY]);
      this.setLang(r[this.STORAGE_KEY] || this.DEFAULT_LANG);
    } catch (e) {
      this.setLang(this.DEFAULT_LANG);
    }
    return this._lang;
  },

  // Persist a new language preference.
  async save(lang) {
    this.setLang(lang);
    try {
      await chrome.storage.local.set({ [this.STORAGE_KEY]: this._lang });
    } catch (e) {
      /* ignore */
    }
    return this._lang;
  },

  // Apply translations to static DOM (popup) via data-i18n* attributes.
  apply(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18N;
} else if (typeof window !== 'undefined') {
  window.I18N = I18N;
}
