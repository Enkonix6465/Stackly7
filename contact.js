const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('form-responce');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const action = form.getAttribute('action');
      
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });
      console.log('Form submitted', response);


      if (response.ok) {
        form.reset();
        successMessage.style.display = 'block';
      } else {
        alert('Oops! Something went wrong.');
      }
    });
