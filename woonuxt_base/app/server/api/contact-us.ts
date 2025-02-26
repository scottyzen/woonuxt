import { defineEventHandler, readBody } from 'h3'
import { submitContactForm } from '../utils/woocommerce'

export default defineEventHandler(async (event) => {
  try {
    // Get the request body
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return {
        success: false,
        message: 'Please provide name, email and message'
      }
    }
    
    try {
      // Try to submit the form to WooCommerce
      const result = await submitContactForm(body)
      return result
    } catch (wooError) {
      console.error('Error submitting to WooCommerce:', wooError)
      
      // Log the form submission as a fallback
      console.log('Contact form submission (fallback):', body)
      
      // Return success response
      return {
        success: true,
        message: 'Thank you for your message. We will get back to you soon.'
      }
    }
  } catch (error) {
    console.error('Error processing contact form:', error)
    
    // Return error response
    return {
      success: false,
      message: 'There was an error processing your request. Please try again later.'
    }
  }
}) 
