const staticFAQs = [
    { question: "How do I reset my password?", answer: "To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions sent to your email." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and Apple Pay." },
    { question: "Can I cancel my subscription?", answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of the billing period." },
    { question: "How do I contact support?", answer: "You can reach our support team via email at support@example.com or use the live chat feature on our website." },
    { question: "Is there a free trial available?", answer: "Yes, we offer a 14-day free trial for new users. No credit card is required to sign up." }
];

document.addEventListener('DOMContentLoaded', () => {
    const faqList = document.getElementById('faq-list');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const aiContainer = document.getElementById('ai-response-container');
    const aiContent = document.getElementById('ai-content');
    const aiLoading = document.querySelector('.ai-loading');

    function slugify(text) {
        return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
    }

    function renderFAQs(faqs) {
        faqList.innerHTML = faqs.map(faq => {
            const id = slugify(faq.question);
            return `
                <div class="faq-item" id="${id}">
                    <div class="faq-question" onclick="toggleAccordion(this)">
                        ${faq.question}
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer"><p>${faq.answer}</p></div>
                </div>
            `;
        }).join('');
    }

    renderFAQs(staticFAQs);

    window.toggleAccordion = (el) => {
        const item = el.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    };

    async function fetchAIAnswer(query) {
        aiContainer.classList.remove('hidden');
        aiContent.innerHTML = '';
        aiLoading.classList.remove('hidden');

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: query })
            });

            const data = await res.json();
            aiContent.innerHTML = data.reply || "Sorry, I couldn't find an answer.";
        } catch (e) {
            aiContent.innerHTML = `<div style="color: #ef4444;">Error: ${e.message}</div>`;
        } finally {
            aiLoading.classList.add('hidden');
        }
    }

    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return (renderFAQs(staticFAQs), aiContainer.classList.add('hidden'));

        const filtered = staticFAQs.filter(f => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query));
        renderFAQs(filtered);
        fetchAIAnswer(query);
    }

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', e => e.key === 'Enter' && handleSearch());
});
