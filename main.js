// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Country Regions mapping
const countryRegions = {
    ma: [
        { value: "casablanca", key: "region_ma_casablanca", defaultLabel: "Casablanca-Settat" },
        { value: "rabat", key: "region_ma_rabat", defaultLabel: "Rabat-Salé-Kénitra" },
        { value: "marrakech", key: "region_ma_marrakech", defaultLabel: "Marrakech-Safi" },
        { value: "tangier", key: "region_ma_tangier", defaultLabel: "Tanger-Tétouan-Al Hoceïma" }
    ],
    tr: [
        { value: "istanbul", key: "region_tr_istanbul", defaultLabel: "Marmara (Istanbul)" },
        { value: "ankara", key: "region_tr_ankara", defaultLabel: "Central Anatolia (Ankara)" },
        { value: "izmir", key: "region_tr_izmir", defaultLabel: "Aegean (Izmir)" },
        { value: "antalya", key: "region_tr_antalya", defaultLabel: "Mediterranean (Antalya)" }
    ],
    ae: [
        { value: "dubai", key: "region_ae_dubai", defaultLabel: "Dubai" },
        { value: "abudhabi", key: "region_ae_abudhabi", defaultLabel: "Abu Dhabi" }
    ],
    eg: [
        { value: "cairo", key: "region_eg_cairo", defaultLabel: "Greater Cairo" },
        { value: "alexandria", key: "region_eg_alexandria", defaultLabel: "Alexandria" }
    ],
    sa: [
        { value: "riyadh", key: "region_sa_riyadh", defaultLabel: "Riyadh Region" },
        { value: "makkah", key: "region_sa_makkah", defaultLabel: "Makkah (Jeddah)" }
    ],
    dz: [
        { value: "algiers", key: "region_dz_algiers", defaultLabel: "Algiers" },
        { value: "oran", key: "region_dz_oran", defaultLabel: "Oran" }
    ],
    tn: [
        { value: "tunis", key: "region_tn_tunis", defaultLabel: "Tunis" }
    ]
};

// Form submissions and dynamic sub-search populating
const heroSearchForm = document.getElementById('heroSearchForm');
const ctaForm = document.getElementById('ctaForm');
const heroSuccess = document.getElementById('heroSuccess');
const ctaSuccess = document.getElementById('ctaSuccess');

const searchCountrySelect = document.getElementById('searchCountry');
const regionInputGroup = document.getElementById('regionInputGroup');
const searchRegionSelect = document.getElementById('searchRegion');

if (searchCountrySelect && regionInputGroup && searchRegionSelect) {
    searchCountrySelect.addEventListener('change', () => {
        const country = searchCountrySelect.value;
        const regions = countryRegions[country];
        const lang = localStorage.getItem('sanitizor_lang') || 'en';

        if (regions && regions.length > 0) {
            // Populate regions
            let optionsHtml = `<option value="" disabled selected data-i18n="search_region_placeholder">${translations[lang]['search_region_placeholder'] || 'Select Region'}</option>`;
            regions.forEach(reg => {
                const label = translations[lang][reg.key] || reg.defaultLabel;
                optionsHtml += `<option value="${reg.value}">${label}</option>`;
            });
            searchRegionSelect.innerHTML = optionsHtml;
            searchRegionSelect.required = true;

            // Show group with smooth transition
            regionInputGroup.style.display = 'block';
            setTimeout(() => {
                regionInputGroup.style.opacity = '1';
            }, 50);
        } else {
            // Hide group with smooth transition
            regionInputGroup.style.opacity = '0';
            searchRegionSelect.required = false;
            searchRegionSelect.value = '';
            setTimeout(() => {
                regionInputGroup.style.display = 'none';
            }, 300);
        }
    });
}

