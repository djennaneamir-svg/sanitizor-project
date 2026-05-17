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

// Regional emergency contacts and pharmacies of guard databases
const regionalEmergencies = {
    ma: {
        medical: "150",
        police: "19",
        pharmacy: [
            { name: "Pharmacie du Centre (Casablanca)", hours: "24/7" },
            { name: "Pharmacie de Garde (Rabat)", hours: "20:00 - 08:00" }
        ]
    },
    tr: {
        medical: "112",
        police: "155",
        pharmacy: [
            { name: "Istanbul Nöbetçi Eczane", hours: "24/7" },
            { name: "Ankara Merkez Eczanesi", hours: "24/7" }
        ]
    },
    ae: {
        medical: "998",
        police: "901",
        pharmacy: [
            { name: "Aster Pharmacy Dubai Marina", hours: "24/7" },
            { name: "Life Pharmacy Abu Dhabi", hours: "24/7" }
        ]
    },
    dz: {
        medical: "115",
        police: "17",
        pharmacy: [
            { name: "Pharmacie Didouche (Alger)", hours: "24/7" }
        ]
    },
    tn: {
        medical: "190",
        police: "197",
        pharmacy: [
            { name: "Pharmacie Avenue Habib Bourguiba", hours: "24/7" }
        ]
    },
    eg: {
        medical: "123",
        police: "122",
        pharmacy: [
            { name: "El Ezaby Pharmacy (Cairo)", hours: "24/7" },
            { name: "Seif Pharmacies (Alexandria)", hours: "24/7" }
        ]
    }
};

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

function populateEmergency(country) {
    const emergData = regionalEmergencies[country];
    const hotlineBox = document.getElementById('emergHotlineBox');
    const partnersBox = document.getElementById('emergPartnersBox');
    const clinicsBox = document.getElementById('emergClinicsBox');
    const lang = localStorage.getItem('sanitizor_lang') || 'en';

    if (!hotlineBox || !partnersBox || !emergData) return;

    const labelMedical = lang === 'fr' ? 'Ambulance / Médical' : (lang === 'ar' ? 'الإسعاف / طبي' : 'Ambulance / Medical');
    const labelPolice = lang === 'fr' ? 'Police Secours' : (lang === 'ar' ? 'الشرطة' : 'Police Emergency');
    const copyLabel = lang === 'fr' ? 'Copié !' : (lang === 'ar' ? 'تم النسخ!' : 'Copied!');

    hotlineBox.innerHTML = `
        <div class="emerg-phone" onclick="handleEmergencyCall('${emergData.medical}', this)" style="cursor: pointer;" title="Click to copy & dial">
            <span>🚨 ${labelMedical}</span>
            <span style="display: flex; align-items: center;">
                <strong>${emergData.medical}</strong>
                <span class="copy-toast">${copyLabel}</span>
            </span>
        </div>
        <div class="emerg-phone" onclick="handleEmergencyCall('${emergData.police}', this)" style="cursor: pointer; color: var(--primary);" title="Click to copy & dial">
            <span>🚓 ${labelPolice}</span>
            <span style="display: flex; align-items: center;">
                <strong>${emergData.police}</strong>
                <span class="copy-toast">${copyLabel}</span>
            </span>
        </div>
    `;

    const labelPharm = lang === 'fr' ? 'Pharmacies de Garde' : (lang === 'ar' ? 'الصيدليات المناوبة' : 'Pharmacies of Guard');
    let pharmHtml = `<h4>🟢 ${labelPharm}</h4>`;
    emergData.pharmacy.forEach(ph => {
        pharmHtml += `
            <div class="emerg-pharmacy">
                <strong>${ph.name}</strong>
                <span>${ph.hours}</span>
            </div>
        `;
    });
    partnersBox.innerHTML = pharmHtml;

    // Populates Partner Clinics Directory List
    if (clinicsBox) {
        const labelClinics = lang === 'fr' ? 'Cliniques Partenaires' : (lang === 'ar' ? 'المراكز الطبية المعتمدة' : 'Verified Partners');
        const goLabel = lang === 'fr' ? 'Voir' : (lang === 'ar' ? 'عرض' : 'View');
        let clinicsHtml = `<h4>🏥 ${labelClinics}</h4>`;
        
        const filteredClinics = partnerClinics.filter(c => c.country === country);
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

// Initialize language and Leaflet map
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('sanitizor_lang') || 'en';
    const langSwitcher = document.getElementById('langSwitcher');
    
    if (langSwitcher) {
        langSwitcher.value = savedLang;
        langSwitcher.addEventListener('change', (e) => {
            setLanguage(e.target.value);
            // Re-render emergency translations
            const emergCountrySelect = document.getElementById('emergCountrySelect');
            if (emergCountrySelect) {
                populateEmergency(emergCountrySelect.value);
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

        // Setup emergency dispatch selector
        const emergCountrySelect = document.getElementById('emergCountrySelect');
        if (emergCountrySelect) {
            populateEmergency('ma');

            emergCountrySelect.addEventListener('change', (e) => {
                const country = e.target.value;
                populateEmergency(country);
                
                // Fly to target country on map selection
                const coordinates = {
                    ma: [31.7917, -7.0926],
                    tr: [38.9637, 35.2433],
                    ae: [23.4241, 53.8478],
                    dz: [28.0339, 1.6596],
                    tn: [33.8869, 9.5375],
                    eg: [26.8206, 30.8025]
                };

                if (coordinates[country]) {
                    map.flyTo(coordinates[country], 6, {
                        animate: true,
                        duration: 1.5
                    });
                }
            });
        }
    }
});
