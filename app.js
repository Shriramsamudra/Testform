// Replace with your Project URL and Anon Key from Supabase
const supabaseUrl = 'https://uyntgocoxdrzdqumlwfe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bnRnb2NveGRyemRxdW1sd2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzczMDMsImV4cCI6MjA3MDc1MzMwM30.xWK9IeeJcWqp-gaDR2yO_hqscAsVgbJQ5sxTo2AUvfU';

const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const contactForm = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Insert the data into the 'contacts' table
    const { data, error } = await supabase
        .from('contacts')
        .insert([{ name, email, message }]);

    if (error) {
        console.error('Error submitting form:', error);
        statusMessage.textContent = 'Something went wrong. Please try again.';
        statusMessage.style.color = 'red';
    } else {
        console.log('Form submitted successfully:', data);
        statusMessage.textContent = 'Thank you for your message!';
        statusMessage.style.color = 'green';
        contactForm.reset();
    }
});