if (heroSearchForm && heroSuccess) {
    heroSearchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const specialty = document.getElementById('searchSpecialty').value;
        const country = document.getElementById('searchCountry').value;
        const regionVal = searchRegionSelect ? searchRegionSelect.value : '';
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        
        submitBtn.innerText = '...';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            console.log(`Searching for ${specialty} in ${country}, region: ${regionVal}`);
            
            heroSuccess.classList.add('show');
            setTimeout(() => {
                heroSuccess.classList.remove('show');
                const regionParam = regionVal ? `&region=${regionVal}` : '';
                window.location.href = `recherche.html?specialty=${specialty}&country=${country}${regionParam}`;
            }, 1200);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

if (ctaForm && ctaSuccess) {
    ctaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput.value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        
        submitBtn.innerText = '...';
        submitBtn.disabled = true;

        try {
            // Live Formspree Email Submission Endpoint (Fallback to local mock if no internet)
            const response = await fetch('https://formspree.io/f/xoqzzdov', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            // Save locally for backup
            const waitlist = JSON.parse(localStorage.getItem('sanitizor_waitlist') || '[]');
            if (!waitlist.includes(email)) {
                waitlist.push(email);
                localStorage.setItem('sanitizor_waitlist', JSON.stringify(waitlist));
            }

            ctaSuccess.classList.add('show');
            e.target.reset();

            setTimeout(() => {
                ctaSuccess.classList.remove('show');
            }, 5000);

        } catch (error) {
            console.warn('Offline or endpoint block, falling back to local storage:', error);
            
            // Graceful offline save
            const waitlist = JSON.parse(localStorage.getItem('sanitizor_waitlist') || '[]');
            if (!waitlist.includes(email)) {
                waitlist.push(email);
                localStorage.setItem('sanitizor_waitlist', JSON.stringify(waitlist));
            }
            
            ctaSuccess.classList.add('show');
            e.target.reset();
            setTimeout(() => ctaSuccess.classList.remove('show'), 5000);
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// FAQ Accordion click toggling
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        
        // Optional: Close all other accordions for a clean collapse
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        item.classList.toggle('active');
    });
});

// Scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// I18N (Internationalization)
function setLanguage(lang) {
    localStorage.setItem('sanitizor_lang', lang);
    
    // Set direction and font family for Arabic
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.lang = 'ar';
        document.body.classList.add('rtl-font');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.lang = lang;
        document.body.classList.remove('rtl-font');
    }

    // Translate texts
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // Translate optgroup labels
    document.querySelectorAll('optgroup[data-i18n-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-label');
        if (translations[lang] && translations[lang][key]) {
            element.label = translations[lang][key];
        }
    });

    // Update dynamically populated regions if active
    if (searchCountrySelect && searchCountrySelect.value && searchRegionSelect) {
        const country = searchCountrySelect.value;
        const regions = countryRegions[country];
        const activeRegion = searchRegionSelect.value;
        if (regions && regions.length > 0) {
            let optionsHtml = `<option value="" disabled data-i18n="search_region_placeholder">${translations[lang]['search_region_placeholder'] || 'Select Region'}</option>`;
            regions.forEach(reg => {
                const label = translations[lang][reg.key] || reg.defaultLabel;
                const selected = reg.value === activeRegion ? 'selected' : '';
                optionsHtml += `<option value="${reg.value}" ${selected}>${label}</option>`;
            });
            searchRegionSelect.innerHTML = optionsHtml;
        }
    }
}

