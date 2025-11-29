// Filter functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            blogPosts.forEach((post, index) => {
                const category = post.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        post.classList.remove('hidden');
                        post.style.transition = 'all 0.4s ease-out';
                        post.style.opacity = '1';
                        post.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    post.style.transition = 'all 0.3s ease-out';
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        post.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    blogPosts.forEach(post => {
        observer.observe(post);
    });
});

