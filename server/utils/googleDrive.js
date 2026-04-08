const { google } = require('googleapis');
const fs = require('fs');

// To use this, you need a service account key from Google Cloud Console
// and the ID of the folder where you want to upload files.
const KEYFILEPATH = 'credentials.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const uploadFileToDrive = async (fileObject) => {
  try {
    // Check if credentials exist
    if (!fs.existsSync(KEYFILEPATH)) {
      console.warn('Google Drive credentials.json not found. Returning a mock URL.');
      return {
        fileId: 'mock-id-' + Date.now(),
        url: 'https://mock-drive-url.com/file/' + fileObject.originalname,
      };
    }

    const driveService = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: fileObject.originalname,
      parents: [process.env.DRIVE_FOLDER_ID], // Define this in .env
    };

    const media = {
      mimeType: fileObject.mimetype,
      body: fs.createReadStream(fileObject.path),
    };

    const response = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    return {
      fileId: response.data.id,
      url: response.data.webViewLink,
    };
  } catch (error) {
    console.error('Error uploading file to Drive', error);
    throw error;
  }
};

module.exports = { uploadFileToDrive };