// Global emergency contacts, centers, coordinates and pharmacies database
const globalCountriesList = [
    { code: "ma", nameEn: "Morocco", nameFr: "Maroc", nameAr: "المغرب", medical: "150", police: "19", latLng: [31.7917, -7.0926], isRich: true, pharmacy: [
        { name: "Pharmacie du Centre (Casablanca)", hours: "24/7" },
        { name: "Pharmacie de Garde (Rabat)", hours: "20:00 - 08:00" }
    ]},
    { code: "dz", nameEn: "Algeria", nameFr: "Algérie", nameAr: "الجزائر", medical: "115", police: "17", latLng: [28.0339, 1.6596], isRich: true, pharmacy: [
        { name: "Pharmacie Didouche (Alger)", hours: "24/7" }
    ]},
    { code: "tn", nameEn: "Tunisia", nameFr: "Tunisie", nameAr: "تونس", medical: "190", police: "197", latLng: [33.8869, 9.5375], isRich: true, pharmacy: [
        { name: "Pharmacie Avenue Habib Bourguiba", hours: "24/7" }
    ]},
    { code: "ly", nameEn: "Libya", nameFr: "Libye", nameAr: "ليبيا", medical: "193", police: "191", latLng: [26.3351, 17.2283], isRich: true, pharmacy: [
        { name: "Central Tripoli Pharmacy", hours: "24/7" }
    ]},
    { code: "eg", nameEn: "Egypt", nameFr: "Égypte", nameAr: "مصر", medical: "123", police: "122", latLng: [26.8206, 30.8025], isRich: true, pharmacy: [
        { name: "El Ezaby Pharmacy (Cairo)", hours: "24/7" },
        { name: "Seif Pharmacies (Alexandria)", hours: "24/7" }
    ]},
    { code: "sn", nameEn: "Senegal", nameFr: "Sénégal", nameAr: "السنغال", medical: "1515", police: "17", latLng: [14.4974, -14.4524], isRich: true, pharmacy: [
        { name: "Pharmacie de la Nation (Dakar)", hours: "24/7" }
    ]},
    { code: "ci", nameEn: "Ivory Coast", nameFr: "Côte d'Ivoire", nameAr: "ساحل العاج", medical: "185", police: "170", latLng: [7.5399, -5.5471], isRich: true, pharmacy: [
        { name: "Pharmacie du Plateau (Abidjan)", hours: "24/7" }
    ]},
    { code: "cm", nameEn: "Cameroon", nameFr: "Cameroun", nameAr: "الكاميرون", medical: "119", police: "117", latLng: [7.3697, 12.3547], isRich: true, pharmacy: [
        { name: "Pharmacie du Centre (Yaoundé)", hours: "24/7" }
    ]},
    { code: "gh", nameEn: "Ghana", nameFr: "Ghana", nameAr: "غانا", medical: "193", police: "191", latLng: [7.9465, -1.0232], isRich: true, pharmacy: [
        { name: "Kempinski Pharmacy (Accra)", hours: "24/7" }
    ]},
    { code: "et", nameEn: "Ethiopia", nameFr: "Éthiopie", nameAr: "إثيوبيا", medical: "907", police: "991", latLng: [9.1450, 40.4897], isRich: true, pharmacy: [
        { name: "Bole Road Pharmacy (Addis Ababa)", hours: "24/7" }
    ]},
    { code: "rw", nameEn: "Rwanda", nameFr: "Rwanda", nameAr: "رواندا", medical: "112", police: "112", latLng: [-1.9403, 29.8739], isRich: true, pharmacy: [
        { name: "Kigali Heights Pharmacy", hours: "24/7" }
    ]},
    { code: "za", nameEn: "South Africa", nameFr: "Afrique du Sud", nameAr: "جنوب أفريقيا", medical: "10177", police: "10111", latLng: [-30.5595, 22.9375], isRich: true, pharmacy: [
        { name: "Clicks Pharmacy V&A Waterfront", hours: "24/7" }
    ]},
    { code: "ke", nameEn: "Kenya", nameFr: "Kenya", nameAr: "كينيا", medical: "999", police: "999", latLng: [-0.0236, 37.9062], isRich: true, pharmacy: [
        { name: "Portal Pharmacy (Nairobi)", hours: "24/7" }
    ]},
    { code: "ng", nameEn: "Nigeria", nameFr: "Nigéria", nameAr: "نيجيريا", medical: "112", police: "112", latLng: [9.0820, 8.6753], isRich: true, pharmacy: [
        { name: "HealthPlus Pharmacy (Lagos)", hours: "24/7" }
    ]},
    { code: "ae", nameEn: "United Arab Emirates", nameFr: "Émirats Arabes Unis", nameAr: "الإمارات العربية المتحدة", medical: "998", police: "901", latLng: [23.4241, 53.8478], isRich: true, pharmacy: [
        { name: "Aster Pharmacy Dubai Marina", hours: "24/7" },
        { name: "Life Pharmacy Abu Dhabi", hours: "24/7" }
    ]},
    { code: "sa", nameEn: "Saudi Arabia", nameFr: "Arabie Saoudite", nameAr: "المملكة العربية السعودية", medical: "997", police: "999", latLng: [23.8859, 45.0792], isRich: true, pharmacy: [
        { name: "Al Dawaa Pharmacy (Riyadh)", hours: "24/7" },
        { name: "Nahdi Pharmacy (Jeddah)", hours: "24/7" }
    ]},
    { code: "qa", nameEn: "Qatar", nameFr: "Qatar", nameAr: "قطر", medical: "999", police: "999", latLng: [25.3548, 51.1839], isRich: true, pharmacy: [
        { name: "Wellcare Pharmacy (Doha)", hours: "24/7" }
    ]},
    { code: "kw", nameEn: "Kuwait", nameFr: "Koweït", nameAr: "الكويت", medical: "112", police: "112", latLng: [29.3759, 47.9774], isRich: true, pharmacy: [
        { name: "Royal Pharmacy (Kuwait City)", hours: "24/7" }
    ]},
    { code: "om", nameEn: "Oman", nameFr: "Oman", nameAr: "عمان", medical: "9999", police: "9999", latLng: [21.5126, 55.9233], isRich: true, pharmacy: [
        { name: "Muscat Pharmacy", hours: "24/7" }
    ]},
    { code: "bh", nameEn: "Bahrain", nameFr: "Bahreïn", nameAr: "البحرين", medical: "999", police: "999", latLng: [26.0667, 50.5577], isRich: true, pharmacy: [
        { name: "Jaffer Pharmacy (Manama)", hours: "24/7" }
    ]},
    { code: "jo", nameEn: "Jordan", nameFr: "Jordanie", nameAr: "الأردن", medical: "911", police: "911", latLng: [30.5852, 36.2384], isRich: true, pharmacy: [
        { name: "One Pharmacy (Amman)", hours: "24/7" }
    ]},
    { code: "lb", nameEn: "Lebanon", nameFr: "Liban", nameAr: "لبنان", medical: "140", police: "112", latLng: [33.8547, 35.8623], isRich: true, pharmacy: [
        { name: "Mazzen Pharmacy (Beirut)", hours: "24/7" }
    ]},
    { code: "iq", nameEn: "Iraq", nameFr: "Irak", nameAr: "العراق", medical: "122", police: "104", latLng: [33.2232, 43.6793], isRich: true, pharmacy: [
        { name: "Al-Harthiya Pharmacy (Baghdad)", hours: "24/7" }
    ]},
    { code: "ye", nameEn: "Yemen", nameFr: "Yémen", nameAr: "اليمن", medical: "191", police: "199", latLng: [15.5527, 48.5164], isRich: true, pharmacy: [
        { name: "Sanaa Central Pharmacy", hours: "24/7" }
    ]},
    { code: "sy", nameEn: "Syria", nameFr: "Syrie", nameAr: "سوريا", medical: "110", police: "112", latLng: [34.8021, 38.9968], isRich: true, pharmacy: [
        { name: "Al-Sham Pharmacy (Damascus)", hours: "24/7" }
    ]},
    { code: "ps", nameEn: "Palestine", nameFr: "Palestine", nameAr: "فلسطين", medical: "101", police: "100", latLng: [31.9522, 35.2332], isRich: true, pharmacy: [
        { name: "Al-Quds Pharmacy (Ramallah)", hours: "24/7" }
    ]},
    { code: "tr", nameEn: "Turkey", nameFr: "Turquie", nameAr: "تركيا", medical: "112", police: "155", latLng: [38.9637, 35.2433], isRich: true, pharmacy: [
        { name: "Istanbul Nöbetçi Eczane", hours: "24/7" },
        { name: "Ankara Merkez Eczanesi", hours: "24/7" }
    ]},
    
    // Europe Fallbacks
    { code: "fr", nameEn: "France", nameFr: "France", nameAr: "فرنسا", medical: "15", police: "17", latLng: [46.2276, 2.2137], pharmacy: [
        { name: "Pharmacie de la Mairie (Paris)", hours: "24/7" }
    ]},
    { code: "de", nameEn: "Germany", nameFr: "Allemagne", nameAr: "ألمانيا", medical: "112", police: "110", latLng: [51.1657, 10.4515], pharmacy: [
        { name: "Hauptbahnhof Apotheke (Berlin)", hours: "24/7" }
    ]},
    { code: "gb", nameEn: "United Kingdom", nameFr: "Royaume-Uni", nameAr: "المملكة المتحدة", medical: "999", police: "999", latLng: [55.3781, -3.4360], pharmacy: [
        { name: "Boots Pharmacy Piccadilly (London)", hours: "24/7" }
    ]},
    { code: "it", nameEn: "Italy", nameFr: "Italie", nameAr: "إيطاليا", medical: "118", police: "113", latLng: [41.8719, 12.5674], pharmacy: [
        { name: "Farmacia Centrale (Rome)", hours: "24/7" }
    ]},
    { code: "es", nameEn: "Spain", nameFr: "Espagne", nameAr: "إspagne", medical: "112", police: "112", latLng: [40.4637, -3.7492], pharmacy: [
        { name: "Farmacia 24 Horas (Madrid)", hours: "24/7" }
    ]},
    
    // Americas
    { code: "us", nameEn: "United States", nameFr: "États-Unis", nameAr: "الولايات المتحدة الأمريكية", medical: "911", police: "911", latLng: [37.0902, -95.7129], pharmacy: [
        { name: "CVS Pharmacy Times Square (NY)", hours: "24/7" }
    ]},
    { code: "ca", nameEn: "Canada", nameFr: "Canada", nameAr: "كندا", medical: "911", police: "911", latLng: [56.1304, -106.3468], pharmacy: [
        { name: "Shoppers Drug Mart (Toronto)", hours: "24/7" }
    ]},
    { code: "mx", nameEn: "Mexico", nameFr: "Mexique", nameAr: "المكسيك", medical: "911", police: "911", latLng: [23.6345, -102.5528], pharmacy: [
        { name: "Farmacias del Ahorro (CDMX)", hours: "24/7" }
    ]},
    { code: "br", nameEn: "Brazil", nameFr: "Brésil", nameAr: "البرازيل", medical: "192", police: "190", latLng: [-14.2350, -51.9253], pharmacy: [
        { name: "Drogaria São Paulo (Rio)", hours: "24/7" }
    ]},
    
    // Asia & Oceania
    { code: "jp", nameEn: "Japan", nameFr: "Japon", nameAr: "اليابان", medical: "119", police: "110", latLng: [36.2048, 138.2529], pharmacy: [
        { name: "Matsumoto Kiyoshi Shibuya (Tokyo)", hours: "24/7" }
    ]},
    { code: "cn", nameEn: "China", nameFr: "Chine", nameAr: "الصين", medical: "120", police: "110", latLng: [35.8617, 104.1954], pharmacy: [
        { name: "Tong Ren Tang Pharmacy (Beijing)", hours: "24/7" }
    ]},
    { code: "in", nameEn: "India", nameFr: "Inde", nameAr: "الهند", medical: "112", police: "112", latLng: [20.5937, 78.9629], pharmacy: [
        { name: "Apollo Pharmacy 24/7 (Mumbai)", hours: "24/7" }
    ]},
    { code: "au", nameEn: "Australia", nameFr: "Australie", nameAr: "أستراليا", medical: "000", police: "000", latLng: [-25.2744, 133.7751], pharmacy: [
        { name: "Chemist Warehouse (Sydney)", hours: "24/7" }
    ]}
];

