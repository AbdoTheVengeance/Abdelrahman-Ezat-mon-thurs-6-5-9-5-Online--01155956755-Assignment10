document.addEventListener('DOMContentLoaded', function() {
    // Active link in Navbar on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    function activateNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) { // Adjust offset as needed
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Call on load to set initial active link

    // Mobile Navbar Toggle (if applicable based on CSS)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
            this.classList.toggle('active');
        });

        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinksContainer.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }


    // Dark and Light Theme Switch functionality
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const htmlElement = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            themeToggleButton.setAttribute('aria-pressed', 'true');
        } else {
            htmlElement.classList.remove('dark');
            themeToggleButton.setAttribute('aria-pressed', 'false');
        }
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Default to system preference if no theme is saved
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    themeToggleButton.addEventListener('click', function() {
        if (htmlElement.classList.contains('dark')) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Portfolio Section Navs & Tabs
    const portfolioFilters = document.querySelectorAll('#portfolio-filters .portfolio-filter');
    const portfolioItems = document.querySelectorAll('#portfolio-grid .portfolio-item');

    portfolioFilters.forEach(filterButton => {
        filterButton.addEventListener('click', function() {
            // Remove active class from all buttons
            portfolioFilters.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
                btn.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border', 'border-slate-300', 'dark:border-slate-700');
                btn.classList.remove('bg-linear-to-r', 'from-primary', 'to-secondary', 'text-white', 'hover:shadow-lg', 'hover:shadow-primary/50');
            });

            // Add active class to the clicked button
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            this.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border', 'border-slate-300', 'dark:border-slate-700');
            this.classList.add('bg-linear-to-r', 'from-primary', 'to-secondary', 'text-white', 'hover:shadow-lg', 'hover:shadow-primary/50');


            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block'; // Or your desired display style
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Testimonials Carousel
    const carousel = document.getElementById('testimonials-carousel');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    const indicatorsContainer = document.querySelector('.flex.justify-center.gap-3.mb-12');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    function getItemsPerPage() {
        if (window.innerWidth >= 1024) { // lg breakpoint
            return 3;
        } else if (window.innerWidth >= 640) { // sm breakpoint
            return 2;
        } else { // xs
            return 1;
        }
    }

    function updateCarousel() {
        const itemsPerPage = getItemsPerPage();
        const totalItems = testimonialCards.length;
        const maxIndex = Math.ceil(totalItems / itemsPerPage) - 1;

        if (currentIndex < 0) {
            currentIndex = maxIndex;
        } else if (currentIndex > maxIndex) {
            currentIndex = 0;
        }

        const translateXValue = -currentIndex * (100 / itemsPerPage);
        carousel.style.transform = `translateX(${translateXValue}%)`;

        // Update indicators
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            indicator.classList.remove('bg-accent', 'dark:bg-accent'); // Remove previous active style
            indicator.classList.add('bg-slate-400', 'dark:bg-slate-600'); // Add default style
            indicator.setAttribute('aria-selected', 'false');

            if (index === currentIndex) {
                indicator.classList.add('bg-accent', 'dark:bg-accent'); // Add active style
                indicator.classList.remove('bg-slate-400', 'dark:bg-slate-600');
                indicator.setAttribute('aria-selected', 'true');
            }
        });
    }

    // Create indicators dynamically if not already in HTML (or just manage existing ones)
    if (indicatorsContainer && indicatorsContainer.children.length === 0) {
        const itemsPerPage = getItemsPerPage();
        const totalIndicators = Math.ceil(testimonialCards.length / itemsPerPage);
        for (let i = 0; i < totalIndicators; i++) {
            const indicator = document.createElement('button');
            indicator.classList.add('carousel-indicator', 'w-3', 'h-3', 'rounded-full', 'bg-slate-400', 'dark:bg-slate-600', 'transition-all', 'duration-300', 'hover:scale-125', 'cursor-pointer');
            indicator.setAttribute('data-index', i);
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-label', `التوصية ${i + 1}`);
            indicator.setAttribute('type', 'button');
            indicatorsContainer.appendChild(indicator);

            indicator.addEventListener('click', function() {
                currentIndex = parseInt(this.getAttribute('data-index'));
                updateCarousel();
            });
        }
    }


    prevButton.addEventListener('click', function() {
        currentIndex--;
        updateCarousel();
    });

    nextButton.addEventListener('click', function() {
        currentIndex++;
        updateCarousel();
    });

    // Handle window resize for carousel responsiveness
    window.addEventListener('resize', function() {
        updateCarousel();
    });

    updateCarousel(); // Initialize carousel on load


    // Sidebar for Customization (Gear Icon)
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsSidebar = document.getElementById('settings-sidebar');
    const closeSettings = document.getElementById('close-settings');
    const fontOptions = document.querySelectorAll('.font-option');
    const themeColorsGrid = document.getElementById('theme-colors-grid');
    const resetSettingsButton = document.getElementById('reset-settings');

    function toggleSidebar() {
        if (settingsSidebar.classList.contains('translate-x-full')) {
            settingsSidebar.classList.remove('translate-x-full');
            settingsSidebar.setAttribute('aria-hidden', 'false');
            settingsToggle.setAttribute('aria-expanded', 'true');
        } else {
            settingsSidebar.classList.add('translate-x-full');
            settingsSidebar.setAttribute('aria-hidden', 'true');
            settingsToggle.setAttribute('aria-expanded', 'false');
        }
    }

    settingsToggle.addEventListener('click', toggleSidebar);
    closeSettings.addEventListener('click', toggleSidebar);

    // Font Customization
    const defaultFont = 'tajawal';

    function applyFont(fontName) {
        document.body.classList.remove('font-alexandria', 'font-tajawal', 'font-cairo');
        document.body.classList.add(`font-${fontName}`);
        fontOptions.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-checked', 'false');
            if (btn.getAttribute('data-font') === fontName) {
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
            }
        });
    }

    // Load saved font from localStorage
    const savedFont = localStorage.getItem('font');
    if (savedFont) {
        applyFont(savedFont);
    } else {
        applyFont(defaultFont);
    }

    fontOptions.forEach(button => {
        button.addEventListener('click', function() {
            const selectedFont = this.getAttribute('data-font');
            applyFont(selectedFont);
            localStorage.setItem('font', selectedFont);
        });
    });

    // Color Customization
    const themeColors = [{
        name: 'Default',
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899'
    }, {
        name: 'Cyan',
        primary: '#06b6d4',
        secondary: '#22d3ee',
        accent: '#67e8f9'
    }, {
        name: 'Green',
        primary: '#22c55e',
        secondary: '#4ade80',
        accent: '#86efad'
    }, {
        name: 'Orange',
        primary: '#f97316',
        secondary: '#fb923c',
        accent: '#fdba74'
    }, {
        name: 'Rose',
        primary: '#e11d48',
        secondary: '#f43f5e',
        accent: '#fda4af'
    }, {
        name: 'Indigo',
        primary: '#4f46e5',
        secondary: '#6366f1',
        accent: '#818cf8'
    }, {
        name: 'Teal',
        primary: '#14b8a6',
        secondary: '#2dd4bf',
        accent: '#5eead4'
    }, {
        name: 'Purple',
        primary: '#a855f7',
        secondary: '#c084fc',
        accent: '#d8b4fe'
    }, ];


    function applyColors(primary, secondary, accent) {
        document.documentElement.style.setProperty('--color-primary', primary);
        document.documentElement.style.setProperty('--color-secondary', secondary);
        document.documentElement.style.setProperty('--color-accent', accent);

        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-primary') === primary) {
                option.classList.add('active');
            }
        });
    }

    // Populate theme colors grid
    themeColors.forEach(color => {
        const colorOption = document.createElement('button');
        colorOption.classList.add('color-option', 'w-12', 'h-12', 'rounded-full', 'border-2', 'border-transparent', 'hover:border-slate-400', 'transition-all', 'duration-300');
        colorOption.style.backgroundColor = color.primary; // Use primary color for display
        colorOption.setAttribute('data-primary', color.primary);
        colorOption.setAttribute('data-secondary', color.secondary);
        colorOption.setAttribute('data-accent', color.accent);
        colorOption.setAttribute('aria-label', `Theme color ${color.name}`);
        colorOption.setAttribute('type', 'button');

        colorOption.addEventListener('click', function() {
            const selectedPrimary = this.getAttribute('data-primary');
            const selectedSecondary = this.getAttribute('data-secondary');
            const selectedAccent = this.getAttribute('data-accent');
            applyColors(selectedPrimary, selectedSecondary, selectedAccent);
            localStorage.setItem('primaryColor', selectedPrimary);
            localStorage.setItem('secondaryColor', selectedSecondary);
            localStorage.setItem('accentColor', selectedAccent);
        });

        themeColorsGrid.appendChild(colorOption);
    });

    // Load saved colors from localStorage
    const savedPrimary = localStorage.getItem('primaryColor');
    const savedSecondary = localStorage.getItem('secondaryColor');
    const savedAccent = localStorage.getItem('accentColor');

    if (savedPrimary && savedSecondary && savedAccent) {
        applyColors(savedPrimary, savedSecondary, savedAccent);
    } else {
        // Apply default colors if none saved
        applyColors(themeColors[0].primary, themeColors[0].secondary, themeColors[0].accent);
    }


    // Reset Settings
    resetSettingsButton.addEventListener('click', function() {
        localStorage.removeItem('theme');
        localStorage.removeItem('font');
        localStorage.removeItem('primaryColor');
        localStorage.removeItem('secondaryColor');
        localStorage.removeItem('accentColor');

        // Reapply defaults
        applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyFont(defaultFont);
        applyColors(themeColors[0].primary, themeColors[0].secondary, themeColors[0].accent);
    });


    // Scroll to Top Button
    const scrollToTopButton = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) { // Show button after scrolling 300px
            scrollToTopButton.classList.remove('opacity-0', 'invisible');
            scrollToTopButton.classList.add('opacity-100', 'visible');
        } else {
            scrollToTopButton.classList.add('opacity-0', 'invisible');
            scrollToTopButton.classList.remove('opacity-100', 'visible');
        }
    });

    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Custom Select (for Project Type and Budget)
    document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
        const select = wrapper.querySelector('.custom-select');
        const optionsContainer = wrapper.querySelector('.custom-options');
        const selectedText = select.querySelector('.selected-text');
        const chevronIcon = select.querySelector('.fa-chevron-down');

        select.addEventListener('click', function() {
            optionsContainer.classList.toggle('hidden');
            select.setAttribute('aria-expanded', optionsContainer.classList.contains('hidden') ? 'false' : 'true');
            chevronIcon.classList.toggle('rotate-180');
        });

        optionsContainer.querySelectorAll('.custom-option').forEach(option => {
            option.addEventListener('click', function() {
                selectedText.textContent = this.textContent;
                optionsContainer.classList.add('hidden');
                select.setAttribute('aria-expanded', 'false');
                chevronIcon.classList.remove('rotate-180');
                // You might want to update a hidden input field here if this was a real form select
            });
        });

        // Close when clicking outside
        document.addEventListener('click', function(event) {
            if (!wrapper.contains(event.target)) {
                optionsContainer.classList.add('hidden');
                select.setAttribute('aria-expanded', 'false');
                chevronIcon.classList.remove('rotate-180');
            }
        });

        // Keyboard navigation for accessibility
        select.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                select.click();
            } else if (event.key === 'ArrowDown' && !optionsContainer.classList.contains('hidden')) {
                event.preventDefault();
                const firstOption = optionsContainer.querySelector('.custom-option');
                if (firstOption) firstOption.focus();
            }
        });

        optionsContainer.querySelectorAll('.custom-option').forEach((option, index, allOptions) => {
            option.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    option.click();
                    select.focus();
                } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    if (index < allOptions.length - 1) {
                        allOptions[index + 1].focus();
                    } else {
                        allOptions[0].focus(); // Loop back to first
                    }
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    if (index > 0) {
                        allOptions[index - 1].focus();
                    } else {
                        allOptions[allOptions.length - 1].focus(); // Loop to last
                    }
                } else if (event.key === 'Escape') {
                    event.preventDefault();
                    optionsContainer.classList.add('hidden');
                    select.setAttribute('aria-expanded', 'false');
                    chevronIcon.classList.remove('rotate-180');
                    select.focus();
                }
            });
        });
    });

});
