import { $fetch } from 'ofetch'

/**
 * Helper function to submit a contact form to WooCommerce
 * @param formData The form data to submit
 * @returns The response from the WooCommerce site
 */
export async function submitContactForm(formData: any) {
  const wpUrl = process.env.NUXT_PUBLIC_WP_URL
  
  if (!wpUrl) {
    throw new Error('WordPress URL not configured')
  }
  
  // Determine which contact form plugin is being used
  // This example supports Contact Form 7 and WPForms
  
  // For Contact Form 7
  try {
    // Replace 'your-form-id' with the actual Contact Form 7 form ID
    const formId = process.env.CONTACT_FORM_ID || 'your-form-id'
    const endpoint = `${wpUrl}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`
    
    // Map the form data to the expected format for Contact Form 7
    const cf7FormData = new FormData()
    cf7FormData.append('your-name', formData.name)
    cf7FormData.append('your-email', formData.email)
    cf7FormData.append('your-message', formData.message)
    
    if (formData.subject) {
      cf7FormData.append('your-subject', formData.subject)
    }
    
    if (formData.phone) {
      cf7FormData.append('your-phone', formData.phone)
    }
    
    const response = await $fetch(endpoint, {
      method: 'POST',
      body: cf7FormData
    })
    
    return {
      success: response.status === 'mail_sent',
      message: response.message
    }
  } catch (error) {
    console.error('Error submitting to Contact Form 7:', error)
    
    // Try WPForms as fallback
    try {
      // Replace 'your-form-id' with the actual WPForms form ID
      const formId = process.env.WPFORMS_ID || 'your-form-id'
      const endpoint = `${wpUrl}/wp-json/wpforms/v1/forms/${formId}/submissions`
      
      const wpformsData = {
        fields: {
          name: formData.name,
          email: formData.email,
          message: formData.message
        }
      }
      
      if (formData.subject) {
        wpformsData.fields.subject = formData.subject
      }
      
      if (formData.phone) {
        wpformsData.fields.phone = formData.phone
      }
      
      const response = await $fetch(endpoint, {
        method: 'POST',
        body: wpformsData
      })
      
      return {
        success: true,
        message: 'Thank you for your message. We will get back to you soon.'
      }
    } catch (wpError) {
      console.error('Error submitting to WPForms:', wpError)
      throw new Error('Failed to submit contact form')
    }
  }
} 