let map;
let clinicMarkers = {};

const partnerClinics = [
    { id: 1, name: "Hopital Privé de Casablanca", coords: [33.5731, -7.5898], desc: "Accredited Cardiology & Orthopedic Center", country: "ma" },
    { id: 2, name: "Clinique de Spécialités Rabat", coords: [34.0209, -6.8416], desc: "Advanced Gynecology & Pediatrics", country: "ma" },
    { id: 3, name: "Memorial Hospital Istanbul", coords: [41.0082, 28.9784], desc: "International Hair Transplant & Oncology Hub", country: "tr" },
    { id: 4, name: "Ankara Medicana Hospital", coords: [39.9334, 32.8597], desc: "State-of-the-art Cardiology Center", country: "tr" },
    { id: 5, name: "Dubai Healthcare City Center", coords: [25.2048, 55.2708], desc: "Premium Multidisciplinary Medical Clinic", country: "ae" },
    { id: 6, name: "Abu Dhabi Cleveland Clinic", coords: [24.4539, 54.3773], desc: "World-class Neurological & Eye Clinic", country: "ae" },
    { id: 7, name: "Hôpital de Spécialités Alger", coords: [36.7538, 3.0588], desc: "Emergency Care & Surgery Center", country: "dz" },
    { id: 8, name: "Clinique Pasteur Tunis", coords: [36.8065, 10.1815], desc: "Leading Cardiovascular Clinic", country: "tn" },
    { id: 9, name: "Cairo Medical Center", coords: [30.0444, 31.2357], desc: "24/7 Multi-specialty Trauma & Emergency", country: "eg" }
];

