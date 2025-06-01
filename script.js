// Global error handler to catch and handle errors gracefully
window.addEventListener('error', function(event) {
    console.warn('Handled error:', event.error?.message || event.message);
    // Don't show errors to users, just log them
    event.preventDefault();
    return true; // Prevents the error from showing in console
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.warn('Handled promise rejection:', event.reason);
    event.preventDefault(); // Prevent the default behavior
});

// --- Utility Functions ---
function showMessage(message, isError = false) {
    // Create or update message element
    let messageDiv = document.getElementById('form-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'form-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
        `;
        document.body.appendChild(messageDiv);
    }
    
    messageDiv.textContent = message;
    messageDiv.style.backgroundColor = isError ? '#dc3545' : '#28a745';
    messageDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (messageDiv && messageDiv.style) {
            messageDiv.style.display = 'none';
        }
    }, 5000);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showPaymentForm(itemName, amount, paymentMethod) {
    const modal = document.getElementById('paymentModal');
    if (!modal) {
        console.error('Payment modal not found');
        return;
    }

    // Populate form with item details
    const itemNameField = document.getElementById('itemName');
    const amountField = document.getElementById('amount');
    const paymentMethodField = document.getElementById('paymentMethod');
    const displayAmountField = document.getElementById('displayAmount');
    const selectedPlanField = document.getElementById('selectedPlan');

    if (itemNameField) itemNameField.value = itemName;
    if (amountField) amountField.value = amount;
    if (paymentMethodField) paymentMethodField.value = paymentMethod;
    if (displayAmountField) displayAmountField.textContent = amount;
    if (selectedPlanField) selectedPlanField.textContent = itemName;

    // Show appropriate payment section
    const paypalSection = document.getElementById('paypal-payment-section');
    const interacSection = document.getElementById('interac-payment-section');
    
    if (paypalSection && interacSection) {
        if (paymentMethod === 'paypal') {
            if (paypalSection.style) paypalSection.style.display = 'block';
            if (interacSection.style) interacSection.style.display = 'none';
            
            // Initialize PayPal buttons if not already done
            const paypalContainer = document.getElementById('paypal-button-container');
            if (paypalContainer && !paypalContainer.hasChildNodes()) {
                initializePayPal(amount, itemName);
            }
        } else if (paymentMethod === 'interac') {
            if (paypalSection.style) paypalSection.style.display = 'none';
            if (interacSection.style) interacSection.style.display = 'block';
            
            // Update Interac amount display
            const interacAmountFields = document.querySelectorAll('.interac-amount');
            interacAmountFields.forEach(field => {
                if (field) field.textContent = `CAD $${amount}`;
            });
        }
    }

    if (modal.style) modal.style.display = 'block';

    // Close modal functionality
    const closeButton = modal.querySelector('.close-button');
    if (closeButton) {
        closeButton.onclick = function() {
            if (modal && modal.style) modal.style.display = 'none';
        };
    }

    window.onclick = function(event) {
        if (event.target === modal && modal && modal.style) {
            modal.style.display = 'none';
        }
    };
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal && modal.style) {
        modal.style.display = 'none';
    }
}

// --- The rest of your script.js code (unchanged) ---

document.addEventListener('DOMContentLoaded', function () {
    try {
        // --- Preloader ---
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                if (preloader && preloader.classList) {
                    preloader.classList.add('loaded');
                }
            });
        }

        // --- Mobile Navigation (Burger Menu) ---
        const burger = document.querySelector('.burger');
        const navLinks = document.querySelector('.nav-links');

        if (burger && navLinks) {
            burger.addEventListener('click', () => {
                if (navLinks.classList) navLinks.classList.toggle('nav-active');
                if (burger.classList) burger.classList.toggle('toggle');
            });
        }

        // --- Modal Popup ---
        const modal = document.getElementById('demoModal');
        const demoModalCloseButton = modal ? modal.querySelector('.close-button') : null;
        const modalForm = document.getElementById('modal-form');
        const modalFormMessage = document.getElementById('modal-form-message');
        const yourEmailAddress = 'frenchgta.ca@gmail.com'; // Email for inquiries

        function openModal() {
            if (modal && modal.style) {
                modal.style.display = 'flex';
                const firstInput = modal.querySelector('input');
                if (firstInput && firstInput.focus) {
                    firstInput.focus();
                }
            }
        }

        // setTimeout(openModal, 5000); // Open the modal after 5 seconds

        function closeModal() {
            if (modal && modal.style) {
                modal.style.display = 'none';
            }
        }

        if (demoModalCloseButton) {
            demoModalCloseButton.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                closeModal();
            }
        });

        if (modalForm) {
            modalForm.addEventListener('submit', function (event) {
                event.preventDefault();

                if (!modalFormMessage) {
                    console.error('Modal form message element not found.');
                    return;
                }

                if (!modalForm.checkValidity()) {
                    modalForm.reportValidity();
                    modalFormMessage.textContent = 'Please fill out all required fields.';
                    modalFormMessage.className = 'form-message-error'; // Use a distinct class for errors
                    return;
                }

                const name = modalForm.name.value;
                const email = modalForm.email.value;

                let mailtoSubject = 'Website Inquiry: New Contact';
                let mailtoBody = `New inquiry from the website modal form:\n\n`;
                mailtoBody += `Name: ${name}\n`;
                mailtoBody += `Email: ${email}\n`;
                mailtoBody += `\nPlease respond to this inquiry at your earliest convenience.`;

                const mailtoLink = `mailto:${yourEmailAddress}` +
                                 `?subject=${encodeURIComponent(mailtoSubject)}` +
                                 `&body=${encodeURIComponent(mailtoBody)}`;

                modalFormMessage.innerHTML = 'Thank you! Please <a href="' + mailtoLink + '" target="_blank">click here to send us an email</a> with your details. If your email client does not open, please manually send an email to ' + yourEmailAddress + '.';
                modalFormMessage.className = 'form-message-success';
            });
        }

        // --- Button Click Animation ---
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function () {
                if (this.classList) {
                    this.classList.add('clicked');
                    setTimeout(() => {
                        if (this.classList) this.classList.remove('clicked');
                    }, 800);
                }
            });
        });

        // --- Scroll-Triggered Animations (Intersection Observer) ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target && entry.target.classList) {
                        entry.target.classList.add('is-visible'); // Add a class when in view
                    }
                }
            });
        }, {
            threshold: 0.1 // Element is considered "in view" when 10% is visible
        });

        // Observe elements with the 'animate-on-scroll' class
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        elementsToAnimate.forEach(element => {
            if (element) observer.observe(element);
        });

        // --- Logo Animation (Subtle) ---
        const logo = document.querySelector('.logo a');
        if (logo) {
            logo.addEventListener('mouseover', () => {
                if (logo.classList) logo.classList.add('logo-hover');
            });
            logo.addEventListener('mouseout', () => {
                if (logo.classList) logo.classList.remove('logo-hover');
            });
        }

        // --- Sticky Header Animation with Enhanced Error Handling ---
        let lastScrollTop = 0;
        let headerElement = null;
        let headerAnimationEnabled = true;

        function safeSetTransform(element, transformValue) {
            try {
                if (element && 
                    element.style && 
                    typeof element.style.transform !== 'undefined' &&
                    element.isConnected !== false) {
                    element.style.transform = transformValue;
                    return true;
                }
            } catch (error) {
                console.warn('Transform operation failed:', error);
                headerAnimationEnabled = false;
                return false;
            }
            return false;
        }

        function initHeaderAnimation() {
            try {
                headerElement = document.querySelector('header');
                if (headerElement && headerElement.style && headerAnimationEnabled) {
                    window.addEventListener('scroll', () => {
                        try {
                            // Re-check header element if it's null or disconnected
                            if (!headerElement || 
                                !headerElement.style || 
                                headerElement.isConnected === false) {
                                headerElement = document.querySelector('header');
                                if (!headerElement || !headerElement.style) return;
                            }

                            if (!headerAnimationEnabled) return;

                            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

                            if (currentScroll > lastScrollTop) {
                                // Scrolling Down
                                safeSetTransform(headerElement, 'translateY(-100%)');
                            } else {
                                // Scrolling Up
                                safeSetTransform(headerElement, 'translateY(0)');
                            }
                            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
                        } catch (error) {
                            console.warn('Header scroll animation error:', error);
                            // Disable animation if errors persist
                            headerAnimationEnabled = false;
                            // Try to reset header position
                            headerElement = document.querySelector('header');
                            safeSetTransform(headerElement, 'translateY(0)');
                        }
                    }, { passive: true });
                }
            } catch (error) {
                console.warn('Header animation initialization failed:', error);
                headerAnimationEnabled = false;
            }
        }

        // Initialize header animation
        initHeaderAnimation();

        // Re-initialize after header is loaded
        setTimeout(() => {
            headerAnimationEnabled = true;
            initHeaderAnimation();
        }, 1000);

        // Additional re-initialization after longer delay for slow connections
        setTimeout(() => {
            headerAnimationEnabled = true;
            initHeaderAnimation();
        }, 3000);

        // --- Set current year in footer ---
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }

        // --- Load Header and Footer with better error handling ---
        function loadHTML(url, elementId) {
            const element = document.getElementById(elementId);
            if (!element) {
                console.warn(`Element with id '${elementId}' not found for loading ${url}`);
                return;
            }

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                    // If header is loaded, re-attach nav burger functionality
                    if (elementId === 'header-placeholder') {
                        const burger = element.querySelector('.burger');
                        const navLinks = element.querySelector('.nav-links');
                        if (burger && navLinks) {
                            burger.addEventListener('click', () => {
                                if (navLinks.classList) navLinks.classList.toggle('nav-active');
                                if (burger.classList) burger.classList.toggle('toggle');
                            });
                        }
                        // Re-attach logo animation if needed
                        const logo = element.querySelector('.logo a');
                        if (logo) {
                            logo.addEventListener('mouseover', () => {
                                if (logo.classList) logo.classList.add('logo-hover');
                            });
                            logo.addEventListener('mouseout', () => {
                                if (logo.classList) logo.classList.remove('logo-hover');
                            });
                        }
                        // Re-initialize header animation after loading
                        setTimeout(() => {
                            initHeaderAnimation();
                        }, 100);
                    }
                })
                .catch(error => {
                    console.error(`Error loading HTML from ${url}:`, error);
                    // Fallback content if file doesn't exist
                    if (elementId === 'header-placeholder') {
                        element.innerHTML = `
                            <header>
                                <nav>
                                    <div class="logo">
                                        <a href="index.html">FRENCH.GTA</a>
                                    </div>
                                </nav>
                            </header>
                        `;
                        setTimeout(() => {
                            initHeaderAnimation();
                        }, 100);
                    } else if (elementId === 'footer-placeholder') {
                        element.innerHTML = `
                            <footer>
                                <div class="footer-content">
                                    <p>&copy; <span id="currentYear">${new Date().getFullYear()}</span> FRENCH.GTA. All rights reserved.</p>
                                </div>
                            </footer>
                        `;
                    }
                });
        }

        // Only load if placeholders exist
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');
        
        if (headerPlaceholder) {
            loadHTML('header.html', 'header-placeholder');
        }
        if (footerPlaceholder) {
            loadHTML('footer.html', 'footer-placeholder');
        }

        // --- Payment Form (services.html) Submission Logic ---
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const paymentMethodField = document.getElementById('payment-method');
                
                if (!paymentMethodField) {
                    console.error('Payment method field not found');
                    return;
                }
                
                const paymentMethod = paymentMethodField.value;

                if (paymentMethod === 'interac') {
                    // Validate form
                    if (!paymentForm.checkValidity()) {
                        alert('Please fill in all required fields before proceeding.');
                        return;
                    }
                    alert('Please follow the Interac e-Transfer instructions provided. We will confirm your enrollment once payment is received.');
                    closePaymentModal();
                    paymentForm.reset();
                }
            });
        }

        // --- Function to load testimonials into index.html ---
        function loadTestimonialSnippets() {
            const placeholder = document.getElementById('testimonial-snippet-placeholder');
            if (!placeholder) return;

            fetch('testimonials.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok for testimonials.html');
                    }
                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const allTestimonials = Array.from(doc.querySelectorAll('.testimonial-carousel .testimonial'));
                    
                    if (allTestimonials.length === 0) {
                        placeholder.innerHTML = '<p style="text-align: center;">Could not load testimonials at this time. Please visit our <a href="testimonials.html">testimonials page</a>.</p>';
                        return;
                    }

                    // Shuffle and pick a few (e.g., 3)
                    allTestimonials.sort(() => 0.5 - Math.random());
                    const snippetsToShow = allTestimonials.slice(0, Math.min(3, allTestimonials.length));

                    if (snippetsToShow.length > 0) {
                        placeholder.innerHTML = ''; // Clear loading message
                        const carouselDiv = document.createElement('div');
                        carouselDiv.className = 'testimonial-carousel';
                        snippetsToShow.forEach(snippet => {
                            const clonedSnippet = snippet.cloneNode(true);
                            if (clonedSnippet.style) {
                                clonedSnippet.style.minWidth = '280px';
                                clonedSnippet.style.flex = '1 1 300px';
                                clonedSnippet.style.marginRight = '1rem';
                            }
                            carouselDiv.appendChild(clonedSnippet);
                        });
                        placeholder.appendChild(carouselDiv);
                    } else {
                         placeholder.innerHTML = '<p style="text-align: center;">No testimonials available at the moment. Visit our <a href="testimonials.html">testimonials page</a> later.</p>';
                    }
                })
                .catch(error => {
                    console.error('Failed to load testimonials for index.html:', error);
                    if (placeholder) {
                        placeholder.innerHTML = '<p style="text-align: center;">Error loading testimonials. Please check our <a href="testimonials.html">testimonials page</a> directly.</p>';
                    }
                });
        }

        // Call the function to load snippets if on index.html (or any page with the placeholder)
        if (document.getElementById('testimonial-snippet-placeholder')) {
            loadTestimonialSnippets();
        }

        // --- Contact Form Submission ---
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (event) {
                event.preventDefault();
                
                const formData = new FormData(contactForm);
                
                fetch('submit_contact.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(result => {
                    showMessage('Thank you for your message! We will get back to you soon.', false);
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    showMessage('Sorry, there was an error sending your message. Please try again.', true);
                });
            });
        }

        // --- Demo Booking Form Submission ---
        const demoForm = document.getElementById('demo-form');
        if (demoForm) {
            demoForm.addEventListener('submit', function (event) {
                event.preventDefault();
                
                const formData = new FormData(demoForm);
                
                fetch('submit_demo_booking.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(result => {
                    showMessage('Your demo class has been booked! Check your email for confirmation details.', false);
                    demoForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    showMessage('Sorry, there was an error booking your demo. Please try again.', true);
                });
            });
        }

        // --- Popup Form Submission ---
        const popupForm = document.getElementById('popup-form');
        if (popupForm) {
            popupForm.addEventListener('submit', function (event) {
                event.preventDefault();
                
                const formData = new FormData(popupForm);
                
                fetch('submit_popup_inquiry.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(result => {
                    showMessage('Thank you for your inquiry! We will contact you soon.', false);
                    closeModal();
                    popupForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    showMessage('Sorry, there was an error. Please try again.', true);
                });
            });
        }

        // --- Success Modal (Get Started Button) ---
        const getStartedBtn = document.getElementById('get-started-btn');
        const successModal = document.getElementById('success-modal');
        const closeSuccessModal = document.getElementById('close-success-modal');

        if (getStartedBtn && successModal) {
            getStartedBtn.addEventListener('click', function() {
                if (successModal.style) successModal.style.display = 'block';
            });
        }

        if (closeSuccessModal && successModal) {
            closeSuccessModal.addEventListener('click', function() {
                if (successModal.style) successModal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        if (successModal) {
            window.addEventListener('click', function(event) {
                if (event.target === successModal && successModal.style) {
                    successModal.style.display = 'none';
                }
            });
        }

        // --- Quick Inquiry Modal ---
        const quickInquiryBtn = document.getElementById('quick-inquiry-btn');
        const quickInquiryModal = document.getElementById('quick-inquiry-modal');
        const closeQuickInquiry = document.getElementById('close-quick-inquiry');

        if (quickInquiryBtn && quickInquiryModal) {
            quickInquiryBtn.addEventListener('click', function() {
                if (quickInquiryModal.style) quickInquiryModal.style.display = 'block';
            });
        }

        if (closeQuickInquiry && quickInquiryModal) {
            closeQuickInquiry.addEventListener('click', function() {
                if (quickInquiryModal.style) quickInquiryModal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        if (quickInquiryModal) {
            window.addEventListener('click', function(event) {
                if (event.target === quickInquiryModal && quickInquiryModal.style) {
                    quickInquiryModal.style.display = 'none';
                }
            });
        }

        // --- WhatsApp Contact Button ---
        const whatsappContact = document.getElementById('whatsapp-contact');
        if (whatsappContact) {
            whatsappContact.addEventListener('click', function() {
                // This creates a pre-filled WhatsApp message for potential students
                const message = "Hi FRENCH.GTA, I'm interested in learning more about your French courses. Can you help me?";
                const phoneNumber = "+13653062049"; // Replace with actual WhatsApp number
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappURL, '_blank');
            });
        }

    } catch (error) {
        console.warn('Error in DOMContentLoaded handler:', error);
    }
});
