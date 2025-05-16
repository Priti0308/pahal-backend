const brevo = require('@getbrevo/brevo');
console.log('Brevo module structure:');
console.log(Object.keys(brevo));

// Try accessing ApiClient
if (brevo.ApiClient) {
    console.log('ApiClient exists');
    console.log(Object.keys(brevo.ApiClient));
    
    // Check if instance exists
    if (brevo.ApiClient.instance) {
        console.log('ApiClient.instance exists');
    } else {
        console.log('ApiClient.instance does not exist');
        // Maybe it's a constructor?
        console.log('Creating new ApiClient instance');
        const apiClient = new brevo.ApiClient();
        console.log('ApiClient instance keys:', Object.keys(apiClient));
    }
} else {
    console.log('ApiClient does not exist');
}

// Check if TransactionalEmailsApi exists
if (brevo.TransactionalEmailsApi) {
    console.log('TransactionalEmailsApi exists');
} else {
    console.log('TransactionalEmailsApi does not exist');
}

// Try to create a new TransactionalEmailsApi instance
try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    console.log('Successfully created TransactionalEmailsApi instance');
} catch (error) {
    console.error('Error creating TransactionalEmailsApi instance:', error);
}