function populateEmergency(countryCode) {
    const country = globalCountriesList.find(c => c.code === countryCode);
    const hotlineBox = document.getElementById('emergHotlineBox');
    const partnersBox = document.getElementById('emergPartnersBox');
    const clinicsBox = document.getElementById('emergClinicsBox');
    const lang = localStorage.getItem('sanitizor_lang') || 'en';

    if (!hotlineBox || !partnersBox || !country) return;

    const labelMedical = lang === 'fr' ? 'Ambulance / Médical' : (lang === 'ar' ? 'الإسعاف / طبي' : 'Ambulance / Medical');
    const labelPolice = lang === 'fr' ? 'Police Secours' : (lang === 'ar' ? 'الشرطة' : 'Police Emergency');
    const copyLabel = lang === 'fr' ? 'Copié !' : (lang === 'ar' ? 'تم النسخ!' : 'Copied!');

    hotlineBox.innerHTML = `
        <div class="emerg-phone" onclick="handleEmergencyCall('${country.medical}', this)" style="cursor: pointer;" title="Click to copy & dial">
            <span>🚨 ${labelMedical}</span>
            <span style="display: flex; align-items: center;">
                <strong>${country.medical}</strong>
                <span class="copy-toast">${copyLabel}</span>
            </span>
        </div>
        <div class="emerg-phone" onclick="handleEmergencyCall('${country.police}', this)" style="cursor: pointer; color: var(--primary);" title="Click to copy & dial">
            <span>🚓 ${labelPolice}</span>
            <span style="display: flex; align-items: center;">
                <strong>${country.police}</strong>
                <span class="copy-toast">${copyLabel}</span>
            </span>
        </div>
    `;

    const labelPharm = lang === 'fr' ? 'Pharmacies de Garde' : (lang === 'ar' ? 'الصيدليات المناوبة' : 'Pharmacies of Guard');
    let pharmHtml = `<h4>🟢 ${labelPharm}</h4>`;
    if (country.pharmacy && country.pharmacy.length > 0) {
        country.pharmacy.forEach(ph => {
            pharmHtml += `
                <div class="emerg-pharmacy">
                    <strong>${ph.name}</strong>
                    <span>${ph.hours}</span>
                </div>
            `;
        });
    } else {
        const noPharmLabel = lang === 'fr' ? 'Consulter les services locaux' : (lang === 'ar' ? 'يرجى مراجعة الخدمات المحلية' : 'Consult local medical desk');
        pharmHtml += `<p style="font-size: 13px; color: var(--text-secondary); margin: 0; padding-top: 4px;">${noPharmLabel}</p>`;
    }
    partnersBox.innerHTML = pharmHtml;

    // Populates Partner Clinics Directory List
    if (clinicsBox) {
        const labelClinics = lang === 'fr' ? 'Cliniques Partenaires' : (lang === 'ar' ? 'المراكز الطبية المعتمدة' : 'Verified Partners');
        const goLabel = lang === 'fr' ? 'Voir' : (lang === 'ar' ? 'عرض' : 'View');
        let clinicsHtml = `<h4>🏥 ${labelClinics}</h4>`;
        
        const filteredClinics = partnerClinics.filter(c => c.country === countryCode);
        if (filteredClinics.length > 0) {
            filteredClinics.forEach(c => {
                clinicsHtml += `
                    <div class="emerg-clinic-item" onclick="focusClinic(${c.id})">
                        <div class="emerg-clinic-info">
                            <h5>${c.name}</h5>
                            <p>${c.desc}</p>
                        </div>
                        <span class="emerg-clinic-go">${goLabel} →</span>
                    </div>
                `;
            });
        } else {
            const noClinicsLabel = lang === 'fr' ? 'Aucun partenaire enregistré' : (lang === 'ar' ? 'لا يوجد مراكز مسجلة' : 'No partner clinic listed');
            clinicsHtml += `<p style="font-size: 13px; color: var(--text-secondary);">${noClinicsLabel}</p>`;
        }
        clinicsBox.innerHTML = clinicsHtml;
    }
}

