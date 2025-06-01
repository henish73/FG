// --- Utility Functions ---
function showMessage(message, isError = false) {
    alert(message); // Replace with a more user-friendly display if needed
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showPaymentForm(itemName, amount, paymentMethod) {
  const modal = document.getElementById('payment-modal');
  const itemNameInput = document.getElementById('item-name');
  const amountInput = document.getElementById('amount'); // This hidden input stores the amount
  const paymentMethodInput = document.getElementById('payment-method'); // This hidden input stores the payment method

  const paypalButtonContainer = document.getElementById('paypal-button-container');
  const interacInstructionsDiv = document.getElementById('interac-instructions');
  const interacAmountSpan = document.getElementById('interac-amount');
  const proceedToPaymentButton = document.getElementById('proceed-to-payment-button');

  if (modal && itemNameInput && amountInput && paymentMethodInput && paypalButtonContainer && interacInstructionsDiv && interacAmountSpan && proceedToPaymentButton) {
    // Populate hidden form fields
    itemNameInput.value = itemName;
    amountInput.value = amount;
    paymentMethodInput.value = paymentMethod;

    // Clear previous PayPal buttons if any
    paypalButtonContainer.innerHTML = '';

    if (paymentMethod === 'paypal') {
      paypalButtonContainer.style.display = 'block';
      interacInstructionsDiv.style.display = 'none';
      proceedToPaymentButton.style.display = 'none'; // Hide the generic button for PayPal

      // Render PayPal Buttons
      paypal.Buttons({
        createOrder: function(data, actions) {
          // Validate form before creating order
          const paymentForm = document.getElementById('payment-form');
          if (!paymentForm.checkValidity()) {
            // paymentForm.reportValidity(); // This will show HTML5 validation messages
            alert('Please fill in all required fields before proceeding.');
            return actions.reject();
          }

          return actions.order.create({
            purchase_units: [{
              description: itemName,
              amount: {
                currency_code: 'CAD',
                value: amount
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            // Show a success message to the buyer
            alert('Transaction completed by ' + details.payer.name.given_name + '! We will be in touch shortly to confirm your class schedule.');
            closePaymentModal();
            document.getElementById('payment-form').reset(); // Reset the form
            // TODO: Optionally, you could gather more details here and send to a static form endpoint
            // For example, all the form fields + details.id (transaction ID)
          });
        },
        onError: function(err) {
          console.error('PayPal Button rendering error or payment error:', err);
          alert('An error occurred with the PayPal payment. Please try again or contact support.');
        },
        onCancel: function (data) {
            // Show a message to the buyer or take other actions
            console.log('PayPal payment cancelled:', data);
            alert('Payment was cancelled.');
        }
      }).render('#paypal-button-container').catch(err => {
        console.error("Failed to render PayPal buttons", err);
        alert("Error loading PayPal. Please try again or select another payment method.");
      });

    } else if (paymentMethod === 'interac') {
      paypalButtonContainer.style.display = 'none';
      interacInstructionsDiv.style.display = 'block';
      interacAmountSpan.textContent = amount;
      proceedToPaymentButton.style.display = 'block'; // Show the generic button for Interac
                                                    // This button will submit the form
    }

    modal.style.display = 'block'; // Show the modal
  } else {
    console.error('One or more elements for the payment modal are missing.');
  }
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// --- The rest of your script.js code (unchanged) ---

document.addEventListener('DOMContentLoaded', function () {
    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('loaded');
        });
    }

    // --- Mobile Navigation (Burger Menu) ---
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // --- Modal Popup ---
    const modal = document.getElementById('demoModal');
    const demoModalCloseButton = modal ? modal.querySelector('.close-button') : null;
    const modalForm = document.getElementById('modal-form');
    const modalFormMessage = document.getElementById('modal-form-message');
    const yourEmailAddress = 'frenchgta.ca@gmail.com'; // Email for inquiries

    function openModal() {
        if (modal) {
            modal.style.display = 'flex';
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    // const openModalButton = document.getElementById('openInquiryModalButton');
    // if (openModalButton) {
    //     openModalButton.addEventListener('click', openModal);
    // }
    setTimeout(openModal, 5000); // Open the modal after 5 seconds

    function closeModal() {
        if (modal) {
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
            // Add any other fields from the modal form if they exist, e.g., phone
            // const phone = modalForm.phone ? modalForm.phone.value : ''; 

            let mailtoSubject = 'Website Inquiry: New Contact';
            let mailtoBody = `New inquiry from the website modal form:\n\n`;
            mailtoBody += `Name: ${name}\n`;
            mailtoBody += `Email: ${email}\n`;
            // if (phone) mailtoBody += `Phone: ${phone}\n`;
            mailtoBody += `\nPlease respond to this inquiry at your earliest convenience.`;

            const mailtoLink = `mailto:${yourEmailAddress}` +
                             `?subject=${encodeURIComponent(mailtoSubject)}` +
                             `&body=${encodeURIComponent(mailtoBody)}`;

            modalFormMessage.innerHTML = 'Thank you! Please <a href="' + mailtoLink + '" target="_blank">click here to send us an email</a> with your details. If your email client does not open, please manually send an email to ' + yourEmailAddress + '.';
            modalFormMessage.className = 'form-message-success';
            // modalForm.reset(); // Keep form data for user to see in email

            // The original index.html specific modal logic for successModal and WhatsApp might need integration here
            // For now, this provides the mailto link. The successModal from index.html might still appear based on its own logic.
        });
    }

    // --- Button Click Animation ---
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function () {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 800);
        });
    });

    // --- Scroll-Triggered Animations (Intersection Observer) ---

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // Add a class when in view
            } else {
                // Optional: Remove the class if you want the animation to only happen once
                // entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Element is considered "in view" when 10% is visible
    });

    // Observe elements with the 'animate-on-scroll' class
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // --- Logo Animation (Subtle) ---
    const logo = document.querySelector('.logo a');
    if (logo) {
        logo.addEventListener('mouseover', () => {
            logo.classList.add('logo-hover');
        });
        logo.addEventListener('mouseout', () => {
            logo.classList.remove('logo-hover');
        });
    }
    // --- Sticky Header Animation ---
    let lastScrollTop = 0;
    const header = document.querySelector('header'); // Select the header

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
            // Scrolling Down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling Up
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);

    // --- Set current year in footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Load Header and Footer ---
    function loadHTML(url, elementId) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                    // If header is loaded, re-attach nav burger functionality
                    if (elementId === 'header-placeholder') {
                        const burger = element.querySelector('.burger');
                        const navLinks = element.querySelector('.nav-links');
                        if (burger && navLinks) {
                            burger.addEventListener('click', () => {
                                navLinks.classList.toggle('nav-active');
                                burger.classList.toggle('toggle');
                            });
                        }
                        // Re-attach logo animation if needed
                        const logo = element.querySelector('.logo a');
                        if (logo) {
                            logo.addEventListener('mouseover', () => {
                                logo.classList.add('logo-hover');
                            });
                            logo.addEventListener('mouseout', () => {
                                logo.classList.remove('logo-hover');
                            });
                        }
                    }
                } else {
                    console.error(`Element with id '${elementId}' not found to load ${url}`);
                }
            })
            .catch(error => console.error(`Error loading HTML from ${url}:`, error));
    }

    if (document.getElementById('header-placeholder')) {
        loadHTML('header.html', 'header-placeholder');
    }
    if (document.getElementById('footer-placeholder')) {
        loadHTML('footer.html', 'footer-placeholder');
    }

    // --- Payment Form (services.html) Submission Logic ---
    // This specifically handles the submission when Interac is chosen,
    // as PayPal has its own onApprove callback.
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const paymentMethod = document.getElementById('payment-method').value;

            if (paymentMethod === 'interac') {
                // Validate form
                if (!paymentForm.checkValidity()) {
                    // paymentForm.reportValidity(); // Shows HTML5 validation messages
                    alert('Please fill in all required fields before proceeding.');
                    return;
                }
                // For Interac, we've already shown instructions.
                // This form submission can be used to send data to a static form endpoint if desired.
                // For now, just show a confirmation.
                alert('Please follow the Interac e-Transfer instructions provided. We will confirm your enrollment once payment is received.');
                closePaymentModal();
                paymentForm.reset();
            }
            // PayPal submission is handled by its onApprove callback
        });
    }

    // --- Function to load testimonials into index.html --- (NEW)
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
                    carouselDiv.className = 'testimonial-carousel'; // Use the same class for styling if needed
                    snippetsToShow.forEach(snippet => {
                        // We need to clone the node to append it
                        const clonedSnippet = snippet.cloneNode(true);
                        // Adjust styles if they are meant for a scrolling carousel but here it's static snippets
                        clonedSnippet.style.minWidth = '280px'; // Ensure they are not too wide if only a few
                        clonedSnippet.style.flex = '1 1 300px'; // Allow them to take up space
                        clonedSnippet.style.marginRight = '1rem'; // Keep some spacing
                        carouselDiv.appendChild(clonedSnippet);
                    });
                    placeholder.appendChild(carouselDiv);
                     // If you want these snippets to also scroll, you might need to re-apply the animation or use a different one
                    // For simplicity, these will be static snippets here. The animation is on testimonials.html
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

});
