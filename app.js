// The Supabase library is now loaded, and the client is created with the lowercase 'supabase' variable.
const supabaseUrl = 'https://uyntgocoxdrzdqumlwfe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bnRnb2NveGRyemRxdW1sd2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzczMDMsImV4cCI6MjA3MDc1MzMwM30.xWK9IeeJcWqp-gaDR2yO_hqscAsVgbJQ5sxTo2AUvfU';

// Corrected line: Use the lowercase 'supabase' variable
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

const contactForm = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');
const showDataButton = document.getElementById('showDataButton');
const dataContainer = document.getElementById('dataContainer');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const { error } = await supabase
        .from('contacts')
        .insert([{ name, email, message }]);

    if (error) {
        console.error('Error submitting form:', error);
        statusMessage.textContent = '❌ Error: ' + error.message;
        statusMessage.style.color = 'red';
    } else {
        statusMessage.textContent = '✅ Success! Data submitted successfully.';
        statusMessage.style.color = 'green';
        contactForm.reset();
    }
});

showDataButton.addEventListener('click', async () => {
    const { data, error } = await supabase
        .from('contacts')
        .select('*');

    if (error) {
        console.error('Error fetching data:', error);
        dataContainer.innerHTML = '<p style="color:red;">❌ Error fetching data: ' + error.message + '</p>';
    } else {
        if (data.length > 0) {
            let html = '<h2>Saved Data:</h2><ul>';
            data.forEach(row => {
                html += `<li><strong>Name:</strong> ${row.name}<br><strong>Email:</strong> ${row.email}<br><strong>Message:</strong> ${row.message}</li>`;
            });
            html += '</ul>';
            dataContainer.innerHTML = html;
        } else {
            dataContainer.innerHTML = '<p>No data found.</p>';
        }
    }
});