function populateEmergencyFallback(customName) {
    const hotlineBox = document.getElementById('emergHotlineBox');
    const partnersBox = document.getElementById('emergPartnersBox');
    const clinicsBox = document.getElementById('emergClinicsBox');
    const lang = localStorage.getItem('sanitizor_lang') || 'en';

    if (!hotlineBox || !partnersBox) return;

    const labelMedical = lang === 'fr' ? 'Ambulance / Médical' : (lang === 'ar' ? 'الإسعاف / طبي' : 'Ambulance / Medical');
    const labelPolice = lang === 'fr' ? 'Police Secours' : (lang === 'ar' ? 'الشرطة' : 'Police Emergency');
    const copyLabel = lang === 'fr' ? 'Copié !' : (lang === 'ar' ? 'تم النسخ!' : 'Copied!');

    hotlineBox.innerHTML = `
        <div class="emerg-phone" onclick="handleEmergencyCall('112', this)" style="cursor: pointer;" title="Click to copy & dial">
            <span>🚨 ${labelMedical}</span>
            <span style="display: flex; align-items: center;">
                <strong>112 / 911</strong>
                <span class="copy-toast">${copyLabel}</span>
            </span>
        </div>
        <div class="emerg-phone" onclick="handleEmergencyCall('911', this)" style="cursor: pointer; color: var(--primary);" title="Click to copy & dial">
            <span>🚓 ${labelPolice}</span>
            <span style="display: flex; align-items: center;">
                <strong>911 / 112</strong>
                <span class="copy-toast">${copyLabel}</span>
            </span>
        </div>
    `;

    const labelPharm = lang === 'fr' ? 'Pharmacies de Garde' : (lang === 'ar' ? 'الصيدليات المناوبة' : 'Pharmacies of Guard');
    const pharmDesc = lang === 'fr' ? 'Veuillez composer le 112 pour localiser la pharmacie ouverte la plus proche.' : (lang === 'ar' ? 'يرجى الاتصال بالرقم 112 لتحديد أقرب صيدلية مفتوحة.' : 'Please dial 112 to locate the nearest open guard pharmacy.');
    partnersBox.innerHTML = `
        <h4>🟢 ${labelPharm}</h4>
        <p style="font-size: 13px; color: var(--text-secondary); margin: 0; padding-top: 4px;">${pharmDesc}</p>
    `;

    if (clinicsBox) {
        const labelClinics = lang === 'fr' ? 'Cliniques Partenaires' : (lang === 'ar' ? 'المراكز الطبية المعتمدة' : 'Verified Partners');
        const noClinicsLabel = lang === 'fr' ? 'Aucun partenaire enregistré' : (lang === 'ar' ? 'لا يوجد مراكز مسجلة' : 'No partner clinic listed');
        clinicsBox.innerHTML = `
            <h4>🏥 ${labelClinics}</h4>
            <p style="font-size: 13px; color: var(--text-secondary);">${noClinicsLabel}</p>
        `;
    }

    if (map) {
        map.flyTo([20, 0], 2, {
            animate: true,
            duration: 2.0
        });
    }
}

