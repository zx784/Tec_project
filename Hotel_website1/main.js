// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Mobile Navigation
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    navbar.appendChild(mobileMenuBtn);

    const navItems = document.querySelector('.nav-items');
    mobileMenuBtn.addEventListener('click', () => {
        navItems.classList.toggle('active');
        mobileMenuBtn.innerHTML = navItems.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navItems.classList.remove('active');
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Booking Form Validation and Enhancement
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        const checkInInput = document.getElementById('check-in');
        const checkOutInput = document.getElementById('check-out');

        // Set minimum date as today
        const today = new Date().toISOString().split('T')[0];
        checkInInput.min = today;
        
        // Set checkout minimum date based on checkin
        checkInInput.addEventListener('change', () => {
            const checkInDate = new Date(checkInInput.value);
            const minCheckOutDate = new Date(checkInDate);
            minCheckOutDate.setDate(checkInDate.getDate() + 1);
            checkOutInput.min = minCheckOutDate.toISOString().split('T')[0];
            
            // If checkout date is before checkin date, reset it
            if (new Date(checkOutInput.value) <= checkInDate) {
                checkOutInput.value = '';
            }
        });

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const bookingData = Object.fromEntries(formData);
            
            // Validate all fields are filled
            if (!Object.values(bookingData).every(value => value)) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Calculate total nights
            const checkIn = new Date(bookingData['check-in']);
            const checkOut = new Date(bookingData['check-out']);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

            showNotification(`Booking request submitted for ${nights} nights!`, 'success');
            bookingForm.reset();
        });
    }

    // Contact Form Enhancement
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const contactData = Object.fromEntries(formData);

            if (!Object.values(contactData).every(value => value)) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        });
    }

    // Room Booking Buttons
    document.querySelectorAll('.book-room').forEach(button => {
        button.addEventListener('click', () => {
            const roomType = button.closest('.room-card').querySelector('h3').textContent;
            document.querySelector('#room-type').value = roomType.toLowerCase();
            document.querySelector('.booking-form').scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        border-left: 4px solid #2ecc71;
    }

    .notification.error {
        border-left: 4px solid #e74c3c;
    }

    .notification i {
        font-size: 1.2rem;
    }

    .notification.success i {
        color: #2ecc71;
    }

    .notification.error i {
        color: #e74c3c;
    }
`;
document.head.appendChild(style);