// Global copy to clipboard and dial trigger
window.handleEmergencyCall = function(number, element) {
    navigator.clipboard.writeText(number).catch(err => console.error("Clipboard copy failed:", err));
    const toast = element.querySelector('.copy-toast');
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
    setTimeout(() => {
        window.location.href = `tel:${number}`;
    }, 400);
};

// Global clinic marker focus and zoom trigger
window.focusClinic = function(clinicId) {
    const clinic = partnerClinics.find(c => c.id === clinicId);
    const marker = clinicMarkers[clinicId];
    if (clinic && map) {
        map.flyTo(clinic.coords, 14, {
            animate: true,
            duration: 1.5
        });
        if (marker) {
            setTimeout(() => {
                marker.openPopup();
            }, 1500); // Wait for flight translation
        }
    }
};

// Global selection trigger for suggestion list
window.selectEmergencyCountry = function(code, name) {
    const searchInput = document.getElementById('emergSearchInput');
    const suggestionsBox = document.getElementById('emergSearchSuggestions');
    if (searchInput) searchInput.value = name;
    if (suggestionsBox) suggestionsBox.classList.remove('active');

    if (code === 'global') {
        populateEmergencyFallback(name);
    } else {
        populateEmergency(code);
        const country = globalCountriesList.find(c => c.code === code);
        if (country && map) {
            map.flyTo(country.latLng, 6, {
                animate: true,
                duration: 1.5
            });
        }
    }
};

// Initialize language and Leaflet map
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('sanitizor_lang') || 'en';
    const langSwitcher = document.getElementById('langSwitcher');
    
    if (langSwitcher) {
        langSwitcher.value = savedLang;
        langSwitcher.addEventListener('change', (e) => {
            setLanguage(e.target.value);
            // Re-sync emergency placeholder and current search result
            const searchInput = document.getElementById('emergSearchInput');
            if (searchInput && searchInput.value) {
                const query = searchInput.value.toLowerCase().trim();
                const matched = globalCountriesList.find(c => 
                    c.nameEn.toLowerCase() === query || 
                    c.nameFr.toLowerCase() === query || 
                    c.nameAr.toLowerCase() === query
                );
                if (matched) {
                    populateEmergency(matched.code);
                    searchInput.value = e.target.value === 'fr' ? matched.nameFr : (e.target.value === 'ar' ? matched.nameAr : matched.nameEn);
                }
            }
        });
    }
    
    setLanguage(savedLang);

    // Leaflet Map Initializer
    if (typeof L !== 'undefined' && document.getElementById('sanitizorMap')) {
        map = L.map('sanitizorMap', {
            scrollWheelZoom: false
        }).setView([31.7917, -7.0926], 5); // Default zoom centered on Morocco/North Africa

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        // Custom pulsing Leaflet HTML Marker Icon
        const pulsingIcon = L.divIcon({
            className: 'custom-pulsing-icon',
            html: '<div class="pulse-marker-halo"></div><div class="pulse-marker-core"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Define partner clinics pins and save markers in global object
        partnerClinics.forEach(clinic => {
            const marker = L.marker(clinic.coords, { icon: pulsingIcon }).addTo(map);
            marker.bindPopup(`<h4>${clinic.name}</h4><p>${clinic.desc}</p>`);
            clinicMarkers[clinic.id] = marker;
        });

        // Setup emergency dispatch autocomplete search input
        const searchInput = document.getElementById('emergSearchInput');
        const suggestionsBox = document.getElementById('emergSearchSuggestions');
        if (searchInput && suggestionsBox) {
            const defaultCountry = globalCountriesList.find(c => c.code === 'ma');
            const countryName = savedLang === 'fr' ? defaultCountry.nameFr : (savedLang === 'ar' ? defaultCountry.nameAr : defaultCountry.nameEn);
            searchInput.value = countryName;
            populateEmergency('ma');

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                const currentLang = localStorage.getItem('sanitizor_lang') || 'en';
                
                if (!query) {
                    suggestionsBox.classList.remove('active');
                    return;
                }

                const filtered = globalCountriesList.filter(c => 
                    c.nameEn.toLowerCase().includes(query) || 
                    c.nameFr.toLowerCase().includes(query) || 
                    c.nameAr.toLowerCase().includes(query) ||
                    c.code.toLowerCase().includes(query)
                );

                if (filtered.length > 0) {
                    let suggestionsHtml = '';
                    filtered.forEach(c => {
                        const name = currentLang === 'fr' ? c.nameFr : (currentLang === 'ar' ? c.nameAr : c.nameEn);
                        suggestionsHtml += `
                            <div class="suggestion-item" onclick="selectEmergencyCountry('${c.code}', '${name.replace(/'/g, "\\'")}')">
                                📍 ${name} (${c.code.toUpperCase()})
                            </div>
                        `;
                    });
                    suggestionsBox.innerHTML = suggestionsHtml;
                    suggestionsBox.classList.add('active');
                } else {
                    const globalLabel = currentLang === 'fr' ? 'Numéros d\'urgence Internationaux' : (currentLang === 'ar' ? 'طوارئ دولية' : 'International Emergency Numbers');
                    suggestionsBox.innerHTML = `
                        <div class="suggestion-item" onclick="selectEmergencyCountry('global', '${query.replace(/'/g, "\\'")}')">
                            🌍 ${query} (${globalLabel})
                        </div>
                    `;
                    suggestionsBox.classList.add('active');
                }
            });

            // Close suggestions on clicking outside
            document.addEventListener('click', (e) => {
                if (e.target !== searchInput && e.target !== suggestionsBox) {
                    suggestionsBox.classList.remove('active');
                }
            });
        }
    }
});
